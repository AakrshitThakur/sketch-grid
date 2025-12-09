interface WebSocketRequest<T> {
  type: "join-room" | "leave-room" | "create-shape" | "delete-shape" | "get-all-shapes";
  payload: T;
}

export type { WebSocketRequest };
