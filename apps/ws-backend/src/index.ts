import { WebSocketServer } from "ws";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { user_conns } from "./states/user.states.js";
import { join_room, leave_room } from "./sockets/room.socket.js";
import { alter_shape, create_shape, delete_all_shapes, delete_shape, get_all_shapes } from "./sockets/shape.socket.js";
import { send_ws_response } from "./utils/websocket.utils.js";
import { catch_general_exception } from "./utils/exceptions.utils.js";
import { get_user_record } from "@repo/db/index";
import { JWT_SECRET } from "@repo/configs/index";

dotenv.config();

interface DecodedPayload {
  id: string;
}

// Validate the user_id to avoid multiple concurrent connections by the same user
const user_ids: { [key: string]: boolean } = {};

// verifying provided jwt
async function verify_jwt(jwt: string): Promise<string | { id: string; username: string }> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(jwt, JWT_SECRET, async (error: any, decoded_payload: unknown) => {
      // jwt is invalid
      if (error) {
        reject(`JWT verification failed: ${error as string}`);
        return;
      } else if (decoded_payload && typeof decoded_payload === "object") {
        // get user record from email field
        const user_obj = await get_user_record({ id: (decoded_payload as DecodedPayload).id || "" });
        if (user_obj.status === "error" || !user_obj.payload) {
          reject("User not found");
          return;
        }
        resolve({ id: user_obj.payload.id, username: user_obj.payload.username });
        return;
      }
      reject("JWT verification failed");
    });
  });
}

// get web-socket port
const PORT = parseInt(process.env.PORT || "3002");

const wss = new WebSocketServer({ port: PORT });

// error initializing web-socket server
wss.on("error", (error) => console.error("WebSocket server error:", error.message));
if (wss) console.info("WebSocket server is successfully running on port:", PORT);

wss.on("connection", async function connection(ws, req) {
  try {
    // get web-socket url
    const url = req.url;
    if (!url) {
      const msg = "Invalid web-socket url";
      console.error(msg);
      send_ws_response({ status: "error", type: "auth", message: msg, payload: null }, ws);
      ws.close();
      return;
    }

    // get jwt from search params
    const search_params = new URLSearchParams(url.split("?")[1]);
    const jwt = search_params.get("jwt");

    // get user-id from parsed jwt
    const user = await verify_jwt(jwt || "");

    // check user value
    if (typeof user !== "object") {
      // error
      const msg = "User verification failed";
      console.error(msg);
      send_ws_response({ status: "error", type: "auth", message: msg, payload: null }, ws);
      ws.close();
      return;
    }

    // set user-credentials on current ws-object
    ws.user_credentials = {
      id: user.id,
      username: user.username,
    };

    // checking if same user has already connected to web-socket server
    if (user_ids[ws.user_credentials.id]) {
      // error
      const msg = `${ws.user_credentials.username} is already connected to the WebSocket server`;
      console.error(msg);
      send_ws_response({ status: "error", type: "auth", message: msg, payload: null }, ws);
      ws.close();
      return;
    }

    // add user-id to users_ids global state
    user_ids[ws.user_credentials.id] = true;

    console.info(user_ids);

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
        } else if (parsed_message.type === "delete-all-shapes") {
          // delete a shape
          await delete_all_shapes(ws);
          console.info(Object.entries(user_conns.user_conns_state));
          return;
        } else if (parsed_message.type === "alter-shape") {
          // delete a shape
          await alter_shape(parsed_message.payload, ws);
          console.info(Object.entries(user_conns.user_conns_state));
          return;
        } else if (parsed_message.type === "get-all-shapes") {
          // get all the shapes of specific room
          await get_all_shapes(ws);
          console.info(Object.entries(user_conns.user_conns_state));
          return;
        }

        // invalid incoming message type
        const msg = "Please provide a valid incoming message type";
        console.error(msg);
        send_ws_response<null>({ status: "error", type: "others", message: msg, payload: null }, ws);
      } catch (error) {
        catch_general_exception(error, ws);
        return;
      }
    });

    // on-close event
    ws.on("close", () => {
      // delete user-id from user_ids global state
      const check_user_id_deletion = delete user_ids[ws.user_credentials?.id as string];
      // error
      if (!check_user_id_deletion) {
        console.error(
          `The client with auth ID (${ws.user_credentials?.id as string}) not found in the global user-ids state.`
        );
      }

      // delete user details in global user-conns-state
      const check_user_conns_state_deletion = delete user_conns.user_conns_state[ws.id || ""];
      // error
      if (!check_user_conns_state_deletion) {
        console.error(`The client with ID (${ws.id}) not found in the global user-state.`);
      }

      // success
      const msg = `The client with ID (${ws.id}) has disconnected from the web-socket server.`;
      console.info(msg);
      send_ws_response<null>({ status: "info", type: "others", message: msg, payload: null }, ws);
    });
  } catch (error) {
    catch_general_exception(error, ws);
    return;
  }
});
