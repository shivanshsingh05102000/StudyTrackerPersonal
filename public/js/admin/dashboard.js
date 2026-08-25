import { renderCalendar } from "../calendar.js";
import { escapeHtml, formatPercent, logout, request, requireRole, verdictText } from "../api.js";
import { renderEditor } from "./editor.js";
import { renderHolidays } from "./holidays.js";
import { renderRebalance, renderStaticGk } from "./rebalance.js";

const app = document.querySelector("#app");
const nav = document.querySelector(".nav");
document.querySelector("#logout").addEventListener("click", logout);

let currentView = "dashboard";

async function loadState() {
  return request("/api/state");
}

function renderDashboard(target, data) {
  const stats = data.stats;
  const state = data.state;
  const remainingItems = Object.values(state.topics).filter((topic) => topic.status !== "done").length
    + Object.values(state.staticGk || {}).filter((item) => item.status !== "done").length;
  target.innerHTML = `
    <header class="screen-header">
      <div>
        <h1>Dashboard</h1>
        <p>${escapeHtml(state.config.learnerName)} - exam <span class="date">${escapeHtml(state.config.examDate)}</span>${state.config.examDateConfirmed ? "" : " - unconfirmed"}</p>
      </div>
    </header>
    <div class="verdict ${escapeHtml(stats.pace.verdict)}">
      <strong>${escapeHtml(verdictText(stats))}</strong>
      <span class="num"> Required ${stats.pace.requiredPerDay}/day - actual ${stats.pace.actual7Day}/day</span>
    </div>
    <section class="metrics">
      <div class="metric"><span class="metric-label">Days remaining</span><span class="metric-value">${stats.pace.remainingDays}</span></div>
      <div class="metric"><span class="metric-label">Items remaining</span><span class="metric-value">${remainingItems}</span></div>
      <div class="metric"><span class="metric-label">Backlog</span><span class="metric-value">${stats.pace.backlogCount}</span></div>
      <div class="metric"><span class="metric-label">Backlog minutes</span><span class="metric-value">${stats.pace.backlogMinutes}</span></div>
      <div class="metric"><span class="metric-label">Overall</span><span class="metric-value">${formatPercent(stats.completion.percent)}</span></div>
      <div class="metric"><span class="metric-label">Study streak</span><span class="metric-value">${stats.practical?.studyDaysInRow || 0}</span></div>
      <div class="metric"><span class="metric-label">Week resources</span><span class="metric-value">${stats.practical?.resourcesDoneThisWeek || 0}</span></div>
      <div class="metric"><span class="metric-label">Backlog cleared</span><span class="metric-value">${stats.practical?.backlogClearedThisWeek || 0}</span></div>
    </section>
    ${stats.pace.requiredPerDay > stats.pace.actual7Day ? `<div class="alarm-band">Required pace exceeds the 7-day average. This is the headline risk.</div>` : ""}
    <section class="section">
      <h2 class="section-title">Risks</h2>
      <ul class="risk-list">
        ${stats.risks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join("")}
        ${stats.risks.length === 0 ? "<li>No computed risk flags.</li>" : ""}
      </ul>
    </section>
    <section class="section">
      <h2 class="section-title">Weakness</h2>
      <ul class="plain-list">
        ${stats.weakness.ranked.map((item) => `<li><strong>${escapeHtml(item.subject)}</strong> - weakness <span class="num">${item.weakness}</span> - average <span class="num">${item.avgScore}%</span></li>`).join("")}
        ${stats.weakness.notEnoughData.map((item) => `<li>${escapeHtml(item.subject)}: not enough data (<span class="num">${item.scored}</span> scored).</li>`).join("")}
      </ul>
    </section>
    <section class="section">
      <h2 class="section-title">Recent activity</h2>
      <ul class="activity-list">
        ${stats.activity.map((item) => `<li><time>${escapeHtml(String(item.at).slice(0, 19).replace("T", " "))}</time> - ${escapeHtml(item.summary)}</li>`).join("")}
        ${stats.activity.length === 0 ? "<li>No activity yet.</li>" : ""}
      </ul>
    </section>
  `;
}

async function renderCalendarView(target, data) {
  const range = await request("/api/range");
  target.innerHTML = `
    <header class="screen-header">
      <div>
        <h1>Calendar</h1>
        <p>All days in the schedule window.</p>
      </div>
    </header>
    <section id="calendar-mount" class="section"></section>
  `;
  renderCalendar(target.querySelector("#calendar-mount"), range.days, range.stats);
}

function renderDataTools(target, data, reload) {
  const state = data.state;
  const audit = [...(state.auditLog || [])].sort((a, b) => String(b.at).localeCompare(String(a.at)));
  const credentials = state.config.credentials || { adminPassword: "admin123", learnerPassword: "learner123" };
  target.innerHTML = `
    <header class="screen-header">
      <div>
        <h1>Data tools</h1>
        <p>Download, restore, undo, reset data, or update demo login passwords.</p>
      </div>
    </header>
    <section class="section">
      <div class="toolbar">
        <button id="download-state" type="button">Download state.json</button>
        <a class="button-link" href="/api/export/progress.csv">Export progress CSV</a>
        <a class="button-link" href="/api/export/progress.json">Export progress JSON</a>
        <button id="load-backups" type="button">List backups</button>
        <button id="reset-progress" type="button">Reset progress</button>
        <button id="reset-all" type="button">Reset everything</button>
      </div>
      <div id="data-message" class="saved-indicator" aria-live="polite"></div>
      <div id="backup-list"></div>
    </section>
    <section class="section">
      <h2 class="section-title">Login passwords</h2>
      <form id="credentials-form" class="form-grid">
        <label class="field">
          <span>Learner password</span>
          <input name="learnerPassword" type="text" value="${escapeHtml(credentials.learnerPassword)}" autocomplete="off">
        </label>
        <label class="field">
          <span>Admin password</span>
          <input name="adminPassword" type="text" value="${escapeHtml(credentials.adminPassword)}" autocomplete="off">
        </label>
        <div class="field command-field">
          <span>&nbsp;</span>
          <button type="submit">Save passwords</button>
        </div>
      </form>
    </section>
    <section class="section">
      <h2 class="section-title">Audit log</h2>
      <div class="audit-list">
        ${audit.map((entry) => `
          <article class="audit-entry">
            <p><time>${escapeHtml(String(entry.at).slice(0, 19).replace("T", " "))}</time> - ${escapeHtml(entry.action)} - ${escapeHtml(entry.summary)}</p>
            <button data-undo="${escapeHtml(entry.id)}" type="button" ${entry.undone ? "disabled" : ""}>Undo</button>
          </article>
        `).join("")}
        ${audit.length === 0 ? "<p>No admin edits yet.</p>" : ""}
      </div>
    </section>
  `;

  const message = target.querySelector("#data-message");
  target.querySelector("#credentials-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    await request("/api/admin/credentials", { method: "PATCH", body });
    message.textContent = "Passwords saved. Login page demo buttons now use the new values.";
  });

  target.querySelector("#download-state").addEventListener("click", () => {
    const blob = new Blob([`${JSON.stringify(state, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "state.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  target.querySelector("#load-backups").addEventListener("click", async () => {
    const result = await request("/api/admin/backups");
    target.querySelector("#backup-list").innerHTML = `
      <ul class="plain-list">
        ${result.backups.map((backup) => `<li>${escapeHtml(backup.filename)} - <span class="num">${backup.bytes}</span> bytes <button data-restore="${escapeHtml(backup.filename)}" type="button">Restore</button></li>`).join("")}
        ${result.backups.length === 0 ? "<li>No backups yet.</li>" : ""}
      </ul>
    `;
    target.querySelectorAll("[data-restore]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!confirm(`Restore ${button.dataset.restore}?`)) return;
        await request("/api/admin/restore", { method: "POST", body: { filename: button.dataset.restore } });
        await reload();
      });
    });
  });

  target.querySelector("#reset-progress").addEventListener("click", async () => {
    if (!confirm("Reset learner progress but keep the schedule?")) return;
    await request("/api/admin/reset-progress", { method: "POST" });
    await reload();
  });

  target.querySelector("#reset-all").addEventListener("click", async () => {
    if (!confirm("Reset everything from the seed schedule?")) return;
    await request("/api/admin/reset-all", { method: "POST" });
    await reload();
  });

  target.querySelectorAll("[data-undo]").forEach((button) => {
    button.addEventListener("click", async () => {
      await request(`/api/admin/undo/${button.dataset.undo}`, { method: "POST" });
      message.textContent = "Undo applied.";
      await reload();
    });
  });
}

async function renderCurrent() {
  const data = await loadState();
  if (currentView === "dashboard") renderDashboard(app, data);
  if (currentView === "editor") renderEditor(app, data, renderCurrent);
  if (currentView === "holidays") renderHolidays(app, data, renderCurrent);
  if (currentView === "rebalance") renderRebalance(app, data, renderCurrent);
  if (currentView === "static") renderStaticGk(app, data, renderCurrent);
  if (currentView === "data") renderDataTools(app, data, renderCurrent);
  if (currentView === "calendar") await renderCalendarView(app, data);
}

nav.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  currentView = button.dataset.view;
  nav.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  await renderCurrent();
});

requireRole("admin")
  .then(renderCurrent)
  .catch(() => {});
