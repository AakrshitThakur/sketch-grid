import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { create_room_zod_schema } from "@repo/zod/index";
import { catch_general_exception } from "@repo/utils/index";
import { prisma_client, get_user_record, get_room_record, get_room_records } from "@repo/db/index";

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

    // hash password
    const h_password = await bcrypt.hash(v_credentials.password, 10);

    // create new room
    const new_room = await prisma_client.room.create({
      data: {
        slug: v_credentials.slug,
        password: h_password,
        admin_id: user_credentials.id,
        user_ids: [],
      },
    });
    if (!new_room) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // success
    res.status(200).json({
      message: `${user_obj.payload.username} has successfully created a new room named ${new_room.slug}`,
      room_id: new_room.id,
    });
    return;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
  }
}

// user (not admin) to join a specific room
async function join_room_controller(req: Request, res: Response) {
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

    // get room
    const room_obj = await get_room_record({
      slug: v_credentials.slug,
    });
    if (room_obj.status === "error" || !room_obj.payload) {
      res.status(room_obj.status_code).json({ message: room_obj.message });
      return;
    }

    // check if the user is admin of room
    if (room_obj.payload.admin_id === user_obj.payload.id) {
      res.status(200);
      res.json({ message: "Administrators are already authorized to access their own rooms", room_id: room_obj.payload.id });
      return;
    }

    // check the authenticity of provided password from the user
    const check_psd = await bcrypt.compare(v_credentials.password, room_obj.payload.password);
    if (!check_psd) {
      res.status(400).json({ message: "Invalid room password" });
      return;
    }

    // @ts-ignore
    if (room_obj.payload.user_ids.includes(user_obj.payload.id)) {
      // user already subscribed/joined the room
      res.status(200).json({
        message: `${user_obj.payload.username} has successfully entered the room with ID ${room_obj.payload.id}`,
        room_id: room_obj.payload.id,
      });
      return;
    }

    // add user-add to user_ids array
    const updated_room = await prisma_client.room.update({
      where: { id: room_obj.payload.id },
      // @ts-ignore
      data: { user_ids: [...room_obj.payload.user_ids, user_credentials.id] },
    });

    // error
    if (!updated_room) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    // success
    res.status(200).json({
      message: `${user_obj.payload.username} has successfully entered the room with ID ${room_obj.payload.id}`,
      room_id: room_obj.payload.id,
    });
    return;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
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
    const room_id = req.params.room_id as string;

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

// get all rooms created by the user (admin)
async function get_all_admin_rooms_controller(req: Request, res: Response) {
  try {
    // get user-id
    const user_credentials = req.user_credentials;
    if (!user_credentials || !user_credentials.id) {
      res.status(401).json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // get user from db
    const user_obj = await get_user_record({ id: user_credentials.id });
    if (user_obj.status === "error" || !user_obj.payload) {
      res.status(user_obj.status_code).json({ message: user_obj.message });
      return;
    }

    // get room by id
    const rooms_obj = await get_room_records({
      admin_id: user_credentials.id,
    });
    // error
    if (rooms_obj.status === "error") {
      res.status(rooms_obj.status_code).json({ message: rooms_obj.message });
      return;
    }
    // success
    res.status(200).json({
      rooms: rooms_obj.payload,
      message: `All rooms made by ${user_obj.payload.username} have been received successfully`,
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
    const room_id = req.params.room_id as string;
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
    if (user_obj.status === "error" || !user_obj.payload) {
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
    res.status(200).json({ message: `${user_obj.payload.username} has successfully deleted the room (ID: ${room_id})` });
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
  }
}

export {
  create_room_controller,
  join_room_controller,
  get_room_by_id_controller,
  get_all_rooms_controller,
  get_all_admin_rooms_controller,
  delete_room_controller,
};
