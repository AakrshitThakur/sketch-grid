import type { Request, Response } from "express";
import { get_user_record } from "@repo/db/auth";
import { get_room_record, get_room_records } from "@repo/db/room";
import { create_room_zod_schema } from "@repo/zod/room.zod";
import { catch_general_exception } from "@repo/utils/exceptions";
import { prisma_client } from "@repo/db/connect";

// create a new room
async function create_room_controller(req: Request, res: Response) {
  try {
    const credentials = req.body;
    const v_credentials = create_room_zod_schema.parse(credentials);

    // get user-cred
    const user_credentials = req.user_credentials;
    if (!user_credentials || !user_credentials.id) {
      res.status(401).json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // check if user exists or not
    const user_obj = await get_user_record({ id: user_credentials.id });
    if (user_obj.status === "error" || !user_obj.payload) {
      res.status(user_obj.status_code).json({ message: user_obj.message });
      return;
    }

    // create new room
    const new_room = await prisma_client.room.create({
      data: {
        slug: v_credentials.slug,
        admin_id: user_credentials.id,
      },
    });
    if (!new_room) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // success
    res.status(200).json({
      message: "Room successfully created",
      room_id: user_obj.payload.id,
    });
    return;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
    return;
  }
}

// get all rooms from Room table
async function get_all_rooms_controller(req: Request, res: Response) {
  try {
    // get all rooms
    const rooms_obj = await get_room_records({});
    if (rooms_obj.status === "error") {
      res.status(rooms_obj.status_code).json({ message: rooms_obj.message });
      return;
    }

    // success
    res.status(200).json({
      rooms: rooms_obj.payload,
      message: "All rooms successfully received",
    });
    return;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
    return;
  }
}

// URL-query-string -> after the ? in the URL
// URL-path-parameters -> part of the route itself
async function get_room_by_id_controller(req: Request, res: Response) {
  try {
    // get room-id from path-params
    const room_id = parseInt(req.params.room_id as string);

    // get user-id
    const user_credentials = req.user_credentials;
    if (!user_credentials || !user_credentials.id) {
      res.status(401).json({ message: "Please sign in or create an account to continue" });
      return;
    }

    const user_obj = await get_user_record({ id: user_credentials.id });
    if (user_obj.status === "error" || !user_obj.payload) {
      res.status(user_obj.status_code).json({ message: user_obj.message });
      return;
    }

    // get room by id
    const room_obj = await get_room_record({
      id: room_id,
      admin_id: user_credentials.id,
    });
    // error
    if (room_obj.status === "error") {
      res.status(room_obj.status_code).json({ message: room_obj.message });
      return;
    }
    // success
    res.status(200).json({
      room: room_obj.payload,
      message: `Room (ID: ${room_id}) successfully received`,
    });
    return;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
    return;
  }
}

// delete room by room-id
async function delete_room_controller(req: Request, res: Response) {
  try {
    const room_id = parseInt(req.params.room_id as string);
    if (!room_id) {
      res.status(400).json({ message: "Invalid Room ID provided" });
      return;
    }

    // get user-cred
    const user_credentials = req.user_credentials;
    if (!user_credentials || !user_credentials.id) {
      res.status(401).json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // check if user exists
    const user_obj = await get_user_record({ id: user_credentials.id });
    if (user_obj.status === "error") {
      res.status(user_obj.status_code).json({ message: user_obj.message });
      return;
    }

    // get room
    const room_obj = await get_room_record({
      id: room_id,
      admin_id: user_credentials.id,
    });
    if (room_obj.status === "error") {
      res.status(room_obj.status_code).json({ message: room_obj.message });
      return;
    }

    // delete room from database
    const deleted_room = await prisma_client.room.delete({
      where: {
        id: room_id,
        admin_id: user_credentials.id,
      },
    });

    // error
    if (!deleted_room) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // success
    res.status(200).json({ message: `Room (ID: ${room_id}) successfully deleted` });
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
  }
}

export { create_room_controller, get_room_by_id_controller, get_all_rooms_controller, delete_room_controller };
