import { escapeHtml, formatPercent } from "../api.js";

function progressBar(percent) {
  return `<div class="bar" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, Number(percent || 0)))}%"></span></div>`;
}

function paceChart(stats) {
  const total = stats.completion.totalWeight || 1;
  const done = stats.completion.doneWeight;
  const width = 700;
  const height = 220;
  const pad = 28;
  const actualEndX = pad + (width - pad * 2) * (done / total);
  const requiredEndY = height - pad;
  const actualY = height - pad - (height - pad * 2) * (done / total);
  return `
    <svg class="pace-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Cumulative completed resources versus required line">
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${pad}" stroke="var(--ink-muted)" stroke-width="2" stroke-dasharray="6 5"></line>
      <polyline points="${pad},${height - pad} ${actualEndX},${actualY}" fill="none" stroke="var(--moss)" stroke-width="3"></polyline>
      <text x="${pad}" y="${height - 8}" fill="var(--ink-muted)" font-size="12">0</text>
      <text x="${width - pad - 70}" y="${pad - 8}" fill="var(--ink-muted)" font-size="12">required</text>
      <text x="${Math.min(width - 95, actualEndX + 8)}" y="${Math.max(18, actualY)}" fill="var(--moss)" font-size="12">actual ${done}/${total}</text>
    </svg>
  `;
}

export function renderProgress(target, stats) {
  const weekly = stats.weekly?.current;
  const previous = stats.weekly?.previous;
  target.innerHTML = `
    <header class="screen-header">
      <div>
        <h1>Progress</h1>
        <p>Overall completion is resource-weighted: done resources divided by total resources.</p>
      </div>
      <div class="toolbar">
        <a class="button-link" href="/api/export/progress.csv">Export CSV</a>
        <a class="button-link" href="/api/export/progress.json">Export JSON</a>
      </div>
    </header>
    <section class="metrics">
      <div class="metric"><span class="metric-label">Overall</span><span class="metric-value">${formatPercent(stats.completion.percent)}</span></div>
      <div class="metric"><span class="metric-label">Current streak</span><span class="metric-value">${stats.streak.current}</span></div>
      <div class="metric"><span class="metric-label">Longest streak</span><span class="metric-value">${stats.streak.longest}</span></div>
      <div class="metric"><span class="metric-label">Required/day</span><span class="metric-value">${stats.pace.requiredPerDay}</span></div>
      <div class="metric"><span class="metric-label">This week resources</span><span class="metric-value">${stats.practical?.resourcesDoneThisWeek || 0}</span></div>
      <div class="metric"><span class="metric-label">Backlog cleared</span><span class="metric-value">${stats.practical?.backlogClearedThisWeek || 0}</span></div>
    </section>
    ${stats.pace.baselineExceeded ? `<div class="alarm-band">Required pace is more than 25% above the original baseline of <span class="num">${stats.pace.baselineRequiredPerDay}</span> resources/day.</div>` : ""}
    <section class="section">
      <h2 class="section-title">Subjects</h2>
      <div class="bars">
        ${stats.subjects.map((subject) => `
          <div class="bar-row">
            <strong>${escapeHtml(subject.subject)}</strong>
            ${progressBar(subject.completionPercent)}
            <span class="num">${subject.done}/${subject.total} - ${subject.avgScore === null ? "no MCQ" : `${subject.avgScore}%`}</span>
          </div>
        `).join("")}
        ${stats.staticGk ? `
          <div class="bar-row">
            <strong>Static GK</strong>
            ${progressBar(stats.staticGk.completionPercent)}
            <span class="num">${stats.staticGk.done}/${stats.staticGk.total} - ${stats.staticGk.avgConfidence === null ? "no confidence" : `confidence ${stats.staticGk.avgConfidence}`}</span>
          </div>
        ` : ""}
      </div>
    </section>
    <section class="section">
      <h2 class="section-title">Weekly review</h2>
      <div class="metrics compact-metrics">
        <div class="metric"><span class="metric-label">Current week</span><span class="metric-value">${weekly?.completionPercent ?? 0}%</span></div>
        <div class="metric"><span class="metric-label">Done resources</span><span class="metric-value">${weekly?.doneResources ?? 0}/${weekly?.totalResources ?? 0}</span></div>
        <div class="metric"><span class="metric-label">Missed days</span><span class="metric-value">${weekly?.missedDays ?? 0}</span></div>
        <div class="metric"><span class="metric-label">Previous week</span><span class="metric-value">${previous?.completionPercent ?? 0}%</span></div>
      </div>
      ${stats.weekly?.nextRevision ? `<p>Next Sunday revision is <span class="date">${escapeHtml(stats.weekly.nextRevision.date)}</span> for <span class="minutes">${escapeHtml(stats.weekly.nextRevision.minutes)}</span> min.</p>` : ""}
    </section>
    <section class="section">
      <h2 class="section-title">Weak areas</h2>
      <ul class="plain-list">
        ${stats.weakness.ranked.map((item) => `<li><strong>${escapeHtml(item.subject)}</strong>: weakness <span class="num">${item.weakness}</span>, average MCQ <span class="num">${item.avgScore}%</span></li>`).join("")}
        ${stats.weakness.ranked.length === 0 ? "<li>Not enough MCQ data to rank subjects.</li>" : ""}
      </ul>
      <h3 class="section-title">Not enough data</h3>
      <ul class="plain-list">
        ${stats.weakness.notEnoughData.map((item) => `<li>${escapeHtml(item.subject)} needs <span class="num">${item.needed}</span> more scored topic${item.needed === 1 ? "" : "s"}.</li>`).join("")}
      </ul>
      <h3 class="section-title">Below threshold</h3>
      <ul class="plain-list">
        ${stats.weakness.belowThresholdTopics.map((topic) => `<li><a href="/learner.html#topic-${escapeHtml(topic.id)}">${escapeHtml(topic.topic)}</a> - ${escapeHtml(topic.subject)} - <span class="num">${topic.score}%</span></li>`).join("")}
        ${stats.weakness.belowThresholdTopics.length === 0 ? "<li>No below-threshold MCQ scores recorded.</li>" : ""}
      </ul>
    </section>
    <section class="section">
      <h2 class="section-title">Pace</h2>
      ${paceChart(stats)}
    </section>
    <section class="section">
      <h2 class="section-title">Time honesty</h2>
      <p>Estimated <span class="minutes">${stats.time.estimated}</span> min - actual <span class="minutes">${stats.time.actual}</span> min.</p>
      ${stats.time.underBudgeted ? `<div class="warning">Actual time is more than 20% above estimate. The plan is under-budgeted.</div>` : ""}
    </section>
  `;
}
