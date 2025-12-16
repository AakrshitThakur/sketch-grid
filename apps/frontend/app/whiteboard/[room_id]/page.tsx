"use client";
import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod/v4";
import CheckUserAuth from "@/wrappers/check-user-auth";
import BtnDrawCanvas from "@/app/canvas/btn-draw-canvas";
import DrawCanvas from "@/app/canvas/draw-canvas";
import { Heading, Alert } from "@repo/ui/index";
import { type WsResponse, type WsResponseStatus, type Shape, WsResponseSchema } from "@repo/zod/index";
import { send_ws_request } from "@/utils/send-ws-request.utils";
import { error_notification } from "@/utils/toast.utils";
// icons
import { SiGoogleclassroom } from "react-icons/si";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { FaArrowRightLong, FaDiamond, FaTrash } from "react-icons/fa6";
import { BsChatTextFill } from "react-icons/bs";
import { BsCursorFill, BsEraserFill } from "react-icons/bs";

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

interface WsLogs {
  text: string;
  status: WsResponseStatus;
}

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

  // hook for navigation
  const router = useRouter();

  // canvas related states
  const [selected_btn_id, set_selected_btn_id] = useState<string | null>(null);
  const [shapes, set_shapes] = useState<Shape[]>([]);
  const web_socket_ref = useRef<WebSocket | null>(null);
  const [ws_logs, set_ws_logs] = useState<WsLogs[]>([]);

  useEffect(() => {
    console.log("sdffgsdsdfdasfsddasdasfadsfasdasfsdfvsdvsdvsdfvfrgvrf");

    // get jwt from local-storage
    const jwt = localStorage.getItem("jwt");
    if (!jwt || !WS_BACKEND_BASE_URL) return;

    // If an older socket exists, close it before creating a new one
    if (web_socket_ref.current) {
      console.error("Under if-block");

      const curr_web_socket = web_socket_ref.current;
      // check state
      if (curr_web_socket.readyState === WebSocket.OPEN || curr_web_socket.readyState === WebSocket.CONNECTING) {
        if (curr_web_socket) curr_web_socket.close();
      }
      // reassign with null
      web_socket_ref.current = null;
    }

    // connect WebSocket client to WebSocket server
    const ws = new WebSocket(`${WS_BACKEND_BASE_URL}?jwt=${jwt}`);

    // The open event is fired when a connection with a WebSocket is opened
    ws.onopen = () => {
      console.info("Connection to WebSocket server established successfully");
      web_socket_ref.current = ws;

      if (!web_socket_ref.current || web_socket_ref.current.readyState !== WebSocket.OPEN) {
        console.error("WebSocket not open");
        return;
      }
      // WebSocket.send() method enqueues the specified data to be transmitted to the server over the WebSocket connection
      // join specific room
      // setTimeout(() => send_ws_request({ type: "join-room", payload: { room_id } }, ws), 1000);
    };
    // The error event is fired when a connection with a WebSocket has been closed due to an error (some data couldn't be sent for example)
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      // clear ref so future attempts will create a new socket
      if (web_socket_ref.current === ws) web_socket_ref.current = null;
    };
    // The close event is fired when a connection with a WebSocket is closed
    ws.onclose = () => {
      console.info("Connection with WebSocket server terminated");
      // clear ref so future attempts will create a new socket
      if (web_socket_ref.current === ws) web_socket_ref.current = null;
    };
    // listen messages coming from WebSocket server
    ws.onmessage = (event) => {
      // validated parsed message
      let v_parsed_response: WsResponse | null = null;
      try {
        // get parsed message
        const parsed_response = JSON.parse(event.data);
        v_parsed_response = WsResponseSchema.parse(parsed_response);
      } catch (error) {
        if (error instanceof ZodError) {
          console.error(error.issues[0]?.message || "Validation error");
          return;
        } else if (error instanceof Error) {
          console.error(error as Error);
          return;
        }
        console.error(error as string);
        return;
      }

      // check assign value
      if (!v_parsed_response) {
        console.error("Message validation error");
        return;
      }

      // The connection isn't open and not ready to communicate
      if (ws.readyState !== WebSocket.OPEN) return;

      // parsed-response message
      let msg = "";

      // All web-socket events
      switch (v_parsed_response.type) {
        case "join-room": {
          // get message from ws-response
          msg = v_parsed_response.message;

          // update ws_logs array
          set_ws_logs((curr) => [...curr, { text: msg, status: v_parsed_response.status }]);

          // check status
          // force user to leave whiteboard if not authorized to join
          if (v_parsed_response.status === "error") {
            msg = v_parsed_response.message as string;
            console.error(msg);
            error_notification(msg);
            router.push("/rooms");
            return;
          }
          console.info(msg);
          // get all shapes of a specific room
          send_ws_request({ type: "get-all-shapes", payload: null }, ws);
          break;
        }
        case "create-shape": {
          // get message from ws-response
          msg = v_parsed_response.message;

          // update ws_logs array
          set_ws_logs((curr) => [...curr, { text: msg, status: v_parsed_response.status }]);

          // check error status
          if (v_parsed_response.status === "error" || !v_parsed_response.payload) {
            console.error(msg);
            error_notification(msg);
            return;
          }
          // get all shapes
          const all_shapes = v_parsed_response.payload;
          // update shapes state
          set_shapes(all_shapes);
          console.info(msg);
          break;
        }
        case "delete-shape": {
          // get message from ws-response
          msg = v_parsed_response.message;

          // update ws_logs array
          set_ws_logs((curr) => [...curr, { text: msg, status: v_parsed_response.status }]);

          // check error status
          if (v_parsed_response.status === "error" || !v_parsed_response.payload) {
            console.error(msg);
            error_notification(msg);
            return;
          }
          const all_shapes = v_parsed_response.payload;
          console.info(msg);
          // update shapes state
          set_shapes(all_shapes);
          break;
        }
        case "delete-all-shapes": {
          // get message from ws-response
          msg = v_parsed_response.message;

          // update ws_logs array
          set_ws_logs((curr) => [...curr, { text: msg, status: v_parsed_response.status }]);

          // check error status
          if (v_parsed_response.status === "error" && !v_parsed_response.payload) {
            console.error(msg);
            error_notification(msg);
            return;
          }
          const all_shapes = v_parsed_response.payload;
          console.info(msg);
          // update shapes state
          set_shapes(all_shapes || []);
          break;
        }
        case "alter-shape": {
          // get message from ws-response
          msg = v_parsed_response.message;

          // update ws_logs array
          set_ws_logs((curr) => [...curr, { text: msg, status: v_parsed_response.status }]);

          // check error status
          if (v_parsed_response.status === "error" || !v_parsed_response.payload) {
            console.error(msg);
            error_notification(msg);
            return;
          }
          const all_shapes = v_parsed_response.payload;
          console.info(msg);
          // update shapes state
          set_shapes(all_shapes);
          break;
        }
        case "get-all-shapes": {
          // get message from ws-response
          msg = v_parsed_response.message;

          // update ws_logs array
          set_ws_logs((curr) => [...curr, { text: msg, status: v_parsed_response.status }]);

          // check error status
          if (v_parsed_response.status === "error" || !v_parsed_response.payload) {
            console.error(msg);
            error_notification(msg);
            return;
          }
          const all_shapes = v_parsed_response.payload;
          console.info(msg);
          // update shapes state
          set_shapes(all_shapes);
          break;
        }
        case "auth": {
          // get message from ws-response
          msg = v_parsed_response.message;

          // update ws_logs array
          set_ws_logs((curr) => [...curr, { text: msg, status: v_parsed_response.status }]);

          // check error status
          if (v_parsed_response.status === "error") {
            console.error(msg);
            error_notification(msg);
            router.push("/rooms/join");
            return;
          }
          console.info(msg);
          send_ws_request({ type: "join-room", payload: { room_id } }, ws);
          break;
        }
        case "others": {
          // get message from ws-response
          msg = v_parsed_response.message;

          // update ws_logs array
          set_ws_logs((curr) => [...curr, { text: msg, status: v_parsed_response.status }]);

          // check error status
          if (v_parsed_response.status === "error" || !v_parsed_response.payload) {
            console.error(msg);
            error_notification(msg);
            return;
          }
          const all_shapes = v_parsed_response.payload;
          console.info(msg);
          // update shapes state
          set_shapes(all_shapes);
          break;
        }
      }
    };

    // cleanup function
    return () => {
      console.error("Under clean-up method");
      // close web-socket instance if current web-socket status is connection or connected
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
        web_socket_ref.current = null;
      }
    };
  }, [room_id, router]);

  const handle_set_selected_btn_id = (id: string | null) => set_selected_btn_id(id);

  // delete all the shapes
  function delete_all_shapes() {
    const check = confirm("Kindly confirm the deletion of all shapes. (ok/cancel)");

    // change selected btn to -> cursor
    set_selected_btn_id("cursor");

    // check response from user
    if (!web_socket_ref.current || !check) return;

    // clear all shapes if authorized
    send_ws_request({ type: "delete-all-shapes", payload: null }, web_socket_ref.current);
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
                key={btn.id}
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
            all_shapes={{ shapes }}
            web_socket_ref={web_socket_ref}
          />
        </section>
        {/* Live logs */}
        <div className="shrink-0 color-base-200 color-base-content h-full max-h-[35vh] max-w-5xl w-full flex flex-col justify-start items-center gap-2 rounded-xl overflow-y-auto p-1 sm:p-2 md:p-3">
          <Heading size="h3" text="Live logs" class_name="underline" />
          {ws_logs.length < 1 ? (
            <p className="text-xs">No Logs Found</p>
          ) : (
            <ul className="space-y-1 sm:space-y-2">
              {ws_logs.map((log, idx) => (
                <li key={idx}>
                  <Alert text={log.text} status={log.status} class_name="text-xs sm:text-sm" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </CheckUserAuth>
    </div>
  );
}
