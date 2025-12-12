import type { WebSocket } from "ws";
import { user_conns } from "../states/user.states.js";
import { get_room_record, get_shape_record, get_shape_records, prisma_client } from "@repo/db/index";
import { Shape } from "@repo/types/index";
import { send_ws_response } from "../utils/websocket.utils.js";
import { catch_general_exception } from "../utils/exceptions.utils.js";
import type { WebSocketResponseType } from "../types/index.js";

// return room which is currently joined by user
async function get_user_joined_room(type: WebSocketResponseType, ws: WebSocket) {
  let msg = "";
  try {
    // user not-found
    if (!ws.id || !ws.user_credentials) {
      msg = "User not found";
      console.error(msg);
      send_ws_response<null>({ status: "error", type, message: msg, payload: null }, ws);
      return null;
    }

    // get user ws:conn details
    const user_conn_details = user_conns.user_conns_state[ws.id];
    if (!user_conn_details) {
      msg = "User not found";
      console.error(msg);
      send_ws_response<null>({ status: "error", type, message: msg, payload: null }, ws);
      return null;
    }

    // check if user already joined the room
    if (!user_conn_details.room) {
      msg = `${ws.user_credentials.username} has not yet joined any room`;
      console.error(msg);
      send_ws_response<null>({ status: "error", type, message: msg, payload: null }, ws);
      return null;
    }

    // check existence of room
    const room_obj = await get_room_record({ id: user_conn_details.room });
    if (room_obj.status === "error") {
      msg = `Room with ID ${user_conn_details.room} not found`;
      console.error(msg);
      send_ws_response({ status: "error", type, message: msg, payload: null }, ws);
      return null;
    }
    return user_conn_details.room;
  } catch (error) {
    catch_general_exception(error, ws);
    return null;
  }
}

// broadcasting all the shapes of specific room
async function broadcast_all_shapes(type: WebSocketResponseType, room_id: string, ws: WebSocket) {
  let msg = "";
  try {
    // get all shapes of a specific room
    const all_shapes_obj = await get_shape_records({ room_id });
    if (all_shapes_obj.status === "error") {
      msg = `Shapes of Room ID: ${room_id} not found`;
      console.error(msg);
      send_ws_response({ status: "error", type, message: msg, payload: null }, ws);
      return false;
    }

    // converting data property from json to a valid ts-object
    if (all_shapes_obj.payload) {
      all_shapes_obj.payload = all_shapes_obj.payload.map((shape) => {
        if (shape.data && typeof shape.data === "string") return { ...shape, data: JSON.parse(shape.data) };
        return shape;
      });
    }

    // The Object.entries() static method returns an array of a given object's own enumerable string-keyed property key-value pairs.
    for (let [key, value] of Object.entries(user_conns.user_conns_state)) {
      if (room_id === value.room) {
        msg = `All shapes have been received successfully - by ${ws.user_credentials?.username}`;
        // broadcast all the shapes of a specific room to all the client connected to the same room
        send_ws_response({ status: "success", type, message: msg, payload: all_shapes_obj.payload }, value.ws);
      }
    }
    return true;
  } catch (error) {
    catch_general_exception(error, ws);
    return false;
  }
}

// invoked then user draws a specific shape
async function create_shape(payload: Shape, ws: WebSocket) {
  const type: WebSocketResponseType = "create-shape";
  let msg = "";
  try {
    // check user
    if (!ws.user_credentials || !ws.id) {
      msg = "Please sign up or sign in to continue";
      console.error(msg);
      send_ws_response({ status: "error", type, message: msg, payload: null }, ws);
      return false;
    }

    // get user-joined-room-id
    const room_id = await get_user_joined_room(type, ws);
    if (!room_id) return false;

    // create new shape entry
    const new_shape = await prisma_client.shape.create({
      data: {
        id: payload.id,
        data: JSON.stringify(payload),
        owner_id: ws.user_credentials.id,
        room_id,
      },
    });

    // new shape not created
    if (!new_shape) {
      msg = `Unable to create a new ${payload.type} shape in the room with ID ${room_id}`;
      console.error(msg);
      send_ws_response<null>({ status: "error", type, message: msg, payload: null }, ws);
      return false;
    }

    // notify
    msg = `A new ${payload.type} shape has been successfully created - by ${ws.user_credentials.username}`;
    console.info(msg);
    send_ws_response({ status: "success", type, message: msg, payload: null }, ws);

    // broadcasting all the shapes of specific room
    return broadcast_all_shapes(type, room_id, ws);
  } catch (error) {
    catch_general_exception(error, ws);
    return false;
  }
}

// delete a specific shape from current room
async function delete_shape(payload: { shape_id: string }, ws: WebSocket) {
  const type: WebSocketResponseType = "delete-shape";
  let msg = "";
  try {
    // check user
    if (!ws.user_credentials || !ws.id) {
      msg = "Please sign up or sign in to continue";
      console.error(msg);
      send_ws_response({ status: "error", type, message: msg, payload: null }, ws);
      return false;
    }

    // get user-joined-room-id
    const room_id = await get_user_joined_room(type, ws);
    if (!room_id) return false;

    // get deleted shape
    const deleted_shape = await prisma_client.shape.delete({
      where: {
        id: payload.shape_id,
        room_id,
      },
    });

    // error while deletion
    if (!deleted_shape) {
      msg = `Unable to delete the shape with ID ${payload.shape_id} in the room with ID ${room_id}`;
      console.error(msg);
      send_ws_response({ status: "error", type, message: msg, payload: null }, ws);
      return false;
    }

    // notify
    msg = `The shape with ID ${payload.shape_id} has been successfully deleted - by ${ws.user_credentials.username}`;
    console.info(msg);
    send_ws_response({ status: "success", type, message: msg, payload: null }, ws);

    // broadcasting all the shapes of specific room
    return broadcast_all_shapes(type, room_id, ws);
  } catch (error) {
    catch_general_exception(error, ws);
    return false;
  }
}

// alter properties of a specific shape of a room
async function alter_shape(payload: { shape_id: string; data: Shape }, ws: WebSocket) {
  const type: WebSocketResponseType = "alter-shape";
  let msg = "";
  try {
    // check user
    if (!ws.user_credentials || !ws.id) {
      msg = "Please sign up or sign in to continue";
      console.error(msg);
      send_ws_response({ status: "error", type, message: msg, payload: null }, ws);
      return false;
    }

    // get user-joined-room-id
    const room_id = await get_user_joined_room(type, ws);
    if (!room_id) return false;

    // Prisma will only update the fields you specify in the data object - all other fields remain unchanged.
    // alter shape of specific shape-id
    const altered_shape = await prisma_client.shape.update({
      where: { id: payload.shape_id },
      data: { data: JSON.stringify(payload.data) },
    });

    // error while deletion
    if (!alter_shape) {
      msg = `Unable to update the properties of shape with ID ${payload.shape_id} in the room with ID ${room_id}`;
      console.error(msg);
      send_ws_response({ status: "error", type, message: msg, payload: null }, ws);
      return false;
    }

    // notify
    msg = `The shape with ID ${payload.shape_id} has been successfully updated - by ${ws.user_credentials.username}`;
    console.info(msg);
    send_ws_response({ status: "success", type, message: msg, payload: null }, ws);

    // broadcasting all the shapes of specific room
    return broadcast_all_shapes(type, room_id, ws);
  } catch (error) {
    catch_general_exception(error, ws);
    return false;
  }
}

// function to get all shapes of a specific room
async function get_all_shapes(ws: WebSocket) {
  const type: WebSocketResponseType = "get-all-shapes";
  let msg = "";
  try {
    // get user-joined-room-id
    const room_id = await get_user_joined_room(type, ws);
    if (!room_id) return false;

    // broadcasting all the shapes of specific room
    return broadcast_all_shapes(type, room_id, ws);
  } catch (error) {
    catch_general_exception(error, ws);
    return false;
  }
}

export { create_shape, delete_shape, alter_shape, get_all_shapes };
