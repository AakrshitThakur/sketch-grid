import type { WebSocket } from "ws";
import { nanoid } from "nanoid";
import { prisma_client } from "@repo/db/index";
import { get_room_record } from "@repo/db/index";
import { send_ws_response } from "../utils/websocket.utils.js";

interface UserConnsState {
  [key: string]: {
    room: string | null;
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
  leave_room: (params: LeaveRoomParams) => Promise<boolean>;
}

// global variable to manage ws:conn user state
const user_conns: UserConns = {
  user_conns_state: {},
  push_new_user(ws: WebSocket) {
    const user_id = nanoid();
    this.user_conns_state[user_id] = { room: null, ws };
    // assign new unique value to user_id
    return user_id;
  },
  async join_room(params: JoinRoomParams) {
    const type = "join-room";
    let msg = "";

    // user not-found
    if (!params.ws.id) {
      msg = "User not found";
      console.error(msg);
      send_ws_response<null>({ status: "error", type, message: msg, payload: null }, params.ws);
      return false;
    }

    // get user ws:conn details
    const user_conn_details = this.user_conns_state[params.ws.id];
    if (!user_conn_details) {
      msg = "User not found";
      console.error(msg);
      send_ws_response<null>({ status: "error", type, message: msg, payload: null }, params.ws);
      return false;
    }

    // check if user already joined the room
    if (user_conn_details.room === params.room_id) {
      msg = "User already joined the room";
      console.error(msg);
      send_ws_response<null>({ status: "error", type, message: msg, payload: null }, params.ws);
      return false;
    }

    // check existence of room
    const room_obj = await get_room_record({ id: params.room_id });
    if (room_obj.status === "error") {
      msg = `Room with ID ${params.room_id} not found`;
      console.error(msg);
      send_ws_response({ status: "error", type, message: msg, payload: null }, params.ws);
      return false;
    }

    // connect user to specific room
    user_conn_details.room = params.room_id;

    // success
    msg = `User has successfully joined the room (ID: ${params.room_id})`;
    console.info(msg);
    send_ws_response({ status: "success", type, message: msg, payload: null }, params.ws);
    return true;
  },
  async leave_room(params: LeaveRoomParams) {
    const type = "leave-room";
    let msg = "";

    // user not-found
    if (!params.ws.id) {
      msg = "User not found";
      console.error(msg);
      send_ws_response<null>({ status: "error", type, message: msg, payload: null }, params.ws);
      return false;
    }

    // get user ws:conn details
    const user_conn_details = this.user_conns_state[params.ws.id];
    msg = "User not found";
    console.error(msg);
    if (!user_conn_details) {
      send_ws_response<null>({ status: "error", type, message: msg, payload: null }, params.ws);
      return false;
    }

    // check if user already joined the room
    if (user_conn_details.room !== params.room_id) {
      msg = `Room with ID ${params.room_id} not found`;
      console.error(msg);
      send_ws_response({ status: "error", type, message: msg, payload: null }, params.ws);
      return false;
    }

    // leave specific room
    user_conn_details.room = null;

    // success
    msg = `User has successfully left the room (ID: ${params.room_id})`;
    console.info(msg);
    send_ws_response<null>({ status: "info", type, message: msg, payload: null }, params.ws);
    return true;
  },
};

export { user_conns };
