import type { WsResponseType, WsResponseStatus } from "@repo/zod/index";

interface WebSocketResponse<T> {
  status: WsResponseStatus;
  type: WsResponseType;
  message: string;
  payload: T;
}

export type { WebSocketResponse, WebSocketResponseType };
