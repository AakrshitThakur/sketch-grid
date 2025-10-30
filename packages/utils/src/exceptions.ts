import { ZodError } from "zod/v4";

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

export { catch_general_exception, catch_auth_exception };
