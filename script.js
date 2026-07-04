const EXAM_DATE = new Date('2026-08-09T00:00:00');
const DAILY_TARGET = 720;
const STORAGE_KEY = 'grind_os_personal_v1';

// Quantitative Aptitude syllabus, sourced from the shared SSC CGL topic
// taxonomy (see seedTopics.js in the MERN backend). Grouped by subject and
// re-tagged with difficulty/session-time so the existing Math page UI
// (grouping, recommended session length, progress tracking) keeps working
// unchanged — only the topic names/grouping actually changed.
const mathTopics = [
  { id: 'q01', title: 'Number System', subject: 'Arithmetic', difficulty: 'easy', sessionMinutes: 5, notes: 'Types of numbers, divisibility rules, remainders' },
  { id: 'q02', title: 'LCM & HCF', subject: 'Arithmetic', difficulty: 'easy', sessionMinutes: 5, notes: 'Prime factorisation, Euclidean algorithm' },
  { id: 'q03', title: 'Surds & Indices', subject: 'Arithmetic', difficulty: 'easy', sessionMinutes: 5, notes: 'Laws of exponents, simplifying surds' },
  { id: 'q04', title: 'Algebraic Identities', subject: 'Arithmetic', difficulty: 'medium', sessionMinutes: 15, notes: 'Standard identities, factorisation, algebraic manipulation' },
  { id: 'q05', title: 'Percentage', subject: 'Commercial Math', difficulty: 'easy', sessionMinutes: 5, notes: 'Percentage change, successive percentage' },
  { id: 'q06', title: 'Profit & Loss', subject: 'Commercial Math', difficulty: 'medium', sessionMinutes: 15, notes: 'CP/SP, discount, marked price, dishonest dealing' },
  { id: 'q07', title: 'Simple & Compound Interest', subject: 'Commercial Math', difficulty: 'medium', sessionMinutes: 15, notes: 'SI/CI formulas, difference between SI and CI' },
  { id: 'q08', title: 'Average', subject: 'Commercial Math', difficulty: 'easy', sessionMinutes: 5, notes: 'Weighted average, average speed' },
  { id: 'q09', title: 'Ratio & Proportion', subject: 'Commercial Math', difficulty: 'medium', sessionMinutes: 15, notes: 'Direct/indirect proportion, combining ratios' },
  { id: 'q10', title: 'Partnership', subject: 'Commercial Math', difficulty: 'medium', sessionMinutes: 15, notes: 'Profit sharing by capital and time invested' },
  { id: 'q11', title: 'Problems on Ages', subject: 'Time & Work', difficulty: 'easy', sessionMinutes: 5, notes: 'Linear equations framed around age ratios' },
  { id: 'q12', title: 'Time & Work', subject: 'Time & Work', difficulty: 'medium', sessionMinutes: 15, notes: 'Work efficiency, combined work, work-wages' },
  { id: 'q13', title: 'Pipes & Cisterns', subject: 'Time & Work', difficulty: 'medium', sessionMinutes: 15, notes: 'Inlet/outlet rates, combined filling/emptying' },
  { id: 'q14', title: 'Mixture & Alligation', subject: 'Time & Work', difficulty: 'hard', sessionMinutes: 30, notes: 'Alligation cross method, successive mixing' },
  { id: 'q15', title: 'Time, Speed & Distance', subject: 'Time & Work', difficulty: 'medium', sessionMinutes: 15, notes: 'Relative speed, trains, boats & streams, races' },
  { id: 'q16', title: 'Mensuration', subject: 'Geometry & Data', difficulty: 'hard', sessionMinutes: 30, notes: '2D/3D shapes — area, perimeter, volume, surface area' },
  { id: 'q17', title: 'Geometry & Coordinate Geometry', subject: 'Geometry & Data', difficulty: 'hard', sessionMinutes: 30, notes: 'Lines, triangles, circles; distance/section formula' },
  { id: 'q18', title: 'Trigonometry & Heights and Distances', subject: 'Geometry & Data', difficulty: 'hard', sessionMinutes: 30, notes: 'Trig ratios, angles of elevation/depression' },
  { id: 'q19', title: 'Data Interpretation', subject: 'Geometry & Data', difficulty: 'medium', sessionMinutes: 15, notes: 'Tables, bar/pie/line graphs, caselets' },
  { id: 'q20', title: 'Statistics & Probability', subject: 'Geometry & Data', difficulty: 'hard', sessionMinutes: 30, notes: 'Mean/median/mode, basic probability — Tier 2 only' },
];

// General Awareness and Computer Knowledge are simple flat checklists (no
// difficulty/session metadata) — see toggleChecklistTopic/renderChecklistPage.
// Each topic needs a stable id so completion state survives a title tweak.
const gkTopics = [
  { id: 'ga01', title: 'History' },
  { id: 'ga02', title: 'Geography' },
  { id: 'ga03', title: 'Polity' },
  { id: 'ga04', title: 'Economy' },
  { id: 'ga05', title: 'Science' },
  { id: 'ga06', title: 'Static GK' },
  { id: 'ga07', title: 'Current Affairs' },
];
const ckTopics = [
  { id: 'ck01', title: 'Hardware & CPU Basics' },
  { id: 'ck02', title: 'Operating Systems & MS Office' },
  { id: 'ck03', title: 'Internet, Email & E-banking' },
  { id: 'ck04', title: 'Networking & Cybersecurity Basics' },
];
const reasoningTopics = ['Verbal Reasoning', 'Non-Verbal Reasoning', 'Series', 'Analogy', 'Coding-Decoding', 'Blood Relations', 'Venn Diagrams'];

const englishDays = [
  { day: 1, title: "Strategy & Course Intro", videos: [
    { title: "English complete strategy for beginners||ssc cgl strategy", search: "Aman Vashist English complete strategy beginners ssc cgl" },
    { title: "Free online course of English||aman vashist sir free course", search: "Aman Vashist free online course English complete" }
  ]},
  { day: 2, title: "Grammar Basics — Part 1 & 2", videos: [
    { title: "Basics of English grammar Part 1", search: "Aman Vashist Basics English grammar competitive exams part 1" },
    { title: "Basics of English grammar Part 2", search: "Aman Vashist Basics English grammar competitive exams part 2" }
  ]},
  { day: 3, title: "Grammar Basics — Part 3 & 4", videos: [
    { title: "Basics of English grammar Part 3", search: "Aman Vashist Basics English grammar competitive exams part 3" },
    { title: "Basics of English grammar Part 4", search: "Aman Vashist Basics English grammar competitive exams part 4" }
  ]},
  { day: 4, title: "Pronoun — Concepts Part 1 & 2", videos: [
    { title: "Pronoun reflexive pronoun", search: "Aman Vashist Pronoun reflexive pronoun English competitive exams" },
    { title: "Distributive & Demonstrative Pronoun", search: "Aman Vashist distributive demonstrative pronoun English competitive" }
  ]},
  { day: 5, title: "Pronoun — Who vs Whom, Clauses", videos: [
    { title: "Who vs whom clauses vs phrases gerund vs participle", search: "Aman Vashist who vs whom clauses phrases gerund participle" },
    { title: "Relative pronoun which vs that", search: "Aman Vashist relative pronoun which vs that who vs whom" }
  ]},
  { day: 6, title: "Pronoun — Relative & Complete Part 1", videos: [
    { title: "Relative pronoun that vs what", search: "Aman Vashist relative pronoun that vs what complete pronoun" },
    { title: "Complete pronoun concepts Part 1", search: "Aman Vashist complete pronoun concepts English competitive exams 1" }
  ]},
  { day: 7, title: "Pronoun — Complete Part 2", videos: [
    { title: "Complete pronoun concepts Part 2", search: "Aman Vashist complete pronoun concepts English competitive exams 2" }
  ]},
  { day: 8, title: "Pronoun Practice", videos: [
    { title: "Pronoun Practice Error Spotting Part 1", search: "Aman Vashist pronoun practice chapterwise error SSC NDA CDS 1" },
    { title: "Pronoun Practice Error Spotting Part 2", search: "Aman Vashist pronoun practice chapterwise error SSC NDA CDS 2" },
    { title: "Pronoun Practice Error Spotting Part 3", search: "Aman Vashist pronoun practice chapterwise error SSC NDA CDS 3" }
  ]},
  { day: 9, title: "Adjective — Concepts Part 1 & 2", videos: [
    { title: "Complete adjective concepts Part 1", search: "Aman Vashist complete adjective concepts English competitive exams 1" },
    { title: "Complete adjective concepts Part 2", search: "Aman Vashist complete adjective concepts English competitive exams 2" }
  ]},
  { day: 10, title: "Adjective — Concepts Part 3 + Practice", videos: [
    { title: "Complete adjective concepts Part 3", search: "Aman Vashist complete adjective concepts English competitive exams 3" },
    { title: "Adjective Practice Part 1", search: "Aman Vashist adjective practice chapterwise error SSC NDA CDS 1" },
    { title: "Adjective Practice Part 2", search: "Aman Vashist adjective practice chapterwise error SSC NDA CDS 2" }
  ]},
  { day: 11, title: "Noun — Concepts + Practice", videos: [
    { title: "Complete noun Part 1", search: "Aman Vashist noun complete chapter English competitive exams 1" },
    { title: "Complete noun Part 2", search: "Aman Vashist noun complete chapter English competitive exams 2" },
    { title: "Noun Practice Part 1", search: "Aman Vashist noun practice chapterwise error SSC NDA CDS 1" },
    { title: "Noun Practice Part 2", search: "Aman Vashist noun practice chapterwise error SSC NDA CDS 2" }
  ]},
  { day: 12, title: "Verb — Concepts Part 1 & 2", videos: [
    { title: "Complete verb Part 1", search: "Aman Vashist verb complete chapter English competitive exams 1" },
    { title: "Complete verb Part 2", search: "Aman Vashist verb complete chapter English competitive exams 2" }
  ]},
  { day: 13, title: "Verb — Concepts Part 3 + Practice", videos: [
    { title: "Complete verb Part 3", search: "Aman Vashist verb complete chapter English competitive exams 3" },
    { title: "Verb Practice Part 1", search: "Aman Vashist verb practice chapterwise error SSC NDA CDS 1" },
    { title: "Verb Practice Part 2", search: "Aman Vashist verb practice chapterwise error SSC NDA CDS 2" }
  ]},
  { day: 14, title: "Subject-Verb Agreement", videos: [
    { title: "Subject Verb Agreement Part 1", search: "Aman Vashist subject verb agreement English competitive exams 1" },
    { title: "Subject Verb Agreement Part 2", search: "Aman Vashist subject verb agreement English competitive exams 2" },
    { title: "SVA Practice", search: "Aman Vashist subject verb agreement practice chapterwise error SSC" }
  ]},
  { day: 15, title: "Adverb — Concepts + Practice", videos: [
    { title: "Adverb complete Part 1", search: "Aman Vashist adverb complete grammar English competitive exams 1" },
    { title: "Adverb complete Part 2", search: "Aman Vashist adverb complete grammar English competitive exams 2" },
    { title: "Adverb Practice Part 1", search: "Aman Vashist adverb practice chapterwise error SSC NDA CDS 1" },
    { title: "Adverb Practice Part 2", search: "Aman Vashist adverb practice chapterwise error SSC NDA CDS 2" }
  ]},
  { day: 16, title: "Tense — Concepts", videos: [
    { title: "Tense complete Part 1", search: "Aman Vashist tense complete grammar English competitive exams 1" },
    { title: "Tense complete Part 2", search: "Aman Vashist tense complete grammar English competitive exams 2" }
  ]},
  { day: 17, title: "Tense Practice", videos: [
    { title: "Tense Practice Part 1", search: "Aman Vashist tense practice chapterwise error SSC NDA CDS 1" },
    { title: "Tense Practice Part 2", search: "Aman Vashist tense practice chapterwise error SSC NDA CDS 2" }
  ]},
  { day: 18, title: "Conjunction — Concepts + Practice", videos: [
    { title: "Conjunction complete Part 1", search: "Aman Vashist conjunction complete grammar English competitive exams 1" },
    { title: "Conjunction complete Part 2", search: "Aman Vashist conjunction complete grammar English competitive exams 2" },
    { title: "Conjunction Practice Part 1", search: "Aman Vashist conjunction practice chapterwise error SSC NDA CDS 1" },
    { title: "Conjunction Practice Part 2", search: "Aman Vashist conjunction practice chapterwise error SSC NDA CDS 2" }
  ]},
  { day: 19, title: "Articles — Concept + Practice", videos: [
    { title: "Articles complete a an the", search: "Aman Vashist article complete a an the grammar English competitive" },
    { title: "Article Practice", search: "Aman Vashist article practice chapterwise error SSC NDA CDS" }
  ]},
  { day: 20, title: "Preposition — Concepts + Practice", videos: [
    { title: "Preposition complete Part 1", search: "Aman Vashist preposition complete fix prepositions English competitive 1" },
    { title: "Preposition complete Part 2", search: "Aman Vashist preposition complete fix prepositions English competitive 2" },
    { title: "Preposition Practice Part 1", search: "Aman Vashist preposition practice chapterwise error SSC NDA CDS 1" },
    { title: "Preposition Practice Part 2", search: "Aman Vashist preposition practice chapterwise error SSC NDA CDS 2" }
  ]},
  { day: 21, title: "Advance Verb — Concepts + Practice", videos: [
    { title: "Advance verb Part 1", search: "Aman Vashist advance verb English SSC competitive exams 1" },
    { title: "Advance verb Part 2", search: "Aman Vashist advance verb English SSC competitive exams 2" },
    { title: "Advance Verb Practice Part 1", search: "Aman Vashist advance verb practice chapterwise error SSC NDA CDS 1" },
    { title: "Advance Verb Practice Part 2", search: "Aman Vashist advance verb practice chapterwise error SSC NDA CDS 2" }
  ]},
  { day: 22, title: "Conditionals + Voice", videos: [
    { title: "Conditionals", search: "Aman Vashist conditionals English SSC competitive exams" },
    { title: "Voice Part 1 (3hr)", search: "Aman Vashist voice English SSC competitive exams active passive 1" },
    { title: "Voice Part 2", search: "Aman Vashist voice English SSC competitive exams active passive 2" }
  ]},
  { day: 23, title: "Narration Part 1", videos: [
    { title: "Narration Part 1", search: "Aman Vashist narration English SSC competitive exams part 1" },
    { title: "Narration Part 2", search: "Aman Vashist narration English SSC competitive exams part 2" },
    { title: "Narration Part 3", search: "Aman Vashist narration English SSC competitive exams part 3" }
  ]},
  { day: 24, title: "Narration Part 2 + Superfluous", videos: [
    { title: "Narration Part 4", search: "Aman Vashist narration English SSC competitive exams part 4" },
    { title: "Narration Part 5", search: "Aman Vashist narration English SSC competitive exams part 5" },
    { title: "Narration Part 6", search: "Aman Vashist narration English SSC competitive exams part 6" },
    { title: "Superfluous Practice", search: "Aman Vashist superfluous practice chapterwise error SSC NDA CDS" }
  ]},
  { day: 25, title: "Parajumbles (PQRS)", videos: [
    { title: "Parajumbles strategy Part 1", search: "Aman Vashist PQRS parajumbles strategy SSC CGL 1" },
    { title: "Parajumbles strategy Part 2", search: "Aman Vashist PQRS parajumbles strategy SSC CGL 2" }
  ]},
  { day: 26, title: "Cloze Test", videos: [
    { title: "Cloze Test strategy Part 1", search: "Aman Vashist cloze test strategy SSC CGL 2024 1" },
    { title: "Cloze Test strategy Part 2", search: "Aman Vashist cloze test strategy SSC CGL 2024 2" }
  ]},
  { day: 27, title: "Miscellaneous Error Practice 1–3", videos: [
    { title: "Misc Error Lec 1", search: "Aman Vashist miscellaneous error practice lec 1 SSC CGL" },
    { title: "Misc Error Lec 2", search: "Aman Vashist miscellaneous error practice lec 2 SSC CGL" },
    { title: "Misc Error Lec 3", search: "Aman Vashist miscellaneous error practice lec 3 SSC CGL" }
  ]},
  { day: 28, title: "Miscellaneous Error Practice 4–7", videos: [
    { title: "Misc Error Lec 4", search: "Aman Vashist miscellaneous error practice lec 4 SSC CGL" },
    { title: "Misc Error Lec 5", search: "Aman Vashist miscellaneous error practice lec 5 SSC CGL" },
    { title: "Misc Error Lec 6", search: "Aman Vashist miscellaneous error practice lec 6 SSC CGL" },
    { title: "Misc Error Lec 7", search: "Aman Vashist miscellaneous error practice lec 7 SSC CGL" }
  ]},
  { day: 29, title: "Miscellaneous Error Practice 8–11", videos: [
    { title: "Misc Error Lec 8", search: "Aman Vashist miscellaneous error practice lec 8 SSC CGL" },
    { title: "Misc Error Lec 9", search: "Aman Vashist miscellaneous error practice lec 9 SSC CGL" },
    { title: "Misc Error Lec 10", search: "Aman Vashist miscellaneous error practice lec 10 SSC CGL" },
    { title: "Misc Error Lec 11", search: "Aman Vashist miscellaneous error practice lec 11 SSC CGL" }
  ]},
  { day: 30, title: "Miscellaneous Error Practice 12–15", videos: [
    { title: "Misc Error Lec 12", search: "Aman Vashist miscellaneous error practice lec 12 SSC CGL" },
    { title: "Misc Error Lec 13", search: "Aman Vashist miscellaneous error practice lec 13 SSC CGL" },
    { title: "Misc Error Lec 14", search: "Aman Vashist miscellaneous error practice lec 14 SSC CGL" },
    { title: "Misc Error Lec 15", search: "Aman Vashist miscellaneous error practice lec 15 SSC CGL" }
  ]},
  { day: 31, title: "Miscellaneous Error Practice 16–19", videos: [
    { title: "Misc Error Lec 16", search: "Aman Vashist miscellaneous error practice lec 16 SSC CGL" },
    { title: "Misc Error Lec 17", search: "Aman Vashist miscellaneous error practice lec 17 SSC CGL" },
    { title: "Misc Error Lec 18", search: "Aman Vashist miscellaneous error practice lec 18 SSC CGL" },
    { title: "Misc Error Lec 19", search: "Aman Vashist miscellaneous error practice lec 19 SSC CGL" }
  ]},
  { day: 32, title: "Miscellaneous Error Practice 20–22", videos: [
    { title: "Misc Error Lec 20", search: "Aman Vashist miscellaneous error practice lec 20 SSC CGL" },
    { title: "Misc Error Lec 21", search: "Aman Vashist miscellaneous error practice lec 21 SSC CGL" },
    { title: "Misc Error Lec 22", search: "Aman Vashist miscellaneous error practice lec 22 SSC CGL" }
  ]},
  { day: 33, title: "Miscellaneous Error Practice 23–25", videos: [
    { title: "Misc Error Lec 23", search: "Aman Vashist miscellaneous error practice lec 23 SSC CGL" },
    { title: "Misc Error Lec 24", search: "Aman Vashist miscellaneous error practice lec 24 SSC CGL" },
    { title: "Misc Error Lec 25", search: "Aman Vashist miscellaneous error practice lec 25 SSC CGL" }
  ]},
  { day: 34, title: "Miscellaneous Error Practice 26–28", videos: [
    { title: "Misc Error Lec 26", search: "Aman Vashist miscellaneous error practice lec 26 SSC CGL" },
    { title: "Misc Error Lec 27", search: "Aman Vashist miscellaneous error practice lec 27 SSC CGL" },
    { title: "Misc Error Lec 28", search: "Aman Vashist miscellaneous error practice lec 28 SSC CGL" }
  ]},
  { day: 35, title: "Miscellaneous Error Practice 29–31", videos: [
    { title: "Misc Error Lec 29", search: "Aman Vashist miscellaneous error practice lec 29 SSC CGL" },
    { title: "Misc Error Lec 30", search: "Aman Vashist miscellaneous error practice lec 30 SSC CGL" },
    { title: "Misc Error Lec 31", search: "Aman Vashist miscellaneous error practice lec 31 SSC CGL" }
  ]},
  { day: 36, title: "Revision — Grammar Foundation", videos: [
    { title: "Grammar Basics revision", search: "Aman Vashist basics English grammar revision competitive exams" },
    { title: "Pronoun full revision", search: "Aman Vashist complete pronoun revision SSC English" }
  ]},
  { day: 37, title: "Revision — Noun & Adjective", videos: [
    { title: "Noun revision", search: "Aman Vashist noun complete revision SSC English competitive" },
    { title: "Adjective revision", search: "Aman Vashist adjective complete revision SSC English competitive" }
  ]},
  { day: 38, title: "Revision — Verb & SVA", videos: [
    { title: "Verb revision", search: "Aman Vashist verb complete revision SSC English competitive" },
    { title: "Subject Verb Agreement revision", search: "Aman Vashist subject verb agreement revision SSC English" }
  ]},
  { day: 39, title: "Revision — Tense & Adverb", videos: [
    { title: "Tense revision", search: "Aman Vashist tense complete revision SSC English competitive" },
    { title: "Adverb revision", search: "Aman Vashist adverb complete revision SSC English competitive" }
  ]},
  { day: 40, title: "Revision — Articles, Preposition, Conjunction", videos: [
    { title: "Articles revision", search: "Aman Vashist articles a an the revision SSC English" },
    { title: "Preposition revision", search: "Aman Vashist preposition revision SSC English competitive" },
    { title: "Conjunction revision", search: "Aman Vashist conjunction revision SSC English competitive" }
  ]},
  { day: 41, title: "Revision — Voice & Narration", videos: [
    { title: "Voice revision", search: "Aman Vashist voice active passive revision SSC English" },
    { title: "Narration revision", search: "Aman Vashist narration revision SSC English competitive" }
  ]},
  { day: 42, title: "Revision — Parajumbles & Cloze Test", videos: [
    { title: "Parajumbles revision", search: "Aman Vashist PQRS parajumbles revision SSC CGL" },
    { title: "Cloze Test revision", search: "Aman Vashist cloze test revision SSC CGL 2024" }
  ]},
  { day: 43, title: "Full Mock Error Practice — Set 1", videos: [
    { title: "Misc Error full practice set 1", search: "Aman Vashist miscellaneous error practice SSC CGL full set 1" },
    { title: "Misc Error full practice set 2", search: "Aman Vashist miscellaneous error practice SSC CGL full set 2" }
  ]},
  { day: 44, title: "Full Mock Error Practice — Set 2", videos: [
    { title: "Misc Error full practice set 3", search: "Aman Vashist miscellaneous error practice SSC CGL full set 3" },
    { title: "Misc Error full practice set 4", search: "Aman Vashist miscellaneous error practice SSC CGL full set 4" }
  ]},
  { day: 45, title: "Final Revision — All Topics", videos: [
    { title: "English complete strategy final revision", search: "Aman Vashist English complete strategy final revision AFCAT SSC" },
    { title: "Full English mock test", search: "Aman Vashist full English mock test SSC CGL AFCAT" }
  ]}
];

// Timetable starts empty by design — the user builds their own schedule
// via the "+ Add slot" UI on the Timetable page (see openSlot/saveSlot below).
// Nothing here is pre-seeded.
const defaultSlots = [];

function slot(time, domain, subject, topic, name, desc) {
  return { id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random()}`, time, domain, subject, topic, name, desc };
}

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadState() {
  const defaults = { sessions: [], englishDays: [], mathSessions: [], mathDone: [], checklistDone: [], timetable: structuredClone(defaultSlots), timer: null };
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return normalizeState({ ...defaults, ...stored });
  } catch {
    return defaults;
  }
}

function normalizeState(nextState) {
  nextState.sessions = Array.isArray(nextState.sessions) ? nextState.sessions : [];
  nextState.englishDays = Array.isArray(nextState.englishDays) ? nextState.englishDays : [];
  nextState.mathSessions = Array.isArray(nextState.mathSessions) ? nextState.mathSessions : [];
  nextState.mathDone = Array.isArray(nextState.mathDone) ? nextState.mathDone.map((item) => typeof item === 'string' ? { topicId: item, completedDate: todayKey() } : item).filter((item) => item?.topicId) : [];
  nextState.checklistDone = Array.isArray(nextState.checklistDone) ? nextState.checklistDone.filter((item) => item?.domain && item?.topicId) : [];
  if (nextState.timetable && !Array.isArray(nextState.timetable) && Array.isArray(nextState.timetable.class)) nextState.timetable = nextState.timetable.class;
  if (!Array.isArray(nextState.timetable)) nextState.timetable = structuredClone(defaultSlots);
  delete nextState.mode;
  return nextState;
}

let state = loadState();
let activePage = 'dashboard';
let timerInterval = null;

const $ = (id) => document.getElementById(id);
const esc = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[ch]));
const mins = (n = 0) => `${Math.floor(n / 60)}h ${n % 60}m`;
const domainLabel = { english: 'English', math: 'Quant', gk: 'GK', reasoning: 'Reasoning', ck: 'Comp. Knowledge', tech: 'Tech', break: 'Break' };

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function topicOptions(domain, subject = '') {
  if (domain === 'english') return englishDays.map((x) => ({ value: `Day ${x.day} — ${x.title}`, label: `Day ${x.day} — ${x.title}` }));
  if (domain === 'math') return mathTopics.map((x) => ({ value: x.title, label: x.title }));
  if (domain === 'gk') return gkTopics.map((x) => ({ value: x.title, label: x.title }));
  if (domain === 'reasoning') return reasoningTopics.map((x) => ({ value: x, label: x }));
  if (domain === 'ck') return ckTopics.map((x) => ({ value: x.title, label: x.title }));
  if (domain === 'tech') return ['React practice', 'Internshala class', 'Next.js', 'Project build', 'Revision'].map((x) => ({ value: x, label: x }));
  return [{ value: 'Break', label: 'Break' }];
}

function subjectOptions(domain) {
  if (domain === 'english') return [{ value: 'English', label: 'English' }];
  if (domain === 'math') return [...new Set(mathTopics.map((x) => x.subject))].map((x) => ({ value: x, label: x }));
  if (domain === 'gk') return [{ value: 'General Awareness', label: 'General Awareness' }];
  if (domain === 'reasoning') return [{ value: 'Reasoning', label: 'Reasoning & Military Aptitude' }];
  if (domain === 'ck') return [{ value: 'Computer Knowledge', label: 'Computer Knowledge' }];
  if (domain === 'tech') return [{ value: 'Web Dev', label: 'Web Dev' }, { value: 'React', label: 'React' }];
  return [{ value: 'Break', label: 'Break' }];
}

function fillSelect(select, options, selected) {
  select.innerHTML = options.map((o) => `<option value="${esc(o.value)}" ${o.value === selected ? 'selected' : ''}>${esc(o.label)}</option>`).join('');
}

function wireDomainControls(prefix) {
  const domain = $(`${prefix}-domain`);
  const subject = $(`${prefix}-subject`);
  const topic = $(`${prefix}-topic`);
  const refreshSubject = () => {
    fillSelect(subject, subjectOptions(domain.value), subject.value);
    if (!subject.value) subject.value = subject.options[0]?.value || '';
    refreshTopic();
  };
  const refreshTopic = () => fillSelect(topic, topicOptions(domain.value, subject.value), topic.value);
  domain.addEventListener('change', refreshSubject);
  subject.addEventListener('change', refreshTopic);
  fillSelect(domain, [
    { value: 'english', label: 'English' }, { value: 'math', label: 'Quant' }, { value: 'gk', label: 'GK' }, { value: 'reasoning', label: 'Reasoning' }, { value: 'ck', label: 'Comp. Knowledge' }, { value: 'tech', label: 'Tech / React' }, { value: 'break', label: 'Break' },
  ], domain.value || 'english');
  refreshSubject();
}

function sessionsOn(date = todayKey()) {
  return state.sessions.filter((s) => s.date === date);
}
function minutesFor(date, domain) {
  return state.sessions.filter((s) => s.date === date && (!domain || s.domain === domain)).reduce((a, s) => a + Number(s.minutes || 0), 0);
}
function completedEnglishDays() {
  return state.englishDays.length;
}
function completedMathTopics() {
  return state.mathDone.length;
}
function isMathDone(topicId) {
  return state.mathDone.some((item) => item.topicId === topicId);
}
function sessionsForMathTopic(topic) {
  return state.mathSessions.filter((s) => s.topicId === topic.id || s.topic === topic.title);
}
function youtubeSearchUrl(search) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(search)}`;
}
function showToast(message, duration = 2500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => { toast.classList.remove('visible'); setTimeout(() => toast.remove(), 300); }, duration);
}

function setPage(page) {
  activePage = page;
  document.querySelectorAll('.page').forEach((p) => p.classList.toggle('active', p.id === `page-${page}`));
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.page === page));
  $('page-title').textContent = { dashboard: 'Dashboard', timetable: 'Live Timetable', english: 'English 45 Days', math: 'Quantitative Aptitude', gk: 'General Awareness', reasoning: 'Reasoning & Military Aptitude', ck: 'Computer Knowledge', analytics: 'Analytics' }[page];
  render();
}

function render() {
  renderChrome(); renderDashboard(); renderTimetable(); renderEnglish(); renderMath(); renderGk(); renderCk(); renderReasoning(); renderAnalytics(); renderTimer();
}

function renderChrome() {
  $('today-date').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  $('days-left').textContent = Math.max(0, Math.ceil((EXAM_DATE - new Date()) / 86400000));
  const englishPct = Math.round((completedEnglishDays() / englishDays.length) * 100);
  const mathPct = Math.round((completedMathTopics() / mathTopics.length) * 100);
  const todayMins = minutesFor(todayKey());
  $('side-english').textContent = `${completedEnglishDays()}/${englishDays.length}`; $('bar-english').style.width = `${englishPct}%`;
  $('side-math').textContent = `${completedMathTopics()}/${mathTopics.length}`; $('bar-math').style.width = `${mathPct}%`;
  $('side-today').textContent = mins(todayMins); $('bar-today').style.width = `${Math.min(100, Math.round((todayMins / DAILY_TARGET) * 100))}%`;
}

function renderDashboard() {
  const todaysPlan = state.timetable || [];
  const next = todaysPlan.find((slotItem) => slotItem.domain !== 'break' && !state.sessions.some((session) => session.date === todayKey() && session.domain === slotItem.domain && session.topic === slotItem.topic)) || todaysPlan.find((slotItem) => slotItem.domain !== 'break') || todaysPlan[0];
  $('focus-title').textContent = next ? next.name : 'Build today’s timetable';
  $('focus-detail').textContent = next ? `${next.time} · ${domainLabel[next.domain]} · ${next.subject || 'custom'} · ${next.topic || 'open work'}` : 'Add a slot and start tracking.';
  $('stat-english').textContent = `${completedEnglishDays()}/${englishDays.length}`;
  $('stat-math').textContent = `${completedMathTopics()}/${mathTopics.length}`;
  $('stat-hours').textContent = mins(state.sessions.reduce((a, s) => a + Number(s.minutes || 0), 0));
  const todayMins = minutesFor(todayKey());
  const pct = Math.min(100, Math.round((todayMins / DAILY_TARGET) * 100));
  $('daily-ring').style.setProperty('--pct', `${pct}%`);
  $('daily-percent').textContent = `${pct}%`;
  $('today-total').textContent = mins(todayMins);
  $('today-split').innerHTML = ['english', 'math', 'gk', 'reasoning', 'ck', 'tech'].map((d) => `<span>${domainLabel[d]} · ${mins(minutesFor(todayKey(), d))}</span>`).join('');
  $('today-plan').innerHTML = todaysPlan.length ? todaysPlan.map(renderPlanItem).join('') : '<div class="empty">No slots yet. Add your first timetable slot.</div>';
  const recent = [...state.sessions].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 5);
  $('session-log').innerHTML = recent.length ? recent.map(renderSession).join('') : '<div class="empty">No sessions logged yet.</div>';
  renderHeatmap('dashboard-heatmap', 60);
}

function renderPlanItem(s) {
  return `<div class="timeline-item"><div class="time">${esc(s.time)}</div><div><span class="badge ${s.domain}">${domainLabel[s.domain]}</span><h4>${esc(s.name)}</h4><p>${esc(s.desc || '')}</p><p>${esc(s.subject || '')}${s.topic ? ` · ${esc(s.topic)}` : ''}</p></div><div class="button-row"><button class="btn small primary" onclick="startFromSlot('${s.id}')">▶ Start</button><button class="btn small ghost" onclick="openSlot('${s.id}')">Edit</button></div></div>`;
}

function renderSession(s) {
  return `<div class="entry-row session-card"><span class="badge ${s.domain}">${domainLabel[s.domain] || s.domain}</span><div><h4>${esc(s.topic || s.subject)}</h4><p>${esc(s.date)} · ${mins(Number(s.minutes || 0))} · ${esc(s.summary || 'No summary')}</p>${s.next ? `<p>Next: ${esc(s.next)}</p>` : ''}</div></div>`;
}

function renderHeatmap(id, days) {
  const cells = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = todayKey(d); const m = minutesFor(key); const ratio = m / DAILY_TARGET;
    const cls = ratio >= 1 ? 'done' : ratio >= .5 ? 'mid' : ratio > 0 ? 'low' : 'zero';
    cells.push(`<div class="day-cell ${cls} ${key === todayKey() ? 'today' : ''}" title="${key}: ${mins(m)}"></div>`);
  }
  $(id).innerHTML = cells.join('');
}

function renderTimetable() {
  $('timetable-list').innerHTML = (state.timetable || []).map(renderPlanItem).join('') || '<div class="empty">No slots yet.</div>';
}


function renderEnglish() {
  const completed = new Set(state.englishDays.map((d) => Number(d.day)));
  const todayDone = state.englishDays.filter((d) => d.completedDate === todayKey()).length;
  $('english-progress').textContent = `${completed.size}/45`;
  $('english-videos').textContent = completed.size;
  $('english-today').textContent = todayDone;
  const next = englishDays.find((d) => !completed.has(d.day));
  const nextBox = $('english-next');
  if (next) {
    nextBox.classList.add('visible');
    nextBox.textContent = `Next up: Day ${next.day} — ${next.title}`;
  } else {
    nextBox.classList.add('visible');
    nextBox.textContent = 'English challenge complete 🎯 Time for revision.';
  }
  $('english-days').innerHTML = englishDays.map((item) => {
    const done = completed.has(item.day);
    const videos = item.videos.map((video) => `<a class="video-link" href="${youtubeSearchUrl(video.search)}" target="_blank" rel="noreferrer">▶ ${esc(video.title)}</a>`).join('');
    return `<article class="day-card ${done ? 'done' : ''}" id="english-day-${item.day}">
      <div class="topic-meta"><h4>Day ${item.day}</h4><span>${done ? '✓ Complete' : `${item.videos.length} video${item.videos.length === 1 ? '' : 's'}`}</span></div>
      <p>${esc(item.title)}</p>
      <div class="video-list">${videos}</div>
      <button class="btn small ${done ? 'success' : 'primary'}" onclick="completeEnglishDay(${item.day})">${done ? 'Mark Incomplete' : 'Mark Day Complete'}</button>
    </article>`;
  }).join('');
}

function renderMath() {
  const done = new Set(state.mathDone.map((item) => item.topicId));
  $('math-progress').textContent = `${done.size}/${mathTopics.length}`;
  $('math-sessions').textContent = state.mathSessions.length;
  $('math-today').textContent = state.mathSessions.filter((s) => s.date === todayKey()).length;
  const groups = [...new Set(mathTopics.map((topic) => topic.subject))];
  $('math-groups').innerHTML = groups.map((group) => {
    const cards = mathTopics.filter((topic) => topic.subject === group).map((topic) => {
      const sessions = sessionsForMathTopic(topic);
      const last = sessions.map((session) => session.date).sort().at(-1) || 'Never';
      const complete = done.has(topic.id);
      return `<article class="topic-card ${complete ? 'done' : ''}">
        <div class="topic-meta"><span class="badge math">${esc(group)}</span><span class="diff-${topic.difficulty}">${esc(topic.difficulty)}</span></div>
        <h4>${esc(topic.title)}</h4>
        <p>${esc(topic.notes)}</p>
        <p class="muted">Recommended session: ${topic.sessionMinutes} min · Sessions logged: ${sessions.length} · Last studied: ${esc(last)}</p>
        <div class="button-row"><button class="btn small primary" onclick="openSession('math','${esc(topic.subject)}','${esc(topic.title)}',${topic.sessionMinutes})">Log session</button><button class="btn small ${complete ? 'success' : 'ghost'}" onclick="toggleMathDone('${topic.id}')">${complete ? 'Complete ✓' : 'Mark complete ✓'}</button></div>
      </article>`;
    }).join('');
    return `<div class="math-group"><div class="section-head compact-head"><h3>${esc(group)}</h3><span>${doneCountForMathSubject(group)}/${mathTopics.filter((topic) => topic.subject === group).length} complete</span></div><div class="topic-grid">${cards}</div></div>`;
  }).join('');
}

// GK and Computer Knowledge share the same "flat checklist" shape, so one
// renderer handles both — add a new checklist page by calling this with a
// new domain/topics/element-id set, no new render logic needed.
function renderChecklistPage(domain, topics, progressId, gridId) {
  const doneIds = new Set(state.checklistDone.filter((item) => item.domain === domain).map((item) => item.topicId));
  $(progressId).textContent = `${doneIds.size}/${topics.length}`;
  $(gridId).innerHTML = topics.map((topic) => {
    const done = doneIds.has(topic.id);
    const subject = subjectOptions(domain)[0]?.value || '';
    return `<article class="topic-card ${done ? 'done' : ''}">
      <h4>${esc(topic.title)}</h4>
      <div class="button-row"><button class="btn small primary" onclick="openSession('${domain}','${esc(subject)}','${esc(topic.title)}',60)">Log session</button><button class="btn small ${done ? 'success' : 'ghost'}" onclick="toggleChecklistTopic('${domain}','${topic.id}')">${done ? 'Complete ✓' : 'Mark complete ✓'}</button></div>
    </article>`;
  }).join('');
}
function renderGk() { renderChecklistPage('gk', gkTopics, 'gk-progress', 'gk-grid'); }
function renderCk() { renderChecklistPage('ck', ckTopics, 'ck-progress', 'ck-grid'); }
function renderReasoning() {}

function doneCountForMathSubject(subject) {
  return mathTopics.filter((topic) => topic.subject === subject && isMathDone(topic.id)).length;
}


function renderProgressChart() {
  const el = $('progress-chart');
  if (!el) return;
  const days = Array.from({ length: 60 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (59 - i));
    return todayKey(d);
  });
  const series = [
    { key: 'math', label: 'Math', color: 'var(--math)', values: days.map((day) => state.mathDone.filter((item) => item.completedDate && item.completedDate <= day).length) },
    { key: 'english', label: 'English', color: '#f472b6', values: days.map((day) => state.englishDays.filter((d) => d.completedDate && d.completedDate <= day).length) },
    { key: 'tech', label: 'Tech', color: 'var(--tech)', values: days.map((day) => state.sessions.filter((s) => s.domain === 'tech' && s.status === 'done' && s.date <= day).length) },
  ];
  const width = 820, height = 230, pad = { top: 18, right: 24, bottom: 34, left: 42 };
  const maxValue = Math.max(1, ...series.flatMap((s) => s.values));
  const x = (idx) => pad.left + (idx / (days.length - 1)) * (width - pad.left - pad.right);
  const y = (value) => height - pad.bottom - (value / maxValue) * (height - pad.top - pad.bottom);
  const grid = [0, .25, .5, .75, 1].map((ratio) => {
    const value = Math.round(maxValue * ratio);
    const yy = y(value);
    return `<line class="progress-grid" x1="${pad.left}" y1="${yy}" x2="${width - pad.right}" y2="${yy}"></line><text class="progress-label" x="8" y="${yy + 4}">${value}</text>`;
  }).join('');
  const paths = series.map((line) => {
    const d = line.values.map((value, idx) => `${idx ? 'L' : 'M'} ${x(idx).toFixed(1)} ${y(value).toFixed(1)}`).join(' ');
    const dots = line.values.map((value, idx) => `<circle cx="${x(idx).toFixed(1)}" cy="${y(value).toFixed(1)}" r="3" fill="${line.color}" opacity=".86"><title>${line.label} · ${days[idx]} · ${value}</title></circle>`).join('');
    return `<path d="${d}" fill="none" stroke="${line.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path>${dots}`;
  }).join('');
  const labels = days.map((day, idx) => idx % 10 === 0 || idx === days.length - 1 ? `<text class="progress-label" x="${x(idx)}" y="${height - 10}" text-anchor="middle">${day.slice(5)}</text>` : '').join('');
  const legend = `<div class="progress-legend">${series.map((line) => `<span><i style="background:${line.color}"></i>${line.label}</span>`).join('')}</div>`;
  el.innerHTML = `${legend}<svg class="progress-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Overall progress line chart">
    ${grid}<line class="progress-axis" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"></line><line class="progress-axis" x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}"></line>${paths}${labels}
  </svg>`;
}

function renderAnalytics() {
  renderProgressChart();
  renderHeatmap('consistency-chart', 30);
  renderMathChart();
  renderDailySplitChart();
  const mathToday = minutesFor(todayKey(), 'math');
  const englishToday = minutesFor(todayKey(), 'english');
  $('advisor-text').innerHTML = mathToday < 30 ? '💡 Math is under target today. Add a 30-minute topic drill next.' : englishToday < 45 ? '💡 English is under target today. Add a focused grammar or reading block.' : '✅ On track. Your Math and English base is covered for today.';
}

function renderMathChart() {
  const groups = [...new Set(mathTopics.map((topic) => topic.subject))];
  $('math-chart').innerHTML = `<div class="hbar-wrap">${groups.map((group) => {
    const total = mathTopics.filter((topic) => topic.subject === group).length;
    const done = doneCountForMathSubject(group);
    return `<div class="hbar"><label><span>${esc(group)}</span><b>${done}/${total} topics</b></label><div><i style="width:${Math.round((done / total) * 100)}%;background:var(--math)"></i></div></div>`;
  }).join('')}</div>`;
}

function renderDailySplitChart() {
  const targets = { english: 90, math: 60, gk: 90, reasoning: 60, ck: 30, tech: 90 };
  $('daily-split-chart').innerHTML = `<div class="hbar-wrap">${Object.entries(targets).map(([domain, target]) => {
    const actual = minutesFor(todayKey(), domain);
    return `<div class="hbar"><label><span>${domainLabel[domain]}</span><b>${mins(actual)} / ${mins(target)}</b></label><div><i style="width:${Math.min(100, Math.round((actual / target) * 100))}%;background:var(--${domain === 'english' ? 'english' : domain})"></i></div></div>`;
  }).join('')}</div>`;
}

function renderTimer() {
  const t = state.timer;
  $('timer-pause-btn').textContent = t?.running ? 'Pause' : 'Resume';
  if (!t) { $('timer-name').textContent = 'No session running'; $('timer-clock').textContent = '00:00:00'; return; }
  const elapsed = t.elapsed + (t.running ? Date.now() - t.startedAt : 0);
  $('timer-name').textContent = `${domainLabel[t.domain]} · ${t.subject} · ${t.topic}`;
  const seconds = Math.floor(elapsed / 1000);
  $('timer-clock').textContent = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((n) => String(n).padStart(2, '0')).join(':');
}

function startTimerFromControls(prefix = 'timer') {
  state.timer = { domain: $(`${prefix}-domain`).value, subject: $(`${prefix}-subject`).value, topic: $(`${prefix}-topic`).value, elapsed: 0, startedAt: Date.now(), running: true };
  save(); ensureTimerTick(); render();
}
function ensureTimerTick() {
  clearInterval(timerInterval);
  timerInterval = setInterval(renderTimer, 1000);
}
function pauseTimer() {
  if (!state.timer) return;
  if (state.timer.running) { state.timer.elapsed += Date.now() - state.timer.startedAt; state.timer.running = false; } else { state.timer.startedAt = Date.now(); state.timer.running = true; }
  save(); render();
}
function finishTimer() {
  if (!state.timer) return;
  const elapsed = state.timer.elapsed + (state.timer.running ? Date.now() - state.timer.startedAt : 0);
  $('finish-meta').textContent = `${domainLabel[state.timer.domain]} · ${state.timer.subject} · ${state.timer.topic} · ${mins(Math.max(1, Math.round(elapsed / 60000)))}`;
  $('finish-modal').showModal();
}
function saveFinishedTimer() {
  const elapsed = state.timer.elapsed + (state.timer.running ? Date.now() - state.timer.startedAt : 0);
  addSession({ ...state.timer, minutes: Math.max(1, Math.round(elapsed / 60000)), summary: $('finish-summary').value, next: $('finish-next').value, status: 'done' });
  state.timer = null; $('finish-summary').value = ''; $('finish-next').value = ''; $('finish-modal').close(); save(); render();
}
function discardTimer() { state.timer = null; save(); render(); }

function addSession(data) {
  const session = { id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}`, date: data.date || todayKey(), domain: data.domain, subject: data.subject, topic: data.topic, minutes: Number(data.minutes || 0), status: data.status || 'done', summary: data.summary || '', next: data.next || '', createdAt: new Date().toISOString() };
  state.sessions.push(session);
  if (session.domain === 'math') {
    const topic = mathTopics.find((item) => item.title === session.topic);
    state.mathSessions.push({ id: session.id, topicId: topic?.id || '', date: session.date, minutes: session.minutes, status: session.status, summary: session.summary, subject: session.subject, topic: session.topic });
  }
  save();
}

function openSession(domain = 'english', subject = 'English', topic = 'English 45-day roadmap', minutes = 90) {
  $('log-date').value = todayKey(); $('log-minutes').value = minutes; $('log-summary').value = ''; $('log-next').value = '';
  $('log-domain').value = domain; $('log-domain').dispatchEvent(new Event('change'));
  $('log-subject').value = subject; $('log-subject').dispatchEvent(new Event('change'));
  $('log-topic').value = topic;
  $('session-modal').showModal();
}

function openSlot(id = '') {
  const item = id ? (state.timetable || []).find((s) => s.id === id) : slot('', 'english', 'English', 'English 45-day roadmap', '', '');
  $('slot-title').textContent = id ? 'Edit slot' : 'Add slot'; $('slot-id').value = id || '';
  $('slot-time').value = item.time; $('slot-name').value = item.name; $('slot-desc').value = item.desc;
  $('slot-domain').value = item.domain; $('slot-domain').dispatchEvent(new Event('change'));
  $('slot-subject').value = item.subject; $('slot-subject').dispatchEvent(new Event('change'));
  $('slot-topic').value = item.topic; $('delete-slot-btn').style.display = id ? '' : 'none';
  $('slot-modal').showModal();
}
function saveSlot() {
  const id = $('slot-id').value;
  const item = { id: id || (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}`), time: $('slot-time').value, domain: $('slot-domain').value, subject: $('slot-subject').value, topic: $('slot-topic').value, name: $('slot-name').value, desc: $('slot-desc').value };
  const list = state.timetable;
  const idx = list.findIndex((s) => s.id === id);
  if (idx >= 0) list[idx] = item; else list.push(item);
  save(); $('slot-modal').close(); render();
}
function startFromSlot(id) {
  const s = (state.timetable || []).find((x) => x.id === id);
  if (!s || s.domain === 'break') return;
  state.timer = { domain: s.domain, subject: s.subject, topic: s.topic, elapsed: 0, startedAt: Date.now(), running: true };
  save(); ensureTimerTick(); setPage('dashboard');
}

function completeEnglishDay(day) {
  const existing = state.englishDays.find((item) => Number(item.day) === Number(day));
  if (existing) {
    state.englishDays = state.englishDays.filter((item) => Number(item.day) !== Number(day));
    save(); render(); showToast(`Day ${day} marked incomplete`);
    return;
  }
  state.englishDays.push({ day: Number(day), completedDate: todayKey() });
  save(); render();
  const next = englishDays.find((item) => !state.englishDays.some((done) => Number(done.day) === item.day));
  if (next) {
    showToast(`Next up: Day ${next.day} — ${next.title}`);
    setTimeout(() => {
      const card = $(`english-day-${next.day}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('highlight');
        setTimeout(() => card.classList.remove('highlight'), 1800);
      }
    }, 80);
  } else {
    showToast(`English 45-day challenge complete 🎯`);
  }
}

function toggleMathDone(topicId) {
  if (isMathDone(topicId)) {
    state.mathDone = state.mathDone.filter((item) => item.topicId !== topicId);
  } else {
    state.mathDone.push({ topicId, completedDate: todayKey() });
  }
  save(); render();
}

function toggleChecklistTopic(domain, topicId) {
  const isDone = state.checklistDone.some((item) => item.domain === domain && item.topicId === topicId);
  if (isDone) {
    state.checklistDone = state.checklistDone.filter((item) => !(item.domain === domain && item.topicId === topicId));
  } else {
    state.checklistDone.push({ domain, topicId, completedDate: todayKey() });
  }
  save(); render();
}


function deleteSession(id) { state.sessions = state.sessions.filter((s) => s.id !== id); state.mathSessions = state.mathSessions.filter((s) => s.id !== id); save(); render(); }

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `grind-os-${todayKey()}.json`; a.click(); URL.revokeObjectURL(a.href);
}
function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const parsed = JSON.parse(reader.result);
    state = normalizeState({ ...loadState(), ...parsed, timer: state.timer });
    save(); render(); showToast('Data imported');
  };
  reader.readAsText(file);
}

function init() {
  document.querySelectorAll('.nav-item').forEach((b) => b.addEventListener('click', () => setPage(b.dataset.page)));
  document.body.addEventListener('click', (e) => { const jump = e.target.closest('[data-jump]'); if (jump) setPage(jump.dataset.jump); });
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => $(b.dataset.close).close()));
  ['timer', 'log', 'slot'].forEach(wireDomainControls);
  $('add-slot-btn').addEventListener('click', () => openSlot());
  $('start-suggested-btn').addEventListener('click', () => {
    const s = (state.timetable || []).find((x) => x.domain !== 'break' && !state.sessions.some((session) => session.date === todayKey() && session.domain === x.domain && session.topic === x.topic));
    if (s) startFromSlot(s.id); else $('focus-detail').textContent = "All today's sessions complete 🎯";
  });
  $('timer-start-btn').addEventListener('click', () => startTimerFromControls('timer')); $('timer-pause-btn').addEventListener('click', pauseTimer); $('timer-finish-btn').addEventListener('click', finishTimer); $('timer-discard-btn').addEventListener('click', discardTimer);
  $('session-form').addEventListener('submit', (e) => { e.preventDefault(); addSession({ date: $('log-date').value, domain: $('log-domain').value, subject: $('log-subject').value, topic: $('log-topic').value, minutes: $('log-minutes').value, status: $('log-status').value, summary: $('log-summary').value, next: $('log-next').value }); $('session-modal').close(); render(); });
  $('slot-form').addEventListener('submit', (e) => { e.preventDefault(); saveSlot(); });
  $('finish-form').addEventListener('submit', (e) => { e.preventDefault(); saveFinishedTimer(); });
  $('delete-slot-btn').addEventListener('click', () => { state.timetable = state.timetable.filter((s) => s.id !== $('slot-id').value); save(); $('slot-modal').close(); render(); });
  $('export-btn').addEventListener('click', exportData); $('import-btn').addEventListener('click', () => $('import-file').click()); $('import-file').addEventListener('change', (e) => importData(e.target.files[0]));
  $('reset-btn').addEventListener('click', () => { if (confirm('Reset all local tracker data?')) { localStorage.removeItem(STORAGE_KEY); state = loadState(); render(); showToast('Data cleared', 2000); } });
  $('clear-today-btn').addEventListener('click', () => { const n = sessionsOn(todayKey()).length; if (!n || !confirm(`Clear all ${n} sessions logged today?`)) return; state.sessions = state.sessions.filter((s) => s.date !== todayKey()); state.mathSessions = state.mathSessions.filter((s) => s.date !== todayKey()); save(); render(); });
  if (state.timer?.running) ensureTimerTick();
  render();
}

document.addEventListener('DOMContentLoaded', init);
