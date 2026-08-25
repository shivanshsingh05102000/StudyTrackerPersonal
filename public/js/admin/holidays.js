import { datesBetween, escapeHtml, request } from "../api.js";

function holidayRows(state) {
  return Object.values(state.days)
    .filter((day) => day.holiday)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function renderHolidays(target, data, reload) {
  const state = data.state;
  const holidays = holidayRows(state);
  target.innerHTML = `
    <header class="screen-header">
      <div>
        <h1>Holidays and extra days</h1>
        <p>Holiday changes recalculate pace immediately.</p>
      </div>
    </header>
    <section class="section">
      <form id="holiday-form" class="form-grid">
        <label class="field"><span>Date</span><input name="date" type="date" min="${escapeHtml(state.config.windowStart)}" max="${escapeHtml(state.config.windowEnd)}" required></label>
        <label class="field"><span>Label</span><input name="label" required></label>
        <label class="field"><span>Type</span><select name="type"><option value="bonus">Bonus</option><option value="off">Off</option></select></label>
        <button type="submit">Add holiday</button>
      </form>
      <div id="holiday-message" class="saved-indicator" aria-live="polite"></div>
    </section>
    <section class="section">
      <h2 class="section-title">Mark break range</h2>
      <div class="toolbar">
        <label class="field"><span>From</span><input id="break-from" type="date" min="${escapeHtml(state.config.windowStart)}" max="${escapeHtml(state.config.windowEnd)}"></label>
        <label class="field"><span>To</span><input id="break-to" type="date" min="${escapeHtml(state.config.windowStart)}" max="${escapeHtml(state.config.windowEnd)}"></label>
        <label class="field"><span>Daily capacity</span><input id="break-capacity" type="number" min="0" value="3"></label>
        <button id="mark-break" type="button">Mark break</button>
      </div>
    </section>
    <section class="section">
      <h2 class="section-title">Current holidays</h2>
      <ul class="plain-list">
        ${holidays.map((day) => `
          <li>
            <span class="date">${escapeHtml(day.date)}</span> · ${escapeHtml(day.holiday)} · ${escapeHtml(day.dayType.replaceAll("_", " "))}
            <button data-remove-holiday="${escapeHtml(day.date)}" type="button">Remove</button>
          </li>
        `).join("")}
        ${holidays.length === 0 ? "<li>No holidays marked.</li>" : ""}
      </ul>
    </section>
  `;

  const message = target.querySelector("#holiday-message");
  target.querySelector("#holiday-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = await request("/api/admin/holiday", { method: "POST", body });
    if (result.delta) {
      message.textContent = `Required pace changed from ${result.delta.beforeRequiredPerDay} to ${result.delta.afterRequiredPerDay} resources/day.`;
    }
    await reload();
  });

  target.querySelectorAll("[data-remove-holiday]").forEach((button) => {
    button.addEventListener("click", async () => {
      await request(`/api/admin/holiday/${button.dataset.removeHoliday}`, { method: "DELETE" });
      await reload();
    });
  });

  target.querySelector("#mark-break").addEventListener("click", async () => {
    const from = target.querySelector("#break-from").value;
    const to = target.querySelector("#break-to").value;
    const capacity = Number(target.querySelector("#break-capacity").value);
    if (!from || !to) {
      message.textContent = "Choose a complete date range.";
      return;
    }
    for (const date of datesBetween(from, to)) {
      await request(`/api/admin/day/${date}`, { method: "PATCH", body: { dayType: "break_intensive", capacity } });
    }
    await reload();
  });
}
