type WebSocketResponseType =
  | "join-room"
  | "leave-room"
  | "create-shape"
  | "delete-shape"
  | "alter-shape"
  | "get-all-shapes"
  | "auth"
  | "others";

interface WebSocketResponse<T> {
  status: "success" | "error" | "info" | "warn";
  type: WebSocketResponseType;
  message: string;
  payload: T;
}

export type { WebSocketResponse, WebSocketResponseType };
