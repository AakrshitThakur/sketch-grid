interface WebSocketResponse<T> {
  status: "success" | "error";
  message: string;
  payload: T;
}

type Point = { x: number; y: number };

type GeometryData = {
  type: "BOX" | "CIRCLE";
  points?: Point[];
  radius?: number;
};

export type { WebSocketResponse, GeometryData };
