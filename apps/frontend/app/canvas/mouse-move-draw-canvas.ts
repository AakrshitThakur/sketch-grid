import { nanoid } from "nanoid";
import type { Shape, Shapes } from "@/types/whiteboard.types";
import { space } from "postcss/lib/list";
import { GiPointySword } from "react-icons/gi";

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
  const start = { x: props.start_point.x, y: props.start_point.y };
  const end = { x: props.end_point.x, y: props.end_point.y };
  switch (props.selected_btn_id) {
    case "circle": {
      const radius = Math.sqrt(
        Math.pow(props.end_point.x - props.start_point.x, 2) + Math.pow(props.end_point.y - props.start_point.y, 2)
      );
      // A path = the shape you describe with drawing commands. It won’t appear until you stroke() or fill() it. Path2D lets you build a shape once and reuse it.
      // beginPath() -> Forget all previous lines and start fresh
      props.ctx.beginPath();
      // print shape on canvas
      props.ctx.arc(props.start_point.x, props.start_point.y, radius, 0, 2 * Math.PI, false);
      props.ctx.stroke();

      // push box to global shapes array
      props.handle_set_curr_shape({
        id: nanoid(),
        type: "circle",
        center: { x: props.start_point.x, y: props.start_point.y },
        radius,
      });
      break;
    }
    case "box": {
      const width = props.end_point.x - props.start_point.x;
      const height = props.end_point.y - props.start_point.y;
      // print shape on canvas
      props.ctx.strokeRect(props.start_point.x, props.start_point.y, width, height);

      // push box to global shapes array
      props.handle_set_curr_shape({
        id: nanoid(),
        type: "box",
        point: { x: props.start_point.x, y: props.start_point.y },
        width,
        height,
      });
      break;
    }
    case "arrow": {
      props.ctx.beginPath();
      // print shape on canvas
      props.ctx.moveTo(props.start_point.x, props.start_point.y);
      props.ctx.lineTo(props.end_point.x, props.end_point.y);
      props.ctx.stroke();

      // Math.atan2() static method returns the angle in the plane (in radians) between the positive x-axis and the ray from (0, 0) to the point (x, y), for Math.atan2(y, x).
      // Note: With atan2(), the y coordinate is passed as the first argument and the x coordinate is passed as the second argument.
      const angle = Math.atan2(props.end_point.y - props.start_point.y, props.end_point.x - props.start_point.x);
      const head_length = 15;

      // drawing 2 lines forming arrow-head
      // haven't understood it
      props.ctx.beginPath();
      props.ctx.moveTo(props.end_point.x, props.end_point.y);
      props.ctx.lineTo(
        props.end_point.x - head_length * Math.cos(angle - Math.PI / 6),
        props.end_point.y - head_length * Math.sin(angle - Math.PI / 6)
      );
      props.ctx.moveTo(props.end_point.x, props.end_point.y);
      props.ctx.lineTo(
        props.end_point.x - head_length * Math.cos(angle + Math.PI / 6),
        props.end_point.y - head_length * Math.sin(angle + Math.PI / 6)
      );
      props.ctx.stroke();

      // push box to global shapes array
      props.handle_set_curr_shape({
        id: nanoid(),
        type: "arrow",
        points: {
          start: { x: props.start_point.x, y: props.start_point.y },
          end: { x: props.end_point.x, y: props.end_point.y },
        },
      });
      break;
    }
    case "pencil": {
      props.ctx.beginPath();
      // draw a tiny line
      props.ctx.moveTo(props.start_point.x, props.start_point.y);
      props.ctx.lineTo(props.end_point.x, props.end_point.y);
      props.ctx.stroke();

      // save points to global shapes
      props.handle_set_curr_shape({
        id: nanoid(),
        type: "pencil",
        points: [
          {
            from: { x: props.start_point.x, y: props.start_point.y },
            to: { x: props.end_point.x, y: props.end_point.y },
          },
        ],
      });
      props.handle_set_start_point(props.end_point.x, props.end_point.y);
      break;
    }
    case "diamond": {
      // find center of straight line forming from starting and ending coordinates
      const center_x = (props.start_point.x + props.end_point.x) / 2;
      const center_y = (props.start_point.y + props.end_point.y) / 2;

      // calc width & height
      const width = Math.abs(props.end_point.x - props.start_point.x);
      const height = Math.abs(props.end_point.y - props.start_point.y);

      // drawing all the four vertices from the center
      props.ctx.beginPath();
      props.ctx.moveTo(center_x, center_y - height);
      props.ctx.lineTo(center_x + width, center_y);
      props.ctx.lineTo(center_x, center_y + height);
      props.ctx.lineTo(center_x - width, center_y);
      props.ctx.closePath();
      props.ctx.stroke();

      // set current shape being drawn
      props.handle_set_curr_shape({
        id: nanoid(),
        type: "diamond",
        points: {
          start: { x: props.start_point.x, y: props.start_point.y },
          end: { x: props.end_point.x, y: props.end_point.y },
        },
      });
      break;
    }
    case "eraser": {
      for (let shape of props.all_shapes.shapes) {
        switch (shape.type) {
          case "box": {
            if (
              end.x >= shape.point.x &&
              end.x <= shape.point.x + shape.width &&
              end.y >= shape.point.y &&
              end.y <= shape.point.y + shape.height
            ) {
              props.all_shapes.delete_shape_by_id(shape.id);
            }
            break;
          }
          case "circle": {
            if (Math.pow(shape.center.x - end.x, 2) + Math.pow(shape.center.y - end.y, 2) <= Math.pow(shape.radius, 2)) {
              props.all_shapes.delete_shape_by_id(shape.id);
            }
            break;
          }
          case "arrow": {
            const point = { x: props.end_point.x, y: props.end_point.y };

            // Compute 2D cross product of vectors AP and AB.
            // if the result is 0 (or very close), then point P lies on the infinite line through A → B.
            // AP = (px - ax, py - ay) & AB = (bx - ax, by - ay)
            // cross = (AP.x * AB.y) - (AP.y * AB.x)
            const ux_vy = (point.x - start.x) * (end.y - start.y);
            const vx_uy = (point.y - start.y) * (end.x - start.x);
            const cross_product = ux_vy - vx_uy;

            // check if collinear (allowing small floating error)
            if (Math.abs(cross_product) > 1e-10) return;

            const within_x_min = point.x >= Math.min(start.x, end.x);
            const within_x_max = point.x <= Math.max(start.x, end.x);
            const within_y_min = point.y >= Math.min(start.y, end.y);
            const within_y_max = point.y <= Math.max(start.y, end.y);

            if (within_x_min && within_x_max && within_y_min && within_y_max) {
              props.all_shapes.delete_shape_by_id(shape.id);
            }
          }
        }
      }
    }
  }
}
