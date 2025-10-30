import { CookieOptions } from "express";
import { ENVIRONMENT } from "@repo/configs/index";

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: ENVIRONMENT === "production",
  sameSite: ENVIRONMENT === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 3600000,
};

export const CORS_OPTIONS = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
