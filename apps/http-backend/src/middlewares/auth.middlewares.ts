import type { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET } from "@repo/configs/index";
import { catch_general_exception } from "../utils/exceptions.js";

interface JwtPayload {
  id: string;
}

function check_user_auth(req: Request, res: Response, next: NextFunction) {
  try {
    // get all cookie
    // Cookie: jwt=jwt_string; other=other_string;
    const cookies = req.headers.cookie;

    if (!cookies) {
      res
        .status(401)
        .json({ message: "Please sign in or create an account to continue" });
      return;
    } 

    // Object.fromEntries() method is used to transform a list of key-value pairs (like an array or map) into an object
    const cookies_obj = Object.fromEntries(
      cookies.split("; ").map((c) => c.split("="))
    );

    // get jwt
    const jwt = cookies_obj.jwt;
    if (!jwt) {
      res
        .status(401)
        .json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // verify jwt
    jsonwebtoken.verify(
      jwt,
      JWT_SECRET,
      (error: any, decoded_payload: unknown) => {
        // token is invalid
        if (error) {
          res.status(400).json({ message: "Token verification failed", error });
          return;
        }
        // token is valid
        if (decoded_payload && typeof decoded_payload === "object") {
          req.user_credentials = decoded_payload as JwtPayload;
          next();
          return;
        }
        // error
        res.status(401).json({ message: "Invalid token payload" });
        return;
      }
    );
  } catch (error) {
    catch_general_exception(error as Error, res);
    return;
  }
}

export { check_user_auth };
