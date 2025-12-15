interface Point {
  x: number;
  y: number;
}

type BaseShape = { id: string };

interface CircleShape extends BaseShape {
  type: "circle";
  center: Point;
  radius: number;
}

interface BoxShape extends BaseShape {
  type: "box";
  point: Point;
  width: number;
  height: number;
}

interface ArrowShape extends BaseShape {
  type: "arrow";
  points: { start: Point; end: Point };
}

interface TextShape extends BaseShape {
  type: "text";
  text: string;
  font: { font_size: number };
  points: { start: Point; end: Point };
}

interface DiamondShape extends BaseShape {
  type: "diamond";
  center: Point;
  width: number;
  height: number;
}

type Shape = CircleShape | BoxShape | ArrowShape | TextShape | DiamondShape;
type Shapes = Shape[];

type WsType =
  | "join-room"
  | "leave-room"
  | "create-shape"
  | "get-all-shapes"
  | "alter-shape"
  | "delete-shape"
  | "delete-all-shapes"
  | "auth"
  | "others";

type WsStatus = "success" | "error" | "info" | "warn";

export type { BaseShape, CircleShape, BoxShape, ArrowShape, TextShape, Shape, Shapes, Point, WsType, WsStatus };
