// getLivePrice.js
require("dotenv").config();
const axios = require("axios");

const getLivePrice = async (symbol = "NSE:RELIANCE-EQ") => {
  try {
    const res = await axios.get(
      `https://api.fyers.in/data-rest/v2/quotes/?symbols=${symbol}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    return res.data.d[symbol].v.lp; // last traded price
  } catch (err) {
    console.error("Live price error:", err.response?.data || err.message);
    return null;
  }
};

// Example usage
getLivePrice().then(price => console.log("Live price:", price));

module.exports = getLivePrice;
