import "ws";

// Augmenting new key to WebSocket interface
declare module "ws" {
  interface WebSocket {
    id?: string;
  }
}
