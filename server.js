// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let viewers = [];

wss.on("connection", (ws, req) => {
  console.log("Client connected");

  // Identify if Android or viewer
  ws.on("message", (msg) => {
    if (msg.toString() === "viewer") {
      viewers.push(ws);
      console.log("Viewer connected");
      return;
    }

    // Broadcast frame to all viewers
    for (const v of viewers) {
      if (v.readyState === WebSocket.OPEN) {
        v.send(msg);
      }
    }
  });

  ws.on("close", () => {
    viewers = viewers.filter((v) => v !== ws);
  });
});

app.get("/", (req, res) => res.send("WebSocket server is running"));

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server started on ${PORT}`));
