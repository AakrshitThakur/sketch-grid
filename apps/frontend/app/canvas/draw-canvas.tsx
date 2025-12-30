"use client";
import { useRef, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import mouse_move_draw_canvas from "./mouse-move-draw-canvas";
import mouse_move_drag_canvas from "./mouse-move-drag-canvas";
import mouse_move_hover_canvas from "./mouse-move-hover-canvas";
import resize_canvas_viewport from "./resize_canvas_viewport";
import draw_all_shapes from "./draw-all-shapes";
import type { Shape } from "@repo/zod/index";
import { send_ws_request } from "@/utils/send-ws-request.utils";

interface CanvasDefaultProps {
  line_width: number;
  line_dash: Array<number>;
  fill_style: string;
  stroke_style: string;
}
interface DrawCanvasProps {
  selected_btn: {
    selected_btn_id: string | null;
    handle_set_selected_btn_id: (id: string | null) => void;
  };
  all_shapes: { shapes: Shape[] };
  web_socket_ref: React.RefObject<WebSocket | null>;
}

export default function DrawCanvas(props: DrawCanvasProps) {
  // reference to canvas
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  // canvas related states
  const [start_point, set_start_point] = useState<{ x: number; y: number } | null>(null);
  const [is_drawing, set_is_drawing] = useState(false);
  const [is_dragging, set_is_dragging] = useState(false);
  const [curr_shape, set_curr_shape] = useState<Shape | null>(null);
  const canvas_default_props = useRef<CanvasDefaultProps>({
    line_width: 1.25,
    line_dash: [],
    fill_style: "oklch(50% 0.15 30)",
    stroke_style: "oklch(50% 0.15 30)",
  });
  const [canvas_viewport_transform, set_canvas_viewport_transform] = useState({ scale: 1, x: 0, y: 0 });

  // used to set current dragged or drawn shape
  const handle_set_curr_shape = (shape: Shape) => set_curr_shape(shape);

  function handle_set_canvas_viewport_transform(scale: number, x: number, y: number) {
    set_canvas_viewport_transform({ scale, x, y });
  }

  // reset all the DrawCanvas's states to initial values
  function reset_to_initial() {
    set_start_point(null);
    set_curr_shape(null);
    set_is_drawing(false);
    set_is_dragging(false);
  }

  // reset all the style-related canvas to default values
  function reset_styles_to_initial(ctx: CanvasRenderingContext2D) {
    // setting canvas pre-requisites
    ctx.lineWidth = canvas_default_props.current.line_width;
    ctx.strokeStyle = canvas_default_props.current.stroke_style;
    ctx.fillStyle = canvas_default_props.current.fill_style;
    ctx.setLineDash(canvas_default_props.current.line_dash);
  }

  // function update_zoom(canvas: HTMLCanvasElement, e: WheelEvent) {
  //   e.preventDefault();
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   const rect = canvas.getBoundingClientRect();
  //   const mouseX = e.clientX - rect.left;
  //   const mouseY = e.clientY - rect.top;

  //   set_canvas_viewport_transform((prev) => {
  //     const old_scale = prev.scale;
  //     const old_x = prev.x;
  //     const old_y = prev.y;

  //     const zoom_speed = 0.001;
  //     let new_scale = old_scale * (1 - e.deltaY * zoom_speed);
  //     new_scale = Math.max(0.1, Math.min(new_scale, 20));

  //     const scale_ratio = new_scale / old_scale;

  //     // (mouseX - old_x) = the distance from the current transform origin to the mouse in canvas coordinates
  //     //  Example:

  //     // mouseX = 400 (mouse is at pixel 400 on canvas)
  //     // old_x = 100 (current transform origin)
  //     // old_scale = 1.0
  //     // new_scale = 2.0 (zooming in 2x)
  //     // scale_ratio = 2.0 / 1.0 = 2.0

  //     // Step by step:

  //     // (mouseX - old_x) = 400 - 100 = 300
  //     // This is the distance from the transform origin to the mouse
  //     // (mouseX - old_x) * scale_ratio = 300 * 2.0 = 600
  //     // After scaling 2x, that distance becomes 600 pixels
  //     // mouseX - (...) = 400 - 600 = -200
  //     // To keep the mouse at pixel 400, we need to move the origin to -200
  //     const new_x = mouseX - (mouseX - old_x) * scale_ratio;
  //     const new_y = mouseY - (mouseY - old_y) * scale_ratio;

  //     return { scale: new_scale, x: new_x, y: new_y };
  //   });
  // }

  // initialize canvas whiteboard
  useEffect(() => {
    // stop everything if web-socket isn't initialized
    if (!props.web_socket_ref.current) return;

    // get canvas reference
    const canvas = canvas_ref.current;
    if (!canvas) return;

    // using 2d-canvas context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // setting canvas pre-requisites
    reset_styles_to_initial(ctx);

    resize_canvas_viewport(handle_set_canvas_viewport_transform, canvas);

    window.addEventListener("resize", () => resize_canvas_viewport(handle_set_canvas_viewport_transform, canvas));
    return () =>
      window.removeEventListener("resize", () => resize_canvas_viewport(handle_set_canvas_viewport_transform, canvas));

    // canvas.addEventListener("wheel", (e: WheelEvent) => update_zoom(canvas, e), { passive: false });
    // return () => canvas.removeEventListener("wheel", (e: WheelEvent) => update_zoom(canvas, e));
  }, [props.web_socket_ref]);

  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = canvas_viewport_transform.scale;
    const origin = { x: canvas_viewport_transform.x, y: canvas_viewport_transform.y };

    ctx.setTransform(scale, 0, 0, scale, origin.x, origin.y);

    reset_styles_to_initial(ctx);
    draw_all_shapes(props.all_shapes.shapes, ctx);
  }, [canvas_viewport_transform, props.all_shapes.shapes]);

  // draw a text when select canvas btn is "text"
  useEffect(() => {
    // setting different modes on different selected btns
    if (props.selected_btn.selected_btn_id !== "text") return;

    const canvas = canvas_ref.current;
    if (!canvas) return;

    // using 2d-canvas context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // stop everything if web-socket isn't initialized
    if (!props.web_socket_ref.current) return;

    // setting canvas pre-requisites
    reset_styles_to_initial(ctx);

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

    // push new text-shape to current room
    send_ws_request(
      {
        type: "create-shape",
        payload: {
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
        },
      },
      props.web_socket_ref.current
    );

    // set to initial state values
    props.selected_btn.handle_set_selected_btn_id("cursor");

    // Run this after React finishes the current render + effects
    setTimeout(() => reset_to_initial(), 0);
  }, [props.selected_btn, props.web_socket_ref]);

  // re-draw all the shapes after response from web-socket server
  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!canvas) return;

    // using 2d-canvas context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // This clears the visible viewport without resetting the matrix
    ctx.clearRect(
      -canvas_viewport_transform.x / canvas_viewport_transform.scale,
      -canvas_viewport_transform.y / canvas_viewport_transform.scale,
      canvas.width / canvas_viewport_transform.scale,
      canvas.height / canvas_viewport_transform.scale
    );
    // setting canvas pre-requisites
    reset_styles_to_initial(ctx);

    // re-drawing all the canvas-shapes
    draw_all_shapes(props.all_shapes.shapes, ctx);
  }, [props.all_shapes.shapes, canvas_viewport_transform.scale, canvas_viewport_transform]);

  function handle_mouse_down(e: React.MouseEvent<HTMLCanvasElement>) {
    if (start_point) return;

    const canvas = canvas_ref.current;
    if (!canvas) return;

    // using 2d-canvas context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // When clicking on canvas element, the mouse event (e) gives coordinates relative to the entire browser viewport (the visible window area). However, the canvas needs coordinates relative to its own top-left corner (0, 0).
    // The Element.getBoundingClientRect() method returns a position relative to the viewport.
    const canvas_pos = canvas.getBoundingClientRect();

    // 1. Get mouse position relative to canvas element (CSS Pixels)
    const mouse_x = e.clientX - canvas_pos.left;
    const mouse_y = e.clientY - canvas_pos.top;

    const current_x = mouse_x;
    const current_y = mouse_y;

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
    const canvas = canvas_ref.current;
    if (!canvas) return;

    // use 2d-context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // setting canvas pre-requisites
    reset_styles_to_initial(ctx);

    // When clicking on canvas element, the mouse event (e) gives coordinates relative to the entire browser viewport (the visible window area). However, the canvas needs coordinates relative to its own top-left corner (0, 0).
    // The Element.getBoundingClientRect() method returns a position relative to the viewport.
    const canvas_pos = canvas.getBoundingClientRect();

    // Get mouse position relative to canvas element (CSS Pixels)
    const mouse_x = e.clientX - canvas_pos.left;
    const mouse_y = e.clientY - canvas_pos.top;

    const end_x = mouse_x;
    const end_y = mouse_y;

    const mouse_move_hover_canvas_args = {
      end_point: { x: end_x * canvas_viewport_transform.scale, y: end_y * canvas_viewport_transform.scale },
      all_shapes: { shapes: props.all_shapes.shapes },
      reset_styles_to_initial,
      ctx,
    };
    mouse_move_hover_canvas(mouse_move_hover_canvas_args);

    if (!start_point || (!is_drawing && !is_dragging)) {
      reset_to_initial();
      return;
    }

    // clear canvas screen to avoid overlapping
    if (props.selected_btn.selected_btn_id !== "pencil") {
      // This clears the visible viewport without resetting the matrix
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // setting canvas pre-requisites
      reset_styles_to_initial(ctx);

      // re-drawing all the canvas-shapes
      draw_all_shapes(props.all_shapes.shapes, ctx);
    }

    // draw specific shape on mouse-move
    // drag specific shape
    if (is_dragging) {
      const mouse_move_drag_canvas_args = {
        start_point: {
          x: start_point.x * canvas_viewport_transform.scale,
          y: start_point.y * canvas_viewport_transform.scale,
        },
        end_point: {
          x: end_x * canvas_viewport_transform.scale,
          y: end_y * canvas_viewport_transform.scale,
        },
        all_shapes: props.all_shapes,
        handle_set_curr_shape,
        reset_styles_to_initial,
        ctx,
        web_socket: props.web_socket_ref.current,
      };
      mouse_move_drag_canvas(mouse_move_drag_canvas_args);
      return;
    }
    mouse_move_draw_canvas({
      selected_btn_id: props.selected_btn.selected_btn_id,
      start_point,
      end_point: { x: end_x, y: end_y },
      all_shapes: props.all_shapes,
      handle_set_curr_shape,
      ctx,
      web_socket: props.web_socket_ref.current,
    });
  }

  // on mouse-up event-handler
  function handle_mouse_up() {
    if (!start_point || (!is_drawing && !is_dragging) || !props.web_socket_ref.current) {
      reset_to_initial();
      return;
    }

    const canvas = canvas_ref.current;
    if (!canvas) {
      reset_to_initial();
      return;
    }

    // get 2d-context
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reset_to_initial();
      return;
    }

    // push curr-shape to shapes
    if (is_drawing && curr_shape) {
      send_ws_request({ type: "create-shape", payload: curr_shape }, props.web_socket_ref.current);
    } else if (is_dragging && curr_shape) {
      send_ws_request(
        { type: "alter-shape", payload: { shape_id: curr_shape.id, data: curr_shape } },
        props.web_socket_ref.current
      );
    }

    // reset state's to initial values
    reset_to_initial();
  }

  return (
    // internal drawing resolution vs css display size
    // mouse gives you: display coordinates (based on css size)
    // canvas needs: internal coordinates (based on width/height attributes)
    // @example - The shape drew at (20, 20) on the internal grid **appears at (40, 40)** on screen because everything is **2x bigger**!
    <canvas
      id="whiteboard-canvas"
      ref={canvas_ref}
      className="color-neutral color-neutral-content block shrink-0 rounded-xl touch-none"
      onMouseDown={handle_mouse_down}
      onMouseMove={handle_mouse_move}
      onMouseUp={handle_mouse_up}
      onPointerDown={handle_mouse_down}
      onPointerMove={handle_mouse_move}
      onPointerUp={handle_mouse_up}
    />
  );
}
