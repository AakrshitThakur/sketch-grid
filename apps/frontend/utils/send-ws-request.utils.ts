import type { WebSocketRequest } from "@/types/websocket.types";

// set web-socket message to web-socket server
function send_ws_request<T>(data: WebSocketRequest<T>, ws: WebSocket) {
  const json = JSON.stringify(data);
  ws.send(json);
}

export { send_ws_request };
