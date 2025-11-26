import { nanoid } from "nanoid";
import type { Shape, Shapes } from "@/types/whiteboard.types";

interface Props {
  selected_btn_id: string | null;
  start_point: { x: number; y: number };
  end_point: { x: number; y: number };
  handle_set_curr_shape: (shape: Shape) => void;
  ctx: CanvasRenderingContext2D;
}

export default function mouse_move_draw_canvas(props: Props) {
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
  }
}
