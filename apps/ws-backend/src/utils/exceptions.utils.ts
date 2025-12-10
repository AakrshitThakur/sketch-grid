import type { WebSocket } from "ws";
import { send_ws_response } from "./websocket.utils.js";

function catch_general_exception(error: unknown, ws: WebSocket) {
  let msg = "";
  if (error instanceof Error) {
    msg = error.message;
    send_ws_response<null>({ status: "error", type: "others", message: msg, payload: null }, ws);
  } else {
    msg = error as string;
    send_ws_response<null>({ status: "error", type: "others", message: msg, payload: null }, ws);
  }
}

export { catch_general_exception };
