import "ws";

// Augmenting new key to WebSocket interface
declare module "ws" {
  interface WebSocket {
    // for web-socket id
    id?: string;
    // for user (auth-id & auth-username)
    user_credentials?: {
      id: string;
      username: string;
    };
  }
}
