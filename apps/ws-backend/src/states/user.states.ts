import type { WebSocket } from "ws";
import { nanoid } from "nanoid";
import { prisma_client } from "@repo/db/index";
import { get_room_record } from "@repo/db/index";
import { send_ws_response } from "../utils/websocket.utils.js";

interface UserConnsState {
  [key: string]: {
    rooms: string[];
    ws: WebSocket;
  };
}

interface JoinRoomParams {
  room_id: string;
  ws: WebSocket;
}

type LeaveRoomParams = JoinRoomParams;

interface UserConns {
  user_conns_state: UserConnsState;
  push_new_user: (ws: WebSocket) => string;
  join_room: (params: JoinRoomParams) => Promise<boolean>;
  leave_room: (params: LeaveRoomParams) => boolean;
}

// global variable to manage ws:conn user state
const user_conns: UserConns = {
  user_conns_state: {},
  push_new_user(ws: WebSocket) {
    const user_id = nanoid();
    this.user_conns_state[user_id] = { rooms: [], ws };
    // assign new unique value to user_id
    return user_id;
  },
  async join_room(params: JoinRoomParams) {
    if (!params.ws.id) {
      send_ws_response<null>({ status: "error", message: "User not found", payload: null }, params.ws);
      return false;
    }

    // get user ws:conn details
    const user_conn_details = this.user_conns_state[params.ws.id];
    if (!user_conn_details) {
      send_ws_response<null>({ status: "error", message: "User not found", payload: null }, params.ws);
      return false;
    }

    // check if user already joined the room
    if (user_conn_details.rooms.includes(params.room_id)) {
      send_ws_response<null>({ status: "error", message: "User already joined the room", payload: null }, params.ws);
      return false;
    }

    // check existance of room
    const room_obj = await get_room_record({ id: params.room_id });
    if (room_obj.status === "error") {
      send_ws_response({ status: "error", message: `Room with ID ${params.room_id} not found`, payload: null }, params.ws);
      return false;
    }

    // connect user to specific room
    user_conn_details.rooms.push(params.room_id);

    return true;
  },
  leave_room(params: LeaveRoomParams) {
    if (!params.ws.id) return false;

    // get user ws:conn details
    const user_conn_details = this.user_conns_state[params.ws.id];

    if (!user_conn_details) return false;

    // check if user already joined the room
    if (!user_conn_details.rooms.includes(params.room_id)) return false;

    // leave specific room
    user_conn_details.rooms = user_conn_details.rooms.filter((r) => r !== params.room_id);

    return true;
  },
};

export { user_conns };
