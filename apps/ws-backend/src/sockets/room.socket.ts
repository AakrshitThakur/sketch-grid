import type { WebSocket } from "ws";
import { user_conns } from "../states/user.states.js";
import { send_ws_response } from "../utils/websocket.utils.js";

// @params -> room_id to join to & ws: WebSocket instance of connected user
async function join_room(room_id: string, ws: WebSocket) {
  let msg = "";

  // user not-found
  if (!ws.id || !ws.user_credentials) {
    msg = "User not found";
    console.error(msg);
    send_ws_response<null>({ status: "error", type: "join-room", message: msg, payload: null }, ws);
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
  let msg = "";

  // user not-found
  if (!ws.id || !ws.user_credentials) {
    msg = "User not found";
    console.error(msg);
    send_ws_response<null>({ status: "error", type: "leave-room", message: msg, payload: null }, ws);
    return false;
  }

  const params = { room_id, ws };

  // leave specific room
  const check = await user_conns.leave_room(params);
  if (!check) return false;
  return true;
}

export { join_room, leave_room };
