import type { WebSocket } from "ws";
import { user_conns } from "../states/user.states.js";
import { send_ws_response } from "../utils/websocket.utils.js";

// @params -> room_id to join to & ws: WebSocket instance of connected user
function join_room(room_id: string, ws: WebSocket) {
  if (!ws.id) {
    send_ws_response<null>({ status: "error", message: "User not found", payload: null }, ws);
    return;
  }

  const params = { room_id, ws };

  // join specific room
  const check = user_conns.join_room(params);
  if (!check) return;

  // success
  send_ws_response<null>(
    { status: "success", message: `User has successfully joined the room (ID: ${room_id})`, payload: null },
    ws
  );
}

// @params -> room_id to leave to & ws: WebSocket instance of connected user
function leave_room(room_id: string, ws: WebSocket) {
  if (!ws.id) {
    send_ws_response<null>({ status: "error", message: "User not found", payload: null }, ws);
    return;
  }

  const params = { room_id, ws };

  // leave specific room
  const check = user_conns.leave_room(params);
  if (!check) {
    send_ws_response<null>({ status: "error", message: "Room not found", payload: null }, ws);
    return;
  }

  // success
  send_ws_response<null>(
    { status: "error", message: `User has successfully left the room (ID: ${room_id})`, payload: null },
    ws
  );
}

export { join_room, leave_room };
