import WebSocket, { WebSocketServer } from "ws";
import jsonwebtoken from "jsonwebtoken";
import { user_conns } from "./states/user.states.js";
import { JWT_SECRET } from "@repo/configs/index";
import { join_room } from "./sockets/room.socket.js";

interface DecodedPayload {
  id: string;
}

async function verify_jwt(jwt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(
      jwt,
      JWT_SECRET,
      (error: any, decoded_payload: unknown) => {
        // jwt is invalid
        if (error) {
          reject(`Token verification failed: ${error as string}`);
          return;
        } else if (decoded_payload && typeof decoded_payload === "object") {
          resolve((decoded_payload as DecodedPayload).id || "");
          return;
        }
        reject("Token verification failed");
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
  // const user_id = await verify_jwt(jwt_token || "");

  // close connection
  // if (!user_id) {
  //   ws.close();
  //   return;
  // }

  // push user to global conn state
  user_conns.push_new_user(ws);

  // store user-id for message event
  ws.id = user_conns.user_id.toString();

  // increment user-id
  user_conns.increment_user_id();

  console.log(user_conns);

  ws.on("message", function incoming(message) {
    // convert: raw-date -> string -> object
    const parsed_message = JSON.parse(message.toString());

    if (parsed_message.type === "join_room") {
      join_room(parsed_message.payload.room_id, ws);
      return;
    }

    ws.send("o_message");
  });
});
