const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs")
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat)

const logPath = path.join(__dirname, "../logs/bot.log");

function log(message) {
  const timestamp = dayjs().utc().tz("Asia/Kolkata");
  const formattedTime = timestamp.format("llll");
  const line = `[${formattedTime}] ${message}\n`;
  fs.appendFileSync(logPath, line);
  console.log(message); // Still show in terminal too
}

module.exports = log;