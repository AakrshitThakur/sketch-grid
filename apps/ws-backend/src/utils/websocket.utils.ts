import type { WebSocket } from "ws";
import type { WebSocketResponse } from "../types/index.js";

function send_ws_response<T>(obj: WebSocketResponse<T>, ws: WebSocket) {
  const json = JSON.stringify(obj);
  ws.send(json);
}

export { send_ws_response };
