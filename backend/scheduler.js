// scheduler.js
const schedule = require("node-schedule");
const run = require("./run");

// Schedule to run every 15 minutes
schedule.scheduleJob("*/1 * * * *", async () => {
  console.log(`\n🔁 Running bot at ${new Date().toLocaleString()}...`);
  await run();
});

// Optional: Run immediately on startup too
(async () => {
  console.log("🚀 Starting bot immediately...");
  await run();
})();