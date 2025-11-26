type Tool = "cursor" | "circle" | "box" | "arrow" | "text" | "pencil" | "eraser";

interface Point {
  x: number;
  y: number;
}

interface BaseShape {
  id: string;
}

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
  points: {
    start: Point;
    end: Point;
  };
}

interface PencilShape extends BaseShape{
     type: "pencil", 
     points: Point[]
}

type Shape = CircleShape | BoxShape | ArrowShape;
type Shapes = Shape[];

export type { BaseShape, CircleShape, BoxShape, ArrowShape, Shape, Shapes };
