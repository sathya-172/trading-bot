// utils/telegram.js
const axios = require("axios");
require("dotenv").config();

const sendTelegramMessage = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    });
    console.log("✅ Sent to Telegram:", text);
  } catch (err) {
    console.error("Telegram Error:", err.response?.data || err.message);
  }
};

module.exports = sendTelegramMessage;
