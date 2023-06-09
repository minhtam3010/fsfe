const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => console.log("Server started on port 3000"));

// ? Begin Web Socket

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log(`Client connected. Total clients: ${numClients}`);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server");
  }

  ws.on("close", () => {
    console.log("Client disconnected");
    wss.broadcast(`Current visitors: ${numClients}`);
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
