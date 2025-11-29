import { useRef, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import fix_dpi from "./fix_dpi";
import mouse_move_draw_canvas from "./mouse-move-draw-canvas";
import draw_all_shapes from "./draw-all-shapes";
import type { Shape, Shapes } from "@/types/whiteboard.types";

// const shapes: Shapes = [];

interface DrawCanvasProps {
  selected_btn: {
    selected_btn_id: string | null;
    handle_set_selected_btn_id: (id: string | null) => void;
  };
  all_shapes: {
    shapes: Shapes;
    push_new_curr_shape: (curr_shape: Shape) => void;
    delete_shape_by_id: (id: string) => void;
  };
}

export default function DrawCanvas(props: DrawCanvasProps) {
  // reference to canvas
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  // canvas related states
  const [start_point, set_start_point] = useState<{ x: number; y: number } | null>(null);
  const [is_drawing, set_is_drawing] = useState(false);
  const [curr_shape, set_curr_shape] = useState<Shape | null>(null);
  const [canvas_styles, set_canvas_styles] = useState({
    fill_style: "oklch(50% 0.15 30)",
    stroke_style: "oklch(50% 0.15 30)",
  });

  console.info(is_drawing, start_point, curr_shape);

  function handle_set_curr_shape(shape: Shape) {
    // // pencil logic
    // if (shape.type === "pencil" && !curr_shape) {
    //   // pushing initial pencil coordinates if newly selected-btn is "pencil"
    //   set_curr_shape(shape);
    //   return;
    // } else if (shape.type === "pencil" && curr_shape) {
    //   // pushing pencil coordinates if already selected-btn is "pencil"
    //   set_curr_shape((curr) => {
    //     return {
    //       id: shape.id,
    //       type: shape.type,
    //       // @ts-ignore
    //       points: [...curr.points, shape.points[0]],
    //     };
    //   });
    //   return;
    // }
    // push coordinates for types other than "pencil"
    set_curr_shape(shape);
  }

  function handle_set_start_point(x: number, y: number) {
    set_start_point({ x, y });
  }

  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!canvas) return;

    // using 2d-canvas context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    fix_dpi(canvas);

    ctx.strokeStyle = canvas_styles.fill_style;
  }, []);

  function handle_mouse_down(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvas_ref.current;
    if (!canvas) return;

    // using 2d-canvas context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // When clicking on canvas element, the mouse event (e) gives coordinates relative to the entire browser viewport (the visible window area). However, the canvas needs coordinates relative to its own top-left corner (0, 0).
    // The Element.getBoundingClientRect() method returns a position relative to the viewport.
    const canvas_pos = canvas.getBoundingClientRect();

    const scale_x = canvas.width / canvas_pos.width;
    const scale_y = canvas.height / canvas_pos.height;

    const current_x = Math.floor((e.clientX - canvas_pos.left) * scale_x) + 0.5;
    const current_y = Math.floor((e.clientY - canvas_pos.top) * scale_y) + 0.5;

    if (props.selected_btn.selected_btn_id === "text") {
      const font_size = 30;
      const text = prompt("Enter text: ");
      if (!text) return;

      // make text on canvas
      ctx.font = `${font_size}px Cursive`;
      ctx.strokeText(text.trim(), current_x, current_y);

      // push new curr-shape to shapes state
      props.all_shapes.push_new_curr_shape({
        id: nanoid(),
        text: text.trim(),
        type: "text",
        points: {
          start: { x: current_x, y: current_y },
          end: { x: current_x + font_size, y: current_y + font_size },
        },
      });
      // set to initial state values
      props.selected_btn.handle_set_selected_btn_id("cursor");
      set_start_point(null);
      set_is_drawing(false);
      return;
    }

    if (props.selected_btn.selected_btn_id && props.selected_btn.selected_btn_id !== "cursor") {
      set_start_point({ x: current_x, y: current_y });
      set_is_drawing(true);
    }
  }

  function handle_mouse_move(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!start_point || !is_drawing) {
      set_start_point(null);
      set_curr_shape(null);
      set_is_drawing(false);
      return;
    }

    const canvas = canvas_ref.current;
    if (!canvas) return;

    // use 2d-context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // clear canvas screen to avoid overlapping
    if (props.selected_btn.selected_btn_id !== "pencil") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // re-drawing all the canvas-shapes
      draw_all_shapes(props.all_shapes.shapes, ctx);
    }

    // When clicking on canvas element, the mouse event (e) gives coordinates relative to the entire browser viewport (the visible window area). However, the canvas needs coordinates relative to its own top-left corner (0, 0).
    // The Element.getBoundingClientRect() method returns a position relative to the viewport.
    const canvas_pos = canvas.getBoundingClientRect();

    const scale_x = canvas.width / canvas_pos.width;
    const scale_y = canvas.height / canvas_pos.height;

    const end_x = Math.floor((e.clientX - canvas_pos.left) * scale_x) + 0.5;
    const end_y = Math.floor((e.clientY - canvas_pos.top) * scale_y) + 0.5;

    ctx.lineWidth = 0.75;
    ctx.strokeStyle = canvas_styles.stroke_style;
    mouse_move_draw_canvas({
      selected_btn_id: props.selected_btn.selected_btn_id,
      start_point,
      end_point: { x: end_x, y: end_y },
      all_shapes: props.all_shapes,
      handle_set_curr_shape,
      handle_set_start_point,
      ctx,
    });
  }

  function handle_mouse_up(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!start_point || !is_drawing || !curr_shape) {
      set_start_point(null);
      set_curr_shape(null);
      set_is_drawing(false);
      return;
    }

    const canvas = canvas_ref.current;
    if (!canvas) return;

    // get 2d-context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // push curr-shape to shapes state
    props.all_shapes.push_new_curr_shape(curr_shape);

    set_start_point(null);
    set_curr_shape(null);
    set_is_drawing(false);
  }

  return (
    // internal drawing resolution vs css display size
    // mouse gives you: display coordinates (based on css size)
    // canvas needs: internal coordinates (based on width/height attributes)
    // @example - The shape drew at (20, 20) on the internal grid **appears at (40, 40)** on screen because everything is **2x bigger**!
    <canvas
      id="whiteboard-canvas"
      ref={canvas_ref}
      className="color-neutral color-neutral-content shrink-0 w-full rounded-xl"
      onMouseDown={handle_mouse_down}
      onMouseMove={handle_mouse_move}
      onMouseUp={handle_mouse_up}
      onPointerDown={handle_mouse_down}
      onPointerMove={handle_mouse_move}
      onPointerUp={handle_mouse_up}
    />
  );
}
