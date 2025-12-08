import { nanoid } from "nanoid";
import type { Shape, Shapes } from "@repo/types/index";

interface Props {
  selected_btn_id: string | null;
  start_point: { x: number; y: number };
  end_point: { x: number; y: number };
  all_shapes: {
    shapes: Shapes;
    push_new_curr_shape: (curr_shape: Shape) => void;
    delete_shape_by_id: (id: string) => void;
  };
  handle_set_curr_shape: (shape: Shape) => void;
  handle_set_start_point: (x: number, y: number) => void;
  ctx: CanvasRenderingContext2D;
}

export default function mouse_move_draw_canvas(props: Props) {
  // mouse-down coordinate
  const start = { x: props.start_point.x, y: props.start_point.y };
  // mouse-move coordinate
  const end = { x: props.end_point.x, y: props.end_point.y };

  switch (props.selected_btn_id) {
    case "circle": {
      const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      // A path = the shape you describe with drawing commands. It won’t appear until you stroke() or fill() it. Path2D lets you build a shape once and reuse it.
      // beginPath() -> Forget all previous lines and start fresh
      props.ctx.beginPath();
      // make circle 0(pi) to 2(pi)
      props.ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI, false);
      // stroke current path
      props.ctx.stroke();

      // push circle to global shapes array
      props.handle_set_curr_shape({
        id: nanoid(),
        type: "circle",
        center: { x: start.x, y: start.y },
        radius,
      });
      break;
    }
    case "box": {
      // set width & height
      const width = end.x - start.x;
      const height = end.y - start.y;

      // print box shape on canvas
      props.ctx.strokeRect(start.x, start.y, width, height);

      // push box to global shapes array
      props.handle_set_curr_shape({
        id: nanoid(),
        type: "box",
        point: { x: start.x, y: start.y },
        width,
        height,
      });
      break;
    }
    case "arrow": {
      props.ctx.beginPath();
      props.ctx.moveTo(start.x, start.y);
      props.ctx.lineTo(end.x, end.y);
      // stroke current path
      props.ctx.stroke();

      // Math.atan2() static method returns the angle in the plane (in radians) between the positive x-axis and the ray from (0, 0) to the point (x, y), for Math.atan2(y, x).
      // Note: With atan2(), the y coordinate is passed as the first argument and the x coordinate is passed as the second argument.
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const head_length = 15;

      // drawing 2 lines forming arrow-head
      // haven't understood it
      props.ctx.beginPath();
      props.ctx.moveTo(end.x, end.y);
      props.ctx.lineTo(
        end.x - head_length * Math.cos(angle - Math.PI / 6),
        end.y - head_length * Math.sin(angle - Math.PI / 6)
      );
      props.ctx.moveTo(end.x, end.y);
      props.ctx.lineTo(
        end.x - head_length * Math.cos(angle + Math.PI / 6),
        end.y - head_length * Math.sin(angle + Math.PI / 6)
      );
      // print current stroke
      props.ctx.stroke();

      // push arrow to global shapes array
      props.handle_set_curr_shape({
        id: nanoid(),
        type: "arrow",
        points: {
          start: { x: start.x, y: start.y },
          end: { x: end.x, y: end.y },
        },
      });
      break;
    }
    case "diamond": {
      // find center of straight line forming from starting and ending coordinates
      const center_x = (start.x + end.x) / 2;
      const center_y = (start.y + end.y) / 2;

      // calc width & height
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);

      // drawing all the four vertices from the center
      props.ctx.beginPath();
      props.ctx.moveTo(center_x, center_y - height);
      props.ctx.lineTo(center_x + width, center_y);
      props.ctx.lineTo(center_x, center_y + height);
      props.ctx.lineTo(center_x - width, center_y);
      props.ctx.closePath();
      props.ctx.stroke();

      // push diamond to global shapes state
      props.handle_set_curr_shape({
        id: nanoid(),
        type: "diamond",
        center: { x: center_x, y: center_y },
        width,
        height,
      });
      break;
    }
    case "eraser": {
      // iterate all shapes to check if mouse-move coordinate land inside the shape
      for (let shape of props.all_shapes.shapes) {
        switch (shape.type) {
          case "box": {
            const box_start = { x: shape.point.x, y: shape.point.y };
            // checking if point lies inside the box
            if (
              end.x >= Math.min(box_start.x, box_start.x + shape.width) &&
              end.x <= Math.max(box_start.x, box_start.x + shape.width) &&
              end.y >= Math.min(box_start.y, box_start.y + shape.height) &&
              end.y <= Math.max(box_start.y, box_start.y + shape.height)
            ) {
              props.all_shapes.delete_shape_by_id(shape.id);
            }
            break;
          }
          case "circle": {
            // checking if point lies inside the circle
            if (Math.pow(shape.center.x - end.x, 2) + Math.pow(shape.center.y - end.y, 2) <= Math.pow(shape.radius, 2)) {
              props.all_shapes.delete_shape_by_id(shape.id);
            }
            break;
          }
          case "arrow": {
            const line_start = { x: shape.points.start.x, y: shape.points.start.y };
            const line_end = { x: shape.points.end.x, y: shape.points.end.y };

            props.ctx.lineWidth = 10;
            const line_segment = new Path2D();
            line_segment.moveTo(line_start.x, line_start.y);
            line_segment.lineTo(line_end.x, line_end.y);

            // checking if point lies on the edge of arrow-line
            if (props.ctx.isPointInStroke(line_segment, end.x, end.y)) {
              props.all_shapes.delete_shape_by_id(shape.id);
            }
            break;
          }
          case "text": {
            const start_text = { x: shape.points.start.x, y: shape.points.start.y };
            const end_text = { x: shape.points.end.x, y: shape.points.end.y };

            const box = new Path2D();
            box.rect(start_text.x, start_text.y, Math.abs(end_text.x - start_text.x), Math.abs(end_text.y - start_text.y));

            // checking if point lies inside the text-box
            if (props.ctx.isPointInPath(box, end.x, end.y)) {
              props.all_shapes.delete_shape_by_id(shape.id);
            }
            break;
          }
          case "diamond": {
            // get diamond-data from global shapes state
            const center = shape.center;
            const height = shape.height;
            const width = shape.width;

            // make a diamond but do not print it on the canvas whiteboard
            const diamond = new Path2D();
            diamond.moveTo(center.x, center.y - height);
            diamond.lineTo(center.x + width, center.y);
            diamond.lineTo(center.x, center.y + height);
            diamond.lineTo(center.x - width, center.y);
            diamond.closePath();

            // checking if point lies inside the diamond
            if (props.ctx.isPointInPath(diamond, end.x, end.y)) {
              props.all_shapes.delete_shape_by_id(shape.id);
            }
            break;
          }
        }
      }
    }
  }
}
