require("dotenv").config();
const symbols = require("./config/symbols");
const analyze = require("./strategy/rrrStrategy");
const placeOrder = require("./trade");
const sendTelegram = require("./utils/telegram");
const calculatePositionSize = require("./capitalManager");
const log = require("./utils/logger");

const CAPITAL = 50000; // your capital
const RISK_PERCENT = 2; // per trade

async function run() {
    for (const symbol of symbols) {
        log(`🔍 Checking ${symbol}...`);
        const result = await analyze(symbol);

        if (!result) {
            log(`❌ No signal for ${symbol}`);
            sendTelegram(`❌ No signal for ${symbol}`)
            continue;
        }

        const { direction, entry, stopLoss, target } = result;

        const { qty, riskPerTrade } = calculatePositionSize({
            capital: CAPITAL,
            riskPercent: RISK_PERCENT,
            entry,
            stopLoss
        });

        if (qty <= 0) {
            log(`⚠️ Skipping ${symbol}: Invalid position size`);
            continue;
        }

        const msg = `*Signal Found for ${symbol}*\n🟢 ${direction}\nEntry: ₹${entry}\nSL: ₹${stopLoss}\nTarget: ₹${target}\nQty: ${qty} (₹${riskPerTrade} risk)`;
        await sendTelegram(msg);

        const response = await placeOrder(direction, symbol, qty, stopLoss, target);

        if (response) {
            await sendTelegram(`✅ *Trade placed for ${symbol}*`);
        } else {
            await sendTelegram(`❌ *Failed to place order for ${symbol}*`);
        }
    }
};

module.exports = run;
