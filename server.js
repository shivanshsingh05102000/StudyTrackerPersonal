const crypto = require("crypto");
const path = require("path");
const express = require("express");
const {
  addHoliday,
  clone,
  compareIso,
  getBacklogTopics,
  moveTopics,
  pushBacklog,
  rebalance,
  recomputeDayEstimate,
  recomputeTopicStatus,
  removeHoliday,
  removeUnmetRevisions,
  shiftRange,
  spawnRevisions,
  todayIso,
  topicEstimatedMinutes,
  topicWeight,
  updateDay,
  validateExamDateChange
} = require("./lib/scheduler");
const { computeStats } = require("./lib/stats");
const { ensureState, listBackups, loadState, resetAll, restoreBackup, saveState } = require("./lib/store");

const ACCOUNTS = {
  admin: { password: process.env.STUDY_TRACKER_ADMIN_PASSWORD || "admin123", role: "admin" },
  learner: { password: process.env.STUDY_TRACKER_LEARNER_PASSWORD || "learner123", role: "learner" }
};

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3000);
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
const AUTH_SECRET = process.env.STUDY_TRACKER_AUTH_SECRET || "demo-study-tracker-auth-secret";

ensureState();

const app = express();
app.use(express.json({ limit: "1mb" }));

function parseCookies(header) {
  return Object.fromEntries(
    String(header || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function base64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64Url(value) {
  const normalized = String(value).replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function signJwt(payload, expiresInSeconds, tokenUse) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const claims = {
    iss: "local-study-tracker",
    aud: "study-tracker",
    iat: now,
    exp: now + expiresInSeconds,
    jti: crypto.randomUUID(),
    tokenUse,
    ...payload
  };
  const body = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claims))}`;
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyJwt(token, expectedUse) {
  if (!token) return null;
  const parts = String(token).split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, signature] = parts;
  const signed = `${encodedHeader}.${encodedPayload}`;
  const expected = crypto.createHmac("sha256", AUTH_SECRET).update(signed).digest("base64url");
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  let payload;
  try {
    payload = JSON.parse(decodeBase64Url(encodedPayload));
  } catch (_error) {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (payload.iss !== "local-study-tracker" || payload.aud !== "study-tracker") return null;
  if (payload.tokenUse !== expectedUse) return null;
  if (!payload.exp || payload.exp <= now) return null;
  const account = ACCOUNTS[payload.sub];
  if (!account || account.role !== payload.role) return null;
  return payload;
}

function authCookie(name, value, maxAgeSeconds) {
  return `${name}=${encodeURIComponent(value)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}`;
}

function setAuthCookies(res, username, role, options = {}) {
  const cookies = [
    authCookie("study_access", signJwt({ sub: username, role }, ACCESS_TOKEN_TTL_SECONDS, "access"), ACCESS_TOKEN_TTL_SECONDS)
  ];
  if (options.includeRefresh) {
    cookies.push(authCookie("study_refresh", signJwt({ sub: username, role }, REFRESH_TOKEN_TTL_SECONDS, "refresh"), REFRESH_TOKEN_TTL_SECONDS));
  }
  res.setHeader("Set-Cookie", cookies);
}

function clearAuthCookies(res) {
  res.setHeader("Set-Cookie", [
    "study_access=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
    "study_refresh=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
    "study_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"
  ]);
}

function refreshSession(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const refreshPayload = verifyJwt(cookies.study_refresh, "refresh");
  if (!refreshPayload) return null;
  setAuthCookies(res, refreshPayload.sub, refreshPayload.role, { includeRefresh: false });
  return { username: refreshPayload.sub, role: refreshPayload.role, refreshed: true };
}

function currentSession(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const accessPayload = verifyJwt(cookies.study_access, "access");
  if (accessPayload) return { username: accessPayload.sub, role: accessPayload.role, refreshed: false };
  return refreshSession(req, res);
}

function requireSession(req, res, next) {
  const session = currentSession(req, res);
  if (!session) return res.status(401).json({ error: "unauthorized", message: "Log in to continue." });
  req.session = session;
  next();
}

function requireAdmin(req, res, next) {
  if (req.session?.role !== "admin") {
    return res.status(403).json({ error: "forbidden", message: "Admin access is required." });
  }
  next();
}

function rejectStaleMutation(req, res, next) {
  if (req.method === "GET" || req.path === "/login") return next();
  const clientUpdatedAt = req.headers["x-state-updated-at"];
  if (!clientUpdatedAt) return next();
  const state = loadState();
  if (state.updatedAt !== clientUpdatedAt) {
    return res.status(409).json({
      error: "state_changed",
      message: "The data changed in another tab. Reload before saving again.",
      updatedAt: state.updatedAt
    });
  }
  next();
}

function snapshot(state) {
  return {
    config: clone(state.config),
    topics: clone(state.topics),
    staticGk: clone(state.staticGk),
    days: clone(state.days)
  };
}

function makeAudit(actor, action, summary, before, after, extra = {}) {
  return {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    actor,
    action,
    summary,
    before,
    after,
    undone: false,
    ...extra
  };
}

function appendAudit(state, entry) {
  state.auditLog = [...(state.auditLog || []), entry];
  if (state.auditLog.length > 1000) state.auditLog = state.auditLog.slice(-1000);
}

function sendState(res, state, body = {}) {
  const stats = computeStats(state);
  res.json({ ...body, stats, updatedAt: state.updatedAt });
}

function hydratedStaticGk(state, block) {
  if (!block) return null;
  return {
    ...block,
    item: block.itemId ? state.staticGk[block.itemId] : null,
    drills: (block.drillIds || []).map((id) => state.staticGk[id]).filter(Boolean)
  };
}

function hydrateDay(state, date) {
  const day = state.days[date];
  if (!day) throw new Error(`${date} is outside the schedule window.`);
  const revisions = Object.values(state.topics)
    .filter((topic) => (topic.revisionsDue || []).includes(date))
    .sort((a, b) => a.subject.localeCompare(b.subject) || a.topic.localeCompare(b.topic));
  const hydrated = {
    ...clone(day),
    topics: (day.topicIds || []).map((id) => state.topics[id]).filter(Boolean),
    staticGk: hydratedStaticGk(state, day.staticGk),
    revisionsDue: revisions
  };
  if (day.dayType === "overflow") {
    hydrated.overflowBacklog = getBacklogTopics(state, date).map((topic) => ({
      ...topic,
      estMinutes: topicEstimatedMinutes(topic, state.config)
    }));
  }
  return hydrated;
}

function mutateLearner(req, res, fn) {
  try {
    const state = loadState();
    const result = fn(state);
    saveState(state);
    sendState(res, state, result);
  } catch (error) {
    res.status(400).json({ error: "bad_request", message: error.message });
  }
}

function mutateAdmin(req, res, action, fn) {
  try {
    const state = loadState();
    const before = snapshot(state);
    const result = fn(state);
    const next = result.state || state;
    const after = snapshot(next);
    appendAudit(next, makeAudit(req.session.username, action, result.summary || action, before, after, { diff: result.diff || result.moved || [] }));
    saveState(next);
    sendState(res, next, { ok: true, ...result, state: undefined, previewState: undefined });
  } catch (error) {
    res.status(400).json({ error: "bad_request", message: error.message });
  }
}

function resourceToggle(state, topicId, resource, done) {
  const topic = state.topics[topicId];
  if (!topic) throw new Error("Topic was not found.");
  if (!Object.prototype.hasOwnProperty.call(topic.resources, resource)) {
    throw new Error(`This topic does not have a ${resource} resource.`);
  }
  const now = new Date().toISOString();
  const today = todayIso();
  const wasDone = topic.status === "done";
  topic.resources[resource] = done ? "done" : "pending";
  topic.resourceCompletedAt = topic.resourceCompletedAt || {};
  if (done) {
    topic.resourceCompletedAt[resource] = now;
    const todayDay = state.days[today];
    if (compareIso(today, topic.scheduledDate) > 0 || todayDay?.dayType === "overflow") topic.rushed = true;
  } else {
    delete topic.resourceCompletedAt[resource];
  }
  recomputeTopicStatus(topic);
  if (topic.status === "done" && !wasDone) {
    topic.completedAt = now;
    spawnRevisions(state, topic, today);
  }
  if (topic.status !== "done" && wasDone) {
    topic.completedAt = null;
    removeUnmetRevisions(topic, today);
  }
  return topic;
}

function resetProgressKeepSchedule(state) {
  const next = clone(state);
  Object.values(next.topics).forEach((topic) => {
    Object.keys(topic.resources || {}).forEach((key) => {
      topic.resources[key] = "pending";
    });
    topic.status = "pending";
    topic.rushed = false;
    topic.mcqScore = null;
    topic.mcqAttempts = [];
    topic.actualMinutes = null;
    topic.notes = "";
    topic.completedAt = null;
    topic.revisionsDue = [];
    topic.resourceCompletedAt = {};
  });
  Object.values(next.staticGk).forEach((item) => {
    item.status = "pending";
    item.confidence = null;
    item.lastSeen = null;
    item.seenCount = 0;
  });
  Object.values(next.days).forEach((day) => {
    if (day.staticGk) day.staticGk.status = "pending";
    day.actualMinutes = null;
  });
  return { state: next, summary: "Reset all learner progress and kept the schedule" };
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  const account = ACCOUNTS[username];
  if (!account || account.password !== password) {
    return res.status(401).json({ error: "invalid_login", message: "Username or password is incorrect." });
  }
  setAuthCookies(res, username, account.role, { includeRefresh: true });
  res.json({
    username,
    role: account.role,
    accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenExpiresIn: REFRESH_TOKEN_TTL_SECONDS
  });
});

app.post("/api/refresh", (req, res) => {
  const session = refreshSession(req, res);
  if (!session) return res.status(401).json({ error: "unauthorized", message: "Log in again." });
  res.json({
    username: session.username,
    role: session.role,
    accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS
  });
});

app.post("/api/logout", requireSession, (req, res) => {
  clearAuthCookies(res);
  res.json({ ok: true });
});

app.use("/api", requireSession, rejectStaleMutation);

app.get("/api/session", (req, res) => {
  res.json({ username: req.session.username, role: req.session.role });
});

app.get("/api/state", requireAdmin, (req, res) => {
  const state = loadState();
  sendState(res, state, { state });
});

app.get("/api/day/:date", (req, res) => {
  try {
    const state = loadState();
    sendState(res, state, { day: hydrateDay(state, req.params.date), config: state.config });
  } catch (error) {
    res.status(404).json({ error: "not_found", message: error.message });
  }
});

app.get("/api/range", (req, res) => {
  const state = loadState();
  const from = req.query.from || state.config.windowStart;
  const to = req.query.to || state.config.windowEnd;
  const days = Object.values(state.days)
    .filter((day) => compareIso(day.date, from) >= 0 && compareIso(day.date, to) <= 0)
    .sort((a, b) => compareIso(a.date, b.date))
    .map((day) => hydrateDay(state, day.date));
  sendState(res, state, { days, config: state.config });
});

app.get("/api/stats", (req, res) => {
  const state = loadState();
  sendState(res, state, { config: state.config });
});

app.get("/api/gk", (req, res) => {
  const state = loadState();
  const scheduleById = {};
  Object.keys(state.staticGk || {}).forEach((id) => {
    scheduleById[id] = [];
  });
  Object.values(state.days || {}).forEach((day) => {
    const block = day.staticGk;
    if (!block) return;
    if (block.itemId && scheduleById[block.itemId]) {
      scheduleById[block.itemId].push({ date: day.date, mode: block.mode });
    }
    (block.drillIds || []).forEach((id) => {
      if (scheduleById[id]) scheduleById[id].push({ date: day.date, mode: block.mode === "rotation" ? "rotation" : "drill" });
    });
  });
  const items = Object.values(state.staticGk || {})
    .map((item) => ({
      ...item,
      schedule: scheduleById[item.id] || []
    }))
    .sort((a, b) => {
      const confidenceA = a.confidence ?? 0;
      const confidenceB = b.confidence ?? 0;
      return confidenceA - confidenceB || String(a.introducedOn || "9999-99-99").localeCompare(String(b.introducedOn || "9999-99-99")) || a.label.localeCompare(b.label);
    });
  sendState(res, state, { items });
});

app.patch("/api/topic/:id/resource", (req, res) => {
  mutateLearner(req, res, (state) => {
    const topic = resourceToggle(state, req.params.id, req.body.resource, Boolean(req.body.done));
    recomputeDayEstimate(state, topic.scheduledDate);
    return { ok: true, topic, day: hydrateDay(state, topic.scheduledDate) };
  });
});

app.patch("/api/topic/:id/mcq", (req, res) => {
  mutateLearner(req, res, (state) => {
    const topic = state.topics[req.params.id];
    if (!topic) throw new Error("Topic was not found.");
    if (!Object.prototype.hasOwnProperty.call(topic.resources, "mcq")) {
      throw new Error("Cannot record an MCQ score on a topic with no MCQ resource.");
    }
    const score = Number(req.body.score);
    if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error("MCQ score must be between 0 and 100.");
    const now = new Date().toISOString();
    topic.mcqScore = score;
    topic.mcqAttempts = [...(topic.mcqAttempts || []), { at: now, score }];
    if (score < state.config.mcqPassThreshold) {
      topic.rushed = true;
      spawnRevisions(state, topic, todayIso());
    } else {
      topic.rushed = false;
    }
    return { ok: true, topic };
  });
});

app.patch("/api/topic/:id/meta", (req, res) => {
  mutateLearner(req, res, (state) => {
    const topic = state.topics[req.params.id];
    if (!topic) throw new Error("Topic was not found.");
    if (req.body.actualMinutes !== undefined) {
      const actual = req.body.actualMinutes === null || req.body.actualMinutes === "" ? null : Number(req.body.actualMinutes);
      if (actual !== null && (!Number.isFinite(actual) || actual < 0)) throw new Error("Actual minutes must be zero or more.");
      topic.actualMinutes = actual;
    }
    if (req.body.notes !== undefined) topic.notes = String(req.body.notes || "");
    return { ok: true, topic };
  });
});

app.patch("/api/gk/:id", (req, res) => {
  mutateLearner(req, res, (state) => {
    const item = state.staticGk[req.params.id];
    if (!item) throw new Error("Static GK item was not found.");
    const now = new Date().toISOString();
    if (req.body.weight !== undefined) {
      if (req.session.role !== "admin") throw new Error("Only admin can change Static GK weights.");
      if (!["light", "normal", "heavy"].includes(req.body.weight)) throw new Error("Weight must be light, normal, or heavy.");
      item.weight = req.body.weight;
    }
    if (req.body.status !== undefined) {
      if (!["pending", "done"].includes(req.body.status)) throw new Error("Status must be pending or done.");
      item.status = req.body.status;
      if (req.body.status === "done") {
        item.lastSeen = now;
        item.seenCount += 1;
      }
      const today = todayIso();
      const day = state.days[today];
      if (day?.staticGk && (day.staticGk.itemId === item.id || (day.staticGk.drillIds || []).includes(item.id))) {
        day.staticGk.status = req.body.status;
      }
    }
    if (req.body.confidence !== undefined) {
      const confidence = Number(req.body.confidence);
      if (!Number.isInteger(confidence) || confidence < 1 || confidence > 5) throw new Error("Confidence must be 1 through 5.");
      item.confidence = confidence;
      item.lastSeen = now;
      item.seenCount += 1;
    }
    return { ok: true, item };
  });
});

app.post("/api/admin/move-topics", requireAdmin, (req, res) => {
  mutateAdmin(req, res, "move_topics", (state) => moveTopics(state, req.body.topicIds, req.body.toDate));
});

app.post("/api/admin/shift-range", requireAdmin, (req, res) => {
  mutateAdmin(req, res, "shift_range", (state) => shiftRange(state, req.body.fromDate, Number(req.body.days)));
});

app.post("/api/admin/push-backlog", requireAdmin, (req, res) => {
  mutateAdmin(req, res, "push_backlog", (state) => pushBacklog(state, req.body.toDate, todayIso()));
});

app.patch("/api/admin/day/:date", requireAdmin, (req, res) => {
  mutateAdmin(req, res, "update_day", (state) => updateDay(state, req.params.date, req.body));
});

app.post("/api/admin/holiday", requireAdmin, (req, res) => {
  mutateAdmin(req, res, "add_holiday", (state) => {
    const beforeStats = computeStats(state);
    const result = addHoliday(state, req.body.date, req.body.label, req.body.type);
    const afterStats = computeStats(result.state);
    return {
      ...result,
      delta: {
        beforeRequiredPerDay: beforeStats.pace.requiredPerDay,
        afterRequiredPerDay: afterStats.pace.requiredPerDay
      }
    };
  });
});

app.delete("/api/admin/holiday/:date", requireAdmin, (req, res) => {
  mutateAdmin(req, res, "remove_holiday", (state) => removeHoliday(state, req.params.date));
});

app.post("/api/admin/rebalance", requireAdmin, (req, res) => {
  try {
    const commit = Boolean(req.body.commit);
    const state = loadState();
    const result = rebalance(state, { today: todayIso(), commit });
    if (!commit || !result.feasible) {
      const previewStats = result.previewState ? computeStats(result.previewState) : null;
      const previewDays = result.previewState
        ? Object.values(result.previewState.days)
          .filter((day) => day.estMinutes > 240)
          .map((day) => ({ date: day.date, estMinutes: day.estMinutes, topicCount: day.topicIds.length }))
        : [];
      return sendState(res, state, { ok: true, ...result, previewStats, previewDays, previewState: undefined });
    }
    const before = snapshot(state);
    const next = result.state;
    appendAudit(next, makeAudit(req.session.username, "rebalance", result.summary, before, snapshot(next), { diff: result.moved }));
    saveState(next);
    sendState(res, next, { ok: true, ...result, state: undefined, previewState: undefined });
  } catch (error) {
    res.status(400).json({ error: "bad_request", message: error.message });
  }
});

app.post("/api/admin/simulate", requireAdmin, (req, res) => {
  try {
    const state = loadState();
    const scenario = req.body.scenario;
    const simulated = clone(state);
    if (scenario === "miss_next_5_days") {
      for (let date = todayIso(), i = 0; i < 5; i += 1, date = require("./lib/scheduler").addDays(date, 1)) {
        if (simulated.days[date]) simulated.days[date].capacity = 0;
      }
    } else if (scenario === "autumn_cancelled") {
      Object.values(simulated.days).forEach((day) => {
        if (day.phase === "P2-geography-sprint") {
          day.dayType = "regular";
          day.capacity = 1;
        }
      });
    } else if (scenario === "add_30_min_day") {
      Object.values(simulated.days).forEach((day) => {
        if (day.capacity > 0) day.capacity += 1;
      });
    } else {
      throw new Error("Choose a supported scenario.");
    }
    const simulatedStats = computeStats(simulated);
    const preview = rebalance(simulated, { today: todayIso(), commit: false });
    sendState(res, state, { ok: true, scenario, simulatedStats, preview: { feasible: preview.feasible, shortfall: preview.shortfall, moved: preview.moved, suggestions: preview.suggestions } });
  } catch (error) {
    res.status(400).json({ error: "bad_request", message: error.message });
  }
});

app.patch("/api/admin/config", requireAdmin, (req, res) => {
  mutateAdmin(req, res, "update_config", (state) => {
    const next = clone(state);
    const allowed = ["examDate", "examDateConfirmed", "mcqPassThreshold", "overflowCapMultiplier", "defaultCapacity", "minutesPerResource", "learnerName"];
    Object.keys(req.body || {}).forEach((key) => {
      if (!allowed.includes(key)) throw new Error(`Config field ${key} cannot be changed here.`);
    });
    if (req.body.examDate !== undefined) validateExamDateChange(next, req.body.examDate);
    next.config = { ...next.config, ...req.body };
    return { state: next, summary: "Updated configuration" };
  });
});

app.post("/api/admin/undo/:auditId", requireAdmin, (req, res) => {
  try {
    const state = loadState();
    const entry = (state.auditLog || []).find((item) => item.id === req.params.auditId);
    if (!entry) throw new Error("Audit entry was not found.");
    if (entry.undone) throw new Error("This audit entry has already been undone.");
    if (!entry.before) throw new Error("This audit entry cannot be undone.");
    const beforeUndo = snapshot(state);
    state.config = clone(entry.before.config);
    state.topics = clone(entry.before.topics);
    state.staticGk = clone(entry.before.staticGk);
    state.days = clone(entry.before.days);
    const original = state.auditLog.find((item) => item.id === entry.id);
    original.undone = true;
    appendAudit(state, makeAudit(req.session.username, "undo", `Undid: ${entry.summary}`, beforeUndo, snapshot(state), { undoOf: entry.id }));
    saveState(state);
    sendState(res, state, { ok: true });
  } catch (error) {
    res.status(400).json({ error: "bad_request", message: error.message });
  }
});

app.get("/api/admin/backups", requireAdmin, (req, res) => {
  const state = loadState();
  sendState(res, state, { backups: listBackups() });
});

app.post("/api/admin/restore", requireAdmin, (req, res) => {
  try {
    const current = loadState();
    const before = snapshot(current);
    const restored = restoreBackup(req.body.filename);
    appendAudit(restored, makeAudit(req.session.username, "restore_backup", `Restored ${req.body.filename}`, before, snapshot(restored)));
    saveState(restored);
    sendState(res, restored, { ok: true });
  } catch (error) {
    res.status(400).json({ error: "bad_request", message: error.message });
  }
});

app.post("/api/admin/reset-progress", requireAdmin, (req, res) => {
  mutateAdmin(req, res, "reset_progress", resetProgressKeepSchedule);
});

app.post("/api/admin/reset-all", requireAdmin, (req, res) => {
  try {
    const current = loadState();
    const before = snapshot(current);
    const state = resetAll();
    appendAudit(state, makeAudit(req.session.username, "reset_all", "Reset everything from the seed schedule", before, snapshot(state)));
    saveState(state);
    sendState(res, state, { ok: true });
  } catch (error) {
    res.status(400).json({ error: "bad_request", message: error.message });
  }
});

app.get("/admin.html", (req, res) => {
  const session = currentSession(req, res);
  if (!session || session.role !== "admin") return res.redirect("/");
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/learner.html", (req, res) => {
  const session = currentSession(req, res);
  if (!session || session.role !== "learner") return res.redirect("/");
  res.sendFile(path.join(__dirname, "public", "learner.html"));
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, HOST, () => {
  console.log(`Study tracker running at http://${HOST}:${PORT}`);
});
