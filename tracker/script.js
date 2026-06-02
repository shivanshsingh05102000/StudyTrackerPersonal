const EXAM_DATE = new Date('2026-08-09T00:00:00');
const DAILY_TARGET = 720;
const STORAGE_KEY = 'grind_os_personal_v1';

const afcatData = {
  English: ['Error spotting', 'Fill in the blanks', 'Synonyms & antonyms', 'Idioms and phrases', 'Comprehension', 'Cloze test', 'Sentence rearrangement', 'Vocabulary revision'],
  'General Awareness': ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Defence awareness', 'Current affairs', 'Static GK revision'],
  'Numerical Ability': ['Number system', 'Simplification', 'Percentage', 'Profit and loss', 'Ratio and proportion', 'Time and work', 'Time speed distance', 'Data interpretation'],
  Reasoning: ['Verbal reasoning', 'Non-verbal reasoning', 'Series', 'Analogy', 'Classification', 'Coding-decoding', 'Blood relation', 'Venn diagrams'],
};

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

const defaultSlots = {
  class: [
    slot('12:00–1:30 PM', 'afcat', 'English', 'Error spotting', 'AFCAT — Subject 1', 'Deep study, notes, and PYQs'),
    slot('1:30–2:00 PM', 'break', '', '', 'Break', 'Reset before the next block'),
    slot('2:00–3:30 PM', 'afcat', 'General Awareness', 'Current affairs', 'AFCAT — Subject 2', 'Notes + practice questions'),
    slot('4:00–5:00 PM', 'afcat', 'Numerical Ability', 'Simplification', 'AFCAT — Revision', 'Weak-spot drills'),
    slot('5:00–6:30 PM', 'tech', 'Web Dev', 'React practice', 'Internshala / Web Dev', 'Class or tutorial with hands-on notes'),
    slot('7:00–8:30 PM', 'dsa', 'Day 1', 'Instructor release', 'DSA — 45 day challenge', 'Add today’s released problems and solve'),
    slot('9:00–10:30 PM', 'afcat', 'Reasoning', 'Verbal reasoning', 'AFCAT — Subject 3', 'Focused practice set'),
    slot('11:00 PM–12:30 AM', 'afcat', 'General Awareness', 'Static GK revision', 'AFCAT — Subject 4', 'Revision + active recall'),
  ],
  noclass: [
    slot('12:00–1:30 PM', 'afcat', 'English', 'Comprehension', 'AFCAT — English', 'Reading + comprehension drill'),
    slot('2:00–3:30 PM', 'afcat', 'Numerical Ability', 'Data interpretation', 'AFCAT — Quant', 'Timed practice'),
    slot('5:00–6:30 PM', 'dsa', 'Day 1', 'Instructor release', 'DSA — LC Daily', 'Daily problems and pattern notes'),
    slot('7:00–8:30 PM', 'dsa', 'Day 1', 'Revision', 'DSA — Re-solve', 'Re-solve without hints'),
    slot('9:00–10:30 PM', 'afcat', 'Reasoning', 'Non-verbal reasoning', 'AFCAT — Reasoning', 'Practice set'),
    slot('11:00 PM–12:30 AM', 'afcat', 'General Awareness', 'Current affairs', 'AFCAT — GA', 'Current affairs notes'),
  ],
};

function slot(time, domain, subject, topic, name, desc) {
  return { id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random()}`, time, domain, subject, topic, name, desc };
}

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadState() {
  const defaults = { sessions: [], questions: [], englishDays: [], timetable: structuredClone(defaultSlots), mode: 'class', timer: null };
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...defaults, ...stored, timetable: { ...defaults.timetable, ...(stored.timetable || {}) } };
  } catch {
    return defaults;
  }
}

let state = loadState();
let activePage = 'dashboard';
let activeAfcat = 'English';
let timerInterval = null;

const $ = (id) => document.getElementById(id);
const esc = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[ch]));
const mins = (n = 0) => `${Math.floor(n / 60)}h ${n % 60}m`;
const domainLabel = { afcat: 'AFCAT', dsa: 'DSA', english: 'English', tech: 'Tech', break: 'Break' };

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function topicOptions(domain, subject = '') {
  if (domain === 'afcat') return (afcatData[subject] || afcatData.English).map((x) => ({ value: x, label: x }));
  if (domain === 'dsa') return Array.from({ length: 45 }, (_, i) => ({ value: `Day ${i + 1}`, label: `Day ${i + 1}${questionsForDay(i + 1).length ? ` (${questionsForDay(i + 1).length} questions)` : ' · empty slot'}` }));
  if (domain === 'tech') return ['React practice', 'Internshala class', 'Next.js', 'Project build', 'Revision'].map((x) => ({ value: x, label: x }));
  return [{ value: 'Break', label: 'Break' }];
}

function subjectOptions(domain) {
  if (domain === 'afcat') return Object.keys(afcatData).map((x) => ({ value: x, label: x }));
  if (domain === 'dsa') return [{ value: '45-day challenge', label: '45-day challenge' }];
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
    { value: 'afcat', label: 'AFCAT' }, { value: 'dsa', label: 'DSA' }, { value: 'tech', label: 'Tech / React' }, { value: 'break', label: 'Break' },
  ], domain.value || 'afcat');
  refreshSubject();
}

function sessionsOn(date = todayKey()) {
  return state.sessions.filter((s) => s.date === date);
}
function minutesFor(date, domain) {
  return state.sessions.filter((s) => s.date === date && (!domain || s.domain === domain)).reduce((a, s) => a + Number(s.minutes || 0), 0);
}
function questionsForDay(day) {
  return state.questions.filter((q) => Number(q.day) === Number(day));
}
function solvedQuestions() {
  return state.questions.filter((q) => q.status === 'solved');
}
function completedDsaDays() {
  return Array.from({ length: 45 }, (_, i) => i + 1).filter((day) => {
    const qs = questionsForDay(day);
    return qs.length > 0 && qs.every((q) => q.status === 'solved');
  }).length;
}
function afcatDoneCount() {
  return Object.values(afcatData).flat().filter((topic) => state.sessions.some((s) => s.domain === 'afcat' && s.topic === topic && s.status === 'done')).length;
}
function completedEnglishDays() {
  return state.englishDays.length;
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
  $('page-title').textContent = { dashboard: 'Dashboard', timetable: 'Live Timetable', afcat: 'AFCAT Planner', dsa: 'DSA 45 Days', english: 'English 45 Days', analytics: 'Analytics' }[page];
  render();
}

function render() {
  renderChrome(); renderDashboard(); renderTimetable(); renderAfcat(); renderDsa(); renderEnglish(); renderAnalytics(); renderTimer();
}

function renderChrome() {
  $('today-date').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  $('days-left').textContent = Math.max(0, Math.ceil((EXAM_DATE - new Date()) / 86400000));
  const totalTopics = Object.values(afcatData).flat().length;
  const afcatPct = Math.round((afcatDoneCount() / totalTopics) * 100);
  const dsaDone = completedDsaDays();
  const todayMins = minutesFor(todayKey());
  $('side-afcat').textContent = `${afcatPct}%`; $('bar-afcat').style.width = `${afcatPct}%`;
  $('side-dsa').textContent = `${dsaDone}/45`; $('bar-dsa').style.width = `${Math.round((dsaDone / 45) * 100)}%`;
  $('side-today').textContent = mins(todayMins); $('bar-today').style.width = `${Math.min(100, Math.round((todayMins / DAILY_TARGET) * 100))}%`;
}

function renderDashboard() {
  const todaysPlan = state.timetable[state.mode] || [];
  const next = todaysPlan.find((s) => s.domain !== 'break') || todaysPlan[0];
  $('focus-title').textContent = next ? next.name : 'Build today’s timetable';
  $('focus-detail').textContent = next ? `${next.time} · ${domainLabel[next.domain]} · ${next.subject || 'custom'} · ${next.topic || 'open work'}` : 'Add a slot and start tracking.';
  $('stat-afcat').textContent = `${afcatDoneCount()}/${Object.values(afcatData).flat().length}`;
  $('stat-dsa').textContent = `${completedDsaDays()}/45`;
  $('stat-questions').textContent = solvedQuestions().length;
  $('stat-hours').textContent = mins(state.sessions.reduce((a, s) => a + Number(s.minutes || 0), 0));
  const todayMins = minutesFor(todayKey());
  const pct = Math.min(100, Math.round((todayMins / DAILY_TARGET) * 100));
  $('daily-ring').style.setProperty('--pct', `${pct}%`);
  $('daily-percent').textContent = `${pct}%`;
  $('today-total').textContent = mins(todayMins);
  $('today-split').innerHTML = ['afcat', 'dsa', 'tech'].map((d) => `<span>${domainLabel[d]} · ${mins(minutesFor(todayKey(), d))}</span>`).join('');
  $('today-plan').innerHTML = todaysPlan.length ? todaysPlan.map(renderPlanItem).join('') : '<div class="empty">No slots yet. Add your first timetable slot.</div>';
  const recent = [...state.sessions].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 8);
  $('session-log').innerHTML = recent.length ? recent.map(renderSession).join('') : '<div class="empty">No sessions logged yet.</div>';
  renderHeatmap('dashboard-heatmap', 60);
}

function renderPlanItem(s) {
  return `<div class="timeline-item"><div class="time">${esc(s.time)}</div><div><span class="badge ${s.domain}">${domainLabel[s.domain]}</span><h4>${esc(s.name)}</h4><p>${esc(s.desc || '')}</p><p>${esc(s.subject || '')}${s.topic ? ` · ${esc(s.topic)}` : ''}</p></div><div class="button-row"><button class="btn small primary" onclick="startFromSlot('${s.id}')">▶ Start</button><button class="btn small ghost" onclick="openSlot('${s.id}')">Edit</button></div></div>`;
}

function renderSession(s) {
  return `<div class="question session-card"><span class="badge ${s.domain}">${domainLabel[s.domain]}</span><div><h4>${esc(s.topic || s.subject)}</h4><p>${esc(s.date)} · ${mins(Number(s.minutes || 0))} · ${esc(s.summary || 'No summary')}</p>${s.next ? `<p>Next: ${esc(s.next)}</p>` : ''}</div><button class="btn small danger" onclick="deleteSession('${s.id}')">Delete</button></div>`;
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
  document.querySelectorAll('.chip[data-mode]').forEach((b) => b.classList.toggle('active', b.dataset.mode === state.mode));
  $('timetable-list').innerHTML = (state.timetable[state.mode] || []).map(renderPlanItem).join('') || '<div class="empty">No slots in this schema.</div>';
}

function renderAfcat() {
  $('afcat-tabs').innerHTML = Object.keys(afcatData).map((s) => `<button class="chip ${s === activeAfcat ? 'active' : ''}" onclick="selectAfcat('${esc(s)}')">${esc(s)}</button>`).join('');
  $('afcat-topics').innerHTML = afcatData[activeAfcat].map((topic) => {
    const list = state.sessions.filter((s) => s.domain === 'afcat' && s.subject === activeAfcat && s.topic === topic);
    const done = list.filter((s) => s.status === 'done').length;
    return `<article class="topic-card"><div class="topic-meta"><span class="badge afcat">${esc(activeAfcat)}</span><span>${done}/${Math.max(1, list.length)} done</span></div><h4>${esc(topic)}</h4><p>Unlimited sessions supported. Log as many blocks as needed until this topic feels complete.</p><div class="dots">${Array.from({ length: Math.max(3, list.length || 1) }, (_, i) => `<span class="mini-dot ${i < done ? 'done' : ''}"></span>`).join('')}</div><button class="btn small primary" onclick="openSession('afcat','${esc(activeAfcat)}','${esc(topic)}')">Log session</button></article>`;
  }).join('');
}

function renderDsa() {
  const easy = solvedQuestions().filter((q) => q.complexity === 'easy').length;
  const medium = solvedQuestions().filter((q) => q.complexity === 'medium').length;
  const hard = solvedQuestions().filter((q) => q.complexity === 'hard').length;
  $('dsa-progress').textContent = `${completedDsaDays()}/45`;
  $('dsa-difficulty').textContent = `${easy} / ${medium} / ${hard}`;
  $('dsa-today').textContent = solvedQuestions().filter((q) => q.solvedDate === todayKey()).length;
  $('dsa-days').innerHTML = Array.from({ length: 45 }, (_, i) => i + 1).map((day) => {
    const qs = questionsForDay(day);
    return `<article class="dsa-day"><div class="topic-meta"><h4>Day ${day}</h4><button class="btn small ghost" onclick="openQuestion(${day})">+ Question</button></div>${qs.length ? qs.map(renderQuestion).join('') : '<p>Empty slot. Add questions when your instructor releases today’s list.</p>'}</article>`;
  }).join('');
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
    return `<article class="dsa-day ${done ? 'done' : ''}" id="english-day-${item.day}">
      <div class="topic-meta"><h4>Day ${item.day}</h4><span>${done ? '✓ Complete' : `${item.videos.length} video${item.videos.length === 1 ? '' : 's'}`}</span></div>
      <p>${esc(item.title)}</p>
      <div class="video-list">${videos}</div>
      <button class="btn small ${done ? 'success' : 'primary'}" onclick="completeEnglishDay(${item.day})">${done ? 'Mark Incomplete' : 'Mark Day Complete'}</button>
    </article>`;
  }).join('');
}

function renderProgressChart() {
  const el = $('progress-chart');
  if (!el) return;
  const days = Array.from({ length: 60 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (59 - i));
    return todayKey(d);
  });
  const series = [
    { key: 'afcat', label: 'AFCAT', color: 'var(--afcat)', values: days.map((day) => state.sessions.filter((s) => s.domain === 'afcat' && s.status === 'done' && s.date <= day).length) },
    { key: 'dsa', label: 'DSA', color: 'var(--dsa)', values: days.map((day) => solvedQuestions().filter((q) => q.solvedDate && q.solvedDate <= day).length) },
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

function renderQuestion(q) {
  const link = q.link ? `<a class="btn small ghost" href="${esc(q.link)}" target="_blank" rel="noreferrer">LC</a>` : '';
  return `<div class="question"><button class="check" onclick="toggleQuestion('${q.id}')">${q.status === 'solved' ? '✓' : ''}</button><div><strong>${esc(q.title)}</strong><p><span class="diff-${q.complexity}">${esc(q.complexity)}</span> · ${esc(q.notes || 'No notes yet')}</p></div><div class="button-row">${link}<button class="btn small ghost" onclick="editQuestion('${q.id}')">Edit</button></div></div>`;
}

function renderAnalytics() {
  renderProgressChart();
  renderHeatmap('consistency-chart', 30);
  const diff = ['easy', 'medium', 'hard'].map((d) => solvedQuestions().filter((q) => q.complexity === d).length);
  const maxDiff = Math.max(1, ...diff);
  $('dsa-chart').innerHTML = ['Easy', 'Medium', 'Hard'].map((label, i) => `<div class="bar-col"><span style="height:${20 + (diff[i] / maxDiff) * 170}px;background:${i === 0 ? 'var(--dsa)' : i === 1 ? 'var(--plan)' : 'var(--danger)'}"></span><b>${diff[i]}</b><em>${label}</em></div>`).join('');
  const subjects = Object.keys(afcatData).map((sub) => ({ sub, m: state.sessions.filter((s) => s.domain === 'afcat' && s.subject === sub).reduce((a, s) => a + Number(s.minutes || 0), 0) }));
  const total = Math.max(1, subjects.reduce((a, x) => a + x.m, 0));
  $('afcat-chart').innerHTML = `<div class="hbar-wrap">${subjects.map((x) => `<div class="hbar"><label><span>${esc(x.sub)}</span><b>${mins(x.m)} · ${Math.round((x.m / total) * 100)}%</b></label><div><i style="width:${Math.round((x.m / total) * 100)}%"></i></div></div>`).join('')}</div>`;
  const over = subjects.find((x) => x.m / total > .45);
  const under = subjects.find((x) => x.m > 0 && x.m / total < .12) || subjects.find((x) => x.m === 0);
  $('advisor-text').innerHTML = over ? `⚠️ You are over-grinding <b>${esc(over.sub)}</b>. Give it a short rest and schedule ${under ? `<b>${esc(under.sub)}</b>` : 'another subject'} next.` : under ? `💡 <b>${esc(under.sub)}</b> is under-trained. Add a focused session in the next timetable slot.` : '✅ Balance looks healthy. Keep rotating AFCAT subjects, DSA, and Tech.';
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
  state.sessions.push({ id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}`, date: data.date || todayKey(), domain: data.domain, subject: data.subject, topic: data.topic, minutes: Number(data.minutes || 0), status: data.status || 'done', summary: data.summary || '', next: data.next || '', createdAt: new Date().toISOString() });
  save();
}

function openSession(domain = 'afcat', subject = 'English', topic = afcatData.English[0]) {
  $('log-date').value = todayKey(); $('log-minutes').value = 90; $('log-summary').value = ''; $('log-next').value = '';
  $('log-domain').value = domain; $('log-domain').dispatchEvent(new Event('change'));
  $('log-subject').value = subject; $('log-subject').dispatchEvent(new Event('change'));
  $('log-topic').value = topic;
  $('session-modal').showModal();
}

function openSlot(id = '') {
  const item = id ? (state.timetable[state.mode] || []).find((s) => s.id === id) : slot('', 'afcat', 'English', afcatData.English[0], '', '');
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
  const list = state.timetable[state.mode];
  const idx = list.findIndex((s) => s.id === id);
  if (idx >= 0) list[idx] = item; else list.push(item);
  save(); $('slot-modal').close(); render();
}
function startFromSlot(id) {
  const s = (state.timetable[state.mode] || []).find((x) => x.id === id);
  if (!s || s.domain === 'break') return;
  state.timer = { domain: s.domain, subject: s.subject, topic: s.topic, elapsed: 0, startedAt: Date.now(), running: true };
  save(); ensureTimerTick(); setPage('dashboard');
}

function openQuestion(day = 1) {
  $('question-id').value = ''; $('question-day').value = day; $('question-title').value = ''; $('question-notes').value = ''; $('question-link').value = ''; $('question-status').value = 'todo'; $('question-complexity').value = 'easy'; $('question-modal').showModal();
}
function editQuestion(id) {
  const q = state.questions.find((x) => x.id === id); if (!q) return;
  $('question-id').value = q.id; $('question-day').value = q.day; $('question-title').value = q.title; $('question-notes').value = q.notes || ''; $('question-link').value = q.link || ''; $('question-status').value = q.status; $('question-complexity').value = q.complexity; $('question-modal').showModal();
}
function saveQuestion() {
  const id = $('question-id').value;
  const q = { id: id || (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}`), day: Number($('question-day').value), title: $('question-title').value, complexity: $('question-complexity').value, status: $('question-status').value, link: $('question-link').value, notes: $('question-notes').value, solvedDate: $('question-status').value === 'solved' ? todayKey() : '' };
  const idx = state.questions.findIndex((x) => x.id === id);
  if (idx >= 0) state.questions[idx] = { ...state.questions[idx], ...q, solvedDate: q.status === 'solved' ? (state.questions[idx].solvedDate || todayKey()) : '' }; else state.questions.push(q);
  save(); $('question-modal').close(); render();
}
function toggleQuestion(id) {
  const q = state.questions.find((x) => x.id === id); if (!q) return;
  q.status = q.status === 'solved' ? 'todo' : 'solved'; q.solvedDate = q.status === 'solved' ? todayKey() : '';
  save(); render();
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

function deleteSession(id) { state.sessions = state.sessions.filter((s) => s.id !== id); save(); render(); }
function selectAfcat(subject) { activeAfcat = subject; renderAfcat(); }

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `grind-os-${todayKey()}.json`; a.click(); URL.revokeObjectURL(a.href);
}
function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const parsed = JSON.parse(reader.result);
    state = { ...loadState(), ...parsed, timer: state.timer };
    save(); render(); showToast('Data imported');
  };
  reader.readAsText(file);
}

function init() {
  document.querySelectorAll('.nav-item').forEach((b) => b.addEventListener('click', () => setPage(b.dataset.page)));
  document.body.addEventListener('click', (e) => { const jump = e.target.closest('[data-jump]'); if (jump) setPage(jump.dataset.jump); });
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => $(b.dataset.close).close()));
  ['timer', 'log', 'slot'].forEach(wireDomainControls);
  $('quick-log-btn').addEventListener('click', () => openSession()); $('afcat-session-btn').addEventListener('click', () => openSession('afcat', activeAfcat, afcatData[activeAfcat][0]));
  $('add-question-btn').addEventListener('click', () => openQuestion(1)); $('add-slot-btn').addEventListener('click', () => openSlot());
  $('start-suggested-btn').addEventListener('click', () => {
    const s = (state.timetable[state.mode] || []).find((x) => x.domain !== 'break' && !state.sessions.some((session) => session.date === todayKey() && session.domain === x.domain && session.topic === x.topic));
    if (s) startFromSlot(s.id); else $('focus-detail').textContent = "All today's sessions complete 🎯";
  });
  $('timer-start-btn').addEventListener('click', () => startTimerFromControls('timer')); $('timer-pause-btn').addEventListener('click', pauseTimer); $('timer-finish-btn').addEventListener('click', finishTimer); $('timer-discard-btn').addEventListener('click', discardTimer);
  $('session-form').addEventListener('submit', (e) => { e.preventDefault(); addSession({ date: $('log-date').value, domain: $('log-domain').value, subject: $('log-subject').value, topic: $('log-topic').value, minutes: $('log-minutes').value, status: $('log-status').value, summary: $('log-summary').value, next: $('log-next').value }); $('session-modal').close(); render(); });
  $('slot-form').addEventListener('submit', (e) => { e.preventDefault(); saveSlot(); });
  $('question-form').addEventListener('submit', (e) => { e.preventDefault(); saveQuestion(); });
  $('finish-form').addEventListener('submit', (e) => { e.preventDefault(); saveFinishedTimer(); });
  $('delete-slot-btn').addEventListener('click', () => { state.timetable[state.mode] = state.timetable[state.mode].filter((s) => s.id !== $('slot-id').value); save(); $('slot-modal').close(); render(); });
  document.querySelectorAll('.chip[data-mode]').forEach((b) => b.addEventListener('click', () => { state.mode = b.dataset.mode; save(); renderTimetable(); renderDashboard(); }));
  $('export-btn').addEventListener('click', exportData); $('import-btn').addEventListener('click', () => $('import-file').click()); $('import-file').addEventListener('change', (e) => importData(e.target.files[0]));
  $('reset-btn').addEventListener('click', () => { if (confirm('Reset all local tracker data?')) { localStorage.removeItem(STORAGE_KEY); state = loadState(); render(); showToast('Data cleared', 2000); } });
  $('clear-today-btn').addEventListener('click', () => { const n = sessionsOn(todayKey()).length; if (!n || !confirm(`Clear all ${n} sessions logged today?`)) return; state.sessions = state.sessions.filter((s) => s.date !== todayKey()); save(); render(); });
  if (state.timer?.running) ensureTimerTick();
  render();
}

document.addEventListener('DOMContentLoaded', init);
