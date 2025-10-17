import type { Request, Response } from "express";
import { ZodError } from "zod/v4";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signin_zod_schema, signup_zod_schema } from "@repo/zod/auth.zod";
import { prisma_client } from "@repo/db/connect";
import { JWT_SECRET, ENVIRONMENT } from "@repo/configs/index";

interface CreateUserParams {
  username: string;
  email: string;
  password: string;
}

function general_exceptions(error: Error, res: Response) {
  if (error instanceof Error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  } else {
    console.error(error as string);
    res.status(400).json({ message: error as string });
  }
}

function catch_auth_exceptions(error: Error, res: Response) {
  if (error instanceof ZodError) {
    console.error(error.issues);
    res
      .status(400)
      .json({ message: error.issues[0]?.message || "Validation error" });
  } else if (error instanceof Error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  } else {
    console.error(error);
    res.status(400).json({ message: error });
  }
}

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
    general_exceptions(error as Error, res);
    return false;
  }
}

async function signin_controller(req: Request, res: Response) {
  try {
    const credentials = req.body;
    const v_credentials = signin_zod_schema.parse(credentials);
  } catch (error) {
    catch_auth_exceptions(error as Error, res);
    return;
  }
}
async function signup_controller(req: Request, res: Response) {
  try {
    const credentials = req.body;
    console.log(credentials);
    const v_credentials = signup_zod_schema.parse(credentials);

    // The salt is combined with the password before hashing
    const rounds = 10;
    const h_password = await bcrypt.hash(v_credentials.password, rounds);

    v_credentials.password = h_password;

    const is_user_created = await create_user({ ...v_credentials }, res);
    // error
    if (!is_user_created) return;

    // jwt payload
    const user_credentials = {
      id: is_user_created.id,
    };

    // generate jwt
    const jwt = jsonwebtoken.sign(user_credentials, JWT_SECRET);
    if (!jwt) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // set jwt cookie
    res.cookie("jwt", jwt, {
      httpOnly: true,
      secure: ENVIRONMENT === "production",
      sameSite: "none",
      path: "/",
      maxAge: 24 * 3600000,
    });

    // success
    res.status(200).json({ message: "User has successfully signed up" });
  } catch (error) {
    catch_auth_exceptions(error as Error, res);
    return;
  }
}
function signout_controller() {}

export { signin_controller, signup_controller, signout_controller };
