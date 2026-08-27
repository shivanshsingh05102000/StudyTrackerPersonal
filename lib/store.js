const fs = require("fs");
const path = require("path");
const { buildInitialState } = require("./seed");
const { computeTopicStatus, recomputeAllDayEstimates } = require("./scheduler");

const ROOT_DIR = path.join(__dirname, "..");
const DATA_DIR = process.env.STUDY_TRACKER_DATA_DIR
  ? path.resolve(process.env.STUDY_TRACKER_DATA_DIR)
  : path.join(ROOT_DIR, "data");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const STATE_PATH = path.join(DATA_DIR, "state.json");
const TMP_PATH = path.join(DATA_DIR, "state.json.tmp");
const SEED_PATH = path.join(ROOT_DIR, "data", "seed-schedule.json");

const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const BLOB_ACCESS = "private";
const BLOB_STATE_PATH = process.env.STUDY_TRACKER_BLOB_STATE_PATH || "studytracker/state.json";
const BLOB_BACKUP_PREFIX = process.env.STUDY_TRACKER_BLOB_BACKUP_PREFIX || "studytracker/backups/";
const DEFAULT_CREDENTIALS = {
  adminPassword: "admin123",
  learnerPassword: "learner123"
};
const DEFAULT_MINUTES_PER_RESOURCE = {
  video: 45,
  pdf: 25,
  mcq: 20,
  notes: 15
};

function normalizeStatus(value) {
  return value === "done" ? "done" : "pending";
}

function normalizeTopicResources(resources = {}) {
  const normalized = {};
  Object.entries(resources || {}).forEach(([key, value]) => {
    normalized[key] = normalizeStatus(value);
  });
  if (!Object.prototype.hasOwnProperty.call(normalized, "notes")) normalized.notes = "pending";
  return normalized;
}

function normalizeState(state) {
  const next = state;
  next.config = next.config || {};
  next.config.credentials = {
    ...DEFAULT_CREDENTIALS,
    ...(next.config.credentials || {})
  };
  next.config.minutesPerResource = {
    ...DEFAULT_MINUTES_PER_RESOURCE,
    ...(next.config.minutesPerResource || {})
  };
  Object.values(next.topics || {}).forEach((topic) => {
    topic.resources = normalizeTopicResources(topic.resources);
    topic.resourceCompletedAt = topic.resourceCompletedAt || {};
    Object.keys(topic.resourceCompletedAt).forEach((key) => {
      if (topic.resources[key] !== "done") delete topic.resourceCompletedAt[key];
    });
    topic.status = computeTopicStatus(topic);
  });
  recomputeAllDayEstimates(next);
  return next;
}

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

function rotateFileBackups() {
  const files = listBackupFiles();
  files.slice(30).forEach((name) => {
    fs.unlinkSync(path.join(BACKUP_DIR, name));
  });
}

function backupCurrentFileState() {
  if (!fs.existsSync(STATE_PATH)) return null;
  const backupName = `state-${fileTimestamp()}.json`;
  const backupPath = path.join(BACKUP_DIR, backupName);
  fs.copyFileSync(STATE_PATH, backupPath);
  rotateFileBackups();
  return backupName;
}

function restoreNewestFileBackup() {
  const [newest] = listBackupFiles();
  if (!newest) return false;
  fs.copyFileSync(path.join(BACKUP_DIR, newest), STATE_PATH);
  console.error(`Restored state from backup ${newest}.`);
  return true;
}

function ensureFileState() {
  ensureDirs();
  if (!fs.existsSync(STATE_PATH)) {
    const state = buildInitialState(SEED_PATH, new Date());
    writeJsonAtomic(STATE_PATH, state);
  }
}

function loadFileState() {
  ensureFileState();
  try {
    return normalizeState(readJson(STATE_PATH));
  } catch (error) {
    const corruptPath = path.join(DATA_DIR, `state.json.corrupt-${fileTimestamp()}`);
    fs.renameSync(STATE_PATH, corruptPath);
    console.error(`State file is corrupt. Renamed to ${corruptPath}.`);
    if (!restoreNewestFileBackup()) {
      console.error("No usable backup was found. Re-seeding from data/seed-schedule.json.");
      const state = buildInitialState(SEED_PATH, new Date());
      writeJsonAtomic(STATE_PATH, state);
    }
    return normalizeState(readJson(STATE_PATH));
  }
}

function saveFileState(state) {
  ensureDirs();
  const next = state;
  next.updatedAt = new Date().toISOString();
  backupCurrentFileState();
  writeJsonAtomic(STATE_PATH, next);
  rotateFileBackups();
  return next;
}

function listFileBackups() {
  return listBackupFiles().map((name) => {
    const fullPath = path.join(BACKUP_DIR, name);
    const stat = fs.statSync(fullPath);
    return { filename: name, bytes: stat.size, createdAt: stat.mtime.toISOString() };
  });
}

function restoreFileBackup(filename) {
  if (!/^state-.+\.json$/.test(filename)) throw new Error("Invalid backup filename.");
  const source = path.join(BACKUP_DIR, filename);
  const resolved = path.resolve(source);
  if (!resolved.startsWith(path.resolve(BACKUP_DIR))) throw new Error("Invalid backup path.");
  if (!fs.existsSync(source)) throw new Error("Backup file was not found.");
  backupCurrentFileState();
  fs.copyFileSync(source, STATE_PATH);
  return loadFileState();
}

function blobSdk() {
  return require("@vercel/blob");
}

async function streamToText(stream) {
  if (!stream) return "";
  if (typeof Response !== "undefined") return new Response(stream).text();
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function getBlobText(pathname) {
  const { get } = blobSdk();
  const result = await get(pathname, { access: BLOB_ACCESS, useCache: false });
  if (!result) return null;
  return streamToText(result.stream);
}

async function putBlobJson(pathname, value) {
  const { put } = blobSdk();
  return put(pathname, `${JSON.stringify(value, null, 2)}\n`, {
    access: BLOB_ACCESS,
    allowOverwrite: true,
    contentType: "application/json"
  });
}

async function deleteBlob(pathname) {
  const { del } = blobSdk();
  await del(pathname);
}

async function listAllBlobs(prefix) {
  const { list } = blobSdk();
  const blobs = [];
  let cursor;
  let hasMore = true;
  while (hasMore) {
    const page = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.cursor;
    hasMore = page.hasMore;
  }
  return blobs;
}

async function rotateBlobBackups() {
  const backups = await listAllBlobs(BLOB_BACKUP_PREFIX);
  backups
    .filter((blob) => /^state-.+\.json$/.test(path.basename(blob.pathname)))
    .sort((a, b) => b.pathname.localeCompare(a.pathname))
    .slice(30)
    .forEach((blob) => {
      deleteBlob(blob.pathname).catch((error) => {
        console.error(`Could not delete old blob backup ${blob.pathname}: ${error.message}`);
      });
    });
}

async function backupCurrentBlobState() {
  const text = await getBlobText(BLOB_STATE_PATH);
  if (!text) return null;
  const backupName = `state-${fileTimestamp()}.json`;
  await putBlobJson(`${BLOB_BACKUP_PREFIX}${backupName}`, JSON.parse(text));
  await rotateBlobBackups();
  return backupName;
}

async function restoreNewestBlobBackup() {
  const [newest] = (await listAllBlobs(BLOB_BACKUP_PREFIX))
    .filter((blob) => /^state-.+\.json$/.test(path.basename(blob.pathname)))
    .sort((a, b) => b.pathname.localeCompare(a.pathname));
  if (!newest) return false;
  const text = await getBlobText(newest.pathname);
  if (!text) return false;
  await putBlobJson(BLOB_STATE_PATH, JSON.parse(text));
  console.error(`Restored state from blob backup ${path.basename(newest.pathname)}.`);
  return true;
}

async function ensureBlobState() {
  const text = await getBlobText(BLOB_STATE_PATH);
  if (!text) {
    const state = buildInitialState(SEED_PATH, new Date());
    await putBlobJson(BLOB_STATE_PATH, state);
  }
}

async function loadBlobState() {
  await ensureBlobState();
  try {
    const text = await getBlobText(BLOB_STATE_PATH);
    return normalizeState(JSON.parse(text));
  } catch (error) {
    const corruptText = await getBlobText(BLOB_STATE_PATH);
    if (corruptText) {
      await putBlobJson(`studytracker/corrupt/state-${fileTimestamp()}.json`, { raw: corruptText });
    }
    console.error(`Blob state is corrupt: ${error.message}`);
    if (!await restoreNewestBlobBackup()) {
      console.error("No usable blob backup was found. Re-seeding from data/seed-schedule.json.");
      const state = buildInitialState(SEED_PATH, new Date());
      await putBlobJson(BLOB_STATE_PATH, state);
    }
    const text = await getBlobText(BLOB_STATE_PATH);
    return normalizeState(JSON.parse(text));
  }
}

async function saveBlobState(state) {
  const next = state;
  next.updatedAt = new Date().toISOString();
  await backupCurrentBlobState();
  await putBlobJson(BLOB_STATE_PATH, next);
  await rotateBlobBackups();
  return next;
}

async function listBlobBackups() {
  const backups = await listAllBlobs(BLOB_BACKUP_PREFIX);
  return backups
    .filter((blob) => /^state-.+\.json$/.test(path.basename(blob.pathname)))
    .sort((a, b) => b.pathname.localeCompare(a.pathname))
    .map((blob) => ({
      filename: path.basename(blob.pathname),
      bytes: blob.size,
      createdAt: blob.uploadedAt.toISOString()
    }));
}

async function restoreBlobBackup(filename) {
  if (!/^state-.+\.json$/.test(filename)) throw new Error("Invalid backup filename.");
  const pathname = `${BLOB_BACKUP_PREFIX}${filename}`;
  const text = await getBlobText(pathname);
  if (!text) throw new Error("Backup file was not found.");
  await backupCurrentBlobState();
  await putBlobJson(BLOB_STATE_PATH, JSON.parse(text));
  return loadBlobState();
}

async function ensureState() {
  if (USE_BLOB) return ensureBlobState();
  ensureFileState();
}

async function loadState() {
  if (USE_BLOB) return loadBlobState();
  return loadFileState();
}

async function saveState(state) {
  if (USE_BLOB) return saveBlobState(state);
  return saveFileState(state);
}

async function listBackups() {
  if (USE_BLOB) return listBlobBackups();
  return listFileBackups();
}

async function restoreBackup(filename) {
  if (USE_BLOB) return restoreBlobBackup(filename);
  return restoreFileBackup(filename);
}

async function resetAll() {
  const state = buildInitialState(SEED_PATH, new Date());
  await saveState(state);
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
