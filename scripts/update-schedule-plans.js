const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SEED_PATH = path.join(ROOT, "data", "seed-schedule.json");
const STATE_PATH = path.join(ROOT, "data", "state.json");

const RESOURCE_MINUTES = { video: 45, pdf: 25, mcq: 20 };
const SECOND_SATURDAY = "Second Saturday";
const SUNDAY_NOTE = "Recursive Sunday revision. Clear urgent backlog first, then complete this spiral review.";

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

function weekdayIndex(iso) {
  return parseIso(iso).getUTCDay();
}

function weekdayName(iso) {
  return parseIso(iso).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
}

function maxIso(a, b) {
  return compareIso(a, b) >= 0 ? a : b;
}

function isSecondSaturday(iso) {
  const date = parseIso(iso);
  return date.getUTCDay() === 6 && date.getUTCDate() >= 8 && date.getUTCDate() <= 14;
}

function weekWindowFor(iso, windowStart) {
  const day = weekdayIndex(iso);
  const start = day === 0 ? iso : addDays(iso, -(day - 1));
  const end = day === 0 ? addDays(iso, 6) : addDays(iso, 6 - day);
  return { from: maxIso(start, windowStart), to: end };
}

function normalizeStaticLabel(label) {
  return String(label || "").replace(/^re-read:\s*/i, "").trim();
}

function seedTopicMinutes(task) {
  return Object.keys(task.resources || {}).reduce((sum, key) => sum + (RESOURCE_MINUTES[key] || 30), 0);
}

function stateTopicMinutes(topic, state) {
  const minutes = state.config?.minutesPerResource || RESOURCE_MINUTES;
  return Object.keys(topic.resources || {}).reduce((sum, key) => sum + (minutes[key] || 30), 0);
}

function seedItems(day) {
  const items = [];
  for (const task of day.tasks || []) {
    if (task.id && task.topic) {
      items.push({ date: day.date, subject: task.subject || "Unassigned", topic: task.topic, kind: "topic" });
    }
  }
  if (day.static_gk && day.static_gk.mode !== "rotation") {
    const labels = [day.static_gk.item, ...(day.static_gk.drill || [])]
      .map(normalizeStaticLabel)
      .filter((label) => label && label !== "GK rotation block");
    labels.forEach((label) => items.push({ date: day.date, subject: "Static GK", topic: label, kind: "static_gk" }));
  }
  return items;
}

function stateItems(day, state) {
  const items = [];
  for (const id of day.topicIds || []) {
    const topic = state.topics[id];
    if (topic) items.push({ date: day.date, subject: topic.subject || "Unassigned", topic: topic.topic, kind: "topic" });
  }
  if (day.staticGk && day.staticGk.mode !== "rotation") {
    const ids = [day.staticGk.itemId, ...(day.staticGk.drillIds || [])].filter(Boolean);
    ids.forEach((id) => {
      const item = state.staticGk[id];
      if (item) items.push({ date: day.date, subject: "Static GK", topic: item.label, kind: "static_gk" });
    });
  }
  return items;
}

function summarizeSubjects(items, includeTopics) {
  const bySubject = new Map();
  for (const item of items) {
    if (!bySubject.has(item.subject)) bySubject.set(item.subject, { subject: item.subject, count: 0, topics: [] });
    const entry = bySubject.get(item.subject);
    entry.count += 1;
    if (includeTopics && !entry.topics.includes(item.topic)) entry.topics.push(item.topic);
  }
  return [...bySubject.values()].sort((a, b) => b.count - a.count || a.subject.localeCompare(b.subject));
}

function itemRevisionMinutes(item, age) {
  if (item.kind === "static_gk") return age === 0 ? 4 : age === 1 ? 2 : 1;
  if (age === 0) return 8;
  if (age === 1) return 5;
  if (age === 2) return 3;
  return 1.5;
}

function roundedMinutes(value) {
  return Math.max(15, Math.round(value / 5) * 5);
}

function buildBuckets(days, sundayDate, windowStart, itemSource) {
  const buckets = new Map();
  for (const day of days) {
    if (compareIso(day.date, sundayDate) >= 0 || compareIso(day.date, windowStart) < 0) continue;
    const items = itemSource(day);
    if (!items.length) continue;
    const window = weekWindowFor(day.date, windowStart);
    if (compareIso(window.to, sundayDate) >= 0) continue;
    if (!buckets.has(window.to)) buckets.set(window.to, { ...window, items: [] });
    buckets.get(window.to).items.push(...items);
  }
  return [...buckets.values()].sort((a, b) => compareIso(b.to, a.to));
}

function buildRevisionPlan(days, sundayDate, windowStart, itemSource) {
  const buckets = buildBuckets(days, sundayDate, windowStart, itemSource);
  if (!buckets.length) return null;
  const windows = buckets.map((bucket, index) => {
    const minutes = roundedMinutes(bucket.items.reduce((sum, item) => sum + itemRevisionMinutes(item, index), 0));
    const focus = index === 0
      ? "Deep review latest week"
      : index === 1
        ? "Second pass"
        : index === 2
          ? "Third pass"
          : `Quick recall pass ${index + 1}`;
    return {
      pass: index + 1,
      focus,
      from: bucket.from,
      to: bucket.to,
      minutes,
      subjects: summarizeSubjects(bucket.items, true)
    };
  });
  const totalMinutes = windows.reduce((sum, windowItem) => sum + windowItem.minutes, 0);
  const allItems = buckets.flatMap((bucket) => bucket.items);
  const olderWeeks = Math.max(0, windows.length - 1);
  return {
    type: "recursive_revision",
    detail: `Deep review the latest week and quick-recall ${olderWeeks} earlier week${olderWeeks === 1 ? "" : "s"}.`,
    from: windows.at(-1).from,
    to: windows[0].to,
    minutes: totalMinutes,
    subjects: summarizeSubjects(allItems, false),
    windows
  };
}

function annotateSeedSpecialMinutes(seed) {
  for (const day of seed.calendar || []) {
    const special = (day.tasks || []).filter((task) => !task.id && (task.type || task.detail));
    if (!special.length) continue;
    const topicMinutes = (day.tasks || []).filter((task) => task.id && task.topic).reduce((sum, task) => sum + seedTopicMinutes(task), 0);
    const staticMinutes = Number(day.static_gk?.minutes || 0);
    const available = Math.max(0, Number(day.est_minutes || 0) - topicMinutes - staticMinutes);
    const perTask = special.length ? Math.round(available / special.length) : 0;
    special.forEach((task) => {
      if (!task.minutes && perTask > 0) task.minutes = perTask;
    });
  }
}

function annotateStateSpecialMinutesFromSeed(state, seed) {
  const seedSpecialByDate = new Map();
  for (const day of seed.calendar || []) {
    seedSpecialByDate.set(day.date, (day.tasks || []).filter((task) => !task.id && (task.type || task.detail)));
  }
  for (const day of Object.values(state.days || {})) {
    const seedSpecial = seedSpecialByDate.get(day.date) || [];
    (day.specialTasks || []).forEach((task, index) => {
      if (!task.minutes && seedSpecial[index]?.minutes) task.minutes = seedSpecial[index].minutes;
    });
  }
}

function markSeedSecondSaturdays(seed) {
  let count = 0;
  for (const day of seed.calendar || []) {
    if (!isSecondSaturday(day.date)) continue;
    day.holiday = day.holiday || SECOND_SATURDAY;
    if (["regular", "heavy", "overflow", "buffer"].includes(day.day_type)) {
      day.day_type = "holiday_bonus";
      day.capacity = Math.max(Number(day.capacity || 0), 3);
    }
    count += 1;
  }
  return count;
}

function markStateSecondSaturdays(state) {
  let count = 0;
  for (const day of Object.values(state.days || {})) {
    if (!isSecondSaturday(day.date)) continue;
    day.holiday = day.holiday || SECOND_SATURDAY;
    if (["regular", "heavy", "overflow", "buffer"].includes(day.dayType)) {
      day.dayType = "holiday_bonus";
      day.capacity = Math.max(Number(day.capacity || 0), 3);
    }
    count += 1;
  }
  return count;
}

function applySeedSundayRevisions(seed) {
  const days = [...(seed.calendar || [])].sort((a, b) => compareIso(a.date, b.date));
  const windowStart = seed.meta?.window?.start || days[0]?.date;
  let count = 0;
  for (const day of days) {
    if (weekdayName(day.date) !== "Sunday") continue;
    const existingTasks = day.tasks || [];
    const hasOnlyGeneratedRevision = existingTasks.length === 1 && existingTasks[0].type === "recursive_revision";
    if ((existingTasks.length && !hasOnlyGeneratedRevision) || day.static_gk) continue;
    const plan = buildRevisionPlan(days, day.date, windowStart, seedItems);
    if (!plan) continue;
    day.day_type = "revision";
    day.capacity = 0;
    day.tasks = [plan];
    day.est_minutes = plan.minutes;
    day.notes = SUNDAY_NOTE;
    count += 1;
  }
  return count;
}

function applyStateSundayRevisions(state) {
  const days = Object.values(state.days || {}).sort((a, b) => compareIso(a.date, b.date));
  const windowStart = state.config?.windowStart || days[0]?.date;
  let count = 0;
  for (const day of days) {
    if (weekdayName(day.date) !== "Sunday") continue;
    const existingTasks = day.specialTasks || [];
    const hasOnlyGeneratedRevision = existingTasks.length === 1 && existingTasks[0].type === "recursive_revision";
    if ((day.topicIds || []).length || (existingTasks.length && !hasOnlyGeneratedRevision) || day.staticGk) continue;
    const plan = buildRevisionPlan(days, day.date, windowStart, (sourceDay) => stateItems(sourceDay, state));
    if (!plan) continue;
    day.dayType = "revision";
    day.capacity = 0;
    day.specialTasks = [plan];
    day.estMinutes = plan.minutes;
    day.adminNote = SUNDAY_NOTE;
    count += 1;
  }
  return count;
}

function recomputeStateEstimates(state) {
  for (const day of Object.values(state.days || {})) {
    const topicMinutes = (day.topicIds || []).reduce((sum, id) => {
      const topic = state.topics[id];
      return topic ? sum + stateTopicMinutes(topic, state) : sum;
    }, 0);
    const staticMinutes = Number(day.staticGk?.minutes || 0);
    const specialMinutes = (day.specialTasks || []).reduce((sum, task) => sum + Number(task.minutes || 0), 0);
    if (topicMinutes || staticMinutes || specialMinutes) day.estMinutes = topicMinutes + staticMinutes + specialMinutes;
  }
}

function main() {
  const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
  const state = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));

  annotateSeedSpecialMinutes(seed);
  const seedHolidays = markSeedSecondSaturdays(seed);
  const seedRevisions = applySeedSundayRevisions(seed);

  annotateStateSpecialMinutesFromSeed(state, seed);
  const stateHolidays = markStateSecondSaturdays(state);
  const stateRevisions = applyStateSundayRevisions(state);
  recomputeStateEstimates(state);
  state.updatedAt = new Date().toISOString();

  fs.writeFileSync(SEED_PATH, `${JSON.stringify(seed, null, 2)}\n`);
  fs.writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);

  console.log(JSON.stringify({
    seedRevisions,
    stateRevisions,
    seedSecondSaturdays: seedHolidays,
    stateSecondSaturdays: stateHolidays
  }, null, 2));
}

main();
