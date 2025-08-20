const cron = require("node-cron");
const { createBackup } = require("./backup");

// Run every minutes
cron.schedule("0 */6 * * *", async () => {
  await createBackup();
});
