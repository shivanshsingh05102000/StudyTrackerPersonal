const DAY_MS = 24 * 60 * 60 * 1000;
const REVISION_DAY_TYPES = new Set(["revision", "regular", "buffer"]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function todayIso(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseIso(iso) {
  const [year, month, day] = String(iso).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(iso, days) {
  const date = parseIso(iso);
  date.setUTCDate(date.getUTCDate() + Number(days));
  return date.toISOString().slice(0, 10);
}

function compareIso(a, b) {
  return String(a).localeCompare(String(b));
}

function isoDatesBetween(start, end) {
  const dates = [];
  for (let date = start; compareIso(date, end) <= 0; date = addDays(date, 1)) {
    dates.push(date);
  }
  return dates;
}

function weekdayName(iso) {
  return parseIso(iso).toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC"
  });
}

function assertDateInWindow(state, date) {
  if (!state.days[date]) {
    throw new Error(`${date} is outside the schedule window.`);
  }
}

function resourceKeys(topic) {
  return Object.keys(topic.resources || {});
}

function topicWeight(topic) {
  return resourceKeys(topic).length;
}

function topicDoneCount(topic) {
  return Object.values(topic.resources || {}).filter((value) => value === "done").length;
}

function topicFraction(topic) {
  const weight = topicWeight(topic);
  return weight === 0 ? 0 : topicDoneCount(topic) / weight;
}

function computeTopicStatus(topic) {
  const weight = topicWeight(topic);
  const done = topicDoneCount(topic);
  if (done === 0) return "pending";
  if (done === weight) return "done";
  return "partial";
}

function recomputeTopicStatus(topic) {
  topic.status = computeTopicStatus(topic);
  return topic.status;
}

function topicEstimatedMinutes(topic, config) {
  const minutes = config.minutesPerResource || {};
  return resourceKeys(topic).reduce((sum, key) => sum + (minutes[key] || 30), 0);
}

function dayTopicMinutes(day, state) {
  return (day.topicIds || []).reduce((sum, id) => {
    const topic = state.topics[id];
    return topic ? sum + topicEstimatedMinutes(topic, state.config) : sum;
  }, 0);
}

function dayStaticMinutes(day) {
  return day.staticGk && day.staticGk.minutes ? Number(day.staticGk.minutes) : 0;
}

function daySpecialMinutes(day) {
  return (day.specialTasks || []).reduce((sum, task) => {
    const minutes = Number(task.minutes || 0);
    return Number.isFinite(minutes) ? sum + minutes : sum;
  }, 0);
}

function recomputeDayEstimate(state, date) {
  const day = state.days[date];
  if (!day) return;
  const specialMinutes = daySpecialMinutes(day);
  const hasStudyPayload = (day.topicIds && day.topicIds.length) || day.staticGk || specialMinutes;
  if (!hasStudyPayload && day.specialTasks && day.specialTasks.length) return;
  day.estMinutes = dayTopicMinutes(day, state) + dayStaticMinutes(day) + specialMinutes;
}

function recomputeAllDayEstimates(state) {
  Object.keys(state.days).forEach((date) => recomputeDayEstimate(state, date));
}

function getTopicDay(state, topicId) {
  return Object.values(state.days).find((day) => (day.topicIds || []).includes(topicId)) || null;
}

function getBacklogTopics(state, today = todayIso()) {
  return Object.values(state.topics)
    .filter((topic) => compareIso(topic.scheduledDate, today) < 0 && topic.status !== "done")
    .sort((a, b) => compareIso(a.scheduledDate, b.scheduledDate) || a.subject.localeCompare(b.subject));
}

function removeTopicFromDays(state, topicId) {
  Object.values(state.days).forEach((day) => {
    day.topicIds = (day.topicIds || []).filter((id) => id !== topicId);
  });
}

function validateNoDuplicateTopics(state) {
  const seen = new Map();
  for (const day of Object.values(state.days)) {
    for (const topicId of day.topicIds || []) {
      if (seen.has(topicId)) {
        throw new Error(`Topic ${topicId} is scheduled on both ${seen.get(topicId)} and ${day.date}.`);
      }
      seen.set(topicId, day.date);
    }
  }
  for (const topic of Object.values(state.topics)) {
    if (!seen.has(topic.id)) {
      throw new Error(`Topic ${topic.id} would be orphaned.`);
    }
  }
}

function moveTopics(state, topicIds, toDate) {
  assertDateInWindow(state, toDate);
  const ids = [...new Set(topicIds || [])];
  if (ids.length === 0) throw new Error("Select at least one topic to move.");

  const next = clone(state);
  const diff = [];
  for (const topicId of ids) {
    const topic = next.topics[topicId];
    if (!topic) throw new Error(`Unknown topic ${topicId}.`);
    const fromDate = topic.scheduledDate;
    removeTopicFromDays(next, topicId);
    next.days[toDate].topicIds.push(topicId);
    topic.scheduledDate = toDate;
    diff.push({ topicId, topic: topic.topic, subject: topic.subject, fromDate, toDate });
    recomputeDayEstimate(next, fromDate);
  }
  recomputeDayEstimate(next, toDate);
  validateNoDuplicateTopics(next);
  return { state: next, diff, summary: `Moved ${ids.length} topic${ids.length === 1 ? "" : "s"} to ${toDate}` };
}

function nextUnlockedDate(state, desiredDate, direction) {
  let date = desiredDate;
  while (state.days[date] && state.days[date].locked) {
    date = addDays(date, direction);
  }
  return state.days[date] ? date : null;
}

function shiftRange(state, fromDate, days) {
  assertDateInWindow(state, fromDate);
  const offset = Number(days);
  if (!Number.isInteger(offset) || offset === 0) {
    throw new Error("Shift days must be a non-zero whole number.");
  }

  const direction = offset > 0 ? 1 : -1;
  const candidates = Object.values(state.topics)
    .filter((topic) => compareIso(topic.scheduledDate, fromDate) >= 0)
    .filter((topic) => {
      const source = state.days[topic.scheduledDate];
      return source && !source.locked;
    });

  const planned = candidates.map((topic) => {
    const desired = addDays(topic.scheduledDate, offset);
    let toDate = nextUnlockedDate(state, desired, direction);
    if (!toDate) {
      throw new Error(`Shifting ${topic.topic} would move past the schedule window. Extend the window first.`);
    }
    return { topicId: topic.id, fromDate: topic.scheduledDate, toDate };
  });

  const next = clone(state);
  for (const item of planned) {
    removeTopicFromDays(next, item.topicId);
  }
  for (const item of planned) {
    next.days[item.toDate].topicIds.push(item.topicId);
    next.topics[item.topicId].scheduledDate = item.toDate;
  }
  [...new Set(planned.flatMap((item) => [item.fromDate, item.toDate]))].forEach((date) => recomputeDayEstimate(next, date));
  validateNoDuplicateTopics(next);
  return {
    state: next,
    diff: planned.map((item) => ({
      ...item,
      topic: state.topics[item.topicId].topic,
      subject: state.topics[item.topicId].subject
    })),
    summary: `Shifted ${planned.length} topic${planned.length === 1 ? "" : "s"} from ${fromDate} by ${offset} day${Math.abs(offset) === 1 ? "" : "s"}`
  };
}

function pushBacklog(state, toDate, today = todayIso()) {
  const backlog = getBacklogTopics(state, today);
  return moveTopics(state, backlog.map((topic) => topic.id), toDate);
}

function chooseInterleavedTopic(queue, lastSubjectDate) {
  let bestIndex = 0;
  let bestScore = Infinity;
  queue.forEach((topic, index) => {
    const last = lastSubjectDate.get(topic.subject) || "";
    const score = last ? parseIso(last).getTime() : -Infinity;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return queue.splice(bestIndex, 1)[0];
}

function rebalance(state, options = {}) {
  const today = options.today || todayIso();
  const backlog = getBacklogTopics(state, today);
  const next = clone(state);
  const queue = backlog.map((topic) => next.topics[topic.id]);
  const diff = [];
  const lastSubjectDate = new Map();
  Object.values(next.days)
    .filter((day) => compareIso(day.date, today) < 0)
    .forEach((day) => {
      (day.topicIds || []).forEach((id) => {
        const topic = next.topics[id];
        if (topic) lastSubjectDate.set(topic.subject, day.date);
      });
    });

  for (const topic of queue) {
    removeTopicFromDays(next, topic.id);
  }

  const futureDays = Object.values(next.days)
    .filter((day) => compareIso(day.date, today) >= 0 && day.capacity > 0 && !day.locked)
    .sort((a, b) => compareIso(a.date, b.date));

  for (const day of futureDays) {
    while (queue.length && (day.capacity - day.topicIds.length) > 0) {
      const chosen = chooseInterleavedTopic(queue, lastSubjectDate);
      const projected = dayTopicMinutes(day, next) + topicEstimatedMinutes(chosen, next.config) + dayStaticMinutes(day) + daySpecialMinutes(day);
      if (projected > 300) {
        queue.push(chosen);
        break;
      }
      const fromDate = chosen.scheduledDate;
      day.topicIds.push(chosen.id);
      chosen.scheduledDate = day.date;
      lastSubjectDate.set(chosen.subject, day.date);
      diff.push({ topicId: chosen.id, topic: chosen.topic, subject: chosen.subject, fromDate, toDate: day.date });
      recomputeDayEstimate(next, day.date);
    }
  }

  if (queue.length) {
    for (const topic of queue) {
      const source = next.days[topic.scheduledDate];
      if (source && !source.topicIds.includes(topic.id)) source.topicIds.push(topic.id);
    }
    const shortfall = queue.length;
    const regularCapacity = next.config.defaultCapacity?.regular || 1;
    const subjectMinutes = new Map();
    queue.forEach((topic) => {
      const current = subjectMinutes.get(topic.subject) || 0;
      const save = ["video", "mcq"].reduce((sum, key) => {
        return sum + (topic.resources[key] ? (next.config.minutesPerResource?.[key] || 0) : 0);
      }, 0);
      subjectMinutes.set(topic.subject, current + save);
    });
    const [subject, minutesSaved] = [...subjectMinutes.entries()].sort((a, b) => b[1] - a[1])[0] || ["the largest subject", 0];
    return {
      feasible: false,
      shortfall,
      moved: diff,
      suggestions: [
        { type: "extend_window", label: `Extend the window by ${Math.ceil(shortfall / regularCapacity)} regular day${Math.ceil(shortfall / regularCapacity) === 1 ? "" : "s"}.` },
        { type: "cut_scope", label: `Drop ${subject} catch-up topics to PDF-only to save about ${minutesSaved} minutes.` }
      ]
    };
  }

  validateNoDuplicateTopics(next);
  return {
    feasible: true,
    shortfall: 0,
    moved: diff,
    state: options.commit ? next : undefined,
    previewState: next,
    summary: `Rebalanced ${diff.length} backlog topic${diff.length === 1 ? "" : "s"}`
  };
}

function updateDay(state, date, patch) {
  assertDateInWindow(state, date);
  const next = clone(state);
  const day = next.days[date];
  const before = clone(day);
  if (patch.capacity !== undefined) {
    const capacity = Number(patch.capacity);
    if (!Number.isFinite(capacity) || capacity < 0) throw new Error("Capacity must be zero or more.");
    day.capacity = capacity;
  }
  if (patch.dayType !== undefined) {
    const allowed = ["regular", "heavy", "holiday_bonus", "break_intensive", "buffer", "overflow", "revision", "sectional", "mock"];
    if (!allowed.includes(patch.dayType)) throw new Error("Unsupported day type.");
    day.dayType = patch.dayType;
  }
  if (patch.locked !== undefined) day.locked = Boolean(patch.locked);
  if (patch.adminNote !== undefined) day.adminNote = String(patch.adminNote || "").trim() || null;
  if (patch.actualMinutes !== undefined) {
    const actual = patch.actualMinutes === null || patch.actualMinutes === "" ? null : Number(patch.actualMinutes);
    if (actual !== null && (!Number.isFinite(actual) || actual < 0)) throw new Error("Actual minutes must be zero or more.");
    day.actualMinutes = actual;
  }
  recomputeDayEstimate(next, date);
  return { state: next, before, after: clone(day), summary: `Updated ${date}` };
}

function addHoliday(state, date, label, type) {
  assertDateInWindow(state, date);
  if (!["bonus", "off"].includes(type)) throw new Error("Holiday type must be bonus or off.");
  const next = clone(state);
  const day = next.days[date];
  if (!day.holidayPrevious) {
    day.holidayPrevious = { dayType: day.dayType, capacity: day.capacity, holiday: day.holiday };
  }
  day.holiday = String(label || "").trim() || "Holiday";
  if (type === "bonus") {
    day.dayType = "holiday_bonus";
    day.capacity = next.config.defaultCapacity?.holiday_bonus || 3;
  } else {
    day.dayType = "buffer";
    day.capacity = 0;
  }
  recomputeDayEstimate(next, date);
  return { state: next, summary: `Added ${type} holiday on ${date}` };
}

function removeHoliday(state, date) {
  assertDateInWindow(state, date);
  const next = clone(state);
  const day = next.days[date];
  if (day.holidayPrevious) {
    day.dayType = day.holidayPrevious.dayType;
    day.capacity = day.holidayPrevious.capacity;
    day.holiday = day.holidayPrevious.holiday || null;
    delete day.holidayPrevious;
  } else {
    day.holiday = null;
  }
  recomputeDayEstimate(next, date);
  return { state: next, summary: `Removed holiday on ${date}` };
}

function snapRevisionDate(state, date) {
  for (let candidate = date; compareIso(candidate, state.config.windowEnd) <= 0; candidate = addDays(candidate, 1)) {
    const day = state.days[candidate];
    if (day && REVISION_DAY_TYPES.has(day.dayType)) return candidate;
  }
  return null;
}

function spawnRevisions(state, topic, completedIso) {
  const offsets = topic.rushed ? [3, 5, 10, 30] : [3, 10, 30];
  const existing = new Set(topic.revisionsDue || []);
  offsets.forEach((offset) => {
    const snapped = snapRevisionDate(state, addDays(completedIso, offset));
    if (snapped) existing.add(snapped);
  });
  topic.revisionsDue = [...existing].sort(compareIso);
}

function removeUnmetRevisions(topic, today = todayIso()) {
  topic.revisionsDue = (topic.revisionsDue || []).filter((date) => compareIso(date, today) < 0);
}

function validateExamDateChange(state, examDate) {
  const lastScheduled = Object.values(state.topics)
    .map((topic) => topic.scheduledDate)
    .sort(compareIso)
    .at(-1);
  if (lastScheduled && compareIso(examDate, lastScheduled) < 0) {
    throw new Error(`Exam date ${examDate} is earlier than the last scheduled topic on ${lastScheduled}. Run rebalance or extend the window before saving.`);
  }
}

module.exports = {
  DAY_MS,
  addDays,
  addHoliday,
  clone,
  compareIso,
  computeTopicStatus,
  dayEstimatedMinutes: dayTopicMinutes,
  daySpecialMinutes,
  getBacklogTopics,
  getTopicDay,
  isoDatesBetween,
  moveTopics,
  pushBacklog,
  rebalance,
  recomputeAllDayEstimates,
  recomputeDayEstimate,
  recomputeTopicStatus,
  removeHoliday,
  removeUnmetRevisions,
  resourceKeys,
  shiftRange,
  spawnRevisions,
  todayIso,
  topicDoneCount,
  topicEstimatedMinutes,
  topicFraction,
  topicWeight,
  updateDay,
  validateExamDateChange,
  weekdayName
};
