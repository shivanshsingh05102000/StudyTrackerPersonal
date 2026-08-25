import { escapeHtml, request } from "../api.js";

function diffList(items = []) {
  if (!items.length) return "<p>No topics would move.</p>";
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Topic</th><th>Old date</th><th>New date</th></tr></thead>
        <tbody>
          ${items.map((item) => `<tr><td>${escapeHtml(item.subject)}: ${escapeHtml(item.topic)}</td><td class="date">${escapeHtml(item.fromDate)}</td><td class="date">${escapeHtml(item.toDate)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

export function renderRebalance(target, data, reload) {
  target.innerHTML = `
    <header class="screen-header">
      <div>
        <h1>Rebalance</h1>
        <p>Dry-run first. Commit only after reviewing moved topics and overloaded days.</p>
      </div>
    </header>
    <section class="section">
      <div class="toolbar">
        <button id="dry-run" type="button">Preview rebalance</button>
        <button id="commit-rebalance" type="button" disabled>Commit rebalance</button>
        <label class="field">
          <span>Scenario</span>
          <select id="scenario">
            <option value="miss_next_5_days">Learner misses next 5 days</option>
            <option value="autumn_cancelled">Autumn break is cancelled</option>
            <option value="add_30_min_day">Add 30 min/day capacity</option>
          </select>
        </label>
        <button id="simulate" type="button">Simulate</button>
      </div>
      <div id="rebalance-result"></div>
    </section>
  `;

  let feasiblePreview = false;
  const output = target.querySelector("#rebalance-result");
  const commit = target.querySelector("#commit-rebalance");

  target.querySelector("#dry-run").addEventListener("click", async () => {
    const result = await request("/api/admin/rebalance", { method: "POST", body: { commit: false } });
    feasiblePreview = Boolean(result.feasible);
    commit.disabled = !feasiblePreview;
    output.innerHTML = `
      <h2 class="section-title">${result.feasible ? "Feasible" : "Not feasible"}</h2>
      ${result.previewStats ? `<p>New required rate: <span class="num">${result.previewStats.pace.requiredPerDay}</span> resources/day. Finishes before exam: ${result.previewStats.pace.remainingDays > 0 ? "yes" : "no"}.</p>` : ""}
      ${result.shortfall ? `<div class="alarm-band">Shortfall: <span class="num">${result.shortfall}</span> topics. ${result.suggestions.map((item) => escapeHtml(item.label)).join(" ")}</div>` : ""}
      ${result.previewDays?.length ? `<div class="warning">Days over 240 minutes: ${result.previewDays.map((day) => `<span class="date">${escapeHtml(day.date)}</span> (${day.estMinutes})`).join(", ")}</div>` : ""}
      ${diffList(result.moved)}
    `;
  });

  commit.addEventListener("click", async () => {
    if (!feasiblePreview) return;
    await request("/api/admin/rebalance", { method: "POST", body: { commit: true } });
    await reload();
  });

  target.querySelector("#simulate").addEventListener("click", async () => {
    const scenario = target.querySelector("#scenario").value;
    const result = await request("/api/admin/simulate", { method: "POST", body: { scenario } });
    output.innerHTML = `
      <h2 class="section-title">Simulation</h2>
      <p>Required pace: <span class="num">${result.simulatedStats.pace.requiredPerDay}</span> resources/day · backlog <span class="num">${result.simulatedStats.pace.backlogCount}</span>.</p>
      ${result.preview.feasible ? `<p>Rebalance would move <span class="num">${result.preview.moved.length}</span> topics.</p>` : `<div class="alarm-band">Not feasible. Shortfall <span class="num">${result.preview.shortfall}</span>.</div>`}
    `;
  });
}

export function renderStaticGk(target, data, reload) {
  const items = Object.values(data.state.staticGk)
    .sort((a, b) => (a.confidence ?? 0) - (b.confidence ?? 0) || a.label.localeCompare(b.label));
  target.innerHTML = `
    <header class="screen-header">
      <div>
        <h1>Static GK</h1>
        <p>Heavy items occupy two introduction slots on the next rebuild.</p>
      </div>
    </header>
    <section class="section table-wrap">
      <table>
        <thead><tr><th>Item</th><th>Weight</th><th>Confidence</th><th>Seen</th><th>Last seen</th></tr></thead>
        <tbody>
          ${items.map((item) => `
            <tr data-gk-id="${escapeHtml(item.id)}">
              <td>${escapeHtml(item.label)}</td>
              <td>
                <select class="gk-weight">
                  ${["light", "normal", "heavy"].map((weight) => `<option value="${weight}" ${weight === item.weight ? "selected" : ""}>${weight}</option>`).join("")}
                </select>
              </td>
              <td class="num">${item.confidence ?? "unrated"}</td>
              <td class="num">${item.seenCount}</td>
              <td class="date">${item.lastSeen ? escapeHtml(String(item.lastSeen).slice(0, 10)) : "never"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
  target.querySelectorAll(".gk-weight").forEach((select) => {
    select.addEventListener("change", async () => {
      const id = select.closest("[data-gk-id]").dataset.gkId;
      await request(`/api/gk/${id}`, { method: "PATCH", body: { weight: select.value } });
      await reload();
    });
  });
}
