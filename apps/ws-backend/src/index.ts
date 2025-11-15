import WebSocket, { WebSocketServer } from "ws";
import jsonwebtoken from "jsonwebtoken";
import { user_conns } from "./states/user.states.js";
import { JWT_SECRET } from "@repo/configs/index";
import { join_room, leave_room } from "./sockets/room.socket.js";
import { send_ws_response } from "./utils/websocket.utils.js";
import { catch_general_exception } from "./utils/exceptions.utils.js";

interface DecodedPayload {
  id: string;
}

// verifing provided jwt
async function verify_jwt(jwt: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(jwt, JWT_SECRET, (error: any, decoded_payload: unknown) => {
      // jwt is invalid
      if (error) {
        console.error(`Token verification failed: ${error as string}`);
        reject(null);
        return;
      } else if (decoded_payload && typeof decoded_payload === "object") {
        resolve((decoded_payload as DecodedPayload).id || null);
        return;
      }
      reject(null);
    });
  });
}

// Token verification failed
const wss = new WebSocketServer({ port: 5000 });

wss.on("connection", async function connection(ws, request) {
  try {
    // get web-socket url
    const url = request.url;
    if (!url) return;

    // get jwt from search params
    const search_params = new URLSearchParams(url.split("?")[1]);
    const jwt_token = search_params.get("jwt");

    // // check jwt
    // const user_id = await verify_jwt(jwt_token || "");

    // // jwt verification failed - close connection
    // if (!user_id) {
    //   ws.close();
    //   return;
    // }

    console.info("New client successfully connected to web-socket server");

    // push user to global conn state
    // store user-id for message event
    ws.id = user_conns.push_new_user(ws);

    console.info(user_conns);

    // on-message event
    ws.on("message", function incoming(message) {
      try {
        // convert: raw-date -> string -> object
        const parsed_message = JSON.parse(message.toString());

        if (parsed_message.type === "join-room") {
          join_room(parsed_message.payload.room_id, ws);
          console.info(user_conns.user_conns_state);
          return;
        } else if (parsed_message.type === "leave-room") {
          leave_room(parsed_message.payload.room_id, ws);
          console.info(user_conns.user_conns_state);
          return;
        }

        // invalid incoming message type
        send_ws_response<null>(
          { status: "error", message: "Please provide a valid incoming message type", payload: null },
          ws
        );
      } catch (error) {
        catch_general_exception(error, ws);
        return;
      }
    });

    // on-close event
    ws.on("close", () => console.info(`The client with ID (${ws.id}) has disconnected from the web-socket server.`));
  } catch (error) {
    catch_general_exception(error, ws);
    return;
  }
});
