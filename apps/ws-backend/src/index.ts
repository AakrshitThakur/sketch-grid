import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 5000 });

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) return;
  // get token from search params
  const search_params = new URLSearchParams(url.split("?")[1]);
  const token = search_params.get("token");

  ws.on("message", function incoming(message) {
    ws.send(message.toString());
  });
});
