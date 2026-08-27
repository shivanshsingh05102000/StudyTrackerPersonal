import { renderCalendar } from "../calendar.js";
import { escapeHtml, logout, request, requireRole, resourceLabel, subjectClass, verdictText } from "../api.js";
import { renderProgress } from "./progress.js";

const app = document.querySelector("#app");
const nav = document.querySelector(".nav");
document.querySelector("#logout").addEventListener("click", logout);

let saveFlash = "";

function resourceProgress(topic) {
  const keys = Object.keys(topic.resources || {});
  const done = keys.filter((key) => topic.resources[key] === "done").length;
  return keys.length ? Math.round((done / keys.length) * 100) : 0;
}

function rememberSaved(text = "Saved") {
  saveFlash = text;
}

function showSaved(target, text = "Saved") {
  target.textContent = text;
  window.setTimeout(() => {
    if (target.textContent === text) target.textContent = "";
  }, 1300);
}

function dayResourceSummary(day) {
  const topicTotals = (day.topics || []).reduce((summary, topic) => {
    const keys = Object.keys(topic.resources || {});
    summary.total += keys.length;
    summary.done += keys.filter((key) => topic.resources[key] === "done").length;
    return summary;
  }, { done: 0, total: 0 });
  if (day.staticGk) {
    topicTotals.total += 1;
    if (day.staticGk.status === "done") topicTotals.done += 1;
  }
  return topicTotals;
}

function topicCard(topic, stats) {
  const keys = Object.keys(topic.resources || {});
  const hasMcq = Object.prototype.hasOwnProperty.call(topic.resources || {}, "mcq");
  const progress = resourceProgress(topic);
  const low = typeof topic.mcqScore === "number" && topic.mcqScore < stats.config?.mcqPassThreshold;
  return `
    <article id="topic-${escapeHtml(topic.id)}" class="topic-card ${subjectClass(topic.subject)} ${topic.rushed ? "rushed" : ""} ${low ? "low-mcq" : ""}" data-topic-id="${escapeHtml(topic.id)}">
      <div class="topic-top">
        <div>
          <span class="chip">${escapeHtml(topic.subject)}</span>
          <h3 class="topic-title">${escapeHtml(topic.topic)}</h3>
        </div>
        <span class="chip">${escapeHtml(topic.status)}</span>
      </div>
      ${topic.rushed ? `<div class="amber-band">Completed under catch-up. Extra revision pass scheduled.</div>` : ""}
      <div class="resource-row">
        ${keys.map((key) => `
          <label class="check-label">
            <input type="checkbox" data-resource="${escapeHtml(key)}" ${topic.resources[key] === "done" ? "checked" : ""}>
            ${resourceLabel(key)}
          </label>
        `).join("")}
      </div>
      <div class="progress-track" aria-label="${progress}% complete"><div class="progress-fill" style="width:${progress}%"></div></div>
      ${hasMcq && topic.resources.mcq === "done" ? `
        <label class="field">
          <span>MCQ score</span>
          <input class="mcq-input" type="number" min="0" max="100" value="${topic.mcqScore ?? ""}" placeholder="0-100">
        </label>
        ${low ? `<div class="amber-band">Below threshold. This topic will be re-queued for revision.</div>` : ""}
      ` : ""}
      <details>
        <summary>Minutes and comment</summary>
        <div class="details-grid">
          <label class="field"><span>Actual minutes</span><input class="actual-input" type="number" min="0" value="${topic.actualMinutes ?? ""}"></label>
          <label class="field"><span>Study comment</span><textarea class="notes-input">${escapeHtml(topic.notes || "")}</textarea></label>
        </div>
      </details>
      <div class="saved-indicator" aria-live="polite"></div>
      <div class="error-line" role="alert"></div>
    </article>
  `;
}

function staticBlock(day) {
  const block = day.staticGk;
  if (!block) return "";
  if (block.mode === "rotation") {
    const items = [block.item, ...(block.drills || [])].filter(Boolean);
    return `
      <section class="section">
        <h2 class="section-title">Static GK rotation</h2>
        <div class="gk-grid static-gk-card">
          ${items.map((item) => `
            <label class="field" data-gk-id="${escapeHtml(item.id)}">
              <span>${escapeHtml(item.label)}</span>
              <select class="confidence-select">
                <option value="">Confidence</option>
                ${[1, 2, 3, 4, 5].map((value) => `<option value="${value}" ${item.confidence === value ? "selected" : ""}>${value}</option>`).join("")}
              </select>
            </label>
          `).join("")}
        </div>
      </section>
    `;
  }
  const title = block.mode === "new" ? "Static GK new item" : "Static GK consolidate";
  const item = block.item;
  return `
    <section class="section">
      <h2 class="section-title">${title}</h2>
      <article class="static-gk-card">
        ${item ? `
          <label class="check-label" data-gk-id="${escapeHtml(item.id)}">
            <input class="gk-done" type="checkbox" ${block.status === "done" ? "checked" : ""}>
            ${escapeHtml(item.label)}
          </label>
        ` : "<p>No Static GK item is attached.</p>"}
        ${(block.drills || []).length ? `<ul class="plain-list">${block.drills.map((drill) => `<li>${escapeHtml(drill.label)}</li>`).join("")}</ul>` : ""}
      </article>
    </section>
  `;
}

function subjectChips(subjects = []) {
  return subjects
    .map((subject) => `<span class="chip">${escapeHtml(subject.subject || subject.name)} ${escapeHtml(subject.count || 1)}</span>`)
    .join("");
}

function subjectNameChips(subjects = []) {
  return subjects
    .slice(0, 6)
    .map((subject) => `<span class="chip">${escapeHtml(subject)}</span>`)
    .join("");
}

function todayDashboard(day, stats) {
  const resources = dayResourceSummary(day);
  const weekly = stats.weekly?.current;
  return `
    <section class="today-dashboard">
      <div class="metric"><span class="metric-label">Today resources</span><span class="metric-value">${resources.done}/${resources.total}</span></div>
      <div class="metric"><span class="metric-label">Estimated minutes</span><span class="metric-value">${escapeHtml(day.estMinutes || 0)}</span></div>
      <div class="metric"><span class="metric-label">Backlog</span><span class="metric-value">${stats.pace.backlogCount}</span></div>
      <div class="metric"><span class="metric-label">Study streak</span><span class="metric-value">${stats.practical?.studyDaysInRow || 0}</span></div>
      <div class="metric"><span class="metric-label">This week done</span><span class="metric-value">${weekly?.doneResources || 0}/${weekly?.totalResources || 0}</span></div>
      <div class="metric"><span class="metric-label">Backlog cleared</span><span class="metric-value">${stats.practical?.backlogClearedThisWeek || 0}</span></div>
    </section>
  `;
}

function weeklyReview(stats) {
  const current = stats.weekly?.current;
  const previous = stats.weekly?.previous;
  const next = stats.weekly?.nextRevision;
  if (!current) return "";
  return `
    <section class="section weekly-review">
      <div class="topic-top">
        <div>
          <span class="chip">Weekly review</span>
          <h2 class="section-title">This week</h2>
        </div>
        <span class="chip">${escapeHtml(current.from)} to ${escapeHtml(current.to)}</span>
      </div>
      <div class="metrics compact-metrics">
        <div class="metric"><span class="metric-label">Completed resources</span><span class="metric-value">${current.doneResources}/${current.totalResources}</span></div>
        <div class="metric"><span class="metric-label">Completed topics</span><span class="metric-value">${current.completedTopics}</span></div>
        <div class="metric"><span class="metric-label">Missed days</span><span class="metric-value">${current.missedDays}</span></div>
        <div class="metric"><span class="metric-label">Previous week</span><span class="metric-value">${previous?.completionPercent ?? 0}%</span></div>
      </div>
      ${current.subjects?.length ? `<div class="revision-subjects">${subjectNameChips(current.subjects)}</div>` : ""}
      ${next ? `<p>Next Sunday revision: <span class="date">${escapeHtml(next.date)}</span>, <span class="minutes">${escapeHtml(next.minutes)}</span> min. ${escapeHtml(next.detail)}</p>` : "<p>No upcoming Sunday revision found in the schedule window.</p>"}
    </section>
  `;
}

function topicPreview(topics = []) {
  const shown = topics.slice(0, 8);
  const extra = topics.length - shown.length;
  return `
    <ul class="plain-list compact-list">
      ${shown.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}
      ${extra > 0 ? `<li>+ ${extra} more</li>` : ""}
    </ul>
  `;
}

function revisionWindow(windowItem, index) {
  const topics = (windowItem.subjects || []).flatMap((subject) => subject.topics || []);
  return `
    <details class="revision-window" ${index === 0 ? "open" : ""}>
      <summary>
        <span>${escapeHtml(windowItem.focus || "Revision")}</span>
        <span class="date">${escapeHtml(windowItem.from)} to ${escapeHtml(windowItem.to)}</span>
        <span class="minutes">${escapeHtml(windowItem.minutes || 0)} min</span>
      </summary>
      <div class="revision-subjects">${subjectChips(windowItem.subjects || [])}</div>
      ${topics.length ? topicPreview(topics) : ""}
    </details>
  `;
}

function specialTaskCard(task) {
  if (task.type === "recursive_revision") {
    return `
      <article class="revision-plan">
        <div class="topic-top">
          <div>
            <span class="chip">Sunday spiral</span>
            <h3 class="topic-title">Recursive revision</h3>
          </div>
          <span class="chip">${escapeHtml(task.minutes || 0)} min</span>
        </div>
        <p>${escapeHtml(task.detail)}</p>
        <div class="revision-subjects">${subjectChips(task.subjects || [])}</div>
        ${(task.windows || []).map(revisionWindow).join("")}
      </article>
    `;
  }
  return `<article class="topic-card"><strong>${escapeHtml(String(task.type || "task").replaceAll("_", " "))}</strong><p>${escapeHtml(task.detail || "")}</p></article>`;
}

function bindTopicCards() {
  app.querySelectorAll(".topic-card").forEach((card) => {
    const id = card.dataset.topicId;
    const saved = card.querySelector(".saved-indicator");
    const error = card.querySelector(".error-line");
    card.querySelectorAll("input[type='checkbox'][data-resource]").forEach((input) => {
      input.addEventListener("change", async () => {
        error.textContent = "";
        try {
          await request(`/api/topic/${id}/resource`, {
            method: "PATCH",
            body: { resource: input.dataset.resource, done: input.checked }
          });
          rememberSaved("Saved");
          await loadToday();
        } catch (err) {
          error.textContent = err.message || "Could not save. The data file may be open in another program. Try again.";
        }
      });
    });
    const mcq = card.querySelector(".mcq-input");
    if (mcq) {
      mcq.addEventListener("change", async () => {
        error.textContent = "";
        try {
          await request(`/api/topic/${id}/mcq`, { method: "PATCH", body: { score: mcq.value } });
          rememberSaved("MCQ saved");
          await loadToday();
        } catch (err) {
          error.textContent = err.message;
        }
      });
    }
    const actual = card.querySelector(".actual-input");
    const notes = card.querySelector(".notes-input");
    const saveMeta = async () => {
      error.textContent = "";
      try {
        await request(`/api/topic/${id}/meta`, {
          method: "PATCH",
          body: { actualMinutes: actual?.value ?? null, notes: notes?.value ?? "" }
        });
        showSaved(saved);
        showSaved(document.querySelector("#global-save"), "Saved");
      } catch (err) {
        error.textContent = err.message;
      }
    };
    if (actual) actual.addEventListener("change", saveMeta);
    if (notes) notes.addEventListener("blur", saveMeta);
  });

  app.querySelectorAll(".gk-done").forEach((input) => {
    input.addEventListener("change", async () => {
      const wrapper = input.closest("[data-gk-id]");
      await request(`/api/gk/${wrapper.dataset.gkId}`, { method: "PATCH", body: { status: input.checked ? "done" : "pending" } });
      rememberSaved("Static GK saved");
      await loadToday();
    });
  });
  app.querySelectorAll(".confidence-select").forEach((select) => {
    select.addEventListener("change", async () => {
      if (!select.value) return;
      const wrapper = select.closest("[data-gk-id]");
      await request(`/api/gk/${wrapper.dataset.gkId}`, { method: "PATCH", body: { confidence: Number(select.value) } });
      rememberSaved("Confidence saved");
      await loadToday();
    });
  });
}

async function loadToday() {
  const statsResponse = await request("/api/stats");
  const stats = { ...statsResponse.stats, config: statsResponse.config };
  const today = stats.today;
  const dayResponse = await request(`/api/day/${today}`);
  const day = dayResponse.day;
  const totalActual = (day.topics || []).reduce((sum, topic) => sum + (Number(topic.actualMinutes) || 0), 0);
  const topicList = day.dayType === "overflow" ? (day.overflowBacklog || []) : (day.topics || []);
  app.innerHTML = `
    <header class="screen-header">
      <div>
        <h1><span class="date">${escapeHtml(day.date)}</span></h1>
        <p>${escapeHtml(day.phase || "No phase")} ${day.holiday ? ` - ${escapeHtml(day.holiday)}` : ""}</p>
        ${dayResponse.config.examDateConfirmed ? "" : `<p class="exam-marker">Exam date ${escapeHtml(dayResponse.config.examDate)} is unconfirmed.</p>`}
      </div>
      <div class="saved-indicator" id="global-save"></div>
    </header>
    ${todayDashboard(day, stats)}
    <div class="verdict ${escapeHtml(stats.pace.verdict)}">
      <strong>${escapeHtml(verdictText(stats))}</strong>
      <span class="num"> Required ${stats.pace.requiredPerDay}/day - actual ${stats.pace.actual7Day}/day</span>
    </div>
    ${stats.pace.baselineExceeded ? `<div class="alarm-band">Required pace is more than 25% above the original baseline.</div>` : ""}
    ${day.adminNote ? `<div class="warning">${escapeHtml(day.adminNote)}</div>` : ""}
    ${day.dayType === "overflow" ? `<section class="section"><h2 class="section-title">Overflow backlog</h2><p><span class="num">${topicList.length}</span> topics - <span class="minutes">${topicList.reduce((sum, topic) => sum + (Number(topic.estMinutes) || 0), 0)}</span> min</p>${topicList.length === 0 ? "<p>Every past day is complete. No backlog is due today.</p>" : ""}</section>` : ""}
    <section class="section">
      <h2 class="section-title">${day.dayType === "overflow" ? "Backlog topics" : "Today work"}</h2>
      <div class="topic-list">
        ${topicList.map((topic) => topicCard(topic, stats)).join("")}
        ${topicList.length === 0 && day.dayType !== "overflow" && !(day.specialTasks || []).length ? `<p>${day.staticGk ? "Static GK is scheduled below." : "No topics scheduled."}</p>` : ""}
      </div>
    </section>
    ${staticBlock(day)}
    ${(day.revisionsDue || []).length ? `
      <section class="section">
        <h2 class="section-title">Revision due</h2>
        <ul class="plain-list">${day.revisionsDue.map((topic) => `<li><strong>${escapeHtml(topic.subject)}</strong>: ${escapeHtml(topic.topic)}</li>`).join("")}</ul>
      </section>
    ` : ""}
    ${(day.specialTasks || []).length ? `
      <section class="section">
        <h2 class="section-title">Revision and tests</h2>
        <div class="topic-list">${day.specialTasks.map(specialTaskCard).join("")}</div>
      </section>
    ` : ""}
    ${weeklyReview(stats)}
    <section class="section">
      <h2 class="section-title">Minutes</h2>
      <p>Estimated <span class="minutes">${escapeHtml(day.estMinutes)}</span> - actual <span class="minutes">${totalActual}</span></p>
      <button type="button" id="finish-day">Finish day</button>
    </section>
  `;
  if (saveFlash) {
    showSaved(document.querySelector("#global-save"), saveFlash);
    saveFlash = "";
  }
  document.querySelector("#finish-day")?.addEventListener("click", () => {
    document.querySelectorAll(".topic-card details").forEach((details) => { details.open = false; });
    showSaved(document.querySelector("#global-save"), "Collapsed");
  });
  bindTopicCards();
}

async function loadCalendar() {
  const data = await request("/api/range");
  app.innerHTML = `
    <header class="screen-header">
      <div>
        <h1>Calendar</h1>
        <p>Six-month schedule from <span class="date">${escapeHtml(data.config.windowStart)}</span> to <span class="date">${escapeHtml(data.config.windowEnd)}</span>.</p>
      </div>
    </header>
    <section id="calendar-mount" class="section"></section>
  `;
  renderCalendar(document.querySelector("#calendar-mount"), data.days, data.stats);
}

async function loadProgress() {
  const data = await request("/api/stats");
  renderProgress(app, data.stats);
}

const views = { today: loadToday, calendar: loadCalendar, progress: loadProgress };

nav.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  nav.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  await views[button.dataset.view]();
});

requireRole("learner")
  .then(loadToday)
  .catch(() => {});
