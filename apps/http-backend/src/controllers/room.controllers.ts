import type { Request, Response } from "express";
import { catch_general_exception } from "../utils/exceptions.js";
import { get_records } from "../prisma/auth.prisma.js";
import { create_room } from "../prisma/room.prisma.js";
import { create_room_zod_schema } from "@repo/zod/room.zod";

async function create_room_controller(req: Request, res: Response) {
  try {
    const credentials = req.body;
    const v_credentials = create_room_zod_schema.parse(credentials);

    // get user id
    const user_credentials = req.user_credentials;

    // check if user exists or not
    const user = await get_records({ id: user_credentials?.id || "" }, res);
    if (user.length < 1) {
      res
        .status(401)
        .json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // create new room
    const new_room = await create_room(
      { ...v_credentials, admin_id: user[0]?.id || "" },
      res
    );
    if (!new_room) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // success
    res
      .status(200)
      .json({ message: "Room successfully created", room_id: user[0]?.id });
      return;
  } catch (error) {
    catch_general_exception(error as Error, res);
    return;
  }
}

export { create_room_controller };
