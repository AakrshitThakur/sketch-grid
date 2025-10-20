import type { Response } from "express";
import { ZodError } from "zod/v4";

function catch_general_exception(error: Error, res: Response) {
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

export { catch_general_exception, catch_auth_exceptions };
