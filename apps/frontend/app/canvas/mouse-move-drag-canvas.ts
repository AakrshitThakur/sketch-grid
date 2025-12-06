import type { Point, Shapes, Shape } from "@/types/whiteboard.types";
import {
  ARROW_DRAG_STROKE_WIDTH,
  BOX_DRAG_STOKE_WIDTH,
  CIRCLE_DRAG_STOKE_WIDTH,
  DIAMOND_DRAG_STROKE_WIDTH,
  TEXT_BOX_DRAG_STROKE_WIDTH,
} from "@/constants/whiteboard.constants";

interface Params {
  start_point: Point;
  end_point: Point;
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
        // get box-credentials from shapes state
        const box_start = { x: shape.point.x, y: shape.point.y };
        const box_width = shape.width;
        const box_height = shape.height;

        params.ctx.lineWidth = BOX_DRAG_STOKE_WIDTH;

        // left-to-right line
        const left_to_right = new Path2D();
        left_to_right.moveTo(box_start.x, box_start.y);
        left_to_right.lineTo(box_start.x + box_width, box_start.y);

        // top-to-bottom line
        const top_to_bottom = new Path2D();
        top_to_bottom.moveTo(box_start.x + box_width, box_start.y);
        top_to_bottom.lineTo(box_start.x + box_width, box_start.y + box_height);

        // right-to-left line
        const right_to_left = new Path2D();
        right_to_left.moveTo(box_start.x + box_width, box_start.y + box_height);
        right_to_left.lineTo(box_start.x, box_start.y + box_height);

        // bottom-to-top line
        const bottom_to_top = new Path2D();
        bottom_to_top.moveTo(box_start.x, box_start.y + box_height);
        bottom_to_top.lineTo(box_start.x, box_start.y);

        // full-box
        const box = new Path2D();
        box.rect(box_start.x, box_start.y, box_width, box_height);

        if (params.ctx.isPointInStroke(left_to_right, start.x, start.y)) {
          // point lies on the edge of left-to-right line
          params.all_shapes.alter_shape_properties({
            ...shape,
            point: { x: shape.point.x, y: shape.point.y + (end.y - start.y) },
            height: shape.height - (end.y - start.y),
          });
        } else if (params.ctx.isPointInStroke(top_to_bottom, start.x, start.y)) {
          // point lies on the edge of top-to-bottom line
          params.all_shapes.alter_shape_properties({
            ...shape,
            width: shape.width + (end.x - start.x),
          });
        } else if (params.ctx.isPointInStroke(right_to_left, start.x, start.y)) {
          // point lies on the edge of right-to-left line
          params.all_shapes.alter_shape_properties({
            ...shape,
            height: shape.height + (end.y - start.y),
          });
        } else if (params.ctx.isPointInStroke(bottom_to_top, start.x, start.y)) {
          // point lies on the edge of bottom-to-top line
          params.all_shapes.alter_shape_properties({
            ...shape,
            point: { x: shape.point.x + (end.x - start.x), y: shape.point.y },
            width: shape.width - (end.x - start.x),
          });
        } else if (params.ctx.isPointInPath(box, start.x, start.y)) {
          // point lies inside the box
          // change the position of box
          params.all_shapes.alter_shape_properties({
            ...shape,
            point: { x: shape.point.x + (end.x - start.x), y: shape.point.y + (end.y - start.y) },
          });
        }
        // change mouse-down coordinates
        params.handle_set_start_point(end.x, end.y);
        break;
      }
      case "circle": {
        const center = shape.center;
        const radius = shape.radius;

        params.ctx.lineWidth = CIRCLE_DRAG_STOKE_WIDTH;

        // creating 2 semi-circles for validations
        const first_half_circle = new Path2D();
        first_half_circle.arc(center.x, center.y, radius, -Math.PI / 2, Math.PI / 2, false);
        const last_half_circle = new Path2D();
        last_half_circle.arc(center.x, center.y, radius, Math.PI / 2, -Math.PI / 2, false);

        // creating a full-circle to check if point lies inside the circle or not
        const circle = new Path2D();
        circle.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);

        // checking where does the point lies inside or at the edge
        if (params.ctx.isPointInStroke(first_half_circle, start.x, start.y)) {
          // point lies on the edge of first-half-circle
          const d = Math.pow(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2), 0.5);
          if (end.x - start.x >= 0) {
            // Δx is +ve
            if (end.y - start.y >= 0) {
              // Δx and Δy both are +ve
              // Increase radius of circle
              params.all_shapes.alter_shape_properties({ ...shape, radius: shape.radius + d });
            } else {
              // Δx is +ve but Δy is -ve
              // Increase radius of circle
              params.all_shapes.alter_shape_properties({ ...shape, radius: shape.radius + d });
            }
          } else {
            // Δx is -ve
            if (end.y - start.y >= 0) {
              // Δx is -ve but Δy is +ve
              // decrease radius of circle
              params.all_shapes.alter_shape_properties({ ...shape, radius: shape.radius - d });
            } else {
              // Δx and Δy both are -ve
              // decrease radius of circle
              params.all_shapes.alter_shape_properties({ ...shape, radius: shape.radius - d });
            }
          }
        } else if (params.ctx.isPointInStroke(last_half_circle, start.x, start.y)) {
          // point lies on the edge of last-half-circle
          const d = Math.pow(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2), 0.5);
          if (end.x - start.x >= 0) {
            // Δx is +ve
            if (end.y - start.y >= 0) {
              // Δx and Δy both are +ve
              // Decrease radius of circle
              params.all_shapes.alter_shape_properties({ ...shape, radius: shape.radius - d });
            } else {
              // Δx is +ve but Δy is -ve
              // Decrease radius of circle
              params.all_shapes.alter_shape_properties({ ...shape, radius: shape.radius - d });
            }
          } else {
            // Δx is -ve
            if (end.y - start.y >= 0) {
              // Δx is -ve but Δy is +ve
              // decrease radius of circle
              params.all_shapes.alter_shape_properties({ ...shape, radius: shape.radius + d });
            } else {
              // Δx and Δy both are -ve
              // decrease radius of circle
              params.all_shapes.alter_shape_properties({ ...shape, radius: shape.radius + d });
            }
          }
        } else if (params.ctx.isPointInPath(circle, start.x, start.y)) {
          // point lies inside the circle
          // change the position of circle
          params.all_shapes.alter_shape_properties({
            ...shape,
            center: { x: shape.center.x + (end.x - start.x), y: shape.center.y + (end.y - start.y) },
          });
        }
        params.handle_set_start_point(end.x, end.y);
        break;
      }
      case "arrow": {
        // start & end coordinates of line-segment
        const line_start = { x: shape.points.start.x, y: shape.points.start.y };
        const line_end = { x: shape.points.end.x, y: shape.points.end.y };

        params.ctx.lineWidth = ARROW_DRAG_STROKE_WIDTH;

        // make an identical line-segment for validations but not printing it
        const line_segment = new Path2D();
        line_segment.moveTo(line_start.x, line_start.y);
        line_segment.lineTo(line_end.x, line_end.y);

        // checking if point is on stoke of line-segment
        if (params.ctx.isPointInStroke(line_segment, start.x, start.y)) {
          params.all_shapes.alter_shape_properties({
            ...shape,
            points: {
              start: { x: shape.points.start.x + (end.x - start.x), y: shape.points.start.y + (end.y - start.y) },
              end: { x: shape.points.end.x + (end.x - start.x), y: shape.points.end.y + (end.y - start.y) },
            },
          });
        }
        params.handle_set_start_point(end.x, end.y);
        break;
      }
      case "text": {
        const start_text = { x: shape.points.start.x, y: shape.points.start.y };
        const end_text = { x: shape.points.end.x, y: shape.points.end.y };

        params.ctx.lineWidth = TEXT_BOX_DRAG_STROKE_WIDTH;

        // box to check if point lies inside the text-box
        const box = new Path2D();
        box.rect(start_text.x, start_text.y, end_text.x - start_text.x, end_text.y - start_text.y);
        box.closePath();

        // left-to-right line to check if point lies on the upper-edge of text-box
        const left_to_right = new Path2D();
        left_to_right.moveTo(start_text.x, start_text.y);
        left_to_right.lineTo(end_text.x, start_text.y);

        // top-to-bottom line to check if point lies on the right-edge of text-box
        const top_to_bottom = new Path2D();
        top_to_bottom.moveTo(end_text.x, start_text.y);
        top_to_bottom.lineTo(end_text.x, end_text.y);

        // right-to-left line to check if point lies on the bottom-edge of text-box
        const right_to_left = new Path2D();
        right_to_left.moveTo(end_text.x, end_text.y);
        right_to_left.lineTo(start_text.x, end_text.y);

        // bottom-to-top line to check if point lies on the left-edge of text-box
        const bottom_to_top = new Path2D();
        bottom_to_top.moveTo(start_text.x, end_text.y);
        bottom_to_top.lineTo(start_text.x, start_text.y);

        if (params.ctx.isPointInStroke(left_to_right, start.x, start.y)) {
          // point lies on the upper-edge of the text-box
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
        } else if (params.ctx.isPointInStroke(top_to_bottom, start.x, start.y)) {
          // point lies on the right-edge of the text-box
          const font_size = shape.font.font_size + (end.x - start.x);

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
        } else if (params.ctx.isPointInStroke(bottom_to_top, start.x, start.y)) {
          // point lies on the bottom-edge of the text-box
          const font_size = shape.font.font_size - (end.x - start.x);

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
        } else if (params.ctx.isPointInStroke(right_to_left, start.x, start.y)) {
          // point lies on the left-edge of the text-box
          const font_size = shape.font.font_size + (end.y - start.y);

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
        } else if (params.ctx.isPointInPath(box, start.x, start.y)) {
          // checking if point lies inside the text-box or not
          params.all_shapes.alter_shape_properties({
            ...shape,
            points: {
              start: { x: shape.points.start.x + (end.x - start.x), y: shape.points.start.y + (end.y - start.y) },
              end: { x: shape.points.end.x + (end.x - start.x), y: shape.points.end.y + (end.y - start.y) },
            },
          });
        }
        params.handle_set_start_point(end.x, end.y);
        break;
      }
      case "diamond": {
        // get diamond-data from global shapes state
        const center = shape.center;
        const width = shape.width;
        const height = shape.height;

        params.ctx.lineWidth = DIAMOND_DRAG_STROKE_WIDTH;

        // right-diamond to check if point lies on the right edges of diamond
        const right_diamond = new Path2D();
        right_diamond.moveTo(center.x, center.y - height);
        right_diamond.lineTo(center.x + width, center.y);
        right_diamond.lineTo(center.x, center.y + height);

        // left-diamond to check if point lies on the left edges of diamond
        const left_diamond = new Path2D();
        left_diamond.moveTo(center.x, center.y + height);
        left_diamond.lineTo(center.x - width, center.y);
        left_diamond.lineTo(center.x, center.y - height);

        // diamond to check if point lies inside the diamond
        const diamond = new Path2D();
        diamond.moveTo(center.x, center.y - height);
        diamond.lineTo(center.x + width, center.y);
        diamond.lineTo(center.x, center.y + height);
        diamond.lineTo(center.x - width, center.y);
        diamond.closePath();

        if (params.ctx.isPointInStroke(right_diamond, start.x, start.y)) {
          // point lies on the right-hand-side edges of diamond
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
        } else if (params.ctx.isPointInStroke(left_diamond, start.x, start.y)) {
          // point lies on the left-hand-side edges of diamond
          if (end.x - start.x >= 0) {
            // Δx is +ve
            if (end.y - start.y >= 0) {
              // Δx and Δy both are +ve
              params.all_shapes.alter_shape_properties({
                ...shape,
                width: shape.width - 2 * (end.x - start.x),
                height: shape.height - 2 * (end.y - start.y),
              });
            } else {
              // Δx is +ve but Δy is -ve
              params.all_shapes.alter_shape_properties({
                ...shape,
                width: shape.width - 2 * (end.x - start.x),
                height: shape.height - 2 * (start.y - end.y),
              });
            }
          } else {
            // Δx is -ve
            if (end.y - start.y >= 0) {
              // Δx is -ve but Δy is +ve
              params.all_shapes.alter_shape_properties({
                ...shape,
                width: shape.width - 2 * (end.x - start.x),
                height: shape.height - 2 * (start.y - end.y),
              });
            } else {
              // Δx and Δy both are -ve
              params.all_shapes.alter_shape_properties({
                ...shape,
                width: shape.width - 2 * (end.x - start.x),
                height: shape.height - 2 * (end.y - start.y),
              });
            }
          }
        } else if (params.ctx.isPointInPath(diamond, start.x, start.y)) {
          // point lies inside diamond
          params.all_shapes.alter_shape_properties({
            ...shape,
            center: {
              x: center.x + (end.x - start.x),
              y: center.y + (end.y - start.y),
            },
          });
        }
        params.handle_set_start_point(end.x, end.y);
        break;
      }
    }
  }
}
