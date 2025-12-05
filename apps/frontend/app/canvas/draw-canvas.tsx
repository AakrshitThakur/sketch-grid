"use client";
import { useRef, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import fix_dpi from "./fix_dpi";
import mouse_move_draw_canvas from "./mouse-move-draw-canvas";
import mouse_move_drag_canvas from "./mouse-move-drag-canvas";
import draw_all_shapes from "./draw-all-shapes";
import type { Shape, Shapes } from "@/types/whiteboard.types";

interface DrawCanvasProps {
  selected_btn: {
    selected_btn_id: string | null;
    handle_set_selected_btn_id: (id: string | null) => void;
  };
  all_shapes: {
    shapes: Shapes;
    push_new_curr_shape: (curr_shape: Shape) => void;
    delete_shape_by_id: (id: string) => void;
    alter_shape_properties: (shape: Shape) => void;
  };
}

export default function DrawCanvas(props: DrawCanvasProps) {
  // reference to canvas
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  // canvas related states
  const [start_point, set_start_point] = useState<{ x: number; y: number } | null>(null);
  const [is_drawing, set_is_drawing] = useState(false);
  const [is_dragging, set_is_dragging] = useState(false);
  const [curr_shape, set_curr_shape] = useState<Shape | null>(null);
  const [canvas_styles, set_canvas_styles] = useState({
    fill_style: "oklch(50% 0.15 30)",
    stroke_style: "oklch(50% 0.15 30)",
  });

  function handle_set_curr_shape(shape: Shape) {
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

    // setting different modes on different selected btns
    if (props.selected_btn.selected_btn_id === "text") {
      const font_size = 30;
      const text = prompt("Enter text: ");
      if (!text) return;

      // make text on canvas
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.font = `${font_size}px Cursive`;
      // The HTML Canvas actualBoundingBoxAscent property of TextMetrics interface is a read-only method which returns a double value giving the distance from horizontal line indicated by the text baseline of CanvasRenderingContext2D interface context object to the "top" of the bounding rectangle box in which the text is rendered. The double value is given in CSS pixels.
      // The HTML Canvas actualBoundingBoxDescent property of TextMetrics interface is a read-only method which returns a double value giving the distance from horizontal line indicated by the text baseline of CanvasRenderingContext2D interface context object to the "bottom" of the bounding rectangle box in which the text is rendered. The double value is given in CSS pixels.
      const metrics = ctx.measureText(text.trim());
      const top_left_x = canvas.width / 2;
      const top_left_y = canvas.height / 2 - metrics.actualBoundingBoxAscent;
      ctx.fillText(text.trim(), top_left_x, top_left_y);

      // push new curr-shape to shapes state
      props.all_shapes.push_new_curr_shape({
        id: nanoid(),
        text: text.trim(),
        type: "text",
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
      // set to initial state values
      props.selected_btn.handle_set_selected_btn_id("cursor");
      set_start_point(null);
      set_is_drawing(false);
      set_is_dragging(false);
      return;
    }
  }, [props.selected_btn]);

  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!canvas) return;

    // using 2d-canvas context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    fix_dpi(canvas);

    // set the pre-requisite values for canvas session
    ctx.strokeStyle = canvas_styles.stroke_style;
    ctx.fillStyle = canvas_styles.fill_style;
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

    if (props.selected_btn.selected_btn_id === "cursor") {
      // unable user to drag existing shapes
      set_is_dragging(true);
      set_start_point({ x: current_x, y: current_y });
      return;
    } else if (props.selected_btn.selected_btn_id && props.selected_btn.selected_btn_id !== "cursor") {
      // unable user to draw new shapes
      set_start_point({ x: current_x, y: current_y });
      set_is_drawing(true);
    }
  }

  function handle_mouse_move(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!start_point || (!is_drawing && !is_dragging)) {
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

    // setting canvas pre-requisites
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = canvas_styles.stroke_style;

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

    // draw specific shape on mouse-move
    // drag specific shape
    if (is_dragging) {
      mouse_move_drag_canvas({
        start_point,
        end_point: { x: end_x, y: end_y },
        is_dragging,
        all_shapes: props.all_shapes,
        handle_set_start_point,
        ctx,
      });
      return;
    }
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
    if (!start_point || (!is_drawing && !is_dragging)) {
      set_start_point(null);
      set_curr_shape(null);
      set_is_drawing(false);
      set_is_dragging(false);
      return;
    }

    const canvas = canvas_ref.current;
    if (!canvas) return;

    // get 2d-context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // push curr-shape to shapes state
    if (is_drawing && curr_shape) props.all_shapes.push_new_curr_shape(curr_shape);

    set_start_point(null);
    set_curr_shape(null);
    set_is_drawing(false);
    set_is_dragging(false);
  }

  return (
    // internal drawing resolution vs css display size
    // mouse gives you: display coordinates (based on css size)
    // canvas needs: internal coordinates (based on width/height attributes)
    // @example - The shape drew at (20, 20) on the internal grid **appears at (40, 40)** on screen because everything is **2x bigger**!
    <canvas
      id="whiteboard-canvas"
      ref={canvas_ref}
      className="color-neutral color-neutral-content shrink-0 w-full rounded-xl touch-none"
      onMouseDown={handle_mouse_down}
      onMouseMove={handle_mouse_move}
      onMouseUp={handle_mouse_up}
      onPointerDown={handle_mouse_down}
      onPointerMove={handle_mouse_move}
      onPointerUp={handle_mouse_up}
    />
  );
}
