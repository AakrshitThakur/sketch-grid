import "ws";

// Augmenting new key to WebSocket interface
declare module "ws" {
  interface WebSocket {
    // for web-socket id
    id?: string;
    // for user-auth id
    user_id?: string;
  }
}
