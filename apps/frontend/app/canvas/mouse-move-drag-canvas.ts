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
        // const box_start = { x: shape.point.x, y: shape.point.y };

        // if (
        //   start.x >= Math.min(box_start.x, box_start.x + shape.width) &&
        //   start.x <= Math.max(box_start.x, box_start.x + shape.width) &&
        //   start.y >= Math.min(box_start.y, box_start.y + shape.height) &&
        //   start.y <= Math.max(box_start.y, box_start.y + shape.height)
        // ) {
        //   params.all_shapes.alter_shape_properties({
        //     ...shape,
        //     point: { x: shape.point.x + (end.x - start.x), y: shape.point.y + (end.y - start.y) },
        //   });
        //   params.handle_set_start_point(end.x, end.y);
        // }
        // break;

        const box_start = { x: shape.point.x, y: shape.point.y };

        if (
          start.x >= Math.min(box_start.x, box_start.x + shape.width) - 5 &&
          start.x <= Math.min(box_start.x, box_start.x + shape.width) + 5
        ) {
          // Increase or shrink width of box current to left
          params.all_shapes.alter_shape_properties({
            ...shape,
            point: { x: shape.point.x + (end.x - start.x), y: shape.point.y },
            width: shape.width + (start.x - end.x),
          });
          params.handle_set_start_point(end.x, end.y);
        } else if (
          start.x >= Math.max(box_start.x, box_start.x + shape.width) - 5 &&
          start.x <= Math.max(box_start.x, box_start.x + shape.width) + 5
        ) {
          // Increase or shrink width of box current to right
          params.all_shapes.alter_shape_properties({
            ...shape,
            width: shape.width + (end.x - start.x),
          });
          params.handle_set_start_point(end.x, end.y);
        } else if (
          start.y >= Math.min(box_start.y, box_start.y + shape.height) - 5 &&
          start.y <= Math.min(box_start.y, box_start.y + shape.height) + 5
        ) {
          // Increase or shrink height of box current to top
          params.all_shapes.alter_shape_properties({
            ...shape,
            point: { x: shape.point.x, y: shape.point.y + (end.y - start.y) },
            height: shape.height + (start.y - end.y),
          });
          params.handle_set_start_point(end.x, end.y);
        } else if (
          start.y >= Math.max(box_start.y, box_start.y + shape.height) - 5 &&
          start.y <= Math.max(box_start.y, box_start.y + shape.height) + 5
        ) {
          // Increase or shrink height of box current to bottom
          params.all_shapes.alter_shape_properties({
            ...shape,
            height: shape.height + (end.y - start.y),
          });
          params.handle_set_start_point(end.x, end.y);
        } else if (
          start.x >= Math.min(box_start.x, box_start.x + shape.width) &&
          start.x <= Math.max(box_start.x, box_start.x + shape.width) &&
          start.y >= Math.min(box_start.y, box_start.y + shape.height) &&
          start.y <= Math.max(box_start.y, box_start.y + shape.height)
        ) {
          // change the position of box
          params.all_shapes.alter_shape_properties({
            ...shape,
            point: { x: shape.point.x + (end.x - start.x), y: shape.point.y + (end.y - start.y) },
          });
          params.handle_set_start_point(end.x, end.y);
        }
        break;
      }
      case "circle": {
        const start_to_center_distance = Math.pow(
          Math.pow(shape.center.x - start.x, 2) + Math.pow(shape.center.y - start.y, 2),
          0.5
        );
        if (start_to_center_distance - 250 <= shape.radius && start_to_center_distance + 250 >= shape.radius) {
          // Increase or decrease radius of circle
          params.all_shapes.alter_shape_properties({ ...shape, radius: shape.radius + (end.x - start.x) });
          params.handle_set_start_point(end.x, end.y);
        } else if (
          Math.pow(shape.center.x - start.x, 2) + Math.pow(shape.center.y - start.y, 2) <=
          Math.pow(shape.radius, 2)
        ) {
          // change the position of circle
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

        params.ctx.lineWidth = 10;
        const box = new Path2D();
        box.rect(start_text.x, start_text.y, end_text.x - start_text.x, end_text.y - start_text.y);
        box.closePath();

        const left_to_right = new Path2D();
        left_to_right.moveTo(start_text.x, start_text.y);
        left_to_right.lineTo(end_text.x, start_text.y);

        const top_to_bottom = new Path2D();
        top_to_bottom.moveTo(end_text.x, start_text.y);
        top_to_bottom.lineTo(end_text.x, end_text.y);

        const right_to_left = new Path2D();
        right_to_left.moveTo(end_text.x, end_text.y);
        right_to_left.lineTo(start_text.x, end_text.y);

        const bottom_to_top = new Path2D();
        bottom_to_top.moveTo(start_text.x, end_text.y);
        bottom_to_top.lineTo(start_text.x, start_text.y);

        params.ctx.stroke(left_to_right);

        if (params.ctx.isPointInStroke(left_to_right, start.x, start.y)) {
          // checking if point lies on the stroke or edge of text-box or not
          let font_size = 0;
          if (end.y - start.y >= 0) font_size = shape.font.font_size - (end.y - start.y);
          else font_size = shape.font.font_size - (end.y - start.y);

          // make text on canvas
          params.ctx.textAlign = "left";
          params.ctx.textBaseline = "top";
          params.ctx.font = `${font_size}px Cursive`;
          // The HTML Canvas actualBoundingBoxAscent property of TextMetrics interface is a read-only method which returns a double value giving the distance from horizontal line indicated by the text baseline of CanvasRenderingContext2D interface context object to the "top" of the bounding rectangle box in which the text is rendered. The double value is given in CSS pixels.
          // The HTML Canvas actualBoundingBoxDescent property of TextMetrics interface is a read-only method which returns a double value giving the distance from horizontal line indicated by the text baseline of CanvasRenderingContext2D interface context object to the "bottom" of the bounding rectangle box in which the text is rendered. The double value is given in CSS pixels.
          const metrics = params.ctx.measureText(shape.text.trim());
          const top_left_x = shape.points.start.x;
          const top_left_y = shape.points.start.y - metrics.actualBoundingBoxAscent;

          // push new curr-shape to shapes state
          params.all_shapes.alter_shape_properties({
            ...shape,
            font: {
              font_size,
            },
            points: {
              start: { x: top_left_x, y: top_left_y },
              end: {
                x: top_left_x + metrics.width,
                y: top_left_y + metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
              },
            },
          });
          params.handle_set_start_point(end.x, end.y);
        } else if (params.ctx.isPointInPath(box, start.x, start.y)) {
          // checking if point lies inside the text-box or not
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
        // get diamond-data from global shapes state
        const center = shape.center;
        const width = shape.width;
        const height = shape.height;

        // Make a diamond but do not print it on the canvas whiteboard
        const diamond = new Path2D();
        params.ctx.lineWidth = 10;
        diamond.moveTo(center.x, center.y - height);
        diamond.lineTo(center.x + width, center.y);
        diamond.lineTo(center.x, center.y + height);
        // diamond.lineTo(center.x - width, center.y);
        // diamond.closePath();
        params.ctx.stroke(diamond);

        if (params.ctx.isPointInStroke(diamond, start.x, start.y)) {
          console.error("Point is on stroke");
          if (end.x - start.x >= 0) {
            // Δx is +ve
            if (end.y - start.y >= 0) {
              // Δx and Δy both are +ve
              params.all_shapes.alter_shape_properties({
                ...shape,
                width: shape.width + 2 * (end.x - start.x),
                height: shape.height + 2 * (end.y - start.y),
              });
            } else {
              // Δx is +ve but Δy is -ve
              params.all_shapes.alter_shape_properties({
                ...shape,
                width: shape.width + 2 * (end.x - start.x),
                height: shape.height + 2 * (start.y - end.y),
              });
            }
          } else {
            // Δx is -ve
            if (end.y - start.y >= 0) {
              // Δx is -ve but Δy is +ve
              params.all_shapes.alter_shape_properties({
                ...shape,
                width: shape.width + 2 * (end.x - start.x),
                height: shape.height + 2 * (start.y - end.y),
              });
            } else {
              // Δx and Δy both are -ve
              params.all_shapes.alter_shape_properties({
                ...shape,
                width: shape.width + 2 * (end.x - start.x),
                height: shape.height + 2 * (end.y - start.y),
              });
            }
          }
          params.handle_set_start_point(end.x, end.y);
        } else if (params.ctx.isPointInPath(diamond, start.x, start.y)) {
          params.all_shapes.alter_shape_properties({
            ...shape,
            center: {
              x: center.x + (end.x - start.x),
              y: center.y + (end.y - start.y),
            },
          });
          params.handle_set_start_point(end.x, end.y);
        }
        break;
      }
    }
  }
}
