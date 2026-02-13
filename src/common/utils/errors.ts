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

const BadRequestError = (msg = "Bad Request", details?: unknown) =>
  new AppError(msg, 400, true, details);
const NotFoundError = (msg = "Not Found", details?: unknown) =>
  new AppError(msg, 404, true, details);
const ForbiddenError = (msg = "Forbidden", details?: unknown) =>
  new AppError(msg, 403, true, details);
const UnauthorizedError = (msg = "Unauthorized", details?: unknown) =>
  new AppError(msg, 401, true, details);

const handleMongooseError = (err: any) => {
  if (err.code === 11000) return BadRequestError("Duplicate key");
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ");
    return BadRequestError(messages);
  }
  return err; // unknown, will be 500
};

export {
  BadRequestError,
  ForbiddenError,
  handleMongooseError,
  NotFoundError,
  UnauthorizedError,
};
