import type { Response } from "express";
import { prisma_client } from "@repo/db/connect";
import { catch_general_exception } from "../utils/exceptions.js";

interface CreateRoomParams {
  slug: string;
  admin_id: string;
}

async function create_room(input: CreateRoomParams, res: Response) {
  try {
    const new_room = await prisma_client.room.create({
      data: {
        ...input,
      },
    });
    return new_room;
  } catch (error) {
    catch_general_exception(error as Error, res);
    return;
  }
}

export { create_room };
