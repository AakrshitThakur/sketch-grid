interface WebSocketRequest<T> {
  type:
    | "join-room"
    | "leave-room"
    | "create-shape"
    | "delete-shape"
    | "delete-all-shapes"
    | "alter-shape"
    | "get-all-shapes";
  payload: T;
}

export type { WebSocketRequest };
