export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

const createErrors = {
  BadRequest: (msg = "Bad Request", details?: unknown) =>
    new AppError(msg, 400, details),
  NotFound: (msg = "Not Found", details?: unknown) =>
    new AppError(msg, 404, details),
  Forbidden: (msg = "Forbidden", details?: unknown) =>
    new AppError(msg, 403, details),
  Unauthorized: (msg = "Unauthorized", details?: unknown) =>
    new AppError(msg, 401, details),
  Conflict: (msg = "Conflict", details?: unknown) =>
    new AppError(msg, 409, details),

  // Optional: handle common Mongoose errors
  handleMongooseError: (err: any) => {
    if (err.code === 11000)
      return createErrors.BadRequest(
        `Duplicate key: ${JSON.stringify(err.keyValue)}`,
      );
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors)
        .map((e: any) => e.message)
        .join(", ");
      return createErrors.BadRequest(messages);
    }
    if (err instanceof AppError) return err;
    return new AppError(err.message || "Internal Server Error", 500, false);
  },
};

export const errors = Object.freeze(createErrors);
