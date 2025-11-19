"use client";
import { useState, useEffect, useRef } from "react";
import { SiGoogleclassroom } from "react-icons/si";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { CgArrowLongRight } from "react-icons/cg";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsChatTextFill } from "react-icons/bs";
import { BiSolidPencil } from "react-icons/bi";
import { BsCursorFill, BsEraserFill } from "react-icons/bs";
import CheckUserAuth from "@/wrappers/check-user-auth";
import BtnDrawCanvas from "../canvas/btn-draw-canvas";
import mouse_move_draw_canvas from "../canvas/mouse-move-draw-canvas";
import fix_dpi from "../canvas/fix_dpi";
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

interface Geometry{
type: "BOX" | "CIRCLE";

}

const BTNS_CANVAS = [
  { id: "cursor", icon: <BsCursorFill className="w-full h-full" /> },
  { id: "circle", icon: <VscCircleLargeFilled className="w-full h-full" /> },
  { id: "box", icon: <RiCheckboxBlankFill className="w-full h-full" /> },
  { id: "arrow", icon: <FaArrowRightLong className="w-full h-full" /> },
  { id: "text", icon: <BsChatTextFill className="w-full h-full" /> },
  { id: "pencil", icon: <BiSolidPencil className="w-full h-full" /> },
  { id: "eraser", icon: <BsEraserFill className="w-full h-full" /> },
];

function DrawCanvas({ selected_btn_id }: { selected_btn_id: string | null }) {
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const [start_point, set_start_point] = useState<{ x: number; y: number } | null>(null);
  const [is_drawing, set_is_drawing] = useState(false);
  const [canvas_styles, set_canvas_styles] = useState({
    fill_style: "oklch(50% 0.15 30)",
    stroke_style: "oklch(50% 0.15 30)",
  });

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

    ctx.lineWidth = 0.75;
    ctx.strokeStyle = canvas_styles.stroke_style;
    mouse_move_draw_canvas({ selected_btn_id, start_point, end_point: { x: end_x, y: end_y }, ctx });
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
  const [selected_btn_id, set_selected_btn_id] = useState<string | null>(null);
  return (
    <div
      id="rooms"
      className="color-base-100 color-base-content shrink-0 min-h-[65vh] flex flex-col justify-center items-center gap-2 sm:gap-3 bg-linear-to-b to-blue-500 overflow-hidden p-3 sm:p-5 md:p-7"
    >
      {/* <CheckUserAuth> */}
      <div
        className={`color-accent color-accent-content shrink-0 flex flex-col justify-center items-center gap-2 sm:gap-3 w-full h-full p-3 sm:p-4 md:p-5 rounded-xl ${selected_btn_id !== "cursor" && "cursor-crosshair"}`}
      >
        <div className="flex justify-center items-center gap-2">
          <Heading size="h3" text="Whiteboard" class_name="underline" />
          <SiGoogleclassroom className="inline-block w-9 h-auto" />
        </div>
        {/* <BtnsDrawCanvas /> */}
        <div
          id="btns-draw-canvas"
          className="color-base-100 color-base-content w-full h-auto flex justify-center items-center gap-5 sm:gap-7 md:gap-9 lg:gap-11 shrink-0 rounded-full overflow-hidden p-1 sm:p-1.5 md:p-2"
        >
          {BTNS_CANVAS.map((btn) => (
            <BtnDrawCanvas
              id={btn.id}
              selected_btn_id={selected_btn_id}
              icon={btn.icon}
              on_click={() => set_selected_btn_id(btn.id)}
            />
          ))}
        </div>
        <DrawCanvas selected_btn_id={selected_btn_id} />
        <div className="shrink-0 color-warning color-warning-content min-h-[25vh] w-full flex flex-col justify-start items-center gap-2 rounded-xl p-1 sm:p-2 md:p-3">
          <Heading size="h3" text="Live logs" class_name="underline" />
        </div>
      </div>
      {/* </CheckUserAuth> */}
    </div>
  );
}
