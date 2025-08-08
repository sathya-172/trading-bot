const WebSocket = require('ws');
const { fyersDataSocket } = require("fyers-api-v3");

let wss;

const fyersSocket = new fyersDataSocket("xxxxxxx-xxxx:your-access-token");

// Your instruments
const instruments = [
  "NSE:NIFTY50-INDEX",
  "NSE:BANKNIFTY-INDEX",
  "NSE:TCS-EQ",
  "NSE:RELIANCE-EQ"
];

function startWebSocketServer(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("🔗 Frontend connected");

    ws.send(JSON.stringify({ message: "Connected to WebSocket server" }));
  });

  fyersSocket.on("connect", () => {
    console.log("✅ Fyers socket connected");
    fyersSocket.subscribe(instruments);
    fyersSocket.autoreconnect();
  });

  fyersSocket.on("message", (data) => {
    if (wss && data?.symbol) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  fyersSocket.on("error", (err) => {
    console.error("Fyers error", err);
  });

  fyersSocket.connect();
}

module.exports = { startWebSocketServer };
