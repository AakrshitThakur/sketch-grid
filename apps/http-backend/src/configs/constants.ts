import { CookieOptions } from "express";
import { ENVIRONMENT } from "@repo/configs/index";

const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: ENVIRONMENT === "production",
  sameSite: ENVIRONMENT === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 3600000,
};

const CORS_OPTIONS = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

export { AUTH_COOKIE_OPTIONS, CORS_OPTIONS };
