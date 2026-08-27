import { datesBetween, escapeHtml, request, resourceLabel } from "../api.js";

const dayTypes = ["regular", "heavy", "holiday_bonus", "break_intensive", "buffer", "overflow", "revision", "sectional", "mock"];

function sortedDays(state) {
  return Object.values(state.days).sort((a, b) => a.date.localeCompare(b.date));
}

function topicPill(topic) {
  return `
    <label class="topic-pill ${topic.rushed ? "rushed" : ""}" draggable="true" data-topic-id="${escapeHtml(topic.id)}">
      <input type="checkbox" class="select-topic" value="${escapeHtml(topic.id)}">
      <span>${escapeHtml(topic.subject)}: ${escapeHtml(topic.topic)}</span>
    </label>
  `;
}

function resourceCheckboxes(topic) {
  return Object.entries(topic.resources || {}).map(([key, status]) => `
    <label class="check-label admin-resource-check">
      <input type="checkbox" data-admin-resource="${escapeHtml(key)}" ${status === "done" ? "checked" : ""}>
      ${escapeHtml(resourceLabel(key))}
    </label>
  `).join("");
}

function topicProgressEditor(topic, day) {
  const done = Object.values(topic.resources || {}).filter((status) => status === "done").length;
  const total = Object.keys(topic.resources || {}).length;
  return `
    <article class="admin-progress-item ${topic.status === "done" ? "complete" : ""}" data-progress-topic-id="${escapeHtml(topic.id)}" data-completed-date="${escapeHtml(day.date)}">
      <div class="admin-progress-head">
        <strong>${escapeHtml(topic.subject)}</strong>
        <span class="chip">${done}/${total}</span>
      </div>
      <div class="admin-progress-title">${escapeHtml(topic.topic)}</div>
      <div class="resource-row admin-resource-row">${resourceCheckboxes(topic)}</div>
      <div class="admin-progress-actions">
        <button class="mark-topic-complete" type="button">Complete</button>
        <button class="clear-topic-progress" type="button">Clear</button>
      </div>
    </article>
  `;
}

function staticGkProgressEditor(day, state) {
  const block = day.staticGk;
  if (!block) return "";
  const labels = [block.itemId, ...(block.drillIds || [])]
    .map((id) => state.staticGk[id]?.label)
    .filter(Boolean);
  return `
    <article class="admin-progress-item static" data-progress-gk-date="${escapeHtml(day.date)}">
      <div class="admin-progress-head">
        <strong>Static GK</strong>
        <span class="chip">${block.status === "done" ? "done" : "pending"}</span>
      </div>
      <div class="admin-progress-title">${escapeHtml(labels.join(", ") || String(block.mode || "scheduled").replaceAll("_", " "))}</div>
      <label class="check-label admin-resource-check">
        <input class="admin-gk-complete" type="checkbox" ${block.status === "done" ? "checked" : ""}>
        Complete
      </label>
    </article>
  `;
}

function dayProgressEditor(day, state) {
  const topics = (day.topicIds || []).map((id) => state.topics[id]).filter(Boolean);
  const blocks = [
    ...topics.map((topic) => topicProgressEditor(topic, day)),
    staticGkProgressEditor(day, state)
  ].filter(Boolean);
  return blocks.length ? blocks.join("") : `<span class="chip">none</span>`;
}

function staticGkPill(day, state) {
  const block = day.staticGk;
  if (!block) return "";
  const labels = [block.itemId, ...(block.drillIds || [])]
    .map((id) => state.staticGk[id]?.label)
    .filter(Boolean);
  const label = labels.length ? labels.join(", ") : String(block.mode || "scheduled").replaceAll("_", " ");
  return `
    <span class="topic-pill static-gk-pill">
      <span>Static GK: ${escapeHtml(label)}</span>
    </span>
  `;
}

function specialTaskPill(task) {
  const label = task.type === "recursive_revision" ? "Sunday revision" : String(task.type || "task").replaceAll("_", " ");
  return `
    <span class="topic-pill revision-pill">
      <span>${escapeHtml(label)}: ${escapeHtml(task.detail || "")}</span>
    </span>
  `;
}

function dayTypeOptions(current) {
  return dayTypes.map((type) => `<option value="${type}" ${type === current ? "selected" : ""}>${type.replaceAll("_", " ")}</option>`).join("");
}

function rowWarning(day) {
  if (day.estMinutes > 240) return `<div class="warning"><span class="minutes">${day.estMinutes}</span> min exceeds 240.</div>`;
  return "";
}

export function renderEditor(target, data, reload) {
  const state = data.state;
  const days = sortedDays(state);
  const backlogCount = data.stats.pace.backlogCount;
  target.innerHTML = `
    <header class="screen-header">
      <div>
        <h1>Schedule editor</h1>
        <p>Move topics, shift ranges, lock days, and correct capacity.</p>
      </div>
    </header>
    <section class="section">
      <div class="toolbar">
        <label class="field"><span>Move selected to</span><input id="move-to" type="date" min="${escapeHtml(state.config.windowStart)}" max="${escapeHtml(state.config.windowEnd)}"></label>
        <button id="move-selected" type="button">Move selected</button>
        <label class="field"><span>Shift from</span><input id="shift-from" type="date" value="${escapeHtml(state.config.windowStart)}"></label>
        <label class="field"><span>Days</span><input id="shift-days" type="number" value="1"></label>
        <button id="preview-shift" type="button">Preview shift</button>
        <button id="commit-shift" type="button">Commit shift</button>
        <label class="field"><span>Push backlog to</span><input id="backlog-to" type="date" min="${escapeHtml(state.config.windowStart)}" max="${escapeHtml(state.config.windowEnd)}"></label>
        <button id="push-backlog" type="button">Push ${backlogCount} backlog</button>
      </div>
      <div id="editor-message" class="saved-indicator" aria-live="polite"></div>
      <div id="shift-preview" class="warning hidden"></div>
    </section>
    <section class="section table-wrap">
      <table class="schedule-editor-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Topics</th>
            <th>Completion</th>
            <th>Lock</th>
            <th>Admin note</th>
          </tr>
        </thead>
        <tbody>
          ${days.map((day) => `
            <tr data-date="${escapeHtml(day.date)}">
              <td><span class="date">${escapeHtml(day.date)}</span><br>${escapeHtml(day.weekday)}${day.holiday ? `<br>${escapeHtml(day.holiday)}` : ""}${rowWarning(day)}</td>
              <td><select class="day-type">${dayTypeOptions(day.dayType)}</select></td>
              <td><input class="capacity" type="number" min="0" value="${escapeHtml(day.capacity)}"></td>
              <td class="drop-zone">
                ${(day.topicIds || []).map((id) => state.topics[id]).filter(Boolean).map(topicPill).join("")}
                ${staticGkPill(day, state)}
                ${(day.specialTasks || []).map(specialTaskPill).join("")}
                ${(day.topicIds || []).length === 0 && !day.staticGk && !(day.specialTasks || []).length ? `<span class="chip">empty</span>` : ""}
              </td>
              <td class="completion-column">${dayProgressEditor(day, state)}</td>
              <td><label class="check-label"><input class="locked" type="checkbox" ${day.locked ? "checked" : ""}> Locked</label></td>
              <td><textarea class="admin-note">${escapeHtml(day.adminNote || "")}</textarea></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;

  const message = target.querySelector("#editor-message");
  const preview = target.querySelector("#shift-preview");
  let draggedTopic = null;

  target.querySelectorAll(".topic-pill").forEach((pill) => {
    pill.addEventListener("dragstart", (event) => {
      draggedTopic = pill.dataset.topicId;
      event.dataTransfer.setData("text/plain", draggedTopic);
    });
  });

  target.querySelectorAll("tr[data-date]").forEach((row) => {
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      row.classList.add("drop-target");
    });
    row.addEventListener("dragleave", () => row.classList.remove("drop-target"));
    row.addEventListener("drop", async (event) => {
      event.preventDefault();
      row.classList.remove("drop-target");
      const topicId = event.dataTransfer.getData("text/plain") || draggedTopic;
      if (!topicId) return;
      await request("/api/admin/move-topics", { method: "POST", body: { topicIds: [topicId], toDate: row.dataset.date } });
      await reload();
    });
  });

  target.querySelector("#move-selected").addEventListener("click", async () => {
    const topicIds = [...target.querySelectorAll(".select-topic:checked")].map((input) => input.value);
    const toDate = target.querySelector("#move-to").value;
    if (!topicIds.length || !toDate) {
      message.textContent = "Select topics and a destination date.";
      return;
    }
    await request("/api/admin/move-topics", { method: "POST", body: { topicIds, toDate } });
    await reload();
  });

  target.querySelector("#preview-shift").addEventListener("click", () => {
    const from = target.querySelector("#shift-from").value;
    const daysOffset = Number(target.querySelector("#shift-days").value);
    const affected = Object.values(state.topics).filter((topic) => topic.scheduledDate >= from && !state.days[topic.scheduledDate]?.locked);
    preview.classList.remove("hidden");
    preview.innerHTML = `Would shift <span class="num">${affected.length}</span> unlocked topics by <span class="num">${daysOffset}</span> day${Math.abs(daysOffset) === 1 ? "" : "s"}. First moves: ${affected.slice(0, 6).map((topic) => `${escapeHtml(topic.topic)} ${escapeHtml(topic.scheduledDate)}`).join(", ") || "none"}.`;
  });

  target.querySelector("#commit-shift").addEventListener("click", async () => {
    await request("/api/admin/shift-range", {
      method: "POST",
      body: { fromDate: target.querySelector("#shift-from").value, days: Number(target.querySelector("#shift-days").value) }
    });
    await reload();
  });

  target.querySelector("#push-backlog").addEventListener("click", async () => {
    const toDate = target.querySelector("#backlog-to").value;
    if (!toDate) {
      message.textContent = "Choose a destination date.";
      return;
    }
    await request("/api/admin/push-backlog", { method: "POST", body: { toDate } });
    await reload();
  });

  target.querySelectorAll("tr[data-date]").forEach((row) => {
    const patchDay = async (patch) => {
      await request(`/api/admin/day/${row.dataset.date}`, { method: "PATCH", body: patch });
      message.textContent = `Saved ${row.dataset.date}`;
    };
    row.querySelector(".day-type").addEventListener("change", (event) => patchDay({ dayType: event.target.value }).then(reload));
    row.querySelector(".capacity").addEventListener("change", (event) => patchDay({ capacity: Number(event.target.value) }).then(reload));
    row.querySelector(".locked").addEventListener("change", (event) => patchDay({ locked: event.target.checked }));
    row.querySelector(".admin-note").addEventListener("blur", (event) => patchDay({ adminNote: event.target.value }));
  });

  target.querySelectorAll("[data-progress-topic-id]").forEach((item) => {
    const topicId = item.dataset.progressTopicId;
    const completedDate = item.dataset.completedDate;
    const saveProgress = async (body) => {
      await request(`/api/admin/topic/${topicId}/progress`, {
        method: "PATCH",
        body: { completedDate, ...body }
      });
      message.textContent = `Saved progress for ${completedDate}`;
      await reload();
    };
    item.querySelectorAll("[data-admin-resource]").forEach((input) => {
      input.addEventListener("change", () => {
        saveProgress({ resources: { [input.dataset.adminResource]: input.checked ? "done" : "pending" } });
      });
    });
    item.querySelector(".mark-topic-complete")?.addEventListener("click", () => saveProgress({ complete: true }));
    item.querySelector(".clear-topic-progress")?.addEventListener("click", () => saveProgress({ clear: true }));
  });

  target.querySelectorAll("[data-progress-gk-date]").forEach((item) => {
    const date = item.dataset.progressGkDate;
    item.querySelector(".admin-gk-complete")?.addEventListener("change", async (event) => {
      await request(`/api/admin/day/${date}/static-gk`, {
        method: "PATCH",
        body: { status: event.target.checked ? "done" : "pending" }
      });
      message.textContent = `Saved Static GK for ${date}`;
      await reload();
    });
  });

  target.dataset.breakDates = datesBetween(state.config.windowStart, state.config.windowEnd).length;
}
