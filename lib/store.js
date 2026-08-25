const fs = require("fs");
const os = require("os");
const path = require("path");
const { buildInitialState } = require("./seed");

const ROOT_DIR = path.join(__dirname, "..");
const DATA_DIR = process.env.STUDY_TRACKER_DATA_DIR
  ? path.resolve(process.env.STUDY_TRACKER_DATA_DIR)
  : process.env.VERCEL
    ? path.join(os.tmpdir(), "studytracker")
    : path.join(ROOT_DIR, "data");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const STATE_PATH = path.join(DATA_DIR, "state.json");
const TMP_PATH = path.join(DATA_DIR, "state.json.tmp");
const SEED_PATH = path.join(ROOT_DIR, "data", "seed-schedule.json");

function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function fileTimestamp(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, "-");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJsonAtomic(file, value) {
  fs.writeFileSync(TMP_PATH, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(TMP_PATH, file);
}

function listBackupFiles() {
  ensureDirs();
  return fs.readdirSync(BACKUP_DIR)
    .filter((name) => /^state-.+\.json$/.test(name))
    .sort()
    .reverse();
}

function rotateBackups() {
  const files = listBackupFiles();
  files.slice(30).forEach((name) => {
    fs.unlinkSync(path.join(BACKUP_DIR, name));
  });
}

function backupCurrentState() {
  if (!fs.existsSync(STATE_PATH)) return null;
  const backupName = `state-${fileTimestamp()}.json`;
  const backupPath = path.join(BACKUP_DIR, backupName);
  fs.copyFileSync(STATE_PATH, backupPath);
  rotateBackups();
  return backupName;
}

function restoreNewestBackup() {
  const [newest] = listBackupFiles();
  if (!newest) return false;
  fs.copyFileSync(path.join(BACKUP_DIR, newest), STATE_PATH);
  console.error(`Restored state from backup ${newest}.`);
  return true;
}

function ensureState() {
  ensureDirs();
  if (!fs.existsSync(STATE_PATH)) {
    const state = buildInitialState(SEED_PATH, new Date());
    writeJsonAtomic(STATE_PATH, state);
  }
}

function loadState() {
  ensureState();
  try {
    return readJson(STATE_PATH);
  } catch (error) {
    const corruptPath = path.join(DATA_DIR, `state.json.corrupt-${fileTimestamp()}`);
    fs.renameSync(STATE_PATH, corruptPath);
    console.error(`State file is corrupt. Renamed to ${corruptPath}.`);
    if (!restoreNewestBackup()) {
      console.error("No usable backup was found. Re-seeding from data/seed-schedule.json.");
      const state = buildInitialState(SEED_PATH, new Date());
      writeJsonAtomic(STATE_PATH, state);
    }
    return readJson(STATE_PATH);
  }
}

function saveState(state) {
  ensureDirs();
  const next = state;
  next.updatedAt = new Date().toISOString();
  backupCurrentState();
  writeJsonAtomic(STATE_PATH, next);
  rotateBackups();
  return next;
}

function listBackups() {
  return listBackupFiles().map((name) => {
    const fullPath = path.join(BACKUP_DIR, name);
    const stat = fs.statSync(fullPath);
    return { filename: name, bytes: stat.size, createdAt: stat.mtime.toISOString() };
  });
}

function restoreBackup(filename) {
  if (!/^state-.+\.json$/.test(filename)) throw new Error("Invalid backup filename.");
  const source = path.join(BACKUP_DIR, filename);
  const resolved = path.resolve(source);
  if (!resolved.startsWith(path.resolve(BACKUP_DIR))) throw new Error("Invalid backup path.");
  if (!fs.existsSync(source)) throw new Error("Backup file was not found.");
  backupCurrentState();
  fs.copyFileSync(source, STATE_PATH);
  return loadState();
}

function resetAll() {
  const state = buildInitialState(SEED_PATH, new Date());
  saveState(state);
  return state;
}

module.exports = {
  BACKUP_DIR,
  DATA_DIR,
  STATE_PATH,
  ensureState,
  listBackups,
  loadState,
  resetAll,
  restoreBackup,
  saveState
};
