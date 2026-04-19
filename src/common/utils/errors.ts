export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  statusCode: number;
  code: ErrorCode;
  details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code: ErrorCode = "INTERNAL_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Preserve stack trace in V8 runtimes.
    Error.captureStackTrace(this, this.constructor);
  }
}

const createErrors = {
  BadRequest: (msg = "Bad Request", details?: unknown) =>
    new AppError(msg, 400, "VALIDATION_ERROR", details),
  NotFound: (msg = "Not Found", details?: unknown) =>
    new AppError(msg, 404, "NOT_FOUND", details),
  Forbidden: (msg = "Forbidden", details?: unknown) =>
    new AppError(msg, 403, "FORBIDDEN", details),
  Unauthorized: (msg = "Unauthorized", details?: unknown) =>
    new AppError(msg, 401, "UNAUTHORIZED", details),
  Conflict: (msg = "Conflict", details?: unknown) =>
    new AppError(msg, 409, "CONFLICT", details),
  InternalServerError: (msg = "Internal Server Error", details?: unknown) =>
    new AppError(msg, 500, "INTERNAL_ERROR", details),

  // Map common Mongoose errors to API errors.
  handleMongooseError: (err: unknown) => {
    if (typeof err === "object" && err !== null) {
      const e = err as any;

      if (e.code === 11000) {
        return createErrors.BadRequest(
          `Duplicate key: ${JSON.stringify(e.keyValue)}`,
        );
      }

      if (e.name === "ValidationError") {
        const messages = Object.values(e.errors)
          .map((v: any) => v.message)
          .join(", ");

        return createErrors.BadRequest(messages);
      }
    }

    if (err instanceof AppError) return err;

    return createErrors.InternalServerError();
  },
};

export const errors = Object.freeze(createErrors);
export type Errors = typeof errors;
