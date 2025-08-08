// getHistorical.js
require("dotenv").config();
const dayjs = require("dayjs");
const FyersAPI = require("fyers-api-v3").fyersModel;

const getHistoricalData = async (
  symbol = "NSE:RELIANCE-EQ",
  interval = "15" // Valid: 1, 3, 5, 15, 30, 60, D, W, M
) => {
  try {
    const fyers = new FyersAPI();

    // Set credentials
    fyers.setAppId(process.env.FYERS_APP_ID);
    fyers.setRedirectUrl(process.env.FYERS_REDIRECT_URI);
    fyers.setAccessToken(process.env.ACCESS_TOKEN);

    const rangeFrom = dayjs().subtract(5, "day").unix(); // UNIX timestamp
    const rangeTo = dayjs().unix();

    const payload = {
      symbol,
      resolution: interval,
      date_format: "0", // Use 0 for UNIX timestamps
      range_from: rangeFrom.toString(),
      range_to: rangeTo.toString(),
      cont_flag: "1",
    };

    const response = await fyers.getHistory(payload);
    const candles = response?.candles || [];

    return candles.map(([timestamp, open, high, low, close, volume]) => ({
      time: timestamp,
      open,
      high,
      low,
      close,
      volume,
    }));
  } catch (err) {
    console.error("Error fetching historical data:", err.message || err);
    return [];
  }
};

// Example usage
getHistoricalData().then((data) => {
  console.log("Last 5 candles:", data.slice(-5));
});

module.exports = getHistoricalData;
