import { prisma_client } from "@repo/db/connect";
import { catch_general_exception } from "@repo/utils/exceptions";
import type { ReturnPrismaResponse } from "@repo/types/index";

interface GetUserAuthRecords {
  id: string;
  username: string;
  email: string;
  password: string;
}

type GetUserAuthRecordsParams = Partial<GetUserAuthRecords>;

async function get_user_records(input: GetUserAuthRecordsParams) {
  try {
    const records = await prisma_client.user.findMany({
      where: {
        ...input,
      },
    });

    // return
    const return_records: ReturnPrismaResponse<typeof records> = {
      status: "success",
      status_code: 200,
      message: "success",
      payload: records,
    };
    return return_records;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    return {
      status_code,
      status: "error",
      message,
      payload: null,
    };
  }
}

async function get_user_record(input: GetUserAuthRecordsParams) {
  try {
    const record = await prisma_client.user.findFirst({
      where: {
        ...input,
      },
    });

    if (!record) {
      return {
        status: "error",
        status_code: 404,
        message: "User not found",
        payload: null,
      } as ReturnPrismaResponse<null>;
    }

    // return
    const return_record: ReturnPrismaResponse<typeof record> = {
      status: "success",
      status_code: 200,
      message: "success",
      payload: record,
    };
    return return_record;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    return {
      status_code,
      status: "error",
      message,
      payload: null,
    };
  }
}

export { get_user_records, get_user_record };
