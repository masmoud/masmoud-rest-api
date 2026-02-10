export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

const BadRequestError = (msg = "Bad Request") => new AppError(msg, 400);
const NotFoundError = (msg = "Not Found") => new AppError(msg, 404);
const ForbiddenError = (msg = "Forbidden") => new AppError(msg, 403);
const UnauthorizedError = (msg = "Unauthorized") => new AppError(msg, 401);

export { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError };
