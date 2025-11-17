"use client";
import { useState, useEffect, useRef } from "react";
import { SiGoogleclassroom } from "react-icons/si";
import CheckUserAuth from "@/wrappers/check-user-auth";
import BtnsCanvas from "../canvas/btns-canvas";
import { Card, Heading, Loading } from "@repo/ui/index";
import { success_notification, error_notification } from "@/utils/toast.utils";

//     9     10    11    12
//  9  ┌─────┬─────┬─────┬─────┐
//     │     │     │     │     │
//  10 ├─────┼─────┼─────┼─────┤
//     │     │  ?  │     │     │  ← always draw +(.5) more to avoid line stroke to let's say 1px to go to multiple lines
//  11 ├─────┼─────┼─────┼─────┤
//     │     │     │     │     │
//  12 └─────┴─────┴─────┴─────┘
//           ↑
//       x = 10 coordinate

function DrawCanvas() {
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const [start_point, set_start_point] = useState<{ x: number; y: number } | null>(null);
  const [is_drawing, set_is_drawing] = useState(false);
  const [canvas_styles, set_canvas_styles] = useState({
    fill_style: "oklch(50% 0.15 30)",
    stroke_style: "white",
  });

  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!canvas) return;

    // using 2d-canvas context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    console.info(current_x, current_y);

    set_start_point({ x: current_x, y: current_y });
    set_is_drawing(true);
  }

  function handle_mouse_move(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!start_point || !is_drawing) return;

    const canvas = canvas_ref.current;
    if (!canvas) return;

    // use 2d-context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // clear canvas screen to avoid overlapping
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // When clicking on canvas element, the mouse event (e) gives coordinates relative to the entire browser viewport (the visible window area). However, the canvas needs coordinates relative to its own top-left corner (0, 0).
    // The Element.getBoundingClientRect() method returns a position relative to the viewport.
    const canvas_pos = canvas.getBoundingClientRect();

    const scale_x = canvas.width / canvas_pos.width;
    const scale_y = canvas.height / canvas_pos.height;

    const end_x = Math.floor((e.clientX - canvas_pos.left) * scale_x) + 0.5;
    const end_y = Math.floor((e.clientY - canvas_pos.top) * scale_y) + 0.5;

    const width = end_x - start_point.x;
    const height = end_y - start_point.y;

    ctx.strokeStyle = canvas_styles.stroke_style;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(start_point.x, start_point.y, width, height);
  }

  function handle_mouse_up(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!start_point || !is_drawing) return;

    const canvas = canvas_ref.current;
    if (!canvas) return;

    // get 2d-context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    set_start_point(null);
    set_is_drawing(false);
  }

  return (
    // internal drawing resolution vs css display size
    // mouse gives you: display coordinates (based on css size)
    // canvas needs: internal coordinates (based on width/height attributes)
    // @example - The shape drew at (20, 20) on the internal grid **appears at (40, 40)** on screen because everything is **2x bigger**!
    <canvas
      ref={canvas_ref}
      className="shrink-0 color-neutral color-neutral-content w-full h-full rounded-xl"
      onMouseDown={handle_mouse_down}
      onMouseMove={handle_mouse_move}
      onMouseUp={handle_mouse_up}
    />
  );
}

export default function Draw() {
  return (
    <div
      id="rooms"
      className="color-base-100 color-base-content shrink-0 min-h-[95vh] flex flex-col justify-center items-center gap-2 sm:gap-3 bg-linear-to-b to-blue-500 p-3 sm:p-5 md:p-7"
    >
      <CheckUserAuth>
        <div className="flex justify-center items-center gap-2">
          <Heading size="h3" text="Whiteboard" />
          <SiGoogleclassroom className="inline-block w-9 h-auto" />
        </div>
        <BtnsCanvas />
        <DrawCanvas />
      </CheckUserAuth>
    </div>
  );
}
