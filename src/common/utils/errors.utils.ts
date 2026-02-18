export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

const createErrors = {
  BadRequest: (msg = "Bad Request", details?: unknown) =>
    new AppError(msg, 400, true, details),
  NotFound: (msg = "Not Found", details?: unknown) =>
    new AppError(msg, 404, true, details),
  Forbidden: (msg = "Forbidden", details?: unknown) =>
    new AppError(msg, 403, true, details),
  Unauthorized: (msg = "Unauthorized", details?: unknown) =>
    new AppError(msg, 401, true, details),

  // Optional: handle common Mongoose errors
  handleMongooseError: (err: any) => {
    if (err.code === 11000) return createErrors.BadRequest("Duplicate key");
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors)
        .map((e: any) => e.message)
        .join(", ");
      return createErrors.BadRequest(messages);
    }
    return err; // unknown, will default to 500
  },
};

export const errors = Object.freeze(createErrors);
