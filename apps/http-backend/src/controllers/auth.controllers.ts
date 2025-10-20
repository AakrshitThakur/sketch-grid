import type { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signin_zod_schema, signup_zod_schema } from "@repo/zod/auth.zod";
import { JWT_SECRET } from "@repo/configs/index";
import { AUTH_COOKIE_OPTIONS } from "../configs/constants.js";
import {
  catch_general_exception,
  catch_auth_exceptions,
} from "../utils/exceptions.js";
import {
  create_user,
  does_email_exists,
  get_records,
} from "../prisma/auth.prisma.js";

async function signin_controller(req: Request, res: Response) {
  try {
    const credentials = req.body;
    const v_credentials = signin_zod_schema.parse(credentials);

    // check if user exists
    const check_email = await does_email_exists(v_credentials.email, res);
    if (!check_email) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // get user record from email field
    const user = await get_records({ email: v_credentials.email }, res);

    // compare passwords
    const check_psd = await bcrypt.compare(
      v_credentials.password,
      user[0]?.password || ""
    );

    // invalid password provided
    if (!check_psd) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // jwt payload
    const user_credentials = {
      id: user[0]?.id || "",
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
  } catch (error) {
    catch_auth_exceptions(error as Error, res);
    return;
  }
}
async function signup_controller(req: Request, res: Response) {
  try {
    const credentials = req.body;
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
    res.cookie("jwt", jwt, AUTH_COOKIE_OPTIONS);

    // success
    res.status(200).json({ message: "User has successfully signed up" });
  } catch (error) {
    catch_auth_exceptions(error as Error, res);
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
  } catch (error) {
    catch_general_exception(error as Error, res);
    return;
  }
}

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
    const user = await get_records({ id: user_credentials.id }, res);

    // user not-found
    if (user.length < 1) {
      res
        .status(401)
        .json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // success
    res.status(200).json({ message: "User is authenticated" });
    return;
  } catch (error) {
    catch_general_exception(error as Error, res);
    return;
  }
}

export {
  signin_controller,
  signup_controller,
  signout_controller,
  is_user_authenticated_controller,
};
