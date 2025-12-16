import { ZodError } from "zod/v4";
import type { WsResponseType, WsResponseStatus } from "@repo/zod/index";

function catch_general_exception(error: Error) {
  if (error instanceof Error) {
    console.error(error.message);
    return { status_code: 400, message: error.message };
  } else {
    console.error(error as string);
    return { status_code: 400, message: error as string };
  }
}

function catch_auth_exception(error: Error) {
  if (error instanceof ZodError) {
    console.error(error.issues);
    return {
      status_code: 400,
      message: error.issues[0]?.message || "Validation error",
    };
  } else if (error instanceof Error) {
    console.error(error.message);
    return { status_code: 400, message: error.message };
  } else {
    console.error(error as string);
    return { status_code: 400, message: error as string };
  }
}

function catch_auth_exception_ws(error: Error) {
  const status: WsResponseStatus = "error";
  const type: WsResponseType = "auth";
  let message = "";
  const payload = null;

  // check error type
  if (error instanceof ZodError) {
    message = error.issues[0]?.message || "Validation error";
    console.error(error.issues);
  } else if (error instanceof Error) {
    message = error.message;
    console.error(message);
  } else {
    message = error as string;
    console.error(message);
  }
  return { status, type, message, payload };
}

function catch_general_exception_ws(error: Error) {
  const status: WsResponseStatus = "error";
  const type: WsResponseType = "auth";
  let message = "";
  const payload = null;

  // check error type
  if (error instanceof Error) {
    message = error.message;
    console.error(message);
  } else {
    message = error as string;
    console.error(message);
  }
  return { status, type, message, payload };
}

export { catch_general_exception, catch_auth_exception, catch_auth_exception_ws, catch_general_exception_ws };
