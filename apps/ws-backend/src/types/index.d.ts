import type { WsType, WsStatus } from "@repo/types/index";

type WebSocketResponseType = WsType;

interface WebSocketResponse<T> {
  status: WsStatus;
  type: WebSocketResponseType;
  message: string;
  payload: T;
}

export type { WebSocketResponse, WebSocketResponseType };
