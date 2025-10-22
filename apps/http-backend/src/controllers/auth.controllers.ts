import type { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma_client } from "@repo/db/connect";
import { signin_zod_schema, signup_zod_schema } from "@repo/zod/auth.zod";
import { JWT_SECRET } from "@repo/configs/index";
import { AUTH_COOKIE_OPTIONS } from "../configs/constants.js";
import { get_user_record } from "@repo/db/auth";
import {
  catch_general_exception,
  catch_auth_exception,
} from "@repo/utils/exceptions";

// sign-in
async function signin_controller(req: Request, res: Response) {
  try {
    const credentials = req.body;
    const v_credentials = signin_zod_schema.parse(credentials);

    // get user record from email field
    const user_obj = await get_user_record({ email: v_credentials.email });
    if (user_obj.status === "error") {
      res.status(user_obj.status_code).json({ message: user_obj.message });
      return;
    }

    // compare passwords
    const check_psd = await bcrypt.compare(
      v_credentials.password,
      user_obj.payload?.password || ""
    );

    // invalid password provided
    if (!check_psd) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // jwt payload
    const user_credentials = {
      id: user_obj.payload?.id || "",
    };

    // generate jwt
    const jwt = jsonwebtoken.sign(user_credentials, JWT_SECRET);
    if (!jwt) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // generate cookie
    res.cookie("jwt", jwt, AUTH_COOKIE_OPTIONS);

    res.status(200).json({ message: "User has successfully signed in" });
    return;
  } catch (error) {
    const { status_code, message } = catch_auth_exception(error as Error);
    res.status(status_code).json({ message });
    return;
  }
}

// sign-up
async function signup_controller(req: Request, res: Response) {
  try {
    const credentials = req.body;
    const v_credentials = signup_zod_schema.parse(credentials);

    // The salt is combined with the password before hashing
    const rounds = 10;
    const h_password = await bcrypt.hash(v_credentials.password, rounds);

    v_credentials.password = h_password;

    const is_user_created = await prisma_client.user.create({
      data: {
        username: v_credentials.username,
        email: v_credentials.email,
        password: v_credentials.password,
      },
    });

    // error
    if (!is_user_created) {
      res.status(400).json({ message: "User not created" });
      return;
    }

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
    res.cookie("jwt", jwt, AUTH_COOKIE_OPTIONS);

    // success
    res.status(200).json({ message: "User has successfully signed up" });
    return;
  } catch (error) {
    const { status_code, message } = catch_auth_exception(error as Error);
    res.status(status_code).json({ message });
    return;
  }
}

// sign-out
function signout_controller(req: Request, res: Response) {
  try {
    const user_credentials = req.user_credentials;

    // id not-found
    if (!user_credentials) {
      res
        .status(401)
        .json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // success
    res.cookie("jwt", "", { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
    res.status(200).json({ message: "User signed out successfully" });
    return;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
    return;
  }
}

// check authenticity
async function is_user_authenticated_controller(req: Request, res: Response) {
  try {
    const user_credentials = req.user_credentials;

    // id not-found
    if (!user_credentials) {
      res
        .status(401)
        .json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // get user from id field
    const user_obj = await get_user_record({ id: user_credentials.id });

    // user not-found
    if (user_obj.status === "error") {
      res.status(user_obj.status_code).json({ message: user_obj.message });
      return;
    }

    // success
    res.status(200).json({ message: "User is authenticated" });
    return;
  } catch (error) {
    const { status_code, message } = catch_general_exception(error as Error);
    res.status(status_code).json({ message });
    return;
  }
}

export {
  signin_controller,
  signup_controller,
  signout_controller,
  is_user_authenticated_controller,
};
