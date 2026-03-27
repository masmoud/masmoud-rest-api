import { errors } from "@/common/utils";
import { NextFunction, Request, Response } from "express";
import { ZodType, ZodError } from "zod";

type RequestTarget = "body" | "query" | "params";

interface ValidateOptions {
  target?: RequestTarget; // Defaults to request body.
}

export const validate =
  <T>(schema: ZodType<T>, options: ValidateOptions = { target: "body" }) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { target = "body" } = options;

    const value = req[target];
    const result = schema.safeParse(value);

    if (!result.success) {
      return next(
        errors.BadRequest(
          "Validation failed",
          formatZodErrors(result.error, target),
        ),
      );
    }

    // Replace request input with parsed and normalized values.
    req[target] = result.data as any;

    next();
  };

// Convert Zod issues to a stable API error format.
const formatZodErrors = (error: ZodError, location: RequestTarget) => {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
    code: issue.code,
    location,
  }));
};
