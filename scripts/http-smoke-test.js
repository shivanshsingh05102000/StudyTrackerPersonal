const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PORT = Number(process.env.SMOKE_PORT || 3107);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "study-tracker-smoke-"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function startServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["server.js"], {
      env: { ...process.env, PORT: String(PORT), STUDY_TRACKER_DATA_DIR: DATA_DIR },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let output = "";
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Server did not start. Output: ${output}`));
    }, 8000);
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
      if (output.includes(BASE_URL)) {
        clearTimeout(timeout);
        resolve(child);
      }
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.on("exit", (code) => {
      if (!output.includes(BASE_URL)) {
        clearTimeout(timeout);
        reject(new Error(`Server exited before startup with code ${code}. Output: ${output}`));
      }
    });
  });
}

function addCookies(jar, response) {
  const raw = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
  for (const header of raw) {
    const [pair] = header.split(";");
    const index = pair.indexOf("=");
    if (index > 0) jar.set(pair.slice(0, index), pair.slice(index + 1));
  }
}

function cookieHeader(jar) {
  return [...jar.entries()].map(([key, value]) => `${key}=${value}`).join("; ");
}

async function request(path, options = {}, jar = new Map()) {
  const headers = { ...(options.headers || {}) };
  if (jar.size) headers.cookie = cookieHeader(jar);
  const response = await fetch(`${BASE_URL}${path}`, {
    redirect: options.redirect || "manual",
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });
  addCookies(jar, response);
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_error) {
    json = null;
  }
  return { response, text, json };
}

function workCount(day) {
  return (day.topics || []).length + (day.staticGk ? 1 : 0) + (day.specialTasks || []).length;
}

async function run() {
  const child = await startServer();
  try {
    const publicHome = await request("/");
    assert(publicHome.response.status === 200, "Home page did not load.");
    assert(publicHome.text.includes("Study tracker"), "Home page content is unexpected.");

    const blockedLearner = await request("/learner.html");
    assert(blockedLearner.response.status === 302, "Learner page should redirect without auth.");

    const invalidLogin = await request("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: { username: "learner", password: "wrong" }
    });
    assert(invalidLogin.response.status === 401, "Invalid login should fail.");

    const loginOptions = await request("/api/login-options");
    assert(loginOptions.response.status === 200, "Login options API failed.");
    assert(loginOptions.json.accounts.some((account) => account.username === "learner" && account.password === "learner123"), "Learner demo credentials are missing.");

    const learnerJar = new Map();
    const learnerLogin = await request("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: { username: "learner", password: "learner123" }
    }, learnerJar);
    assert(learnerLogin.response.status === 200, "Learner login failed.");
    assert(learnerLogin.json.role === "learner", "Learner role is wrong.");
    assert(learnerJar.has("study_access") && learnerJar.has("study_refresh"), "Learner auth cookies were not set.");

    const learnerSession = await request("/api/session", {}, learnerJar);
    assert(learnerSession.response.status === 200 && learnerSession.json.role === "learner", "Learner session failed.");

    const learnerState = await request("/api/state", {}, learnerJar);
    assert(learnerState.response.status === 403, "Learner should not access admin state.");

    const stats = await request("/api/stats", {}, learnerJar);
    assert(stats.response.status === 200, "Stats API failed.");
    assert(stats.json.stats.staticGk.total === 24, "Stats API Static GK total is wrong.");
    assert(stats.json.stats.weekly.current, "Weekly stats are missing.");

    const range = await request("/api/range", {}, learnerJar);
    assert(range.response.status === 200, "Range API failed.");
    assert(range.json.days.length >= 100, "Range API returned too few days.");
    const sunday = range.json.days.find((day) => day.date === "2026-09-06");
    assert(sunday?.specialTasks?.[0]?.type === "recursive_revision", "Sunday revision is missing from range API.");
    assert(workCount(sunday) === 1, "Sunday revision should show one planned item.");

    const gkDay = await request("/api/day/2026-11-02", {}, learnerJar);
    assert(gkDay.response.status === 200, "Static GK day API failed.");
    assert(gkDay.json.day.staticGk?.item?.label, "Static GK item label is missing.");

    const firstStudyDay = range.json.days.find((day) => day.topics?.length);
    const firstTopic = firstStudyDay.topics[0];
    const firstResource = Object.keys(firstTopic.resources)[0];
    const resourceSave = await request(`/api/topic/${firstTopic.id}/resource`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: { resource: firstResource, done: true }
    }, learnerJar);
    assert(resourceSave.response.status === 200, "Learner resource save failed.");
    const savedDay = await request(`/api/day/${firstTopic.scheduledDate}`, {}, learnerJar);
    const savedTopic = savedDay.json.day.topics.find((topic) => topic.id === firstTopic.id);
    assert(savedTopic.resources[firstResource] === "done", "Learner resource update did not persist across requests.");

    const refresh = await request("/api/refresh", { method: "POST" }, learnerJar);
    assert(refresh.response.status === 200, "Refresh token flow failed.");

    const adminJar = new Map();
    const adminLogin = await request("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: { username: "admin", password: "admin123" }
    }, adminJar);
    assert(adminLogin.response.status === 200 && adminLogin.json.role === "admin", "Admin login failed.");

    const adminState = await request("/api/state", {}, adminJar);
    assert(adminState.response.status === 200, "Admin state API failed.");
    assert(Object.keys(adminState.json.state.topics).length === 90, "Admin state topic count is wrong.");
    const adminTopic = Object.values(adminState.json.state.topics)[0];
    assert(Object.prototype.hasOwnProperty.call(adminTopic.resources, "notes"), "Notes resource is missing from topics.");
    const adminProgress = await request(`/api/admin/topic/${adminTopic.id}/progress`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: { complete: true, completedDate: adminTopic.scheduledDate }
    }, adminJar);
    assert(adminProgress.response.status === 200, "Admin topic progress update failed.");
    assert(adminProgress.json.topic.status === "done", "Admin complete did not mark topic done.");
    assert(adminProgress.json.topic.resources.notes === "done", "Admin complete did not mark Notes done.");
    assert(String(adminProgress.json.topic.completedAt).startsWith(adminTopic.scheduledDate), "Admin complete did not use the selected completion date.");
    const adminGkProgress = await request("/api/admin/day/2026-11-02/static-gk", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: { status: "done" }
    }, adminJar);
    assert(adminGkProgress.response.status === 200, "Admin Static GK progress update failed.");
    assert(adminGkProgress.json.day.staticGk.status === "done", "Admin Static GK did not save done status.");

    const csvExport = await request("/api/export/progress.csv", {}, adminJar);
    assert(csvExport.response.status === 200 && csvExport.text.includes("type,id,subject,title"), "Progress CSV export failed.");
    const jsonExport = await request("/api/export/progress.json", {}, adminJar);
    assert(jsonExport.response.status === 200 && jsonExport.json.topics.length === 90, "Progress JSON export failed.");

    const credentialUpdate = await request("/api/admin/credentials", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: { learnerPassword: "learn456", adminPassword: "admin456" }
    }, adminJar);
    assert(credentialUpdate.response.status === 200, "Credential update failed.");
    const changedLogin = await request("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: { username: "learner", password: "learn456" }
    }, new Map());
    assert(changedLogin.response.status === 200, "Updated learner password did not work.");

    for (const asset of ["/favicon.svg", "/css/app.css", "/css/tokens.css", "/js/theme.js", "/js/calendar.js", "/js/learner/today.js", "/js/admin/dashboard.js"]) {
      const result = await request(asset);
      assert(result.response.status === 200, `${asset} did not load.`);
      assert(result.text.length > 100, `${asset} looks unexpectedly short.`);
    }

    console.log(JSON.stringify({
      home: "ok",
      auth: "ok",
      refresh: "ok",
      learnerApis: "ok",
      persistence: "ok",
      adminApis: "ok",
      exports: "ok",
      credentials: "ok",
      sundayRevision: "ok",
      staticGk: "ok",
      assets: "ok"
    }, null, 2));
  } finally {
    child.kill();
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
