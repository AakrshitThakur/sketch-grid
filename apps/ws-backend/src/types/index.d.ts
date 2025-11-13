// interface WebSocketMessage {
//   type: "join-room";
//   payload: {};
// }

interface WebSocketResponse<T> {
  status: "success" | "error";
  message: string;
  payload: T;
}

export type { WebSocketResponse };
