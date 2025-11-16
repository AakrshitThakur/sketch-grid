import WebSocket, { WebSocketServer } from "ws";
import jsonwebtoken from "jsonwebtoken";
import { user_conns } from "./states/user.states.js";
import { JWT_SECRET } from "@repo/configs/index";
import { join_room, leave_room } from "./sockets/room.socket.js";
import { draw } from "./sockets/draw.socket.js";
import { send_ws_response } from "./utils/websocket.utils.js";
import { catch_general_exception } from "./utils/exceptions.utils.js";

interface DecodedPayload {
  id: string;
}

// verifing provided jwt
async function verify_jwt(jwt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(jwt, JWT_SECRET, (error: any, decoded_payload: unknown) => {
      // jwt is invalid
      if (error) {
        reject(`JWT verification failed: ${error as string}`);
        return;
      } else if (decoded_payload && typeof decoded_payload === "object") {
        resolve((decoded_payload as DecodedPayload).id || "");
        return;
      }
      reject("JWT verification failed");
    });
  });
}

const wss = new WebSocketServer({ port: 5001 });

wss.on("connection", async function connection(ws, req) {
  try {
    // get web-socket url
    const url = req.url;
    if (!url) {
      send_ws_response({ status: "error", message: "Invalid web-socket url", payload: null }, ws);
      ws.close();
      return;
    }

    // get jwt from search params
    const search_params = new URLSearchParams(url.split("?")[1]);
    const jwt = search_params.get("jwt");

    // get user-id from parsed jwt
    let user_id = "";

    // check jwt
    verify_jwt(jwt || "")
      .then((s: string) => {
        user_id = s;
      })
      .catch((e: string) => {
        console.error(e);
        send_ws_response({ status: "error", message: e, payload: null }, ws);
        ws.close();
        return;
      });

    // cookie logic if needed in future
    // const cookies = req.headers.cookie;
    // if (!cookies) {
    //   send_ws_response({ status: "error", message: "JWT token not found", payload: null }, ws);
    //   ws.close();
    //   return;
    // }
    // // Object.fromEntries() method is used to transform a list of key-value pairs (like an array or map) into an object
    // const cookies_obj = Object.fromEntries(cookies.split("; ").map((c) => c.split("=")));

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
    ws.on("message", async function incoming(message) {
      try {
        // convert: raw-date -> string -> object
        const parsed_message = JSON.parse(message.toString());

        if (parsed_message.type === "join-room") {
          await join_room(parsed_message.payload.room_id, ws);
          console.info(user_conns.user_conns_state);
          return;
        } else if (parsed_message.type === "leave-room") {
          await leave_room(parsed_message.payload.room_id, ws);
          console.info(user_conns.user_conns_state);
          return;
        } else if (parsed_message.type === "draw") {
          // await draw(parsed_message.payload.room_id, ws);
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
