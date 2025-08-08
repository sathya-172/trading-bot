// trade.js
require("dotenv").config();
const axios = require("axios");

const placeOrder = async (side, symbol, qty, sl, target) => {
  const order = {
    symbol,
    qty,
    type: 2,
    side: side === "BUY" ? 1 : -1,
    productType: "INTRADAY",
    limitPrice: 0,
    stopPrice: 0,
    disclosedQty: 0,
    validity: "DAY",
    offlineOrder: false,
    stopLoss: sl,
    takeProfit: target,
  };

  try {
    const res = await axios.post("https://api.fyers.in/api/v2/orders", order, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    return res.data;
  } catch (error) {
    console.error("Trade Error:", error.response?.data || error.message);
    return null;
  }
};

module.exports = placeOrder;
