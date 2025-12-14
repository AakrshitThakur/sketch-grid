type WebSocketResponseType =
  | "join-room"
  | "leave-room"
  | "create-shape"
  | "alter-shape"
  | "delete-shape"
  | "delete-all-shapes"
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
