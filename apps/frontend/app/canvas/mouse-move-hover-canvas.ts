import type { Point, Shapes } from "@repo/types/index";
import {
  ARROW_DRAG_STROKE_WIDTH,
  BOX_DRAG_STOKE_WIDTH,
  CIRCLE_DRAG_STOKE_WIDTH,
  DIAMOND_DRAG_STROKE_WIDTH,
  TEXT_BOX_DRAG_STROKE_WIDTH,
} from "@/constants/whiteboard.constants";

interface Params {
  end_point: Point;
  all_shapes: {
    shapes: Shapes;
  };
  ctx: CanvasRenderingContext2D;
}

export default function mouse_move_hover_canvas(params: Params) {
  const whiteboard_canvas = window.document.getElementById("whiteboard-canvas");
  const end = { x: params.end_point.x, y: params.end_point.y };

  function add_move_cursor_only(canvas: HTMLElement | null) {
    //  Adds the specified class(es) to the element's class attribute
    // If the class already exists on the element, it won't add it again (no duplicates)
    canvas && canvas.classList.add("move");
    remove_n_resize_cursor(canvas);
    remove_e_resize_cursor(canvas);
    remove_n_w_resize_cursor(canvas);
    remove_n_e_resize_cursor(canvas);
  }
  function add_n_resize_cursor_only(canvas: HTMLElement | null) {
    canvas && canvas.classList.add("n-resize");
    remove_move_cursor(canvas);
    remove_e_resize_cursor(canvas);
    remove_n_w_resize_cursor(canvas);
    remove_n_e_resize_cursor(canvas);
  }
  function add_e_resize_cursor_only(canvas: HTMLElement | null) {
    canvas && canvas.classList.add("e-resize");
    remove_move_cursor(canvas);
    remove_n_resize_cursor(canvas);
    remove_n_w_resize_cursor(canvas);
    remove_n_e_resize_cursor(canvas);
  }
  function add_n_e_resize_cursor_only(canvas: HTMLElement | null) {
    canvas && canvas.classList.add("ne-resize");
    remove_move_cursor(canvas);
    remove_n_resize_cursor(canvas);
    remove_e_resize_cursor(canvas);
    remove_n_w_resize_cursor(canvas);
  }
  function add_n_w_resize_cursor_only(canvas: HTMLElement | null) {
    canvas && canvas.classList.add("nw-resize");
    remove_move_cursor(canvas);
    remove_n_resize_cursor(canvas);
    remove_e_resize_cursor(canvas);
    remove_n_e_resize_cursor(canvas);
  }

  function remove_move_cursor(canvas: HTMLElement | null) {
    // Removes the specified class(es) from the element's class attribute
    // If the class doesn't exist on the element, it does nothing (no error thrown)
    canvas && canvas.classList.remove("move");
  }
  function remove_n_resize_cursor(canvas: HTMLElement | null) {
    canvas && canvas.classList.remove("n-resize");
  }
  function remove_e_resize_cursor(canvas: HTMLElement | null) {
    canvas && canvas.classList.remove("e-resize");
  }
  function remove_n_e_resize_cursor(canvas: HTMLElement | null) {
    canvas && canvas.classList.remove("ne-resize");
  }
  function remove_n_w_resize_cursor(canvas: HTMLElement | null) {
    canvas && canvas.classList.remove("nw-resize");
  }
  function remove_all_cursor_types(canvas: HTMLElement | null) {
    if (!canvas) return;

    remove_move_cursor(canvas);
    remove_n_resize_cursor(canvas);
    remove_e_resize_cursor(canvas);
    remove_n_w_resize_cursor(canvas);
    remove_n_e_resize_cursor(canvas);
  }

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

        if (
          params.ctx.isPointInStroke(left_to_right, end.x, end.y) ||
          params.ctx.isPointInStroke(right_to_left, end.x, end.y)
        ) {
          add_n_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (
          params.ctx.isPointInStroke(top_to_bottom, end.x, end.y) ||
          params.ctx.isPointInStroke(bottom_to_top, end.x, end.y)
        ) {
          add_e_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInPath(box, end.x, end.y)) {
          add_move_cursor_only(whiteboard_canvas);
          return;
        }
        break;
      }
      case "circle": {
        const center = shape.center;
        const radius = shape.radius;

        params.ctx.lineWidth = CIRCLE_DRAG_STOKE_WIDTH;

        const first_quadrant_circle = new Path2D();
        first_quadrant_circle.arc(center.x, center.y, radius, -Math.PI / 2, 0, false);
        const second_quadrant_circle = new Path2D();
        second_quadrant_circle.arc(center.x, center.y, radius, 0, Math.PI / 2, false);
        const third_quadrant_circle = new Path2D();
        third_quadrant_circle.arc(center.x, center.y, radius, Math.PI / 2, Math.PI, false);
        const forth_quadrant_circle = new Path2D();
        forth_quadrant_circle.arc(center.x, center.y, radius, Math.PI, -Math.PI / 2, false);

        // creating a full-circle to check if point lies inside the circle or not
        const circle = new Path2D();
        circle.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);

        // checking where does the point lies inside or at the edge
        if (params.ctx.isPointInStroke(first_quadrant_circle, end.x, end.y)) {
          // point lies on the edge of first-quadrant-circle
          add_n_e_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInStroke(second_quadrant_circle, end.x, end.y)) {
          // point lies on the edge of last-half-circle
          add_n_w_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInStroke(third_quadrant_circle, end.x, end.y)) {
          add_n_e_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInStroke(forth_quadrant_circle, end.x, end.y)) {
          // point lies on the edge of last-half-circle
          add_n_w_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInPath(circle, end.x, end.y)) {
          // point lies inside the circle
          // change the position of circle
          add_move_cursor_only(whiteboard_canvas);
          return;
        }
        break;
      }
      case "arrow": {
        // start & end coordinates of line-segment
        const line_start = { x: shape.points.start.x, y: shape.points.start.y };
        const line_end = { x: shape.points.end.x, y: shape.points.end.y };

        // make an identical line-segment for validations but not printing it
        params.ctx.lineWidth = ARROW_DRAG_STROKE_WIDTH;
        const line_segment = new Path2D();
        line_segment.moveTo(line_start.x, line_start.y);
        line_segment.lineTo(line_end.x, line_end.y);

        // checking if point is on stoke of line-segment
        if (params.ctx.isPointInStroke(line_segment, end.x, end.y)) {
          add_move_cursor_only(whiteboard_canvas);
          return;
        }
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

        if (params.ctx.isPointInStroke(left_to_right, end.x, end.y)) {
          // point lies on the upper-edge of the text-box
          add_n_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInStroke(top_to_bottom, end.x, end.y)) {
          // point lies on the right-edge of the text-box
          add_e_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInStroke(right_to_left, end.x, end.y)) {
          // point lies on the bottom-edge of the text-box
          add_n_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInStroke(bottom_to_top, end.x, end.y)) {
          // point lies on the left-edge of the text-box
          add_e_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInPath(box, end.x, end.y)) {
          // checking if point lies inside the text-box or not
          add_move_cursor_only(whiteboard_canvas);
          return;
        }
        break;
      }
      case "diamond": {
        // get diamond-data from global shapes state
        const center = shape.center;
        const width = shape.width;
        const height = shape.height;

        params.ctx.lineWidth = DIAMOND_DRAG_STROKE_WIDTH;

        const n_e_edge = new Path2D();
        n_e_edge.moveTo(center.x, center.y - height);
        n_e_edge.lineTo(center.x + width, center.y);

        const s_e_edge = new Path2D();
        s_e_edge.moveTo(center.x + width, center.y);
        s_e_edge.lineTo(center.x, center.y + height);

        const s_w_edge = new Path2D();
        s_w_edge.moveTo(center.x, center.y + height);
        s_w_edge.lineTo(center.x - width, center.y);

        const n_w_edge = new Path2D();
        n_w_edge.moveTo(center.x - width, center.y);
        n_w_edge.lineTo(center.x, center.y - height);

        // diamond to check if point lies inside the diamond
        const diamond = new Path2D();
        diamond.moveTo(center.x, center.y - height);
        diamond.lineTo(center.x + width, center.y);
        diamond.lineTo(center.x, center.y + height);
        diamond.lineTo(center.x - width, center.y);
        diamond.closePath();

        if (params.ctx.isPointInStroke(n_e_edge, end.x, end.y)) {
          // point lies on the right-hand-side edges of diamond
          add_n_e_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInStroke(s_e_edge, end.x, end.y)) {
          // point lies on the left-hand-side edges of diamond
          add_n_w_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInStroke(s_w_edge, end.x, end.y)) {
          // point lies on the left-hand-side edges of diamond
          add_n_e_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInStroke(n_w_edge, end.x, end.y)) {
          add_n_w_resize_cursor_only(whiteboard_canvas);
          return;
        } else if (params.ctx.isPointInPath(diamond, end.x, end.y)) {
          // point lies inside diamond
          add_move_cursor_only(whiteboard_canvas);
          return;
        }
        break;
      }
    }
    remove_all_cursor_types(whiteboard_canvas);
  }
}
