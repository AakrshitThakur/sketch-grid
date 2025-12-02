import type { Point, Shapes, Shape } from "@/types/whiteboard.types";
import mouse_move_draw_canvas from "./mouse-move-draw-canvas";

interface Params {
  start_point: Point;
  end_point: Point;
  is_dragging: boolean;
  all_shapes: {
    shapes: Shapes;
    push_new_curr_shape: (curr_shape: Shape) => void;
    delete_shape_by_id: (id: string) => void;
    alter_shape_properties: (shape: Shape) => void;
  };
  handle_set_start_point: (x: number, y: number) => void;
  ctx: CanvasRenderingContext2D;
}

export default function mouse_move_drag_canvas(params: Params) {
  const start = { x: params.start_point.x, y: params.start_point.y };
  const end = { x: params.end_point.x, y: params.end_point.y };

  for (let shape of params.all_shapes.shapes) {
    switch (shape.type) {
      case "box": {
        const box_start = { x: shape.point.x, y: shape.point.y };
        if (
          start.x >= Math.min(box_start.x, box_start.x + shape.width) &&
          start.x <= Math.max(box_start.x, box_start.x + shape.width) &&
          start.y >= Math.min(box_start.y, box_start.y + shape.height) &&
          start.y <= Math.max(box_start.y, box_start.y + shape.height)
        ) {
          params.all_shapes.alter_shape_properties({
            ...shape,
            point: { x: shape.point.x + (end.x - start.x), y: shape.point.y + (end.y - start.y) },
          });
          params.handle_set_start_point(end.x, end.y);
        }
        break;
      }
      case "circle": {
        if (Math.pow(shape.center.x - end.x, 2) + Math.pow(shape.center.y - end.y, 2) <= Math.pow(shape.radius, 2)) {
          params.all_shapes.alter_shape_properties({
            ...shape,
            center: { x: shape.center.x + (end.x - start.x), y: shape.center.y + (end.y - start.y) },
          });
          params.handle_set_start_point(end.x, end.y);
        }
        break;
      }
      case "arrow": {
        const line_start = { x: shape.points.start.x, y: shape.points.start.y };
        const line_end = { x: shape.points.end.x, y: shape.points.end.y };

        const line_segment = new Path2D();
        line_segment.moveTo(line_start.x, line_start.y);
        line_segment.lineTo(line_end.x, line_end.y);
        line_segment.closePath();

        if (
          params.ctx.isPointInStroke(line_segment, end.x, end.y) ||
          params.ctx.isPointInPath(line_segment, end.x - 5, end.y - 5) ||
          params.ctx.isPointInPath(line_segment, end.x + 5, end.y + 5)
        ) {
          params.all_shapes.alter_shape_properties({
            ...shape,
            points: {
              start: { x: shape.points.start.x + (end.x - start.x), y: shape.points.start.y + (end.y - start.y) },
              end: { x: shape.points.end.x + (end.x - start.x), y: shape.points.end.y + (end.y - start.y) },
            },
          });
          params.handle_set_start_point(end.x, end.y);
        }
        break;
      }
      case "text": {
        const start_text = { x: shape.points.start.x, y: shape.points.start.y };
        const end_text = { x: shape.points.end.x, y: shape.points.end.y };

        const box = new Path2D();
        box.rect(start_text.x, start_text.y, end_text.x - start_text.x, end_text.y - start_text.y);
        box.closePath();

        // checking if point lies between the text-box or not
        if (params.ctx.isPointInPath(box, start.x, start.y)) {
          params.all_shapes.alter_shape_properties({
            ...shape,
            points: {
              start: { x: shape.points.start.x + (end.x - start.x), y: shape.points.start.y + (end.y - start.y) },
              end: { x: shape.points.end.x + (end.x - start.x), y: shape.points.end.y + (end.y - start.y) },
            },
          });
          params.handle_set_start_point(end.x, end.y);
        }
        break;
      }
      case "diamond": {
        const diamond_start = {
          x: shape.points.start.x,
          y: shape.points.start.y,
        };
        const diamond_end = { x: shape.points.end.x, y: shape.points.end.y };

        const center_x = (diamond_start.x + diamond_end.x) / 2;
        const center_y = (diamond_start.y + diamond_end.y) / 2;

        const height = Math.abs(diamond_end.y - diamond_start.y);
        const width = Math.abs(diamond_end.x - diamond_start.x);

        const diamond = new Path2D();
        diamond.moveTo(diamond_start.x, diamond_start.y);
        diamond.lineTo(center_x, center_y - height);
        diamond.lineTo(center_x + width, center_y);
        diamond.lineTo(center_x + width, center_y + height);
        diamond.lineTo(center_x - width, center_y);
        diamond.closePath();

        if (params.ctx.isPointInPath(diamond, end.x, end.y)) {
          params.all_shapes.alter_shape_properties({
            ...shape,
            points: {
              start: { x: shape.points.start.x + (end.x - start.x), y: shape.points.start.y + (end.y - start.y) },
              end: { x: shape.points.end.x + (end.x - start.x), y: shape.points.end.y + (end.y - start.y) },
            },
          });
          params.handle_set_start_point(end.x, end.y);
        }
        break;
      }
    }
  }
}
