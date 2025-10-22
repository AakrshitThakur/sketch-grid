import type { Request, Response } from "express";
import { get_user_record } from "@repo/db/auth";
import { get_room_record } from "@repo/db/room";
import { create_room_zod_schema } from "@repo/zod/room.zod";
import { catch_general_exception } from "@repo/utils/exceptions";
import { prisma_client } from "@repo/db/connect";

async function create_room_controller(req: Request, res: Response) {
  try {
    const credentials = req.body;
    const v_credentials = create_room_zod_schema.parse(credentials);

    // get user id
    const user_credentials = req.user_credentials;

    // check if user exists or not
    const user_obj = await get_user_record({ id: user_credentials?.id || "" });
    if (user_obj.status === "error") {
      res.status(user_obj.status_code).json({ message: user_obj.message });
      return;
    }

    // create new room
    const new_room = await prisma_client.room.create({
      data: {
        slug: v_credentials.slug,
        admin_id: user_obj.payload?.id || "",
      },
    });
    if (!new_room) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // success
    res.status(200).json({
      message: "Room successfully created",
      room_id: user_obj.payload?.id,
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
    const room_id = req.params.room_id as unknown as number;

    // get user-id
    const user_credentials = req.user_credentials;

    const user_obj = await get_user_record({ id: user_credentials?.id || "" });
    if (user_obj.status === "error") {
      res.status(user_obj.status_code).json({ message: user_obj.message });
      return;
    }

    // get room by id
    const room_obj = await get_room_record({ id: room_id });
    if (room_obj.status === "error") {
      res.status(room_obj.status_code).json({ message: room_obj.message });
      return;
    }
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
    return;
  }
}

export { create_room_controller };
