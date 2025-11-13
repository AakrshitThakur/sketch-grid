import { prisma_client } from "./index";
import { catch_general_exception } from "@repo/utils/exceptions";
import type { ReturnPrismaResponse } from "@repo/types/index";

interface GetRoomRecords {
  id?: number;
  slug?: string;
  admin_id?: string;
}

async function get_room_records(input: GetRoomRecords) {
  try {
    const rooms = await prisma_client.room.findMany({
      where: {
        ...input,
      },
    });

    if (rooms.length === 0) {
      return {
        status_code: 404,
        status: "error",
        message: "No Rooms found",
        payload: null,
      } as ReturnPrismaResponse<null>;
    }

    const return_rooms: ReturnPrismaResponse<typeof rooms> = {
      status_code: 200,
      status: "success",
      message: "success",
      payload: rooms,
    };
    return return_rooms;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    return {
      status_code,
      status: "error",
      message,
      payload: null,
    } as ReturnPrismaResponse<null>;
  }
}

async function get_room_record(input: GetRoomRecords) {
  try {
    const room = await prisma_client.room.findFirst({
      where: {
        ...input,
      },
    });

    if (!room) {
      return {
        status_code: 404,
        status: "error",
        message: "Room not found",
        payload: null,
      } as ReturnPrismaResponse<null>;
    }

    const return_room: ReturnPrismaResponse<typeof room> = {
      status_code: 200,
      status: "success",
      message: "success",
      payload: room,
    };
    return return_room;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    return {
      status_code,
      status: "error",
      message,
      payload: null,
    } as ReturnPrismaResponse<null>;
  }
}

export { get_room_records, get_room_record };
