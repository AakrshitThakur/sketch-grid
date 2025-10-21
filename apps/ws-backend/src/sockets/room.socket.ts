import type { WebSocket } from "ws";
import { user_conns } from "../states/user.states.js";

function join_room(room_id: string, ws: WebSocket) {
  if (!ws.id) return;

  const params = {
    user_id: ws.id,
    room_id,
    ws,
  };

  // join specific room
  const check = user_conns.join_room({ ...params });

  if (!check) return;

  console.dir(user_conns, { depth: null, color: true });

  ws.send(`User has successfully joined the room (ID: ${room_id})`);
}

export { join_room };
