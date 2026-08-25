const assert = require("node:assert/strict");
const test = require("node:test");
const {
  computeTopicStatus,
  rebalance,
  recomputeDayEstimate,
  topicDoneCount,
  topicWeight
} = require("../lib/scheduler");
const { computePace, computeStats, computeWeakness } = require("../lib/stats");

function baseState() {
  return {
    version: 1,
    createdAt: "2026-08-25T00:00:00.000Z",
    updatedAt: "2026-08-25T00:00:00.000Z",
    config: {
      examDate: "2026-09-10",
      windowStart: "2026-08-25",
      windowEnd: "2026-09-10",
      mcqPassThreshold: 60,
      defaultCapacity: { regular: 1, heavy: 3, holiday_bonus: 3, break_intensive: 3 },
      minutesPerResource: { video: 45, pdf: 25, mcq: 20 }
    },
    topics: {},
    staticGk: {},
    days: {},
    auditLog: []
  };
}

function addDay(state, date, capacity = 1, topicIds = []) {
  state.days[date] = {
    date,
    weekday: "Tuesday",
    phase: "test",
    dayType: capacity === 0 ? "overflow" : "regular",
    holiday: null,
    capacity,
    topicIds,
    staticGk: null,
    estMinutes: 0,
    actualMinutes: null,
    adminNote: null,
    locked: false
  };
}

function addTopic(state, id, date, subject = "Polity", resources = { video: "pending", pdf: "pending", mcq: "pending" }) {
  const topic = {
    id,
    subject,
    track: "A",
    topic: id,
    resources,
    status: "pending",
    rushed: false,
    mcqScore: null,
    mcqAttempts: [],
    actualMinutes: null,
    notes: "",
    scheduledDate: date,
    originalDate: date,
    completedAt: null,
    revisionsDue: [],
    resourceCompletedAt: {}
  };
  topic.status = computeTopicStatus(topic);
  state.topics[id] = topic;
  state.days[date].topicIds.push(id);
  return topic;
}

test("11.1 topic completion is resource-weighted and status is derived", () => {
  const topic = {
    resources: { video: "done", pdf: "done", mcq: "pending" }
  };
  assert.equal(topicWeight(topic), 3);
  assert.equal(topicDoneCount(topic), 2);
  assert.equal(computeTopicStatus(topic), "partial");
  topic.resources.mcq = "done";
  assert.equal(computeTopicStatus(topic), "done");
});

test("11.2 pace and verdict use remaining resources, available days, and backlog", () => {
  const state = baseState();
  ["2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28"].forEach((date) => addDay(state, date, 1));
  addTopic(state, "old-1", "2026-08-25");
  addTopic(state, "old-2", "2026-08-25", "Economy");
  addTopic(state, "future-1", "2026-08-27", "History", { video: "done", pdf: "pending" });
  state.topics["future-1"].resourceCompletedAt.video = "2026-08-26T09:00:00.000Z";
  state.topics["future-1"].status = "partial";
  const pace = computePace(state, "2026-08-26");
  assert.equal(pace.backlogCount, 2);
  assert.equal(pace.remainingWeight, 7);
  assert.equal(pace.remainingDays, 3);
  assert.equal(pace.requiredPerDay, 2.3);
  assert.equal(pace.actual7Day, 0.1);
  assert.equal(pace.verdict, "slipping");
});

test("Static GK contributes to daily resources and overall completion", () => {
  const state = baseState();
  addDay(state, "2026-11-02", 1);
  state.staticGk["gk-01"] = {
    id: "gk-01",
    label: "Books and authors",
    weight: "normal",
    introducedOn: "2026-11-02",
    status: "pending",
    confidence: null,
    lastSeen: null,
    seenCount: 0
  };
  state.days["2026-11-02"].staticGk = {
    mode: "new",
    itemId: "gk-01",
    drillIds: [],
    status: "pending",
    minutes: 25
  };

  let stats = computeStats(state, { today: "2026-11-02" });
  assert.equal(stats.completion.totalWeight, 1);
  assert.equal(stats.completion.doneWeight, 0);
  assert.equal(stats.calendar["2026-11-02"].totalResources, 1);

  state.staticGk["gk-01"].status = "done";
  state.days["2026-11-02"].staticGk.status = "done";
  stats = computeStats(state, { today: "2026-11-02" });
  assert.equal(stats.completion.doneWeight, 1);
  assert.equal(stats.calendar["2026-11-02"].doneResources, 1);
});

test("special task minutes are included in day estimates", () => {
  const state = baseState();
  addDay(state, "2026-12-27", 0);
  state.days["2026-12-27"].specialTasks = [
    { type: "full_length_mock", detail: "Mock and review", minutes: 240 }
  ];
  state.days["2026-12-27"].staticGk = {
    mode: "rotation",
    itemId: null,
    drillIds: [],
    status: "pending",
    minutes: 20
  };

  recomputeDayEstimate(state, "2026-12-27");
  assert.equal(state.days["2026-12-27"].estMinutes, 260);
});

test("11.3 rebalance moves past incomplete topics into future unlocked headroom", () => {
  const state = baseState();
  addDay(state, "2026-08-25", 1);
  addDay(state, "2026-08-26", 1);
  addDay(state, "2026-08-27", 2);
  addTopic(state, "backlog", "2026-08-25");
  addTopic(state, "future", "2026-08-27");
  const result = rebalance(state, { today: "2026-08-26", commit: false });
  assert.equal(result.feasible, true);
  assert.equal(result.moved.length, 1);
  assert.equal(result.moved[0].topicId, "backlog");
  assert.equal(result.moved[0].toDate, "2026-08-26");
  assert.equal(state.topics.backlog.scheduledDate, "2026-08-25");
  assert.equal(result.previewState.topics.backlog.scheduledDate, "2026-08-26");
});

test("11.3 rebalance reports infeasible when headroom is insufficient", () => {
  const state = baseState();
  addDay(state, "2026-08-25", 1);
  addDay(state, "2026-08-26", 1, ["filled"]);
  addTopic(state, "backlog", "2026-08-25");
  addTopic(state, "filled", "2026-08-26");
  const result = rebalance(state, { today: "2026-08-26", commit: false });
  assert.equal(result.feasible, false);
  assert.equal(result.shortfall, 1);
  assert.ok(result.suggestions.length >= 2);
});

test("11.5 weakness ranks only subjects with at least three scored topics", () => {
  const state = baseState();
  ["2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28"].forEach((date) => addDay(state, date, 3));
  ["a", "b", "c"].forEach((id, index) => {
    const topic = addTopic(state, id, "2026-08-25", "Polity");
    topic.mcqScore = [50, 70, 80][index];
  });
  const unmeasured = addTopic(state, "geo", "2026-08-26", "Geography");
  unmeasured.mcqScore = 100;
  const subjects = computeStats(state, { today: "2026-08-26" }).subjects;
  const weakness = computeWeakness(state, subjects);
  assert.equal(weakness.ranked.length, 1);
  assert.equal(weakness.ranked[0].subject, "Polity");
  assert.equal(weakness.notEnoughData.length, 1);
  assert.equal(weakness.notEnoughData[0].subject, "Geography");
});
