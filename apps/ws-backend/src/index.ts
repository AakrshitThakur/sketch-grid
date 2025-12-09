import WebSocket, { WebSocketServer } from "ws";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { user_conns } from "./states/user.states.js";
import { JWT_SECRET } from "@repo/configs/index";
import { join_room, leave_room } from "./sockets/room.socket.js";
import { create_shape, delete_shape, get_all_shapes } from "./sockets/shape.socket.js";
import { send_ws_response } from "./utils/websocket.utils.js";
import { catch_general_exception } from "./utils/exceptions.utils.js";

dotenv.config();

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

const PORT = parseInt(process.env.PORT || "3002");

const wss = new WebSocketServer({ port: PORT });

wss.on("error", (error) => console.error("WebSocket server error:", error.message));
if (wss) console.info("WebSocket server is successfully running on port:", PORT);

wss.on("connection", async function connection(ws, req) {
  try {
    // get web-socket url
    const url = req.url;
    if (!url) {
      send_ws_response({ status: "error", type: "auth", message: "Invalid web-socket url", payload: null }, ws);
      ws.close();
      return;
    }

    // get jwt from search params
    const search_params = new URLSearchParams(url.split("?")[1]);
    const jwt = search_params.get("jwt");

    // get user-id from parsed jwt
    ws.user_id = await verify_jwt(jwt || "");

    console.info("New client successfully connected to web-socket server");

    // push user to global conn state
    // store user-id for message event
    ws.id = user_conns.push_new_user(ws);

    // on-message event
    ws.on("message", async function incoming(message) {
      try {
        // convert: raw-date -> string -> object
        const parsed_message = JSON.parse(message.toString());

        if (parsed_message.type === "join-room") {
          // join a new room
          await join_room(parsed_message.payload.room_id, ws);
          console.info(Object.entries(user_conns.user_conns_state));
          return;
        } else if (parsed_message.type === "leave-room") {
          // leave a room
          await leave_room(parsed_message.payload.room_id, ws);
          console.info(Object.entries(user_conns.user_conns_state));
          return;
        } else if (parsed_message.type === "create-shape") {
          // create a new shape
          await create_shape(parsed_message.payload, ws);
          console.info(Object.entries(user_conns.user_conns_state));
          return;
        } else if (parsed_message.type === "delete-shape") {
          // delete a shape
          await delete_shape(parsed_message.payload, ws);
          console.info(Object.entries(user_conns.user_conns_state));
          return;
        } else if (parsed_message.type === "get-all-shapes") {
          // get all the shapes of specific room
          await get_all_shapes(ws);
          console.info(Object.entries(user_conns.user_conns_state));
          return;
        }

        // invalid incoming message type
        send_ws_response<null>(
          { status: "error", type: "others", message: "Please provide a valid incoming message type", payload: null },
          ws
        );
      } catch (error) {
        catch_general_exception(error, ws);
        return;
      }
    });

    // on-close event
    ws.on("close", () => {
      // delete user details in global user-state
      const check_deletion = delete user_conns.user_conns_state[ws.id || ""];
      // error
      if (!check_deletion) {
        console.error(`The client with ID (${ws.id}) not found in the global user-state.`);
        return;
      }
      // success
      console.info(`The client with ID (${ws.id}) has disconnected from the web-socket server.`);
    });
  } catch (error) {
    catch_general_exception(error, ws);
    return;
  }
});
