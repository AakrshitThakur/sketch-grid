import type { WebSocket } from "ws";

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
  user_id: number;
  increment_user_id: () => void;
  push_new_user: (ws: WebSocket) => void;
  join_room: (params: JoinRoomParams) => boolean;
  leave_room: (params: LeaveRoomParams) => boolean;
}

// global variable to manage ws:conn user state
const user_conns: UserConns = {
  user_conns_state: {},
  user_id: 1,
  increment_user_id() {
    this.user_id++;
  },
  push_new_user(ws: WebSocket) {
    this.user_conns_state[this.user_id] = { rooms: [], ws };
  },
  join_room(params: JoinRoomParams) {
    if (!params.ws.id) return false;

    // get user ws:conn details
    const user_conn_details = this.user_conns_state[params.ws.id];

    if (!user_conn_details) return false;

    // check if user already joined the room
    if (user_conn_details.rooms.includes(params.room_id)) return false;

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
