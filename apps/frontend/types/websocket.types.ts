import type { WsType } from "@repo/types/index";
interface WebSocketRequest<T> {
  type: WsType;
  payload: T;
}

export type { WebSocketRequest };
