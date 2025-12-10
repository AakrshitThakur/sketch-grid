"use client";
import { useEffect, useState, use } from "react";
import CheckUserAuth from "@/wrappers/check-user-auth";
import BtnDrawCanvas from "@/app/canvas/btn-draw-canvas";
import DrawCanvas from "@/app/canvas/draw-canvas";
import { Heading } from "@repo/ui/index";
import { send_ws_request } from "@/utils/send-ws-request.utils";
import { success_notification, error_notification } from "@/utils/toast.utils";
// icons
import { SiGoogleclassroom } from "react-icons/si";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { FaArrowRightLong, FaDiamond, FaTrash } from "react-icons/fa6";
import { BsChatTextFill } from "react-icons/bs";
import { BsCursorFill, BsEraserFill } from "react-icons/bs";
import { Shape, Shapes } from "@repo/types/index";

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

const WS_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_WS_BACKEND_BASE_URL;

const BTNS_CANVAS = [
  { id: "cursor", icon: <BsCursorFill className="w-full h-full" /> },
  { id: "circle", icon: <VscCircleLargeFilled className="w-full h-full" /> },
  { id: "box", icon: <RiCheckboxBlankFill className="w-full h-full" /> },
  { id: "arrow", icon: <FaArrowRightLong className="w-full h-full" /> },
  { id: "text", icon: <BsChatTextFill className="w-full h-full" /> },
  { id: "diamond", icon: <FaDiamond className="w-full h-full" /> },
  { id: "eraser", icon: <BsEraserFill className="w-full h-full" /> },
];

export default function Draw({ params }: { params: Promise<{ room_id: string }> }) {
  // get room_id from dynamic route
  const { room_id } = use(params);

  // canvas-btn related states
  const [selected_btn_id, set_selected_btn_id] = useState<string | null>(null);
  const [shapes, set_shapes] = useState<Shapes>([]);
  const [web_socket, set_web_socket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // get jwt from local-storage
    const jwt = localStorage.getItem("jwt");

    if (!jwt) return;
    if (!WS_BACKEND_BASE_URL) return;

    // connect WebSocket client to WebSocket server
    const ws = new WebSocket(`${WS_BACKEND_BASE_URL}?jwt=${jwt}`);

    // The open event is fired when a connection with a WebSocket is opened
    ws.onopen = () => {
      console.info("Connection to WebSocket server established successfully");
      set_web_socket(ws);
    };
    // The error event is fired when a connection with a WebSocket has been closed due to an error (some data couldn't be sent for example)
    ws.onerror = (error) => console.error("WebSocket error:", error);
    // The close event is fired when a connection with a WebSocket is closed
    ws.onclose = () => console.info("Connection with WebSocket server terminated");
    // listen messages coming from WebSocket server
    ws.onmessage = (event) => {
      // parse json-stringified response
      const parsed_response = JSON.parse(event.data);

      if (!ws) return;

      let msg = "";

      switch (parsed_response.type) {
        case "join-room": {
          if (parsed_response.status === "error") {
            msg = parsed_response.message as string;
            console.error(msg);
            error_notification(msg);
            return;
          }
          // get all shapes of a specific room
          send_ws_request({ type: "get-all-shapes", payload: null }, ws);
          break;
        }
        case "create-shape": {
          msg = parsed_response.message;
          if (parsed_response.status === "error") {
            console.error(msg);
            error_notification(msg);
            return;
          }
          console.info(msg);
          const all_shapes: Shape[] = parsed_response.payload.map((shape: unknown) => {
            // @ts-ignore - shape.data is data about shape
            return { ...shape.data };
          });
          set_shapes(all_shapes);
        }
        case "alter-shape": {
          msg = parsed_response.message;
          if (parsed_response.status === "error") {
            console.error(msg);
            error_notification(msg);
            return;
          }
          console.info(msg);
          const all_shapes: Shape[] = parsed_response.payload.map((shape: unknown) => {
            // @ts-ignore - shape.data is data about shape
            return { ...shape.data };
          });
          set_shapes(all_shapes);
        }
        case "get-all-shapes": {
          msg = parsed_response.message;
          if (parsed_response.status === "error") {
            console.error(msg);
            error_notification(msg);
            set_shapes([]);
            return;
          }
          console.info(msg);
          const all_shapes: Shape[] = parsed_response.payload.map((shape: unknown) => {
            // @ts-ignore - shape.data is data about shape
            return { ...shape.data };
          });
          set_shapes(all_shapes);
        }
      }
    };
  }, []);

  // send message on successfully initializing web-socket instance
  useEffect(() => {
    if (!web_socket) return;
    // WebSocket.send() method enqueues the specified data to be transmitted to the server over the WebSocket connection
    // join specific room
    send_ws_request({ type: "join-room", payload: { room_id } }, web_socket);
  }, [web_socket]);

  function handle_set_selected_btn_id(id: string | null) {
    set_selected_btn_id(id);
  }

  // push new curr-shape to shapes array
  function push_new_curr_shape(curr_shape: Shape) {
    set_shapes((curr) => [...curr, curr_shape]);
  }

  // delete specific shape
  function delete_shape_by_id(id: string) {
    if (!id) return;
    set_shapes(shapes.filter((shape) => shape.id !== id));
  }

  // alter existing shape properties in existing shapes state
  function alter_shape_properties(shape: Shape) {
    const altered_shapes = shapes.map((s) => {
      if (shape.id === s.id) return shape;
      return s;
    });
    set_shapes(altered_shapes);
  }

  // delete all the shapes
  function delete_all_shapes() {
    const check = prompt("Kindly confirm the deletion of all shapes. (yes/no)");

    // change selected btn to -> cursor
    set_selected_btn_id("cursor");

    // validations
    if (!check) return;
    if (check.toLowerCase().trim() !== "yes") return;

    // clear all shapes
    set_shapes([]);
    // get canvas ref
    const canvas = document.getElementById("whiteboard-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    // get 2d-context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // clear entire canvas area
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  console.info(shapes);

  return (
    <div
      id="whiteboard"
      className={`color-base-100 color-base-content shrink-0 min-h-[65vh] flex flex-col justify-center items-center gap-2 sm:gap-3 bg-linear-to-b to-blue-500 overflow-hidden p-3 sm:p-5 md:p-7`}
    >
      <CheckUserAuth>
        {/* heading of page */}
        <div className="flex justify-center items-center gap-2">
          <Heading size="h3" text="Whiteboard" class_name="underline" />
          <SiGoogleclassroom className="inline-block w-9 h-auto" />
        </div>
        {/* functionality btns of draw-canvas */}
        <section
          className={`relative shrink-0 w-full h-auto ${selected_btn_id && selected_btn_id !== "cursor" && "cursor-crosshair"}`}
        >
          <div
            id="btns-draw-canvas"
            className="color-base-300 color-base-content absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 shrink-0 w-full max-w-[90%] sm:max-w-lg md:max-w-xl h-auto flex justify-center items-center gap-5 sm:gap-7 md:gap-9 lg:gap-11 rounded-full overflow-hidden p-1 sm:p-1.5"
          >
            {/* mapping all the btns of BTN_CANVAS */}
            {BTNS_CANVAS.map((btn) => (
              <BtnDrawCanvas
                id={btn.id}
                selected_btn_id={selected_btn_id}
                icon={btn.icon}
                on_click={() => set_selected_btn_id(btn.id)}
              />
            ))}
          </div>
          <div
            className="absolute bottom-2.5 md:top-2.5 right-2.5 color-error color-error-content shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full overflow-hidden cursor-pointer p-1"
            onClick={delete_all_shapes}
          >
            <FaTrash className="w-full h-full" />
          </div>
          {/* draw canvas whiteboard */}
          <DrawCanvas
            selected_btn={{ selected_btn_id, handle_set_selected_btn_id }}
            all_shapes={{ shapes, push_new_curr_shape, delete_shape_by_id, alter_shape_properties }}
            web_socket={web_socket}
          />
        </section>
        {/* Live logs */}
        {/* <div className="shrink-0 color-warning color-warning-content min-h-[25vh] w-full flex flex-col justify-start items-center gap-2 rounded-xl p-1 sm:p-2 md:p-3">
        <Heading size="h3" text="Live logs" class_name="underline" />
      </div> */}
      </CheckUserAuth>
    </div>
  );
}
