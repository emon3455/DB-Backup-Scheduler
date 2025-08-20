const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { EJSON } = require("bson");
require("dotenv").config();

// ================== CONFIG ==================
const MONGO_URI = process.env.MONGO_URI || "";
const DB_NAME = process.env.DB_NAME || "";

const BACKUP_DIR = path.join(__dirname, "backups");
const RETENTION_DAYS = parseInt(process.env.RETENTION_DAYS, 10) || 3;

// ================== Helpers ==================
function formatTimestamp(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

function cleanupBackups(now) {
  const folders = fs.readdirSync(BACKUP_DIR);
  for (const folder of folders) {
    const folderPath = path.join(BACKUP_DIR, folder);
    const stats = fs.statSync(folderPath);
    const ageDays = (now - stats.birthtime) / (1000 * 60 * 60 * 24);

    if (ageDays > RETENTION_DAYS) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`🗑 Deleted old backup: ${folder}`);
    }
  }
}

// ================== MongoDB Backup ==================
async function backupMongoDB(backupFolder) {
  if (!MONGO_URI || !DB_NAME) {
    console.log("⚠️ Skipping MongoDB backup (no DB config).");
    return;
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const collections = await db.listCollections().toArray();
  console.log(`📂 Found ${collections.length} collections in ${DB_NAME}.`);

  for (const col of collections) {
    const name = col.name;
    const docs = await db.collection(name).find({}).toArray();

    // ✅ Use EJSON to preserve ObjectId, Date, Decimal128, etc.
    const serialized = EJSON.stringify(docs, null, 2);

    const filePath = path.join(backupFolder, `${name}.json`);
    fs.writeFileSync(filePath, serialized);
    console.log(`✅ Exported ${name} (${docs.length} docs) → ${filePath}`);
  }

  await client.close();
}

// ================== Master Backup ==================
async function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const now = new Date();
  const timestamp = formatTimestamp(now);
  const backupFolder = path.join(BACKUP_DIR, `backup_${timestamp}`);
  fs.mkdirSync(backupFolder, { recursive: true });

  console.log("⏳ Running backup job...");
  await backupMongoDB(backupFolder);

  cleanupBackups(now);
  console.log("✅ Backup + Cleanup finished.");
}

module.exports = { createBackup };
