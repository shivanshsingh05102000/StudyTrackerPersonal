const fs = require("fs");
const { buildInitialState } = require("../lib/seed");
const { computeStats } = require("../lib/stats");

const state = JSON.parse(fs.readFileSync("data/state.json", "utf8"));
const seed = JSON.parse(fs.readFileSync("data/seed-schedule.json", "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseIso(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function isSecondSaturday(iso) {
  const date = parseIso(iso);
  return date.getUTCDay() === 6 && date.getUTCDate() >= 8 && date.getUTCDate() <= 14;
}

function scheduledStaticNewDays(sourceDays) {
  return Object.values(sourceDays)
    .filter((day) => day.date >= "2026-11-02" && day.date <= "2026-11-28")
    .filter((day) => day.staticGk?.mode === "new");
}

function workCount(day) {
  return (day.topicIds || []).length + (day.staticGk ? 1 : 0) + (day.specialTasks || []).length;
}

function unique(values) {
  return [...new Set(values)];
}

const days = Object.values(state.days);
const topics = Object.values(state.topics);
const staticItems = Object.values(state.staticGk || {});

assert(topics.length === 90, `Expected 90 topics, found ${topics.length}.`);
assert(staticItems.length === 24, `Expected 24 Static GK items, found ${staticItems.length}.`);
assert(days.length === seed.calendar.length, "State/seed day counts differ.");

const topicPlacements = new Map();
for (const day of days) {
  assert(day.date && day.weekday && day.dayType, `Malformed day ${day.date || "(missing date)"}.`);
  for (const id of day.topicIds || []) {
    assert(state.topics[id], `Day ${day.date} references missing topic ${id}.`);
    assert(!topicPlacements.has(id), `Topic ${id} is scheduled more than once.`);
    topicPlacements.set(id, day.date);
  }
  if (day.staticGk) {
    if (day.staticGk.itemId) assert(state.staticGk[day.staticGk.itemId], `Day ${day.date} references missing Static GK item ${day.staticGk.itemId}.`);
    for (const id of day.staticGk.drillIds || []) assert(state.staticGk[id], `Day ${day.date} references missing Static GK drill ${id}.`);
  }
}

for (const topic of topics) {
  assert(topicPlacements.get(topic.id) === topic.scheduledDate, `Topic ${topic.id} scheduledDate does not match its day.`);
}

const staticNew = scheduledStaticNewDays(state.days);
assert(staticNew.length === 24, `Expected 24 November Static GK new days, found ${staticNew.length}.`);
assert(staticNew.every((day) => day.staticGk.itemId && !(day.staticGk.drillIds || []).length), "A November Static GK new day is not exactly one item.");
assert(unique(staticNew.map((day) => day.staticGk.itemId)).length === 24, "Static GK new items are not unique.");

const sundayRevisions = days.filter((day) => day.weekday === "Sunday" && day.specialTasks?.[0]?.type === "recursive_revision");
assert(sundayRevisions.length === 16, `Expected 16 recursive Sunday revisions, found ${sundayRevisions.length}.`);
assert(sundayRevisions.every((day) => workCount(day) > 0 && day.estMinutes > 0), "A Sunday revision still looks empty.");
assert(sundayRevisions.every((day) => day.specialTasks[0].windows?.length > 0), "A Sunday revision has no revision windows.");

const secondSaturdays = days.filter((day) => isSecondSaturday(day.date));
const markedSecondSaturdays = secondSaturdays.filter((day) => day.holiday === "Second Saturday");
assert(markedSecondSaturdays.length === secondSaturdays.length, "Not every second Saturday is marked.");
assert(secondSaturdays.length === 5, `Expected 5 second Saturdays in the schedule window, found ${secondSaturdays.length}.`);

const fresh = buildInitialState("data/seed-schedule.json", new Date("2026-08-25T00:00:00.000Z"));
assert(Object.values(fresh.days).filter((day) => day.specialTasks?.[0]?.type === "recursive_revision").length === 16, "Fresh seed rebuild loses Sunday revisions.");
assert(Object.values(fresh.days).filter((day) => day.holiday === "Second Saturday").length === 5, "Fresh seed rebuild loses second Saturdays.");
assert(fresh.days["2027-01-09"].estMinutes === 260, "Fresh seed rebuild does not preserve mock + GK minutes.");

const stats = computeStats(state, { today: "2026-08-25" });
assert(stats.staticGk.total === 24, "Stats Static GK total is wrong.");
assert(stats.calendar["2026-11-02"].totalResources === 1, "Static GK new day should count as one resource.");

console.log(JSON.stringify({
  topics: topics.length,
  staticGk: staticItems.length,
  sundayRevisions: sundayRevisions.length,
  secondSaturdays: markedSecondSaturdays.map((day) => day.date),
  resetPathOk: true
}, null, 2));
