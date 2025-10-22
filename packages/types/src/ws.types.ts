// RESPONSE can represent a business-level error (e.g., order out of stock). An ERROR often means the system/framework could not or will not produce a normal response in the regular format.

// interface WebSocketMessage {
//   type: "REQUEST" | "RESPONSE" | "ERROR" | "ACTION";
//   action: string;
//   status?: "success" | "error" | "warning";
//   payload: {
//     room_id?: string;
//     message?: string;
//   };
// }

interface WebSocketMessageFrontend {
  type: "REQUEST";
  action: "string";
  payload: {
    room_id?: string;
    message?: string;
  };
}

interface WebSocketMessageBackend {
  type: "RESPONSE" | "ERROR" | "ACTION";
  action: "string";
  status: "success" | "error" | "warning";
  payload: {
    message?: string;
  };
}

export type { WebSocketMessageFrontend, WebSocketMessageBackend };
