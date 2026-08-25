let knownUpdatedAt = sessionStorage.getItem("study-state-updated-at") || "";

export async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const init = {
    method: options.method || "GET",
    credentials: "same-origin",
    headers
  };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body);
  }
  if (knownUpdatedAt && init.method !== "GET" && path !== "/api/login") {
    headers["X-State-Updated-At"] = knownUpdatedAt;
  }
  const response = await fetch(path, init);
  let data = {};
  try {
    data = await response.json();
  } catch (_error) {
    data = {};
  }
  if (data.updatedAt || data.stats?.updatedAt) {
    knownUpdatedAt = data.updatedAt || data.stats.updatedAt;
    sessionStorage.setItem("study-state-updated-at", knownUpdatedAt);
  }
  if (response.status === 401 && !options.skipAuthRedirect && !options.noRefresh && path !== "/api/refresh" && path !== "/api/login") {
    try {
      await request("/api/refresh", { method: "POST", skipAuthRedirect: true, noRefresh: true });
      return request(path, { ...options, noRefresh: true });
    } catch (_error) {
      location.href = "/";
      throw new Error("Log in to continue.");
    }
  }
  if (response.status === 401 && !options.skipAuthRedirect) {
    location.href = "/";
    throw new Error("Log in to continue.");
  }
  if (response.status === 409) {
    alert(data.message || "The data changed in another tab. Reloading.");
    location.reload();
    throw new Error(data.message || "State changed.");
  }
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

export async function requireRole(role) {
  const session = await request("/api/session");
  if (session.role !== role) {
    location.href = session.role === "admin" ? "/admin.html" : "/learner.html";
    throw new Error("Wrong role.");
  }
  return session;
}

export async function logout() {
  await request("/api/logout", { method: "POST" });
  sessionStorage.removeItem("study-state-updated-at");
  location.href = "/";
}

export function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function subjectClass(subject) {
  return `subject-${String(subject || "").toLowerCase().replaceAll("/", " ").replaceAll(/\s+/g, "-")}`;
}

export function resourceLabel(key) {
  const labels = { video: "Video", pdf: "PDF", mcq: "MCQ" };
  return labels[key] || key;
}

export function verdictText(stats) {
  const backlog = stats.pace.backlogCount;
  if (stats.pace.verdict === "on_track") return "On track";
  if (stats.pace.verdict === "slipping") return backlog === 0 ? "Pace slipping" : `${backlog} topic${backlog === 1 ? "" : "s"} behind`;
  if (stats.pace.verdict === "behind") return `${backlog} behind`;
  return `${backlog} behind. Rebalance needed.`;
}

export function datesBetween(from, to) {
  const dates = [];
  const current = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}
