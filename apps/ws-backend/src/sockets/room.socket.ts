import type { WebSocket } from "ws";
import { user_conns } from "../states/user.states.js";
import { send_ws_response } from "../utils/websocket.utils.js";
import { prisma_client } from "@repo/db/index";

// @params -> room_id to join to & ws: WebSocket instance of connected user
function join_room(room_id: string, ws: WebSocket) {
  if (!ws.id) return;

  const params = { room_id, ws };

  // join specific room
  const check = user_conns.join_room({ ...params });

  if (!check) {
    send_ws_response<null>({ status: "error", message: "Room not found", payload: null }, ws);
    return;
  }

  send_ws_response<null>(
    { status: "success", message: `User has successfully joined the room (ID: ${room_id})`, payload: null },
    ws
  );
}

export { join_room };
