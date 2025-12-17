import type { WsResponseType } from "@repo/zod/index";
interface WebSocketRequest<T> {
  type: WsResponseType;
  payload: T;
}

export type { WebSocketRequest };
