import { CookieOptions } from "express";
import { ENVIRONMENT } from "@repo/configs/index";

const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: ENVIRONMENT === "production",
  sameSite: ENVIRONMENT === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 3600000,
};

// "http://localhost:3000",
const CORS_OPTIONS = {
  origin: [
    "https://www.sketchgrid.online",
    "http://www.sketchgrid.online",
    "https://sketchgrid.online",
    "http://sketchgrid.online",
    "https://app.sketchgrid.online",
    "http://app.sketchgrid.online",
    "https://13.62.19.172:3000",
    "http://13.62.19.172:3000",
    "https://13.62.19.172",
    "http://13.62.19.172",
    "http://localhost:3000",
  ],
  credentials: true,
};

export { AUTH_COOKIE_OPTIONS, CORS_OPTIONS };
