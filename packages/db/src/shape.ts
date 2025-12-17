import { prisma_client } from "./index";
import { catch_general_exception } from "@repo/utils/exceptions";
import type { ReturnPrismaResponse } from "@repo/types/index";

interface GetShapeRecords {
  id?: string;
  room_id?: string;
}

async function get_shape_records(input: GetShapeRecords) {
  try {
    const shapes = await prisma_client.shape.findMany({
      where: {
        ...input,
      },
    });

    if (shapes.length === 0) {
      return {
        status_code: 404,
        status: "error",
        message: "No Shapes found",
        payload: [],
      } as ReturnPrismaResponse<[]>;
    }

    const return_shapes: ReturnPrismaResponse<typeof shapes> = {
      status_code: 200,
      status: "success",
      message: "success",
      payload: shapes,
    };
    return return_shapes;
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

async function get_shape_record(input: GetShapeRecords) {
  try {
    const shape = await prisma_client.shape.findFirst({
      where: {
        ...input,
      },
    });

    if (!shape) {
      return {
        status_code: 404,
        status: "error",
        message: "Shape not found",
        payload: null,
      } as ReturnPrismaResponse<null>;
    }

    const return_shape: ReturnPrismaResponse<typeof shape> = {
      status_code: 200,
      status: "success",
      message: "success",
      payload: shape,
    };
    return return_shape;
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

export { get_shape_records, get_shape_record };
