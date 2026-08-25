const fs = require("fs");
const path = require("path");
const readline = require("readline");
const {
  computeTopicStatus,
  recomputeAllDayEstimates,
  todayIso,
  weekdayName
} = require("./scheduler");

const ROOT_DIR = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "data");
const SEED_PATH = path.join(DATA_DIR, "seed-schedule.json");
const STATE_PATH = path.join(DATA_DIR, "state.json");

function normalizeStatus(value) {
  return value === "done" ? "done" : "pending";
}

function normalizeLabel(label) {
  return String(label || "")
    .replace(/^re-read:\s*/i, "")
    .trim();
}

function collectStaticLabels(seed) {
  const labels = [];
  const seen = new Set();
  for (const day of seed.calendar || []) {
    const block = day.static_gk;
    if (!block) continue;
    const candidates = [block.item, ...(block.drill || [])]
      .map(normalizeLabel)
      .filter((label) => label && label !== "GK rotation block");
    for (const label of candidates) {
      if (!seen.has(label)) {
        seen.add(label);
        labels.push(label);
      }
    }
  }
  return labels;
}

function buildStaticGk(seed) {
  const labels = collectStaticLabels(seed);
  const firstNewDate = new Map();
  for (const day of seed.calendar || []) {
    const block = day.static_gk;
    if (!block || block.mode !== "new") continue;
    const label = normalizeLabel(block.item);
    if (label && !firstNewDate.has(label)) firstNewDate.set(label, day.date);
  }
  const labelToId = new Map();
  const staticGk = {};
  labels.forEach((label, index) => {
    const id = `gk-${String(index + 1).padStart(2, "0")}`;
    labelToId.set(label, id);
    staticGk[id] = {
      id,
      label,
      weight: "normal",
      introducedOn: firstNewDate.get(label) || null,
      status: "pending",
      confidence: null,
      lastSeen: null,
      seenCount: 0
    };
  });
  return { staticGk, labelToId };
}

function normalizeStaticBlock(block, labelToId) {
  if (!block) return null;
  const itemLabel = normalizeLabel(block.item);
  const drillLabels = (block.drill || []).map(normalizeLabel).filter(Boolean);
  return {
    mode: block.mode,
    itemId: itemLabel && itemLabel !== "GK rotation block" ? (labelToId.get(itemLabel) || null) : null,
    drillIds: drillLabels.map((label) => labelToId.get(label)).filter(Boolean),
    status: normalizeStatus(block.status),
    minutes: Number(block.minutes || 0)
  };
}

function buildInitialState(seedPath = SEED_PATH, now = new Date()) {
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  const createdAt = now.toISOString();
  const { staticGk, labelToId } = buildStaticGk(seed);
  const topics = {};
  const days = {};

  for (const day of seed.calendar || []) {
    const topicIds = [];
    const specialTasks = [];
    for (const task of day.tasks || []) {
      if (task.id && task.topic) {
        const topic = {
          id: task.id,
          subject: task.subject || "Unassigned",
          track: task.track || null,
          topic: task.topic,
          resources: Object.fromEntries(
            Object.entries(task.resources || {}).map(([key, value]) => [key, normalizeStatus(value)])
          ),
          status: "pending",
          rushed: Boolean(task.rushed),
          mcqScore: typeof task.mcq_score === "number" ? task.mcq_score : null,
          mcqAttempts: [],
          actualMinutes: null,
          notes: "",
          scheduledDate: day.date,
          originalDate: day.date,
          completedAt: null,
          revisionsDue: [],
          resourceCompletedAt: {}
        };
        topic.status = computeTopicStatus(topic);
        topics[topic.id] = topic;
        topicIds.push(topic.id);
      } else if (task.type || task.detail) {
        specialTasks.push({
          ...JSON.parse(JSON.stringify(task)),
          type: task.type || "note",
          detail: task.detail || ""
        });
      }
    }

    days[day.date] = {
      date: day.date,
      weekday: day.weekday || weekdayName(day.date),
      phase: day.phase || null,
      dayType: day.day_type || "regular",
      holiday: day.holiday || null,
      capacity: Number(day.capacity || 0),
      topicIds,
      staticGk: normalizeStaticBlock(day.static_gk, labelToId),
      estMinutes: Number(day.est_minutes || 0),
      actualMinutes: null,
      adminNote: day.notes || null,
      locked: false,
      specialTasks
    };
  }

  const state = {
    version: 1,
    createdAt,
    updatedAt: createdAt,
    config: {
      examDate: "2027-01-18",
      examDateConfirmed: false,
      windowStart: seed.meta?.window?.start || "2026-08-25",
      windowEnd: seed.meta?.window?.end || "2027-01-11",
      mcqPassThreshold: 60,
      overflowCapMultiplier: 1.5,
      defaultCapacity: { regular: 1, heavy: 3, holiday_bonus: 3, break_intensive: 3 },
      minutesPerResource: { video: 45, pdf: 25, mcq: 20 },
      learnerName: "Learner"
    },
    topics,
    staticGk,
    days,
    auditLog: []
  };
  recomputeAllDayEstimates(state);
  return state;
}

function writeFreshState(state) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(path.join(DATA_DIR, "backups"), { recursive: true });
  fs.writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function resetCli() {
  const answer = await ask("Reset data/state.json from the seed schedule? Type RESET to continue: ");
  if (answer !== "RESET") {
    console.log("Reset cancelled.");
    return;
  }
  if (fs.existsSync(STATE_PATH)) fs.unlinkSync(STATE_PATH);
  writeFreshState(buildInitialState(SEED_PATH, new Date()));
  console.log(`Reset complete at ${todayIso()}.`);
}

if (require.main === module) {
  if (process.argv.includes("--reset")) {
    resetCli().catch((error) => {
      console.error(error);
      process.exit(1);
    });
  } else {
    writeFreshState(buildInitialState(SEED_PATH, new Date()));
  }
}

module.exports = {
  buildInitialState,
  collectStaticLabels,
  normalizeLabel,
  writeFreshState
};
