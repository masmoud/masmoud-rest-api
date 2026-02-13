import { BadRequestError } from "@/common/utils";
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type RequestTarget = "body" | "query" | "params";

interface ValidateOptions {
  target?: RequestTarget; // default: body
}

export const validate =
  (schema: ZodType<any>, options: ValidateOptions = { target: "body" }) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { target = "body" } = options;

    const value = req[target];
    const result = schema.safeParse(value);

    if (!result.success) {
      const formattedErrors: Record<string, any> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");

        formattedErrors[field] = {
          type: "field",
          value: value[issue.path[0] as string], // original value
          msg: issue.message,
          path: field,
          location: target,
        };
      });

      return next(BadRequestError("Validation failed", formattedErrors));
    }
    req[target] = result.data;
    next();
  };
