import { CookieOptions } from "express";
import { ENVIRONMENT } from "@repo/configs/index";

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: ENVIRONMENT === "production",
  sameSite: "none",
  path: "/",
  maxAge: 24 * 3600000,
};
