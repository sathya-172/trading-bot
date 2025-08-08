const getHistoricalData = require("../data/getHistorical");
const dayjs = require('dayjs')
const {
    calculateEMA,
    calculateRSI,
    calculateSTC,
    calculateUTBot,
} = require("../utils/indicators");

const analyze = async (symbol = "NSE:RELIANCE-EQ") => {
    const currentTime = Date.now()
    const formattedTime = dayjs(currentTime)
    const candles = await getHistoricalData(symbol);
    if (candles.length < 50) return console.log(`Not enough data. ${formattedTime}`);

    const closes = candles.map(c => c.close);

    const ema50 = calculateEMA(closes, 50);
    const ema200 = calculateEMA(closes, 200);
    const rsi14 = calculateRSI(closes, 14);
    const stc = calculateSTC(closes);
    const { buySignals, sellSignals } = calculateUTBot(closes);

    const last = candles.length - 1;
    const price = closes[last];
    const conditionsMet = [];

    if (
        buySignals.includes(last) &&
        ema50[last] > ema200[last] &&
        rsi14[last] > 50 &&
        stc[last] > 50
    ) {
        conditionsMet.push("BUY");
    }

    if (
        sellSignals.includes(last) &&
        ema50[last] < ema200[last] &&
        rsi14[last] < 50 &&
        stc[last] < 50
    ) {
        conditionsMet.push("SELL");
    }

    if (conditionsMet.includes("BUY")) {
        console.log("🔔 BUY SIGNAL @", price);
        const stopLoss = price * 0.01; // 1% SL
        const target = price + stopLoss * 4;
        console.log(`🎯 Target: ${target.toFixed(2)}, 🛑 SL: ${(price - stopLoss).toFixed(2)}`);
    } else if (conditionsMet.includes("SELL")) {
        console.log("🔔 SELL SIGNAL @", price);
        const stopLoss = price * 0.01;
        const target = price - stopLoss * 4;
        console.log(`🎯 Target: ${target.toFixed(2)}, 🛑 SL: ${(price + stopLoss).toFixed(2)}`);
    } else {
        console.log("No valid trade signal found.");
    }
};

module.exports = analyze;

// Run directly
if (require.main === module) {
    //   analyze();
    return {
        direction: "BUY" || "SELL",
        entry: price,
        stopLoss,
        target
    };

}
