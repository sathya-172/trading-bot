function calculateEMA(data, period = 14) {
  const k = 2 / (period + 1);
  let emaArray = [];

  data.forEach((val, i) => {
    if (i < period - 1) {
      emaArray.push(null);
    } else if (i === period - 1) {
      const avg = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
      emaArray.push(avg);
    } else {
      const ema = val * k + emaArray[i - 1] * (1 - k);
      emaArray.push(ema);
    }
  });

  return emaArray;
}

function calculateRSI(data, period = 14) {
  let gains = 0;
  let losses = 0;
  let rsiArray = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      rsiArray.push(null);
      if (i > 0) {
        const diff = data[i] - data[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
      }
    } else {
      const avgGain = gains / period;
      const avgLoss = losses / period;

      const rs = avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      rsiArray.push(rsi);

      const diff = data[i] - data[i - 1];
      if (diff >= 0) {
        gains = (gains * (period - 1) + diff) / period;
        losses = (losses * (period - 1)) / period;
      } else {
        gains = (gains * (period - 1)) / period;
        losses = (losses * (period - 1) - diff) / period;
      }
    }
  }

  return rsiArray;
}

function calculateSTC(closePrices, shortEMA = 23, longEMA = 50, cycle = 10) {
  const emaShort = calculateEMA(closePrices, shortEMA);
  const emaLong = calculateEMA(closePrices, longEMA);

  const macd = emaShort.map((val, i) =>
    val !== null && emaLong[i] !== null ? val - emaLong[i] : null
  );

  const signal = calculateEMA(macd.map(m => m ?? 0), cycle);

  const stc = macd.map((val, i) => {
    if (val === null || signal[i] === null) return null;
    return 100 * (val / signal[i]);
  });

  return stc;
}

function calculateUTBot(closePrices, atrPeriod = 10, multiplier = 1) {
  const atr = calculateATR(closePrices, atrPeriod); // We'll define ATR next
  const buySignals = [];
  const sellSignals = [];

  for (let i = 1; i < closePrices.length; i++) {
    const prev = closePrices[i - 1];
    const curr = closePrices[i];
    const stopLoss = atr[i] * multiplier;

    if (curr > prev + stopLoss) {
      buySignals.push(i);
    } else if (curr < prev - stopLoss) {
      sellSignals.push(i);
    }
  }

  return { buySignals, sellSignals };
}

// Basic ATR (Average True Range) Calculation
function calculateATR(closePrices, period = 14) {
  const tr = [];

  for (let i = 1; i < closePrices.length; i++) {
    const currentClose = closePrices[i];
    const prevClose = closePrices[i - 1];
    tr.push(Math.abs(currentClose - prevClose));
  }

  const atr = [];

  for (let i = 0; i < tr.length; i++) {
    if (i < period) {
      atr.push(null);
    } else {
      const avg = tr.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      atr.push(avg);
    }
  }

  return [null, ...atr]; // pad to match length
}


module.exports = {
  calculateEMA,
  calculateRSI,
  calculateSTC,
  calculateUTBot,
};

