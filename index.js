// index.js
console.log("🚀 Universal Backup Scheduler Started");

// Load the scheduler (which runs the cron jobs)
require("./scheduler");

// Optional: allow manual trigger if you want
const { createBackup } = require("./backup");

// If you run `node index.js backup-now`, it will run one backup immediately
if (process.argv.includes("backup-now")) {
  (async () => {
    console.log("⚡ Running backup manually...");
    await createBackup();
    process.exit(0);
  })();
}
