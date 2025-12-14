import { send_ws_request } from "@/utils/send-ws-request.utils";

let timeout: NodeJS.Timeout | null = null;

// to limit the number of call to web-socket backend
function debounced_delete_shape(shape_id: string, web_socket: WebSocket) {
  timeout && clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (!web_socket) return;
    send_ws_request({ type: "delete-shape", payload: { shape_id } }, web_socket);
  }, 100);
}

export default debounced_delete_shape;
