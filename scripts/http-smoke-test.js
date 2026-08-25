const { spawn } = require("child_process");

const PORT = Number(process.env.SMOKE_PORT || 3107);
const BASE_URL = `http://127.0.0.1:${PORT}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function startServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["server.js"], {
      env: { ...process.env, PORT: String(PORT) },
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

    const learnerJar = new Map();
    const learnerLogin = await request("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: { username: "learner", password: "CHANGE_ME_LEARNER" }
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

    const range = await request("/api/range", {}, learnerJar);
    assert(range.response.status === 200, "Range API failed.");
    assert(range.json.days.length >= 100, "Range API returned too few days.");
    const sunday = range.json.days.find((day) => day.date === "2026-09-06");
    assert(sunday?.specialTasks?.[0]?.type === "recursive_revision", "Sunday revision is missing from range API.");
    assert(workCount(sunday) === 1, "Sunday revision should show one planned item.");

    const gkDay = await request("/api/day/2026-11-02", {}, learnerJar);
    assert(gkDay.response.status === 200, "Static GK day API failed.");
    assert(gkDay.json.day.staticGk?.item?.label, "Static GK item label is missing.");

    const refresh = await request("/api/refresh", { method: "POST" }, learnerJar);
    assert(refresh.response.status === 200, "Refresh token flow failed.");

    const adminJar = new Map();
    const adminLogin = await request("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: { username: "admin", password: "CHANGE_ME_ADMIN" }
    }, adminJar);
    assert(adminLogin.response.status === 200 && adminLogin.json.role === "admin", "Admin login failed.");

    const adminState = await request("/api/state", {}, adminJar);
    assert(adminState.response.status === 200, "Admin state API failed.");
    assert(Object.keys(adminState.json.state.topics).length === 90, "Admin state topic count is wrong.");

    for (const asset of ["/css/app.css", "/css/tokens.css", "/js/theme.js", "/js/calendar.js", "/js/learner/today.js", "/js/admin/dashboard.js"]) {
      const result = await request(asset);
      assert(result.response.status === 200, `${asset} did not load.`);
      assert(result.text.length > 100, `${asset} looks unexpectedly short.`);
    }

    console.log(JSON.stringify({
      home: "ok",
      auth: "ok",
      refresh: "ok",
      learnerApis: "ok",
      adminApis: "ok",
      sundayRevision: "ok",
      staticGk: "ok",
      assets: "ok"
    }, null, 2));
  } finally {
    child.kill();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
