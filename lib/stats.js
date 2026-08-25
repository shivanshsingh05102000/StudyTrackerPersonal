const {
  addDays,
  compareIso,
  getBacklogTopics,
  isoDatesBetween,
  todayIso,
  topicDoneCount,
  topicEstimatedMinutes,
  topicWeight
} = require("./scheduler");

function round1(value) {
  return Math.round((Number(value) || 0) * 10) / 10;
}

function topicScore(topic) {
  return typeof topic.mcqScore === "number" ? topic.mcqScore : null;
}

function dayResourceTotals(state, day) {
  let total = 0;
  let done = 0;
  (day.topicIds || []).forEach((id) => {
    const topic = state.topics[id];
    if (!topic) return;
    total += topicWeight(topic);
    done += topicDoneCount(topic);
  });
  if (day.staticGk && day.staticGk.status) {
    total += 1;
    if (day.staticGk.status === "done") done += 1;
  }
  return { total, done };
}

function dayCompletionState(state, day, today) {
  const totals = dayResourceTotals(state, day);
  if (totals.total === 0) return "empty";
  if (totals.done === totals.total) return "done";
  if (totals.done > 0) return "partial";
  if (compareIso(day.date, today) < 0) return "missed";
  return "pending";
}

function resourceCompletionsInWindow(state, from, to) {
  let count = 0;
  Object.values(state.topics).forEach((topic) => {
    Object.values(topic.resourceCompletedAt || {}).forEach((at) => {
      const date = String(at).slice(0, 10);
      if (compareIso(date, from) >= 0 && compareIso(date, to) <= 0) count += 1;
    });
  });
  Object.values(state.staticGk || {}).forEach((item) => {
    const date = item.lastSeen ? String(item.lastSeen).slice(0, 10) : null;
    if (date && compareIso(date, from) >= 0 && compareIso(date, to) <= 0) count += 1;
  });
  return count;
}

function computeCompletion(state) {
  let totalWeight = 0;
  let doneWeight = 0;
  Object.values(state.topics).forEach((topic) => {
    totalWeight += topicWeight(topic);
    doneWeight += topicDoneCount(topic);
  });
  Object.values(state.staticGk || {}).forEach((item) => {
    totalWeight += 1;
    if (item.status === "done") doneWeight += 1;
  });
  return {
    doneWeight,
    totalWeight,
    remainingWeight: Math.max(0, totalWeight - doneWeight),
    fraction: totalWeight === 0 ? 0 : doneWeight / totalWeight,
    percent: totalWeight === 0 ? 0 : round1((doneWeight / totalWeight) * 100)
  };
}

function computeSubjectStats(state) {
  const map = new Map();
  Object.values(state.topics).forEach((topic) => {
    if (!map.has(topic.subject)) {
      map.set(topic.subject, {
        subject: topic.subject,
        total: 0,
        done: 0,
        scored: 0,
        scoreTotal: 0,
        belowThreshold: 0,
        rushed: 0,
        doneWeight: 0,
        totalWeight: 0
      });
    }
    const entry = map.get(topic.subject);
    entry.total += 1;
    if (topic.status === "done") entry.done += 1;
    entry.doneWeight += topicDoneCount(topic);
    entry.totalWeight += topicWeight(topic);
    if (typeof topic.mcqScore === "number") {
      entry.scored += 1;
      entry.scoreTotal += topic.mcqScore;
      if (topic.mcqScore < state.config.mcqPassThreshold) entry.belowThreshold += 1;
    }
    if (topic.rushed) entry.rushed += 1;
  });
  return [...map.values()]
    .map((entry) => ({
      ...entry,
      avgScore: entry.scored ? round1(entry.scoreTotal / entry.scored) : null,
      completionPercent: entry.totalWeight ? round1((entry.doneWeight / entry.totalWeight) * 100) : 0
    }))
    .sort((a, b) => a.subject.localeCompare(b.subject));
}

function computeStaticGkStats(state) {
  const items = Object.values(state.staticGk || {});
  const done = items.filter((item) => item.status === "done").length;
  const introduced = items.filter((item) => item.introducedOn).length;
  const confidenceItems = items.filter((item) => typeof item.confidence === "number");
  const confidenceTotal = confidenceItems.reduce((sum, item) => sum + item.confidence, 0);
  return {
    subject: "Static GK",
    total: items.length,
    done,
    introduced,
    scored: confidenceItems.length,
    avgConfidence: confidenceItems.length ? round1(confidenceTotal / confidenceItems.length) : null,
    completionPercent: items.length ? round1((done / items.length) * 100) : 0,
    weakOrUnrated: items.filter((item) => item.confidence === null || item.confidence <= 2).length
  };
}

function computeWeakness(state, subjects) {
  const ranked = [];
  const notEnoughData = [];
  subjects.forEach((subject) => {
    if (subject.scored < 3) {
      notEnoughData.push({
        subject: subject.subject,
        scored: subject.scored,
        needed: 3 - subject.scored
      });
      return;
    }
    const weakness = (100 - subject.avgScore) + (subject.belowThreshold * 5) + (subject.rushed * 3);
    ranked.push({ ...subject, weakness: round1(weakness) });
  });
  ranked.sort((a, b) => b.weakness - a.weakness);
  const belowThresholdTopics = Object.values(state.topics)
    .filter((topic) => typeof topic.mcqScore === "number" && topic.mcqScore < state.config.mcqPassThreshold)
    .map((topic) => ({
      id: topic.id,
      subject: topic.subject,
      topic: topic.topic,
      score: topic.mcqScore,
      scheduledDate: topic.scheduledDate
    }))
    .sort((a, b) => a.score - b.score);
  return { ranked, notEnoughData, belowThresholdTopics };
}

function computePace(state, today = todayIso()) {
  const completion = computeCompletion(state);
  const remainingDays = Object.values(state.days).filter((day) => {
    return compareIso(day.date, today) >= 0 && compareIso(day.date, state.config.examDate) <= 0 && day.capacity > 0;
  }).length;
  const requiredRaw = remainingDays ? completion.remainingWeight / remainingDays : completion.remainingWeight;
  const actual7Day = resourceCompletionsInWindow(state, addDays(today, -6), today) / 7;
  const backlog = getBacklogTopics(state, today);
  const baselineDays = Object.values(state.days).filter((day) => {
    return compareIso(day.date, state.config.windowStart) >= 0 && compareIso(day.date, state.config.examDate) <= 0 && day.capacity > 0;
  }).length;
  const baseline = baselineDays ? completion.totalWeight / baselineDays : completion.totalWeight;
  let verdict = "critical";
  if (backlog.length === 0 && actual7Day >= requiredRaw) verdict = "on_track";
  else if (backlog.length <= 2) verdict = "slipping";
  else if (backlog.length <= 6) verdict = "behind";
  return {
    remainingWeight: completion.remainingWeight,
    remainingDays,
    requiredPerDay: round1(requiredRaw),
    actual7Day: round1(actual7Day),
    baselineRequiredPerDay: round1(baseline),
    baselineExceeded: baseline > 0 && requiredRaw > baseline * 1.25,
    backlogCount: backlog.length,
    backlogMinutes: backlog.reduce((sum, topic) => sum + topicEstimatedMinutes(topic, state.config), 0),
    backlogTopicIds: backlog.map((topic) => topic.id),
    verdict
  };
}

function isDayFullyComplete(state, day) {
  const totals = dayResourceTotals(state, day);
  if (totals.total === 0) return null;
  return totals.done === totals.total;
}

function computeStreaks(state, today = todayIso()) {
  const days = Object.values(state.days)
    .filter((day) => compareIso(day.date, today) <= 0)
    .sort((a, b) => compareIso(a.date, b.date));
  let longest = 0;
  let current = 0;
  for (const day of days) {
    const complete = isDayFullyComplete(state, day);
    if (complete === null) continue;
    if (complete) current += 1;
    else current = 0;
    if (current > longest) longest = current;
  }
  return { current, longest };
}

function weekStartIso(iso) {
  const date = new Date(`${iso}T00:00:00Z`);
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return addDays(iso, mondayOffset);
}

function summarizeWeek(state, from, to, today) {
  const days = isoDatesBetween(from, to)
    .map((date) => state.days[date])
    .filter(Boolean);
  const totals = days.reduce((summary, day) => {
    const resources = dayResourceTotals(state, day);
    summary.totalResources += resources.total;
    summary.doneResources += resources.done;
    summary.estimatedMinutes += Number(day.estMinutes || 0);
    if (typeof day.actualMinutes === "number") summary.actualMinutes += day.actualMinutes;
    if (compareIso(day.date, today) < 0 && dayCompletionState(state, day, today) === "missed") summary.missedDays += 1;
    (day.topicIds || []).forEach((id) => {
      const topic = state.topics[id];
      if (topic) summary.subjects.add(topic.subject);
    });
    if (day.staticGk) summary.subjects.add("Static GK");
    (day.specialTasks || []).forEach((task) => {
      if (task.type === "recursive_revision") summary.revisionDays += 1;
    });
    return summary;
  }, {
    totalResources: 0,
    doneResources: 0,
    estimatedMinutes: 0,
    actualMinutes: 0,
    missedDays: 0,
    revisionDays: 0,
    subjects: new Set()
  });
  const completedTopics = Object.values(state.topics).filter((topic) => {
    const date = topic.completedAt ? String(topic.completedAt).slice(0, 10) : null;
    return date && compareIso(date, from) >= 0 && compareIso(date, to) <= 0;
  });
  const backlogCleared = completedTopics.filter((topic) => compareIso(String(topic.completedAt).slice(0, 10), topic.scheduledDate) > 0).length;
  return {
    from,
    to,
    totalResources: totals.totalResources,
    doneResources: totals.doneResources,
    completionPercent: totals.totalResources ? round1((totals.doneResources / totals.totalResources) * 100) : 0,
    completedTopics: completedTopics.length,
    backlogCleared,
    missedDays: totals.missedDays,
    revisionDays: totals.revisionDays,
    estimatedMinutes: totals.estimatedMinutes,
    actualMinutes: totals.actualMinutes,
    subjects: [...totals.subjects].sort()
  };
}

function nextSundayPlan(state, today) {
  for (let date = today; compareIso(date, state.config.windowEnd) <= 0; date = addDays(date, 1)) {
    const day = state.days[date];
    const task = day?.specialTasks?.find((item) => item.type === "recursive_revision");
    if (task) {
      return {
        date,
        minutes: task.minutes || day.estMinutes || 0,
        detail: task.detail || "",
        subjects: (task.subjects || []).map((subject) => ({
          subject: subject.subject || subject.name,
          count: Number(subject.count || 1)
        }))
      };
    }
  }
  return null;
}

function computeWeeklyReview(state, today = todayIso()) {
  const currentFrom = weekStartIso(today);
  const currentTo = addDays(currentFrom, 6);
  const previousFrom = addDays(currentFrom, -7);
  const previousTo = addDays(currentFrom, -1);
  return {
    current: summarizeWeek(state, currentFrom, currentTo, today),
    previous: summarizeWeek(state, previousFrom, previousTo, today),
    nextRevision: nextSundayPlan(state, today)
  };
}

function computeTimeHonesty(state) {
  let estimated = 0;
  let actual = 0;
  Object.values(state.days).forEach((day) => {
    if (typeof day.actualMinutes === "number") {
      estimated += Number(day.estMinutes || 0);
      actual += day.actualMinutes;
    }
  });
  const ratio = estimated ? actual / estimated : null;
  return {
    estimated,
    actual,
    ratio: ratio === null ? null : round1(ratio),
    underBudgeted: ratio !== null && ratio > 1.2
  };
}

function computeActivity(state) {
  const completions = Object.values(state.topics)
    .filter((topic) => topic.completedAt)
    .map((topic) => ({
      at: topic.completedAt,
      actor: "learner",
      action: "completed_topic",
      summary: `Completed ${topic.topic}`
    }));
  return [...(state.auditLog || []), ...completions]
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))
    .slice(0, 20);
}

function computeRisks(state, stats, today) {
  const risks = [];
  if (stats.pace.requiredPerDay > stats.pace.actual7Day) {
    risks.push(`Required pace is ${stats.pace.requiredPerDay} resources/day, above the 7-day average of ${stats.pace.actual7Day}.`);
  }
  if (stats.pace.backlogCount > 0) {
    risks.push(`${stats.pace.backlogCount} backlog topic${stats.pace.backlogCount === 1 ? "" : "s"} need rescheduling or overflow work.`);
  }
  const lastMcq = Object.values(state.topics)
    .flatMap((topic) => topic.mcqAttempts || [])
    .map((attempt) => String(attempt.at || "").slice(0, 10))
    .filter(Boolean)
    .sort(compareIso)
    .at(-1);
  if (!lastMcq || compareIso(lastMcq, addDays(today, -9)) < 0) {
    risks.push(lastMcq ? `No MCQ score recorded since ${lastMcq}.` : "No MCQ scores have been recorded yet.");
  }
  const missed = Object.values(state.days)
    .filter((day) => compareIso(day.date, today) < 0 && dayCompletionState(state, day, today) === "missed")
    .sort((a, b) => compareIso(b.date, a.date));
  if (missed.length >= 3) risks.push(`${missed.length} past scheduled days have no completed resources.`);
  const geographyInBreak = Object.values(state.topics).filter((topic) => topic.subject === "Geography" && state.days[topic.scheduledDate]?.phase === "P2-geography-sprint").length;
  if (geographyInBreak >= 20) {
    risks.push(`Geography is concentrated in the autumn break: ${geographyInBreak} topics depend on that sprint.`);
  }
  if (stats.time.underBudgeted) {
    risks.push("Actual time is more than 20% above estimates; the plan is under-budgeted.");
  }
  return risks;
}

function computeStats(state, options = {}) {
  const today = options.today || todayIso();
  const completion = computeCompletion(state);
  const subjects = computeSubjectStats(state);
  const staticGk = computeStaticGkStats(state);
  const weakness = computeWeakness(state, subjects);
  const pace = computePace(state, today);
  const streak = computeStreaks(state, today);
  const weekly = computeWeeklyReview(state, today);
  const time = computeTimeHonesty(state);
  const calendar = {};
  Object.values(state.days).forEach((day) => {
    calendar[day.date] = {
      status: dayCompletionState(state, day, today),
      doneResources: dayResourceTotals(state, day).done,
      totalResources: dayResourceTotals(state, day).total
    };
  });
  const stats = {
    today,
    updatedAt: state.updatedAt,
    completion,
    pace,
    subjects,
    staticGk,
    weakness,
    streak,
    weekly,
    practical: {
      studyDaysInRow: streak.current,
      resourcesDoneThisWeek: weekly.current.doneResources,
      backlogClearedThisWeek: weekly.current.backlogCleared,
      missedDaysThisWeek: weekly.current.missedDays
    },
    time,
    calendar,
    activity: computeActivity(state)
  };
  stats.risks = computeRisks(state, stats, today);
  return stats;
}

module.exports = {
  computeCompletion,
  computePace,
  computeStats,
  computeStaticGkStats,
  computeSubjectStats,
  computeWeeklyReview,
  computeWeakness,
  dayCompletionState,
  dayResourceTotals,
  round1
};
