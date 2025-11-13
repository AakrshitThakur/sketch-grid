import type { WebSocket } from "ws";
import { send_ws_response } from "./websocket.utils.js";

function catch_general_exception(error: unknown, ws: WebSocket) {
  if (error instanceof Error) {
    send_ws_response<null>({ status: "error", message: error.message, payload: null }, ws);
  } else {
    send_ws_response<null>({ status: "error", message: error as string, payload: null }, ws);
  }
}

export { catch_general_exception };
