import type { WebSocket } from "ws";
import { user_conns } from "../states/user.states.js";
import { send_ws_response } from "../utils/websocket.utils.js";

// @params -> room_id to join to & ws: WebSocket instance of connected user
async function join_room(room_id: string, ws: WebSocket) {
  if (!ws.id) {
    send_ws_response<null>({ status: "error", message: "User not found", payload: null }, ws);
    return false;
  }

  const params = { room_id, ws };

  // join specific room
  const check = await user_conns.join_room(params);
  if (!check) return false;
  return true;
}

// @params -> room_id to leave to & ws: WebSocket instance of connected user
async function leave_room(room_id: string, ws: WebSocket) {
  if (!ws.id) {
    send_ws_response<null>({ status: "error", message: "User not found", payload: null }, ws);
    return false;
  }

  const params = { room_id, ws };

  // leave specific room
  const check = await user_conns.leave_room(params);
  if (!check) return false;
  return true;
}

export { join_room, leave_room };
