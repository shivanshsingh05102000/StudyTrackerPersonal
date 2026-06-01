const EXAM = new Date('2026-08-09');

const afcatData = {
  'English': [
    {name:'Comprehension passages',s:2},
    {name:'Detect error in sentence',s:1},
    {name:'Sentence completion / fill in the blank',s:1},
    {name:'Synonym & Antonym',s:1},
    {name:'Cloze test',s:1},
    {name:'Idioms and phrases',s:1},
    {name:'Analogy',s:1},
    {name:'Sentence rearranging',s:1},
    {name:'One-word substitution',s:1},
    {name:'Transformation of sentence',s:1},
    {name:'Homonyms',s:1},
  ],
  'General Awareness': [
    {name:'History (Indian & World)',s:2},
    {name:'Geography',s:2},
    {name:'Sports',s:1},
    {name:'National & International organisations',s:1},
    {name:'Art & Culture',s:1},
    {name:'Personalities',s:1},
    {name:'Environment & Ecology',s:1},
    {name:'Indian Polity',s:2},
    {name:'Economy',s:2},
    {name:'Basic Science',s:1},
    {name:'Science & Technology',s:1},
    {name:'Current Affairs (National)',s:1},
    {name:'Current Affairs (International)',s:1},
    {name:'Defence & Military knowledge',s:2},
  ],
  'Numerical Ability': [
    {name:'Decimal fraction',s:1},
    {name:'Time and work',s:1},
    {name:'Average / percentage',s:1},
    {name:'Profit & loss',s:1},
    {name:'Ratio & proportion',s:1},
    {name:'Simple & compound interest',s:1},
    {name:'Time, distance & races',s:2},
    {name:'Area and perimeter',s:1},
    {name:'Probability',s:1},
    {name:'Number system & number series',s:1},
    {name:'Mixture & allegation',s:1},
    {name:'Square roots / HCF / LCM',s:1},
    {name:'Elementary mensuration',s:1},
    {name:'Heights & distance',s:1},
    {name:'Statistics (mean, median, mode)',s:1},
    {name:'Exponents and powers',s:1},
  ],
  'Reasoning & Military': [
    {name:'Verbal reasoning',s:2},
    {name:'Non-verbal reasoning',s:2},
    {name:'Military aptitude test practice',s:3},
  ],
};

const dsaData = [
  {d:1,t:'Arrays: Two Sum, Best Time to Buy Stock',lc:'LC Daily'},
  {d:2,t:'Arrays: Maximum Subarray (Kadane)',lc:'LC Daily'},
  {d:3,t:'Arrays: 3Sum, Container With Most Water',lc:'LC Daily'},
  {d:4,t:'Arrays: Next Permutation, Find Duplicate',lc:'LC Daily'},
  {d:5,t:'Strings: Anagram, Valid Palindrome',lc:'LC Daily'},
  {d:6,t:'Strings: Longest Substring Without Repeat',lc:'LC Daily'},
  {d:7,t:'Strings: Group Anagrams, Minimum Window',lc:'LC Daily'},
  {d:8,t:'Hashing: Two Sum II, Subarray Sum = K',lc:'LC Daily'},
  {d:9,t:'Hashing: Longest Consecutive Sequence',lc:'LC Daily'},
  {d:10,t:'Sorting: Merge Sort, Quick Sort deep dive',lc:'LC Daily'},
  {d:11,t:'Binary Search: Classic + Search in Rotated Array',lc:'LC Daily'},
  {d:12,t:'Binary Search: Find Peak, Median of Two Arrays',lc:'LC Daily'},
  {d:13,t:'Binary Search: Min in Rotated, Kth Smallest',lc:'LC Daily'},
  {d:14,t:'Linked List: Reverse, Detect Cycle',lc:'LC Daily'},
  {d:15,t:'Linked List: Merge Two Sorted, Remove Nth Node',lc:'LC Daily'},
  {d:16,t:'Linked List: LRU Cache, Copy List with Random',lc:'LC Daily'},
  {d:17,t:'Stack: Valid Parentheses, Min Stack',lc:'LC Daily'},
  {d:18,t:'Stack: Daily Temperatures, Largest Rectangle in Histogram',lc:'LC Daily'},
  {d:19,t:'Stack: Trapping Rain Water, Next Greater Element',lc:'LC Daily'},
  {d:20,t:'Queue: Sliding Window Maximum, First Non-repeating',lc:'LC Daily'},
  {d:21,t:'Trees: Inorder, Preorder, Postorder traversals',lc:'LC Daily'},
  {d:22,t:'Trees: Level Order, Zigzag Level Order',lc:'LC Daily'},
  {d:23,t:'Trees: Max Depth, Diameter, Balanced Check',lc:'LC Daily'},
  {d:24,t:'Trees: LCA, Path Sum, Serialize/Deserialize',lc:'LC Daily'},
  {d:25,t:'BST: Validate BST, Kth Smallest in BST',lc:'LC Daily'},
  {d:26,t:'Heaps: Kth Largest, Top K Frequent Elements',lc:'LC Daily'},
  {d:27,t:'Heaps: Merge K Sorted Lists, Find Median Stream',lc:'LC Daily'},
  {d:28,t:'Graphs: BFS, DFS, Number of Islands',lc:'LC Daily'},
  {d:29,t:'Graphs: Clone Graph, Course Schedule (Topo Sort)',lc:'LC Daily'},
  {d:30,t:'Graphs: Dijkstra, Bellman-Ford shortest path',lc:'LC Daily'},
  {d:31,t:'Graphs: Union-Find, Number of Connected Components',lc:'LC Daily'},
  {d:32,t:'DP: Climbing Stairs, Coin Change, Fibonacci',lc:'LC Daily'},
  {d:33,t:'DP: 0/1 Knapsack, Unbounded Knapsack',lc:'LC Daily'},
  {d:34,t:'DP: LCS, LIS, Edit Distance',lc:'LC Daily'},
  {d:35,t:'DP: Matrix Chain, Palindrome Partition',lc:'LC Daily'},
  {d:36,t:'DP: Word Break, Decode Ways',lc:'LC Daily'},
  {d:37,t:'Backtracking: Subsets, Permutations, Combinations',lc:'LC Daily'},
  {d:38,t:'Backtracking: N-Queens, Sudoku Solver',lc:'LC Daily'},
  {d:39,t:'Tries: Implement Trie, Word Search II',lc:'LC Daily'},
  {d:40,t:'Sliding Window: Max Consecutive Ones, Fruit into Baskets',lc:'LC Daily'},
  {d:41,t:'Two Pointers: Sort Colors, Partition Labels',lc:'LC Daily'},
  {d:42,t:'Bit Manipulation: Single Number, Count Bits',lc:'LC Daily'},
  {d:43,t:'Revision: Arrays + Strings (hard problems)',lc:'LC Daily'},
  {d:44,t:'Revision: Trees + Graphs (hard problems)',lc:'LC Daily'},
  {d:45,t:'Full mock contest — All topics',lc:'LC Daily'},
];

const techData = {
  react: [
    {name:'JSX & Virtual DOM fundamentals',s:1},
    {name:'useState — state management basics',s:1},
    {name:'useEffect — lifecycle & side effects',s:2},
    {name:'useRef — DOM refs & mutable values',s:1},
    {name:'useContext — Context API',s:1},
    {name:'useReducer — complex state logic',s:1},
    {name:'useMemo — memoization',s:1},
    {name:'useCallback — referential stability',s:1},
    {name:'Custom hooks — writing & using',s:2},
    {name:'React Router — routing & navigation',s:2},
    {name:'Lazy loading & Suspense',s:1},
    {name:'Error boundaries',s:1},
    {name:'Performance optimisation (memo, profiler)',s:2},
    {name:'Forms & controlled components',s:1},
    {name:'Portals',s:1},
  ],
  next: [
    {name:'Pages Router vs App Router',s:1},
    {name:'File-based routing',s:1},
    {name:'Server-side rendering (SSR)',s:2},
    {name:'Static site generation (SSG)',s:1},
    {name:'Incremental static regeneration (ISR)',s:1},
    {name:'API routes',s:1},
    {name:'Middleware',s:1},
    {name:'Image optimisation (next/image)',s:1},
    {name:'Server vs Client components',s:2},
    {name:'Data fetching patterns',s:2},
    {name:'Deployment & Vercel',s:1},
  ],
  internshala: [
    {name:'Module 1 — Course intro & setup',s:1},
    {name:'Module 2 — Core concepts',s:2},
    {name:'Module 3 — Intermediate topics',s:2},
    {name:'Module 4 — Project work',s:3},
    {name:'Module 5 — Final assessment',s:1},
  ],
};

const ttClass = [
  {time:'12:00–1:30 PM', name:'AFCAT — Subject 1', desc:'Deep study · notes + YouTube', type:'afcat'},
  {time:'1:30–2:00 PM', name:'Break', desc:'', type:'break'},
  {time:'2:00–3:30 PM', name:'AFCAT — Subject 2', desc:'PYQs + practice questions', type:'afcat'},
  {time:'3:30–4:00 PM', name:'Break', desc:'', type:'break'},
  {time:'4:00–5:00 PM', name:'AFCAT — Revision', desc:'Recap both subjects, weak spots', type:'afcat'},
  {time:'5:00–6:30 PM', name:'Internshala class / Web Dev tutorial', desc:'Attend class or watch tutorial · 🔒 locked', type:'tech'},
  {time:'6:30–7:00 PM', name:'Break', desc:'', type:'break'},
  {time:'7:00–8:30 PM', name:'DSA — LC Daily + Striver Day', desc:'Both problems. Think before peeking. · 🔒 locked', type:'dsa'},
  {time:'8:30–9:00 PM', name:'Revise class concept', desc:'Re-read notes from today\'s class · 🔒 locked', type:'tech'},
  {time:'9:00–10:30 PM', name:'AFCAT — Subject 3', desc:'90-min focused new subject', type:'afcat'},
  {time:'10:30–11:00 PM', name:'Break', desc:'', type:'break'},
  {time:'11:00 PM–12:30 AM', name:'AFCAT — Subject 4', desc:'All 4 subjects covered today', type:'afcat'},
  {time:'12:30–1:00 AM', name:'Break', desc:'', type:'break'},
  {time:'1:00–2:30 AM', name:'AFCAT — Mock / Weak subject', desc:'Timed mock or drill weakest area', type:'afcat'},
  {time:'2:30–5:00 AM', name:'Wind down + sleep', desc:'', type:'break'},
];

const ttNoClass = [
  {time:'12:00–1:30 PM', name:'AFCAT — Subject 1', desc:'Deep study · notes + YouTube', type:'afcat'},
  {time:'1:30–2:00 PM', name:'Break', desc:'', type:'break'},
  {time:'2:00–3:30 PM', name:'AFCAT — Subject 2', desc:'PYQs + practice questions', type:'afcat'},
  {time:'3:30–4:00 PM', name:'Break', desc:'', type:'break'},
  {time:'4:00–5:00 PM', name:'AFCAT — Revision', desc:'Recap both subjects, weak spots', type:'afcat'},
  {time:'5:00–6:30 PM', name:'DSA — LC Daily + Striver Day', desc:'Both problems + deep dive · 🔒 locked', type:'dsa'},
  {time:'6:30–7:00 PM', name:'Break', desc:'', type:'break'},
  {time:'7:00–8:30 PM', name:'DSA — Yesterday\'s revision', desc:'Re-solve without hints. Lock patterns. · 🔒 locked', type:'dsa'},
  {time:'8:30–9:00 PM', name:'React / Web Dev — hands-on', desc:'Build a small component, no tutorials', type:'tech'},
  {time:'9:00–10:30 PM', name:'AFCAT — Subject 3', desc:'90-min focused new subject', type:'afcat'},
  {time:'10:30–11:00 PM', name:'Break', desc:'', type:'break'},
  {time:'11:00 PM–12:30 AM', name:'AFCAT — Subject 4', desc:'All 4 subjects covered today', type:'afcat'},
  {time:'12:30–1:00 AM', name:'Break', desc:'', type:'break'},
  {time:'1:00–2:30 AM', name:'AFCAT — Full mock test', desc:'Timed mock. Analyze immediately.', type:'afcat'},
  {time:'2:30–5:00 AM', name:'Wind down + sleep', desc:'', type:'break'},
];

// ── STATE ──────────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'grind_os_v3';
const EMPTY_PROGRESS = () => ({afcat: {}, dsa: {}, tech: {}});
const DAILY_TARGET_MIN = 12 * 60;
let timerTick = null;

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

function getDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekStartKey(d = new Date()) {
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return getDateKey(start);
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[ch]));
}

function formatMinutes(total = 0) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function formatTimer(ms = 0) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function getTodaySessions() {
  const today = getDateKey();
  return S.sessions.filter(x => x.date === today);
}

function getTodayMinutes(subject) {
  return getTodaySessions()
    .filter(x => !subject || x.subject === subject)
    .reduce((sum, x) => sum + (x.dur || 0), 0);
}

function getAfcatTopicOptions() {
  return Object.entries(afcatData).flatMap(([sub, topics]) =>
    topics.map((topic, i) => ({
      value: `afcat|${sub}|${i}`,
      label: `${sub}: ${topic.name}`,
      name: topic.name,
    }))
  );
}

function getTechTopicOptions() {
  return Object.entries(techData).flatMap(([cat, topics]) =>
    topics.map((topic, i) => ({
      value: `tech|${cat}|${i}`,
      label: `${cat.toUpperCase()}: ${topic.name}`,
      name: topic.name,
    }))
  );
}

function getDsaTopicOptions() {
  const opts = [];
  for (let d = 1; d <= 45; d++) {
    const dayQ = S.dsaQuestions ? S.dsaQuestions.filter(q => q.day === d) : [];
    const solvedCount = dayQ.filter(q => q.status === 'solved').length;
    const label = dayQ.length > 0
      ? `Day ${d} (${solvedCount}/${dayQ.length} solved)`
      : `Day ${d} (Empty)`;
    opts.push({
      value: `dsa|${d}`,
      label: label,
      name: `Day ${d}`,
    });
  }
  return opts;
}

function applySessionProgress(sess) {
  if (sess.status === 'pending') return;
  const parts = (sess.topicKey || '').split('|');
  if (!parts.length) return;

  if (parts[0] === 'afcat') {
    const [, sub, rawIndex] = parts;
    const i = Number(rawIndex);
    if (!afcatData[sub] || !afcatData[sub][i]) return;
    const key = `${sub}__${i}`;
    const target = S.manualTargetSessions[key] || afcatData[sub][i].s;
    const done = sess.status === 'done' ? target : Math.min((S.sessionProgress.afcat[key + '_done'] || 0) + 1, target);
    S.sessionProgress.afcat[key] = done >= target ? 'done' : 'in-progress';
    S.sessionProgress.afcat[key + '_done'] = done;
  }

  if (parts[0] === 'dsa') {
    const day = Number(parts[1]);
    if (sess.status === 'done') S.sessionProgress.dsa[day] = 'done';
  }

  if (parts[0] === 'tech') {
    const [, cat, rawIndex] = parts;
    const i = Number(rawIndex);
    if (!techData[cat] || !techData[cat][i]) return;
    const key = `${cat}__${i}`;
    const target = S.manualTargetSessions[key] || techData[cat][i].s;
    const done = sess.status === 'done' ? target : Math.min((S.sessionProgress.tech[key + '_done'] || 0) + 1, target);
    S.sessionProgress.tech[key] = done >= target ? 'done' : 'in-progress';
    S.sessionProgress.tech[key + '_done'] = done;
  }
}

function rebuildProgressFromSessions() {
  S.sessionProgress = EMPTY_PROGRESS();
  S.sessions.forEach(applySessionProgress);
  syncProgress();
}

function mergeProgress(sessionProgress, manualProgress) {
  const merged = {...sessionProgress, ...manualProgress};
  Object.keys(sessionProgress).forEach(key => {
    if (manualProgress[key] === 'pending' && sessionProgress[key] === 'done') merged[key] = 'done';
    if (key.endsWith('_done')) merged[key] = Math.max(sessionProgress[key] || 0, manualProgress[key] || 0);
  });
  return merged;
}

function syncProgress() {
  S.afcat = mergeProgress(S.sessionProgress.afcat, S.manual.afcat);
  
  // Dynamic DSA progress calculation from logged questions
  S.dsa = {};
  for (let d = 1; d <= 45; d++) {
    const dayQ = S.dsaQuestions ? S.dsaQuestions.filter(q => q.day === d) : [];
    const solved = dayQ.filter(q => q.status === 'solved').length;
    const manualVal = S.manual.dsa[d] || 'pending';
    
    if (manualVal === 'done' || (dayQ.length > 0 && solved >= 2)) {
      S.dsa[d] = 'done';
    } else if (dayQ.length > 0) {
      S.dsa[d] = 'in-progress';
    } else {
      S.dsa[d] = 'pending';
    }
  }
  
  S.tech = mergeProgress(S.sessionProgress.tech, S.manual.tech);
}

function createDefaultState() {
  return {
    afcat: {},
    dsa: {},
    tech: {},
    manual: EMPTY_PROGRESS(),
    sessionProgress: EMPTY_PROGRESS(),
    sessions: [],
    dsaQuestions: [],
    manualTargetSessions: {},
    timer: {
      running: false,
      subject: 'afcat',
      topic: '',
      topicKey: '',
      elapsed: 0,
      startTs: null,
    },
    today: {},
    todayDate: getDateKey(),
    tt_class: clone(ttClass),
    tt_noclass: clone(ttNoClass),
  };
}

function loadState() {
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem('grind_os_v2') || '{}');
  } catch (err) {
    stored = {};
  }

  const state = {...createDefaultState(), ...stored};
  state.manual = stored.manual || {
    afcat: stored.afcat || {},
    dsa: stored.dsa || {},
    tech: stored.tech || {},
  };
  state.manual.afcat = state.manual.afcat || {};
  state.manual.dsa = state.manual.dsa || {};
  state.manual.tech = state.manual.tech || {};
  state.sessionProgress = EMPTY_PROGRESS();
  state.sessions = Array.isArray(state.sessions) ? state.sessions : [];
  state.dsaQuestions = Array.isArray(stored.dsaQuestions) ? stored.dsaQuestions : [];
  state.manualTargetSessions = stored.manualTargetSessions || {};
  state.timer = {...createDefaultState().timer, ...(state.timer || {})};
  state.tt_class = Array.isArray(state.tt_class) ? state.tt_class : clone(ttClass);
  state.tt_noclass = Array.isArray(state.tt_noclass) ? state.tt_noclass : clone(ttNoClass);

  if (state.todayDate !== getDateKey()) {
    state.today = {};
    state.todayDate = getDateKey();
  } else {
    state.today = state.today || {};
  }

  return state;
}

let S = loadState();
rebuildProgressFromSessions();
let mStatus = 'done';

const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(S));

// ── INIT ───────────────────────────────────────────────────────────────────────
window.onload = () => {
  save();
  const diff = Math.ceil((EXAM - new Date()) / 864e5);
  document.getElementById('days-left').textContent = diff;
  document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-IN', {weekday:'long',year:'numeric',month:'long',day:'numeric'});
  renderWeek();
  renderTT();
  renderAfcat('English');
  renderDSA();
  renderTech('react');
  document.getElementById('t-sub').value = S.timer.subject || 'afcat';
  refreshTimerTopicDD();
  renderToday();
  renderCommandCenter();
  updateTimerDisplay();
  timerTick = setInterval(updateTimerDisplay, 1000);
  updateStats();
  renderLog();
};

// ── WEEK STRIP ─────────────────────────────────────────────────────────────────
function renderWeek() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date();
  const el = document.getElementById('week-strip');
  el.innerHTML = '';
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const key = getDateKey(d);
    const ss = S.sessions.filter(x => x.date === key);
    const ha = ss.some(x => x.subject === 'afcat');
    const hd = ss.some(x => x.subject === 'dsa');
    const ht = ss.some(x => x.subject === 'tech');
    el.innerHTML += `<div class="wday${i===0?' today':''}">
      <div class="wday-name">${days[d.getDay()]}</div>
      <div class="wday-date">${d.getDate()}</div>
      <div class="wday-dots">
        <div class="wd${ha?' a':''}"></div>
        <div class="wd${hd?' d':''}"></div>
        <div class="wd${ht?' t':''}"></div>
      </div>
    </div>`;
  }
}

// ── TIMETABLE ──────────────────────────────────────────────────────────────────
function renderTT() {
  const cols = {afcat:'var(--afcat)',dsa:'var(--dsa)',tech:'var(--tech)',break:'var(--b2)'};
  const bg = {afcat:'var(--afcat-d)',dsa:'var(--dsa-d)',tech:'var(--tech-d)',break:'var(--s3)'};
  const lbl = {afcat:'AFCAT',dsa:'DSA',tech:'TECH',break:'—'};
  const tc = {afcat:'var(--afcat)',dsa:'var(--dsa)',tech:'var(--tech)',break:'var(--t3)'};
  const render = (list, id) => {
    document.getElementById(id).innerHTML = list.map((r,i) => `
      <div class="tt-row${r.type==='break'?' is-break':''}">
        <div class="tt-time">${r.time}</div>
        <div class="tt-bar2" style="background:${cols[r.type]}"></div>
        <div class="tt-info">
          <div class="tt-name">${r.name}</div>
          ${r.desc?`<div class="tt-desc">${r.desc}</div>`:''}
    const ss = S.sessions.filter(x => x.date === key);
    const ha = ss.some(x => x.subject === 'afcat');
    const hd = ss.some(x => x.subject === 'dsa');
    const ht = ss.some(x => x.subject === 'tech');
    el.innerHTML += `<div class="wday${i===0?' today':''}">
      <div class="wday-name">${days[d.getDay()]}</div>
      <div class="wday-date">${d.getDate()}</div>
      <div class="wday-dots">
        <div class="wd${ha?' a':''}"></div>
        <div class="wd${hd?' d':''}"></div>
        <div class="wd${ht?' t':''}"></div>
      </div>
    </div>`;
  }
}

// ── TIMETABLE ──────────────────────────────────────────────────────────────────
function renderTT() {
  const cols = {afcat:'var(--afcat)',dsa:'var(--dsa)',tech:'var(--tech)',break:'var(--b2)'};
  const bg = {afcat:'var(--afcat-d)',dsa:'var(--dsa-d)',tech:'var(--tech-d)',break:'var(--s3)'};
  const lbl = {afcat:'AFCAT',dsa:'DSA',tech:'TECH',break:'—'};
  const tc = {afcat:'var(--afcat)',dsa:'var(--dsa)',tech:'var(--tech)',break:'var(--t3)'};
  const render = (list, id) => {
    document.getElementById(id).innerHTML = list.map((r,i) => `
      <div class="tt-row${r.type==='break'?' is-break':''}">
        <div class="tt-time">${r.time}</div>
        <div class="tt-bar2" style="background:${cols[r.type]}"></div>
        <div class="tt-info">
          <div class="tt-name">${r.name}</div>
          ${r.desc?`<div class="tt-desc">${r.desc}</div>`:''}
        </div>
        ${r.type!=='break'?`<div class="tt-badge" style="background:${bg[r.type]};color:${tc[r.type]}">${lbl[r.type]}</div>`:''}
        <div style="display:flex; gap:6px;">
          ${r.type!=='break'?`<button class="tt-edit" style="border-color:var(--tech);color:var(--tech);" onclick="startTimetableSession('${r.type}', '${escapeHTML(r.name)}')">▶ play</button>`:''}
          <button class="tt-edit" onclick="editTT(${i},'${id}')">edit</button>
        </div>
      </div>`).join('');
  };
  render(S.tt_class, 'tt-class');
  render(S.tt_noclass, 'tt-noclass');
}

function editTT(i, id) {
  const list = id === 'tt-class' ? S.tt_class : S.tt_noclass;
  const item = list[i];
  
  document.getElementById('timetable-modal').classList.add('open');
  document.getElementById('tt-slot-index').value = i;
  document.getElementById('tt-slot-list-id').value = id;
  
  document.getElementById('tt-slot-time').value = item.time || '';
  document.getElementById('tt-slot-name').value = item.name || '';
  document.getElementById('tt-slot-desc').value = item.desc || '';
  document.getElementById('tt-slot-type').value = item.type || 'break';
}

function closeTimetableModal() {
  document.getElementById('timetable-modal').classList.remove('open');
}

function saveTimetableSlot() {
  const i = parseInt(document.getElementById('tt-slot-index').value, 10);
  const id = document.getElementById('tt-slot-list-id').value;
  const list = id === 'tt-class' ? S.tt_class : S.tt_noclass;
  
  if (i < 0 || !list[i]) return;
  
  list[i].time = document.getElementById('tt-slot-time').value.trim();
  list[i].name = document.getElementById('tt-slot-name').value.trim();
  list[i].desc = document.getElementById('tt-slot-desc').value.trim();
  list[i].type = document.getElementById('tt-slot-type').value;
  
  save();
  closeTimetableModal();
  renderTT();
}

function switchTT(mode, btn) {
  document.getElementById('tt-class').style.display = mode==='class'?'block':'none';
  document.getElementById('tt-noclass').style.display = mode==='noclass'?'block':'none';
  document.querySelectorAll('.tt-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── AFCAT TOPICS ───────────────────────────────────────────────────────────────
let curAfcatSub = 'English';
function renderAfcat(sub) {
  curAfcatSub = sub;
  const tabs = document.getElementById('afcat-tabs');
  tabs.innerHTML = Object.keys(afcatData).map(s =>
    `<button class="sub-tab${s===sub?' a-afcat':''}" onclick="renderAfcat('${s}')">${s}</button>`
  ).join('');
  const el = document.getElementById('afcat-list');
  el.innerHTML = afcatData[sub].map((t,i) => {
    const key = `${sub}__${i}`;
    const st = S.afcat[key] || 'pending';
    const done_s = S.afcat[key+'_done'] || 0;
    const target = S.manualTargetSessions[key] || t.s;
    const dots = Array.from({length:target},(_,di) =>
      `<div class="t-dot${di<done_s?' done':di===done_s&&st==='in-progress'?' active':''}"></div>`).join('');
    
    return `<div class="topic-item${st==='done'?' done':st==='in-progress'?' in-progress':''}" onclick="cycleAfcat('${sub}',${i})">
      <div class="t-chk">${st==='done'?'✓':st==='in-progress'?'…':''}</div>
      <div class="t-name">${t.name}</div>
      <div style="display:flex; align-items:center; gap:8px;" onclick="event.stopPropagation()">
        <button class="tt-edit" style="padding:2px 6px; font-weight:bold;" onclick="adjustTargetSessions('afcat','${key}',-1,'${sub}')">-</button>
        <div class="t-dots">${dots}</div>
        <button class="tt-edit" style="padding:2px 6px; font-weight:bold;" onclick="adjustTargetSessions('afcat','${key}',1,'${sub}')">+</button>
      </div>
      <div class="t-sess" style="min-width:60px;">${done_s}/${target} sess</div>
    </div>`;
  }).join('');
}

function cycleAfcat(sub, i) {
  const key = `${sub}__${i}`;
  const cur = S.afcat[key] || 'pending';
  const target = S.manualTargetSessions[key] || afcatData[sub][i].s;
  const nxt = cur==='pending'?'in-progress':cur==='in-progress'?'done':'pending';
  S.manual.afcat[key] = nxt;
  S.manual.afcat[key+'_done'] = nxt==='done' ? target : nxt==='in-progress' ? Math.min((S.afcat[key+'_done']||0)+1, target) : 0;
  syncProgress();
  save(); renderAfcat(sub); renderToday(); updateStats();
}

// ── DSA ────────────────────────────────────────────────────────────────────────
function renderDSA() {
  const el = document.getElementById('dsa-list');
  if (!el) return;
  
  let html = '';
  for (let d = 1; d <= 45; d++) {
    const dayQ = S.dsaQuestions ? S.dsaQuestions.filter(q => q.day === d) : [];
    const done = S.dsa[d] === 'done';
    const inProgress = S.dsa[d] === 'in-progress';
    
    let qListHtml = '';
    if (dayQ.length > 0) {
      qListHtml = `<div class="dsa-questions-list" style="display:flex; flex-direction:column; gap:8px; width:100%;">` + dayQ.map((q) => {
        const idx = S.dsaQuestions.findIndex(x => x.ts === q.ts);
        const solved = q.status === 'solved';
        const cClass = `badge-${q.complexity || 'easy'}`;
        const linkBtn = q.link ? `<a href="${escapeHTML(q.link)}" target="_blank" class="dsa-q-link" title="Open LeetCode">LC ↗</a>` : '';
        return `
          <div class="dsa-q-item" style="display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background:rgba(255,255,255,0.03); border:1px solid var(--b1); border-radius:6px; font-size:12px;">
            <div class="dsa-q-info" style="display:flex; align-items:center; gap:8px;">
              <div class="t-chk${solved ? ' done' : ''}" style="width:16px;height:16px;font-size:8px;border-radius:4px; cursor:pointer;" onclick="toggleDsaQ(${idx})">${solved ? '✓' : ''}</div>
              <span class="dsa-q-title">${escapeHTML(q.title)}</span>
              <span class="${cClass}">${q.complexity}</span>
              ${linkBtn}
            </div>
            <div class="dsa-q-actions" style="display:flex; gap:6px;">
              <button class="log-edit" style="padding:2px 6px;" onclick="openDsaModal(${d}, ${idx})">edit</button>
              <button class="log-del" style="padding:2px 6px;" onclick="deleteDsaQuestion(${idx})">del</button>
            </div>
          </div>
        `;
      }).join('') + `</div>`;
    } else {
      qListHtml = `<div style="font-size:11px; color:var(--t3); font-style:italic; padding:4px 0;">No questions logged yet.</div>`;
    }
    
    html += `
      <div class="dsa-day${done ? ' done' : inProgress ? ' in-progress' : ''}" style="display:flex; flex-direction:column; gap:10px; padding:14px; margin-bottom:12px;">
        <div class="dsa-day-header" style="display:flex; align-items:center; justify-content:space-between; width:100%; border-bottom:1px solid var(--b1); padding-bottom:8px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="dsa-chk" style="width:20px; height:20px; border-radius:6px; font-size:9px;" onclick="toggleDSA(${d})">${done ? '✓' : ''}</div>
            <div class="dsa-num" style="min-width:auto; padding:0; font-weight:700; color:var(--t1)">Day ${d}</div>
          </div>
          <button class="btn primary mini" style="min-height:24px; padding:2px 8px; font-size:11px;" onclick="openDsaModal(${d})">+ Add Question</button>
        </div>
        ${qListHtml}
      </div>
    `;
  }
  
  el.innerHTML = html;
  
  const dn = Object.keys(S.dsa).filter(k => S.dsa[k] === 'done').length;
  document.getElementById('dsa-done').textContent = `${dn} / 45`;
  document.getElementById('dsa-cur').textContent = `Day ${Math.min(dn + 1, 45)}`;
}

function toggleDSA(d) {
  S.manual.dsa[d] = S.dsa[d]==='done'?'pending':'done';
  syncProgress();
  save(); renderDSA(); renderToday(); updateStats();
}

function toggleDsaQ(idx) {
  if (!S.dsaQuestions || !S.dsaQuestions[idx]) return;
  S.dsaQuestions[idx].status = S.dsaQuestions[idx].status === 'solved' ? 'attempted' : 'solved';
  syncProgress();
  save();
  renderDSA();
  updateStats();
  renderToday();
  if (document.getElementById('page-analytics').classList.contains('active')) {
    renderAnalytics();
  }
}

function deleteDsaQuestion(idx) {
  if (!confirm('Delete this logged question?')) return;
  S.dsaQuestions.splice(idx, 1);
  syncProgress();
  save();
  renderDSA();
  updateStats();
  renderToday();
  if (document.getElementById('page-analytics').classList.contains('active')) {
    renderAnalytics();
  }
}

let dsaStatus = 'solved';
function openDsaModal(day = null, editIdx = -1) {
  document.getElementById('dsa-modal').classList.add('open');
  const indexInput = document.getElementById('dsa-q-index');
  const dayInput = document.getElementById('dsa-q-day');
  const titleInput = document.getElementById('dsa-q-title');
  const complexSelect = document.getElementById('dsa-q-complex');
  const linkInput = document.getElementById('dsa-q-link');
  
  if (editIdx > -1) {
    const q = S.dsaQuestions[editIdx];
    document.getElementById('dsa-modal-title').textContent = 'Edit DSA Question';
    indexInput.value = editIdx;
    dayInput.value = q.day;
    titleInput.value = q.title;
    complexSelect.value = q.complexity || 'easy';
    linkInput.value = q.link || '';
    setDsaStatus(q.status || 'solved', document.getElementById(q.status === 'solved' ? 'dsa-btn-solved' : 'dsa-btn-attempted'));
  } else {
    document.getElementById('dsa-modal-title').textContent = 'Log DSA Question';
    indexInput.value = -1;
    const activeDay = day || Math.min(Object.keys(S.dsa).filter(k => S.dsa[k] === 'done').length + 1, 45);
    dayInput.value = activeDay;
    titleInput.value = '';
    complexSelect.value = 'easy';
    linkInput.value = '';
    setDsaStatus('solved', document.getElementById('dsa-btn-solved'));
  }
}

function closeDsaModal() {
  document.getElementById('dsa-modal').classList.remove('open');
}

function setDsaStatus(s, btn) {
  dsaStatus = s;
  document.querySelectorAll('#dsa-modal .status-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

function saveDsaQuestion() {
  const editIdx = parseInt(document.getElementById('dsa-q-index').value, 10);
  const day = parseInt(document.getElementById('dsa-q-day').value, 10) || 1;
  const title = document.getElementById('dsa-q-title').value.trim();
  const complexity = document.getElementById('dsa-q-complex').value;
  const link = document.getElementById('dsa-q-link').value.trim();
  
  if (!title) {
    alert('Please enter a question title.');
    return;
  }
  
  const q = {
    day: day,
    title: title,
    complexity: complexity,
    status: dsaStatus,
    link: link,
    ts: editIdx > -1 ? S.dsaQuestions[editIdx].ts : Date.now(),
    date: editIdx > -1 ? S.dsaQuestions[editIdx].date : getDateKey()
  };
  
  if (editIdx > -1) {
    S.dsaQuestions[editIdx] = q;
  } else {
    S.dsaQuestions.push(q);
  }
  
  syncProgress();
  save();
  closeDsaModal();
  renderDSA();
  updateStats();
  renderToday();
  if (document.getElementById('page-analytics').classList.contains('active')) {
    renderAnalytics();
  }
}

function loadDsaDefaultChallenge() {
  if (S.dsaQuestions && S.dsaQuestions.length > 0) {
    if (!confirm('This will load default challenge questions. Your existing logged questions will be preserved. Proceed?')) return;
  }
  const defaults = [
    {d:1, t:'Two Sum', c:'easy'},
    {d:1, t:'Best Time to Buy Stock', c:'easy'},
    {d:2, t:'Maximum Subarray (Kadane)', c:'medium'},
    {d:2, t:'Sort Colors (Dutch Flag)', c:'medium'},
    {d:3, t:'3Sum', c:'medium'},
    {d:3, t:'Container With Most Water', c:'medium'},
    {d:4, t:'Next Permutation', c:'medium'},
    {d:4, t:'Find the Duplicate Number', c:'medium'},
    {d:5, t:'Valid Anagram', c:'easy'},
    {d:5, t:'Valid Palindrome', c:'easy'},
    {d:6, t:'Longest Substring Without Repeat', c:'medium'},
    {d:7, t:'Group Anagrams', c:'medium'},
    {d:7, t:'Minimum Window Substring', c:'hard'}
  ];
  
  defaults.forEach(x => {
    const exists = S.dsaQuestions.some(q => q.day === x.d && q.title.toLowerCase() === x.t.toLowerCase());
    if (!exists) {
      S.dsaQuestions.push({
        day: x.d,
        title: x.t,
        complexity: x.c,
        status: 'solved',
        link: 'https://leetcode.com/problems/' + x.t.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        ts: Date.now() + Math.random(),
        date: getDateKey()
      });
    }
  });
  
  syncProgress();
  save();
  renderDSA();
  updateStats();
  renderToday();
  alert('Default DSA challenge questions loaded successfully!');
}

// ── TECH ───────────────────────────────────────────────────────────────────────
let curTechCat = 'react';
function renderTech(cat) {
  curTechCat = cat;
  document.querySelectorAll('#page-tech .sub-tab').forEach(b => b.className='sub-tab');
  const active = document.querySelector(`#page-tech .sub-tab[data-cat="${cat}"]`);
  if (active) active.className = 'sub-tab a-tech';
  const el = document.getElementById('tech-list');
  if (!el) return;
  el.innerHTML = (techData[cat]||[]).map((t,i) => {
    const key = `${cat}__${i}`;
    const st = S.tech[key] || 'pending';
    const done_s = S.tech[key+'_done'] || 0;
    const target = S.manualTargetSessions[key] || t.s;
    const dots = Array.from({length:target},(_,di) =>
      `<div class="t-dot${di<done_s?' done':di===done_s&&st==='in-progress'?' active-tech':''}"></div>`).join('');
    return `<div class="topic-item${st==='done'?' done':st==='in-progress'?' in-progress-tech':''}" onclick="cycleTech('${cat}',${i})">
      <div class="t-chk">${st==='done'?'✓':st==='in-progress'?'…':''}</div>
      <div class="t-name">${t.name}</div>
      <div style="display:flex; align-items:center; gap:8px;" onclick="event.stopPropagation()">
        <button class="tt-edit" style="padding:2px 6px; font-weight:bold;" onclick="adjustTargetSessions('tech','${key}',-1,'${cat}')">-</button>
        <div class="t-dots">${dots}</div>
        <button class="tt-edit" style="padding:2px 6px; font-weight:bold;" onclick="adjustTargetSessions('tech','${key}',1,'${cat}')">+</button>
      </div>
      <div class="t-sess" style="min-width:60px;">${done_s}/${target} sess</div>
    </div>`;
  }).join('');
}

function cycleTech(cat, i) {
  const key = `${cat}__${i}`;
  const cur = S.tech[key] || 'pending';
  const nxt = cur==='pending'?'in-progress':cur==='in-progress'?'done':'pending';
  S.manual.tech[key] = nxt;
  S.manual.tech[key+'_done'] = nxt==='done' ? techData[cat][i].s : nxt==='in-progress' ? Math.min((S.tech[key+'_done']||0)+1, techData[cat][i].s) : 0;
  syncProgress();
  save(); renderTech(cat); renderToday(); updateStats();
}

function switchTech(cat, btn) {
  document.querySelectorAll('#page-tech .sub-tab').forEach(b => b.className='sub-tab');
  btn.className='sub-tab a-tech';
  renderTech(cat);
}

function getOptionsForSubject(subject) {
  if (subject === 'afcat') return getAfcatTopicOptions();
  if (subject === 'dsa') return getDsaTopicOptions();
  return getTechTopicOptions();
}

function getRecommendedPlan() {
  const dsaDone = Object.values(S.dsa).filter(v => v === 'done').length;
  const curDsa = dsaData[Math.min(dsaDone, 44)];
  const afcatSubject = Object.keys(afcatData).find(sub =>
    afcatData[sub].some((topic, i) => S.afcat[`${sub}__${i}`] !== 'done')
  ) || 'English';
  const afcatIndex = afcatData[afcatSubject].findIndex((topic, i) => S.afcat[`${afcatSubject}__${i}`] !== 'done');
  const afcatTopic = afcatData[afcatSubject][Math.max(afcatIndex, 0)];
  const techCat = Object.keys(techData).find(cat =>
    techData[cat].some((topic, i) => S.tech[`${cat}__${i}`] !== 'done')
  ) || 'react';
  const techIndex = techData[techCat].findIndex((topic, i) => S.tech[`${techCat}__${i}`] !== 'done');
  const techTopic = techData[techCat][Math.max(techIndex, 0)];
  const afcatMinutes = getTodayMinutes('afcat');
  const dsaMinutes = getTodayMinutes('dsa');
  const techMinutes = getTodayMinutes('tech');

  if (afcatMinutes < 240) {
    return {
      subject: 'afcat',
      topicKey: `afcat|${afcatSubject}|${Math.max(afcatIndex, 0)}`,
      title: `${afcatSubject}: ${afcatTopic.name}`,
      meta: `${formatMinutes(afcatMinutes)} AFCAT done today. Push the core exam block first.`,
      next: `Next after this: DSA Day ${curDsa.d}`,
    };
  }
  if (S.dsa[curDsa.d] !== 'done' || dsaMinutes < 60) {
    return {
      subject: 'dsa',
      topicKey: `dsa|${curDsa.d}`,
      title: `DSA Day ${curDsa.d}: ${curDsa.t}`,
      meta: `${formatMinutes(dsaMinutes)} DSA done today. Finish the daily pair.`,
      next: `Next after this: ${techTopic.name}`,
    };
  }
  return {
    subject: 'tech',
    topicKey: `tech|${techCat}|${Math.max(techIndex, 0)}`,
    title: `${techCat.toUpperCase()}: ${techTopic.name}`,
    meta: `${formatMinutes(techMinutes)} React/Web Dev done today. Keep the build streak moving.`,
    next: 'Next after this: AFCAT revision or mock block',
  };
}

function renderCommandCenter() {
  const plan = getRecommendedPlan();
  const focusTitle = document.getElementById('focus-title');
  if (!focusTitle) return;
  focusTitle.textContent = plan.title;
  document.getElementById('focus-meta').textContent = plan.meta;
  document.getElementById('focus-next').textContent = plan.next;
  document.getElementById('focus-start').dataset.subject = plan.subject;
  document.getElementById('focus-start').dataset.topicKey = plan.topicKey;

  const total = getTodayMinutes();
  const pct = Math.min(100, Math.round((total / DAILY_TARGET_MIN) * 100));
  document.getElementById('today-minutes').textContent = formatMinutes(total);
  document.getElementById('daily-fill').style.width = pct + '%';
  document.getElementById('target-split').textContent =
    `AFCAT ${formatMinutes(getTodayMinutes('afcat'))} / DSA ${formatMinutes(getTodayMinutes('dsa'))} / Tech ${formatMinutes(getTodayMinutes('tech'))}`;
}

function refreshTimerTopicDD() {
  const subject = document.getElementById('t-sub')?.value || 'afcat';
  const topic = document.getElementById('t-topic');
  if (!topic) return;
  const opts = getOptionsForSubject(subject);
  topic.innerHTML = opts.map(o => `<option value="${escapeHTML(o.value)}">${escapeHTML(o.label)}</option>`).join('');
  if (S.timer.topicKey && S.timer.subject === subject) topic.value = S.timer.topicKey;
}

function startRecommendedSession() {
  const btn = document.getElementById('focus-start');
  document.getElementById('t-sub').value = btn.dataset.subject || 'afcat';
  refreshTimerTopicDD();
  if (btn.dataset.topicKey) document.getElementById('t-topic').value = btn.dataset.topicKey;
  startTimer();
}

function getTimerElapsed() {
  if (!S.timer.running) return S.timer.elapsed || 0;
  return (S.timer.elapsed || 0) + (Date.now() - (S.timer.startTs || Date.now()));
}

function updateTimerDisplay() {
  const clock = document.getElementById('timer-clock');
  if (!clock) return;
  clock.textContent = formatTimer(getTimerElapsed());
  document.getElementById('timer-topic').textContent = S.timer.topic || 'No session running';
  document.getElementById('timer-start').textContent = S.timer.running ? 'Running' : (S.timer.elapsed ? 'Resume' : 'Start');
  document.getElementById('timer-start').disabled = S.timer.running;
  document.getElementById('timer-pause').disabled = !S.timer.running;
  document.getElementById('timer-finish').disabled = !S.timer.running && !S.timer.elapsed;
}

function startTimer() {
  if (S.timer.running) return;
  const subject = document.getElementById('t-sub').value;
  const select = document.getElementById('t-topic');
  S.timer.subject = subject;
  S.timer.topicKey = select.value;
  S.timer.topic = select.options[select.selectedIndex]?.textContent || select.value;
  S.timer.running = true;
  S.timer.startTs = Date.now();
  save();
  updateTimerDisplay();
}

function pauseTimer() {
  if (!S.timer.running) return;
  S.timer.elapsed = getTimerElapsed();
  S.timer.running = false;
  S.timer.startTs = null;
  save();
  updateTimerDisplay();
}

let tempFinishSess = null;
function finishTimer() {
  const elapsed = getTimerElapsed();
  if (elapsed < 1000) return;
  
  tempFinishSess = {
    subject: S.timer.subject,
    topic: S.timer.topic,
    topicKey: S.timer.topicKey,
    dur: Math.max(1, Math.ceil(elapsed / 60000)),
    status: 'done',
    notes: 'Timer session',
    date: getDateKey(),
    ts: Date.now(),
  };
  
  document.getElementById('summary-modal').classList.add('open');
  document.getElementById('sum-covered').value = '';
  document.getElementById('sum-completed').value = '';
  document.getElementById('sum-targets').value = '';
}

function discardTimer() {
  if (!S.timer.running && !S.timer.elapsed) return;
  S.timer = createDefaultState().timer;
  save();
  refreshTimerTopicDD();
  updateTimerDisplay();
}

// ── TODAY ──────────────────────────────────────────────────────────────────────
function renderToday() {
  const subs = Object.keys(afcatData);
  const idx = new Date().getDay() % subs.length;
  const pair = [subs[idx], subs[(idx+1)%subs.length]];
  const el1 = document.getElementById('td-afcat');
  el1.innerHTML = pair.map((s,i) => {
    const id = `td_afcat_${i}`;
    const done = S.today[id];
    const nextTopic = afcatData[s].find((topic, ti) => S.afcat[`${s}__${ti}`] !== 'done') || afcatData[s][0];
    return `<div class="td-task${done?' done':''}" onclick="toggleToday('${id}')">
      <div class="td-chk">${done?'✓':''}</div><span>${escapeHTML(s)}: ${escapeHTML(nextTopic.name)}</span>
    </div>`;
  }).join('');
  const dsaDone = Object.values(S.dsa).filter(v=>v==='done').length;
  const curDay = dsaData[Math.min(dsaDone, 44)];
  const el2 = document.getElementById('td-tech');
  el2.innerHTML = [
    {id:'td_dsa', label:`DSA Day ${curDay.d}: ${curDay.t.split(':')[0]}`},
    {id:'td_lc', label:'LeetCode daily problem'},
    {id:'td_react', label:'React / Web Dev session'},
  ].map(x => {
    const done = S.today[x.id];
    return `<div class="td-task${done?' done':''}" onclick="toggleToday('${x.id}')">
      <div class="td-chk">${done?'✓':''}</div><span>${escapeHTML(x.label)}</span>
    </div>`;
  }).join('');
}

function toggleToday(id) { S.today[id] = !S.today[id]; save(); renderToday(); }

// ── STATS ──────────────────────────────────────────────────────────────────────
function updateStats() {
  const allA = Object.values(afcatData).flat().length;
  const doneA = Object.entries(S.afcat).filter(([k,v])=>!k.includes('_done')&&v==='done').length;
  document.getElementById('s-afcat').textContent = `${doneA}/${allA}`;
  const weekStart = getWeekStartKey();
  document.getElementById('s-afcat-week').textContent = S.sessions.filter(x => x.subject === 'afcat' && x.date >= weekStart).length;
  const pA = Math.round(doneA/allA*100);
  document.getElementById('pb-afcat').style.width = pA+'%';
  document.getElementById('spb-afcat').textContent = pA+'%';

  const dsaDone = Object.values(S.dsa).filter(v=>v==='done').length;
  document.getElementById('s-dsa').textContent = `Day ${dsaDone}/45`;
  document.getElementById('s-dsa-probs').textContent = dsaDone*2;
  const pD = Math.round(dsaDone/45*100);
  document.getElementById('pb-dsa').style.width = pD+'%';
  document.getElementById('spb-dsa').textContent = `Day ${dsaDone}`;

  const allT = Object.values(techData).flat().length;
  const doneT = Object.entries(S.tech).filter(([k,v])=>!k.includes('_done')&&v==='done').length;
  document.getElementById('s-tech').textContent = `${doneT}/${allT}`;
  document.getElementById('s-tech-sess').textContent = S.sessions.filter(x=>x.subject==='tech').length;
  const pT = Math.round(doneT/allT*100);
  document.getElementById('pb-tech').style.width = pT+'%';
  document.getElementById('spb-tech').textContent = pT+'%';

  const hrs = Math.round(S.sessions.reduce((a,x)=>a+(x.dur||0),0)/60);
  document.getElementById('s-hours').textContent = hrs+'h';
  renderCommandCenter();
}

// ── LOG ────────────────────────────────────────────────────────────────────────
function renderLog() {
  const el = document.getElementById('sess-log');
  if (!el) return;
  if (!S.sessions.length) {
    el.innerHTML = '<div class="empty-state">No sessions logged yet. Hit "+ Log session" to start.</div>';
    return;
  }
  const cols = {afcat:'var(--afcat)',dsa:'var(--dsa)',tech:'var(--tech)'};
  const bg = {afcat:'var(--afcat-d)',dsa:'var(--dsa-d)',tech:'var(--tech-d)'};
  el.innerHTML = [...S.sessions].reverse().slice(0,20).map(x => {
    let summaryHtml = '';
    if (x.notes && x.notes !== 'Timer session') {
      summaryHtml = `<div class="log-desc" style="font-size: 11.5px; color: var(--t2); margin-top: 6px; font-family: var(--sans); line-height:1.4; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px; white-space: pre-wrap;">${escapeHTML(x.notes)}</div>`;
    }
    return `
      <div class="log-row" style="flex-direction: column; align-items: stretch; gap: 4px; padding: 12px 14px;">
        <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
          <div class="log-bar" style="background:${cols[x.subject]||'var(--b2)'}; height: 24px;"></div>
          <div class="log-info" style="min-width:0; flex:1;">
            <div class="log-topic" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(x.topic)}</div>
            <div class="log-meta">${escapeHTML(x.date)} - ${x.dur}min</div>
          </div>
          <div class="log-badge" style="background:${bg[x.subject]||'var(--s3)'};color:${cols[x.subject]||'var(--t2)'}">${x.subject.toUpperCase()}</div>
          <button class="log-edit" onclick="editSession(${x.ts})">edit</button>
          <button class="log-del" onclick="deleteSession(${x.ts})">delete</button>
        </div>
        ${summaryHtml}
      </div>
    `;
  }).join('');
}

function deleteSession(ts) {
  S.sessions = S.sessions.filter(x => x.ts !== ts);
  rebuildProgressFromSessions();
  save();
  renderAfcat(curAfcatSub);
  renderDSA();
  renderTech(curTechCat);
  renderToday();
  updateStats();
  renderLog();
  renderWeek();
}


function editSession(ts) {
  const sess = S.sessions.find(x => x.ts === ts);
  if (!sess) return;
  const dur = prompt('Duration in minutes:', sess.dur);
  if (dur === null) return;
  const parsedDur = parseInt(dur, 10);
  if (!Number.isFinite(parsedDur) || parsedDur < 1) return;
  const notes = prompt('Notes:', sess.notes || '');
  if (notes === null) return;
  sess.dur = parsedDur;
  sess.notes = notes.trim();
  rebuildProgressFromSessions();
  save();
  renderAfcat(curAfcatSub);
  renderDSA();
  renderTech(curTechCat);
  renderToday();
  updateStats();
  renderLog();
  renderWeek();
}

function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'grind-os-' + getDateKey() + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      S = {...createDefaultState(), ...imported};
      S.sessions = Array.isArray(S.sessions) ? S.sessions : [];
      S.manual = S.manual || EMPTY_PROGRESS();
      S.manual.afcat = S.manual.afcat || {};
      S.manual.dsa = S.manual.dsa || {};
      S.manual.tech = S.manual.tech || {};
      rebuildProgressFromSessions();
      save();
      location.reload();
    } catch (err) {
      alert('Could not import that JSON file.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetData() {
  if (!confirm('Reset all tracker data on this browser?')) return;
  localStorage.removeItem(STORAGE_KEY);
  S = createDefaultState();
  save();
  location.reload();
}

// ── MODAL ──────────────────────────────────────────────────────────────────────
function openModal() { document.getElementById('overlay').classList.add('open'); refreshTopicDD(true); }
function closeModal() { document.getElementById('overlay').classList.remove('open'); }

document.getElementById('overlay').onclick = e => { if (e.target.id==='overlay') closeModal(); };
document.getElementById('dsa-modal').onclick = e => { if (e.target.id==='dsa-modal') closeDsaModal(); };
document.getElementById('timetable-modal').onclick = e => { if (e.target.id==='timetable-modal') closeTimetableModal(); };
document.getElementById('summary-modal').onclick = e => { if (e.target.id==='summary-modal') closeSummaryModal(); };

function setStatus(s, btn) {
  mStatus = s;
  document.querySelectorAll('#overlay .status-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
}

function refreshTopicDD(resetAfcatSub = false) {
  const sub = document.getElementById('m-sub').value;
  const afcatSubFg = document.getElementById('m-afcat-sub-fg');
  const sel = document.getElementById('m-topic');
  
  if (sub === 'afcat') {
    if (afcatSubFg) {
      afcatSubFg.style.display = 'block';
      const afcatSub = document.getElementById('m-afcat-sub').value || 'English';
      const topics = afcatData[afcatSub] || [];
      sel.innerHTML = topics.map((t, i) => {
        const val = `afcat|${afcatSub}|${i}`;
        return `<option value="${escapeHTML(val)}">${escapeHTML(t.name)}</option>`;
      }).join('');
    }
  } else {
    if (afcatSubFg) afcatSubFg.style.display = 'none';
    let opts = [];
    if (sub==='dsa') opts = getDsaTopicOptions();
    if (sub==='tech') opts = getTechTopicOptions();
    sel.innerHTML = opts.map(o=>`<option value="${escapeHTML(o.value)}">${escapeHTML(o.label)}</option>`).join('');
  }
}

function saveSession() {
  const selected = document.getElementById('m-topic');
  const selectedText = selected.options[selected.selectedIndex]?.textContent || selected.value;
  const sess = {
    subject: document.getElementById('m-sub').value,
    topic: selectedText,
    topicKey: selected.value,
    dur: parseInt(document.getElementById('m-dur').value)||90,
    status: mStatus,
    notes: document.getElementById('m-notes').value.trim(),
    date: getDateKey(),
    ts: Date.now(),
  };
  S.sessions.push(sess);
  applySessionProgress(sess);
  syncProgress();
  save(); closeModal(); renderAfcat(curAfcatSub); renderDSA(); renderTech(curTechCat); renderToday(); updateStats(); renderLog(); renderWeek();
  document.getElementById('m-notes').value = '';
}

// ── NAV ────────────────────────────────────────────────────────────────────────
function nav(id, el) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.querySelectorAll('.sb-nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
  const titles = {dashboard:'Dashboard',timetable:'Timetable',afcat:'AFCAT Topics',dsa:'DSA · 45 Day Challenge',tech:'React / Web Dev',analytics:'Analytics Dashboard'};
  document.getElementById('page-title').textContent = titles[id]||id;
  if (id==='afcat') renderAfcat(curAfcatSub);
  if (id==='tech') { document.querySelectorAll('#page-tech .sub-tab').forEach(b=>b.className='sub-tab'); document.querySelector('#page-tech .sub-tab').className='sub-tab a-tech'; renderTech(curTechCat); }
  if (id==='analytics') renderAnalytics();
}

// ── PLAY TIMETABLE SLOT LIVE ───────────────────────────────────────────────────
function startTimetableSession(type, name) {
  nav('dashboard', document.querySelectorAll('.sb-nav-item')[0]);
  
  const subEl = document.getElementById('t-sub');
  if (subEl) {
    subEl.value = type;
    refreshTimerTopicDD(true);
  }
  
  S.timer.subject = type;
  S.timer.topic = name;
  S.timer.topicKey = `${type}|custom|${Date.now()}`;
  S.timer.running = true;
  S.timer.startTs = Date.now();
  S.timer.elapsed = 0;
  
  save();
  updateTimerDisplay();
  alert(`Started live tracking session for timetable slot: "${name}"`);
}

// ── SESSION SUMMARY MODAL HANDLERS ──────────────────────────────────────────────
function closeSummaryModal() {
  if (tempFinishSess) {
    S.sessions.push(tempFinishSess);
    applySessionProgress(tempFinishSess);
    syncProgress();
    S.timer = createDefaultState().timer;
    save();
    finalizeFinishUI();
  }
  document.getElementById('summary-modal').classList.remove('open');
}

function saveSessionSummary() {
  if (tempFinishSess) {
    const covered = document.getElementById('sum-covered').value.trim();
    const completed = document.getElementById('sum-completed').value.trim();
    const targets = document.getElementById('sum-targets').value.trim();
    
    let summaryText = '';
    if (covered) summaryText += `Covered: ${covered}\n`;
    if (completed) summaryText += `Completed: ${completed}\n`;
    if (targets) summaryText += `Targets for tomorrow: ${targets}\n`;
    
    tempFinishSess.notes = summaryText.trim() || 'Timer session';
    tempFinishSess.summary = { covered, completed, targets };
    
    S.sessions.push(tempFinishSess);
    applySessionProgress(tempFinishSess);
    syncProgress();
    S.timer = createDefaultState().timer;
    save();
    finalizeFinishUI();
  }
  document.getElementById('summary-modal').classList.remove('open');
}

function finalizeFinishUI() {
  tempFinishSess = null;
  renderAfcat(curAfcatSub);
  renderDSA();
  renderTech(curTechCat);
  renderToday();
  renderCommandCenter();
  updateStats();
  renderLog();
  renderWeek();
  refreshTimerTopicDD();
  updateTimerDisplay();
  if (document.getElementById('page-analytics').classList.contains('active')) {
    renderAnalytics();
  }
}

// ── ANALYTICS RENDERING ────────────────────────────────────────────────────────
function renderAnalytics() {
  renderConsistencyGrid();
  renderDsaChart();
  renderAfcatChart();
}

function renderConsistencyGrid() {
  const grid = document.getElementById('consistency-grid');
  if (!grid) return;
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  let html = `
    <div style="width:100%; text-align:center; margin-bottom:8px; font-weight:600; font-size:13px; font-family:var(--mono); color:var(--afcat)">
      ${monthNames[month]} ${year}
    </div>
    <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap: 6px; width: 100%; max-width: 280px; margin: 0 auto;">
  `;
  
  const wdays = ['S','M','T','W','T','F','S'];
  wdays.forEach(w => {
    html += `<div style="text-align:center; font-size:10px; color:var(--t3); font-weight:bold; padding-bottom:4px;">${w}</div>`;
  });
  
  for (let i = 0; i < firstDayIndex; i++) {
    html += `<div style="aspect-ratio:1; background:transparent;"></div>`;
  }
  
  let activeDays = 0;
  let perfectDays = 0;
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const daySessions = S.sessions.filter(x => x.date === dKey);
    const dayMins = daySessions.reduce((sum, x) => sum + (x.dur || 0), 0);
    
    let lvl = 0;
    if (dayMins >= 720) {
      lvl = 3;
      perfectDays++;
    } else if (dayMins >= 360) {
      lvl = 2;
    } else if (dayMins > 0) {
      lvl = 1;
    }
    
    if (dayMins > 0) activeDays++;
    
    const tooltip = `${dKey}: ${formatMinutes(dayMins)} studied`;
    const isToday = dKey === getDateKey();
    const borderStyle = isToday ? 'border: 1px solid var(--afcat);' : '';
    
    let cellColor = 'rgba(255,255,255,0.06)';
    if (lvl === 1) cellColor = 'rgba(35, 201, 142, 0.25)';
    if (lvl === 2) cellColor = 'rgba(35, 201, 142, 0.55)';
    if (lvl === 3) cellColor = 'var(--tech)';
    
    html += `
      <div class="grid-cell lvl-${lvl}" title="${tooltip}" 
           style="aspect-ratio:1; background:${cellColor}; border-radius:3px; cursor:pointer; position:relative; display:flex; align-items:center; justify-content:center; font-size:9px; font-family:var(--mono); color:rgba(255,255,255,0.4); ${borderStyle}">
        ${d}
      </div>
    `;
  }
  
  html += `</div>`;
  grid.innerHTML = html;
  
  document.getElementById('an-active-days').textContent = `${activeDays}/${daysInMonth}`;
  document.getElementById('an-perfect-days').textContent = perfectDays;
}

function renderDsaChart() {
  const container = document.getElementById('dsa-chart-container');
  if (!container) return;
  
  const easyCount = S.dsaQuestions ? S.dsaQuestions.filter(q => q.complexity === 'easy' && q.status === 'solved').length : 0;
  const mediumCount = S.dsaQuestions ? S.dsaQuestions.filter(q => q.complexity === 'medium' && q.status === 'solved').length : 0;
  const hardCount = S.dsaQuestions ? S.dsaQuestions.filter(q => q.complexity === 'hard' && q.status === 'solved').length : 0;
  const total = easyCount + mediumCount + hardCount;
  
  document.getElementById('an-solved-dsa').textContent = total;
  
  if (total === 0) {
    container.innerHTML = `<div style="font-size:12px; color:var(--t3); font-style:italic;">No questions solved yet. Log some solved questions in DSA page!</div>`;
    return;
  }
  
  const max = Math.max(easyCount, mediumCount, hardCount, 1);
  const scale = 110 / max;
  
  const hEasy = easyCount * scale;
  const hMedium = mediumCount * scale;
  const hHard = hardCount * scale;
  
  const svg = `
    <svg viewBox="0 0 240 160" width="100%" height="100%" style="max-height:180px;">
      <line x1="40" y1="120" x2="220" y2="120" stroke="rgba(255,255,255,0.08)" stroke-width="1"></line>
      <line x1="40" y1="80" x2="220" y2="80" stroke="rgba(255,255,255,0.04)" stroke-width="1"></line>
      <line x1="40" y1="40" x2="220" y2="40" stroke="rgba(255,255,255,0.04)" stroke-width="1"></line>
      
      <rect x="60" y="${120 - hEasy}" width="30" height="${hEasy}" fill="var(--tech)" rx="3" opacity="0.85"></rect>
      <text x="75" y="${120 - hEasy - 6}" font-family="var(--mono)" font-size="10" fill="var(--t2)" text-anchor="middle" font-weight="600">${easyCount}</text>
      
      <rect x="115" y="${120 - hMedium}" width="30" height="${hMedium}" fill="var(--afcat)" rx="3" opacity="0.85"></rect>
      <text x="130" y="${120 - hMedium - 6}" font-family="var(--mono)" font-size="10" fill="var(--t2)" text-anchor="middle" font-weight="600">${mediumCount}</text>
      
      <rect x="170" y="${120 - hHard}" width="30" height="${hHard}" fill="var(--danger)" rx="3" opacity="0.85"></rect>
      <text x="185" y="${120 - hHard - 6}" font-family="var(--mono)" font-size="10" fill="var(--t2)" text-anchor="middle" font-weight="600">${hardCount}</text>
      
      <text x="75" y="138" font-family="var(--sans)" font-size="10" fill="var(--t3)" text-anchor="middle">Easy</text>
      <text x="130" y="138" font-family="var(--sans)" font-size="10" fill="var(--t3)" text-anchor="middle">Med</text>
      <text x="185" y="138" font-family="var(--sans)" font-size="10" fill="var(--t3)" text-anchor="middle">Hard</text>
    </svg>
  `;
  container.innerHTML = svg;
}

function renderAfcatChart() {
  const container = document.getElementById('afcat-chart-container');
  if (!container) return;
  
  const subjects = ['English', 'General Awareness', 'Numerical Ability', 'Reasoning & Military'];
  
  const data = subjects.map(s => {
    const mins = S.sessions
      .filter(x => x.subject === 'afcat' && (x.topicKey || '').split('|')[1] === s)
      .reduce((sum, x) => sum + (x.dur || 0), 0);
    return { name: s, mins: mins };
  });
  
  const totalMins = data.reduce((sum, x) => sum + x.mins, 0);
  
  if (totalMins === 0) {
    container.innerHTML = `<div style="font-size:12px; color:var(--t3); font-style:italic; text-align:center; width:100%;">No AFCAT sessions logged yet. Log some AFCAT study time!</div>`;
    return;
  }
  
  const parsed = data.map(x => ({
    name: x.name,
    mins: x.mins,
    pct: totalMins > 0 ? Math.round((x.mins / totalMins) * 100) : 0
  }));
  
  let html = `<div style="display:flex; flex-direction:column; gap:12px; width:100%; padding: 10px 0;">`;
  const colors = ['var(--tech)', 'var(--afcat)', 'var(--dsa)', '#ff6b6b'];
  
  parsed.forEach((x, i) => {
    html += `
      <div>
        <div style="display:flex; justify-content:space-between; font-size:11.5px; color:var(--t2); margin-bottom:4px;">
          <span>${x.name}</span>
          <span style="font-family:var(--mono); font-weight:600;">${formatMinutes(x.mins)} (${x.pct}%)</span>
        </div>
        <div style="height:6px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
          <div style="height:100%; width:${x.pct}%; background:${colors[i]}; border-radius:999px;"></div>
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  container.innerHTML = html;
  
  const afcatMins = S.sessions.filter(x => x.subject === 'afcat').reduce((sum, x) => sum + (x.dur || 0), 0);
  const dsaMins = S.sessions.filter(x => x.subject === 'dsa').reduce((sum, x) => sum + (x.dur || 0), 0);
  const techMins = S.sessions.filter(x => x.subject === 'tech').reduce((sum, x) => sum + (x.dur || 0), 0);
  const allMins = afcatMins + dsaMins + techMins;
  
  if (allMins > 0) {
    const afcatPct = Math.round((afcatMins / allMins) * 100);
    const dsaPct = Math.round((dsaMins / allMins) * 100);
    const techPct = Math.round((techMins / allMins) * 100);
    document.getElementById('an-focus-ratio').innerHTML = `<span style="font-size:12px; color:var(--t3);">${afcatPct}% A / ${dsaPct}% D / ${techPct}% T</span>`;
  } else {
    document.getElementById('an-focus-ratio').textContent = '0%';
  }
  
  const advisor = document.getElementById('advisor-content');
  if (advisor) {
    let warning = '';
    const overground = parsed.find(x => x.pct > 40);
    const underground = parsed.find(x => x.pct < 10);
    
    if (overground) {
      warning = `⚠️ You are heavily grinding **${overground.name}** (${overground.pct}% of your AFCAT time). Consider shifting focus to other subjects to keep a balanced preparation.`;
    } else if (underground) {
      warning = `💡 Preparation is looking decent, but **${underground.name}** is lagging behind (${underground.pct}% of preparation time). Try scheduling a revision session for it today.`;
    } else {
      warning = `✅ **Excellent study balance!** You are allocating time evenly across all four AFCAT subjects. Keep up this consistency!`;
    }
    
    if (allMins > 0) {
      const dsaRatio = dsaMins / allMins;
      if (dsaRatio < 0.15) {
        warning += `<br><span style="color:var(--dsa);">⚡ Pro-tip: DSA study time is relatively low. Make sure you maintain your daily problem-solving streak!</span>`;
      }
    }
    
    advisor.innerHTML = warning;
  }
}
}
