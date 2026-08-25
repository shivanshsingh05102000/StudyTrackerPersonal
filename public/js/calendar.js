import { escapeHtml } from "./api.js";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

function subjectSlug(subject) {
  return String(subject || "unassigned").toLowerCase().replaceAll("/", " ").trim().replace(/\s+/g, "-");
}

function monthKey(date) {
  return date.slice(0, 7);
}

function monthName(key) {
  const date = new Date(`${key}-01T00:00:00Z`);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function mondayOffset(key) {
  const date = new Date(`${key}-01T00:00:00Z`);
  const day = date.getUTCDay();
  return day === 0 ? 6 : day - 1;
}

function daysInMonth(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function monthDate(key, dayNumber) {
  return `${key}-${String(dayNumber).padStart(2, "0")}`;
}

function subjectCounts(day) {
  const counts = new Map();
  (day.topics || []).forEach((topic) => {
    counts.set(topic.subject, (counts.get(topic.subject) || 0) + 1);
  });
  if (day.staticGk) counts.set("Static GK", (counts.get("Static GK") || 0) + 1);
  (day.specialTasks || []).forEach((task) => {
    const subjects = Array.isArray(task.windows)
      ? task.windows.flatMap((windowItem) => windowItem.subjects || [])
      : task.subjects || [];
    subjects.forEach((subject) => {
      const name = subject.subject || subject.name;
      if (!name) return;
      counts.set(name, (counts.get(name) || 0) + Number(subject.count || 1));
    });
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function primarySubject(day) {
  return subjectCounts(day)[0]?.[0] || null;
}

function subjectSummary(day) {
  const counts = subjectCounts(day);
  if (!counts.length) return "No subject";
  return counts.map(([subject, count]) => `${subject}${count > 1 ? ` ${count}` : ""}`).join(", ");
}

function subjectMarkers(day) {
  return subjectCounts(day)
    .slice(0, 4)
    .map(([subject]) => `<span class="subject-mark subject-mark-${escapeHtml(subjectSlug(subject))}" title="${escapeHtml(subject)}"></span>`)
    .join("");
}

function staticItems(day) {
  const block = day.staticGk;
  if (!block) return [];
  return [block.item, ...(block.drills || [])].filter(Boolean);
}

function workCount(day) {
  return (day.topics || []).length + (day.staticGk ? 1 : 0) + (day.specialTasks || []).length;
}

function staticGkPanel(day) {
  const block = day.staticGk;
  if (!block) return "";
  const items = staticItems(day);
  const mode = String(block.mode || "scheduled").replaceAll("_", " ");
  return `
    <div class="static-gk-panel">
      <strong>Static GK</strong>
      <span class="chip">${escapeHtml(mode)}</span>
      ${items.length ? `
        <ul class="plain-list">
          ${items.map((item) => `<li>${escapeHtml(item.label || item.id || "Static GK item")}</li>`).join("")}
        </ul>
      ` : "<p>No Static GK item is attached.</p>"}
    </div>
  `;
}

function subjectChips(subjects = []) {
  return subjects
    .map((subject) => `<span class="chip">${escapeHtml(subject.subject || subject.name)} ${escapeHtml(subject.count || 1)}</span>`)
    .join("");
}

function topicPreview(topics = []) {
  const shown = topics.slice(0, 6);
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

function specialTaskItem(task) {
  if (task.type === "recursive_revision") {
    return `
      <li class="revision-plan">
        <strong>Recursive Sunday revision</strong>
        <p>${escapeHtml(task.detail)}</p>
        <div class="revision-subjects">${subjectChips(task.subjects || [])}</div>
        ${(task.windows || []).map(revisionWindow).join("")}
      </li>
    `;
  }
  return `<li><strong>${escapeHtml(String(task.type || "task").replaceAll("_", " "))}</strong>: ${escapeHtml(task.detail || "")}</li>`;
}

function dayClass(day, mode) {
  const subject = primarySubject(day);
  const subjectClass = subject ? `subject-fill-${subjectSlug(subject)} ${subjectCounts(day).length > 1 ? "subject-mixed" : ""}` : "subject-fill-none";
  return `day-cell ${mode === "subject" ? subjectClass : `day-${day.dayType}`} state-${day.calendarStatus || "pending"} ${day.isToday ? "is-today" : ""}`;
}

function renderPanel(panel, day) {
  const topics = day.topics || [];
  const special = day.specialTasks || [];
  panel.innerHTML = `
    <h2 class="section-title"><span class="date">${escapeHtml(day.date)}</span></h2>
    <p>${escapeHtml(day.dayType.replaceAll("_", " "))}${day.holiday ? ` - ${escapeHtml(day.holiday)}` : ""}</p>
    <p><span class="num">${workCount(day)}</span> item${workCount(day) === 1 ? "" : "s"} - ${escapeHtml(subjectSummary(day))} - <span class="minutes">${escapeHtml(day.estMinutes)}</span> min</p>
    ${staticGkPanel(day)}
    ${day.adminNote ? `<div class="warning">${escapeHtml(day.adminNote)}</div>` : ""}
    <ul class="plain-list">
      ${topics.map((topic) => `
        <li class="panel-topic">
          <span class="panel-topic-main"><strong>${escapeHtml(topic.subject)}</strong>: ${escapeHtml(topic.topic)}</span>
          <span class="chip">${escapeHtml(topic.status)}</span>
        </li>
      `).join("")}
      ${special.map(specialTaskItem).join("")}
      ${topics.length === 0 && special.length === 0 && !day.staticGk ? "<li>No scheduled items.</li>" : ""}
    </ul>
  `;
}

function renderScheduledCell(day, colorMode) {
  const label = colorMode === "subject" ? subjectSummary(day) : day.dayType;
  const dayNumber = Number(day.date.slice(-2));
  const count = workCount(day);
  return `
    <button class="${dayClass(day, colorMode)}" data-date="${escapeHtml(day.date)}" title="${escapeHtml(day.date)} - ${escapeHtml(label)} - ${count} items" aria-label="${escapeHtml(day.date)}, ${escapeHtml(label)}, ${count} items">
      <span class="date">${dayNumber}</span>
      ${colorMode === "subject" ? `<span class="subject-marks" aria-hidden="true">${subjectMarkers(day)}</span>` : ""}
      <span class="count">${count}</span>
    </button>
  `;
}

function blankCell() {
  return `<button class="day-cell blank" tabindex="-1" aria-hidden="true"></button>`;
}

export function renderCalendar(container, days, stats) {
  const byMonth = new Map();
  const today = stats.today;
  let colorMode = "intensity";
  days.forEach((day) => {
    const key = monthKey(day.date);
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push({
      ...day,
      calendarStatus: stats.calendar?.[day.date]?.status || "pending",
      isToday: day.date === today
    });
  });

  container.innerHTML = `
    <div class="calendar-controls" aria-label="Calendar color mode">
      <span>Color by</span>
      <div class="segmented" role="group" aria-label="Calendar color mode">
        <button type="button" class="active" data-calendar-mode="intensity" aria-pressed="true">Intensity</button>
        <button type="button" data-calendar-mode="subject" aria-pressed="false">Subject</button>
      </div>
    </div>
    <div class="legend" aria-label="Calendar legend">
      <span class="day-regular" data-legend-mode="intensity">Regular</span>
      <span class="day-heavy" data-legend-mode="intensity">Heavy</span>
      <span class="day-holiday_bonus" data-legend-mode="intensity">Holiday bonus</span>
      <span class="day-revision" data-legend-mode="intensity">Revision</span>
      <span class="day-sectional" data-legend-mode="intensity">Sectional</span>
      <span class="day-mock" data-legend-mode="intensity">Mock</span>
      <span class="subject-fill-polity hidden" data-legend-mode="subject">Polity</span>
      <span class="subject-fill-economy hidden" data-legend-mode="subject">Economy</span>
      <span class="subject-fill-ancient-history hidden" data-legend-mode="subject">Ancient history</span>
      <span class="subject-fill-medieval-history hidden" data-legend-mode="subject">Medieval history</span>
      <span class="subject-fill-modern-history hidden" data-legend-mode="subject">Modern history</span>
      <span class="subject-fill-geography hidden" data-legend-mode="subject">Geography</span>
      <span class="subject-fill-static-gk hidden" data-legend-mode="subject">Static GK</span>
      <span>Dot complete</span>
      <span>Hatch missed</span>
    </div>
    <div class="calendar-shell">
      <div class="calendar-grid"></div>
      <aside class="calendar-panel" id="calendar-panel" aria-live="polite"></aside>
    </div>
  `;

  const grid = container.querySelector(".calendar-grid");
  const panel = container.querySelector("#calendar-panel");

  const paintGrid = () => {
    grid.innerHTML = "";
    [...byMonth.entries()].forEach(([key, monthDays]) => {
      const dayByDate = new Map(monthDays.map((day) => [day.date, day]));
      const leadingBlanks = Array.from({ length: mondayOffset(key) }, blankCell).join("");
      const cells = Array.from({ length: daysInMonth(key) }, (_value, index) => {
        const date = monthDate(key, index + 1);
        const day = dayByDate.get(date);
        return day ? renderScheduledCell(day, colorMode) : blankCell();
      }).join("");
      grid.insertAdjacentHTML("beforeend", `
        <section class="month">
          <h3>${escapeHtml(monthName(key))}</h3>
          <div class="weekdays">${weekdays.map((day) => `<span>${day}</span>`).join("")}</div>
          <div class="days-grid">${leadingBlanks}${cells}</div>
        </section>
      `);
    });
  };
  paintGrid();

  const first = days.find((day) => day.date === today) || days[0];
  renderPanel(panel, first);

  container.querySelectorAll("[data-calendar-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      colorMode = button.dataset.calendarMode;
      container.querySelectorAll("[data-calendar-mode]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      container.querySelectorAll("[data-legend-mode]").forEach((item) => {
        item.classList.toggle("hidden", item.dataset.legendMode !== colorMode);
      });
      paintGrid();
    });
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".day-cell[data-date]");
    if (!button) return;
    const day = days.find((item) => item.date === button.dataset.date);
    if (day) renderPanel(panel, day);
  });
}
