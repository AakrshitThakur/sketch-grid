import type { Response } from "express";
import { prisma_client } from "@repo/db/connect";
import { catch_general_exception } from "../utils/exceptions.js";

interface CreateUserParams {
  username: string;
  email: string;
  password: string;
}

interface GetUserAuthRecords {
  id: string;
  username: string;
  email: string;
  password: string;
}

type GetUserAuthRecordsParams = Partial<GetUserAuthRecords>;

async function create_user(params: CreateUserParams, res: Response) {
  try {
    const new_user = await prisma_client.user.create({
      data: {
        username: params.username,
        email: params.email,
        password: params.password,
      },
    });

    if (new_user) return new_user;
    return false;
  } catch (error) {
    catch_general_exception(error as Error, res);
    return false;
  }
}

async function does_email_exists(email: string, res: Response) {
  try {
    const count = await prisma_client.user.count({
      where: {
        email,
      },
    });

    if (count < 1) return false;
    return true;
  } catch (error) {
    catch_general_exception(error as Error, res);
    return true;
  }
}

async function get_records(input: GetUserAuthRecordsParams, res: Response) {
  try {
    const records: GetUserAuthRecords[] = await prisma_client.user.findMany({
      where: {
        ...input,
      },
    });

    return records;
  } catch (error) {
    catch_general_exception(error as Error, res);
    return [];
  }
}

export { create_user, does_email_exists, get_records };
