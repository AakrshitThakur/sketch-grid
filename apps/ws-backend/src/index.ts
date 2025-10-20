import WebSocket, { WebSocketServer } from "ws";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET } from "@repo/configs/index";

interface DecodedPayload {
  id: string;
}

async function verify_jwt(jwt: string): Promise<string | boolean> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(
      jwt,
      JWT_SECRET,
      (error: any, decoded_payload: unknown) => {
        // jwt is invalid
        if (error) {
          reject(false);
          return;
        } else if (decoded_payload && typeof decoded_payload === "object") {
          resolve((decoded_payload as DecodedPayload).id || "");
          return;
        }
        reject(false);
        return;
      }
    );
  });
}

const wss = new WebSocketServer({ port: 5000 });

wss.on("connection", async function connection(ws, request) {
  // get web-socket url
  const url = request.url;
  if (!url) return;

  // get jwt from search params
  const search_params = new URLSearchParams(url.split("?")[1]);
  const jwt_token = search_params.get("token");

  // check jwt
  const user_id = await verify_jwt(jwt_token || "");

  // close connection
  if (!user_id) {
    ws.close();
    return;
  }

  ws.on("message", function incoming(message) {
    ws.send(message.toString());
  });
});
