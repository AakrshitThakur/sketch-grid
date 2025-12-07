import type { WebSocket } from "ws";
import type { Prisma } from "@prisma/client";
import { user_conns } from "../states/user.states.js";
import { send_ws_response } from "../utils/websocket.utils.js";
import { get_room_record, get_shape_records, prisma_client } from "@repo/db/index";
import { Shape } from "@repo/types/index";
import { catch_general_exception } from "../utils/exceptions.utils.js";

// envoked then user draws a specific geometry
async function create_shape(payload: Shape, ws: WebSocket) {
  try {
    if (!ws.id) {
      send_ws_response<null>({ status: "error", message: "User not found", payload: null }, ws);
      return false;
    }

    // get user ws:conn details
    const user_conn_details = user_conns.user_conns_state[ws.id];
    if (!user_conn_details) {
      send_ws_response<null>({ status: "error", message: "User not found", payload: null }, ws);
      return false;
    }

    // check if user already joined the room
    if (!user_conn_details.room) {
      send_ws_response<null>({ status: "error", message: "User has not yet joined the room", payload: null }, ws);
      return false;
    }

    // check existance of room
    const room_obj = await get_room_record({ id: user_conn_details.room });
    if (room_obj.status === "error") {
      send_ws_response({ status: "error", message: `Room with ID ${user_conn_details.room} not found`, payload: null }, ws);
      return false;
    }

    // create new shape entry
    const new_shape = await prisma_client.shape.create({
      data: {
        id: payload.id,
        data: JSON.stringify(payload),
        room_id: user_conn_details.room,
      },
    });

    // new shape not created
    if (!new_shape) {
      send_ws_response<null>({ status: "error", message: "New shape not created", payload: null }, ws);
      return false;
    }

    // get all the shapes
    let all_shapes_obj = await get_shape_records({ room_id: user_conn_details.room });
    if (all_shapes_obj.status === "error") {
      send_ws_response({ status: "error", message: `Shape with ID ${user_conn_details.room} not found`, payload: null }, ws);
      return false;
    }

    // success
    send_ws_response(
      { status: "success", message: "All shapes received successfully", payload: { shapes: all_shapes_obj.payload } },
      ws
    );
    return true;
  } catch (error) {
    catch_general_exception(error, ws);
    return;
  }
}

async function delete_shape(payload: { shape_id: string }, ws: WebSocket) {
  try {
    if (!ws.id) {
      send_ws_response<null>({ status: "error", message: "User not found", payload: null }, ws);
      return false;
    }

    // get user ws:conn details
    const user_conn_details = user_conns.user_conns_state[ws.id];
    if (!user_conn_details) {
      send_ws_response<null>({ status: "error", message: "User not found", payload: null }, ws);
      return false;
    }

    // check if user already joined the room
    if (!user_conn_details.room) {
      send_ws_response<null>({ status: "error", message: "User has not yet joined the room", payload: null }, ws);
      return false;
    }

    // check existence of room
    const room_obj = await get_room_record({ id: user_conn_details.room });
    if (room_obj.status === "error") {
      send_ws_response({ status: "error", message: `Room with ID ${user_conn_details.room} not found`, payload: null }, ws);
      return false;
    }

    // get deleted shape
    const deleted_shape = await prisma_client.shape.delete({
      where: {
        id: payload.shape_id,
      },
    });

    // error while deletion
    if (!deleted_shape) {
      send_ws_response(
        { status: "error", message: `The provided shape ID: ${payload.shape_id} is invalid`, payload: null },
        ws
      );
      return false;
    }
    // success
    send_ws_response(
      { status: "success", message: `Shape with ID ${deleted_shape.id} has been successfully deleted`, payload: null },
      ws
    );
    return true;
  } catch (error) {
    catch_general_exception(error, ws);
    return;
  }
}

export { create_shape, delete_shape };
