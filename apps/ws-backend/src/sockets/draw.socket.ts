import type { WebSocket } from "ws";
import { send_ws_response } from "../utils/websocket.utils.js";

interface DrawParams {
  user_id: string;
  room_id: string;
  ws: WebSocket;
}

// envoked then user draws a specific geometry
async function draw(params: DrawParams) {
  if (!params.ws.id) {
    send_ws_response<null>({ status: "error", message: "User not found", payload: null }, params.ws);
    return false;
  }
}
export { draw };
