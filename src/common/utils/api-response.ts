import { Response } from "express";

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
  ) {}
}

export const sendResponse = <T>(
  res: Response,
  statusCode = 200,
  data: T,
  message = "Success",
) => {
  return res.status(statusCode).json(new ApiResponse(true, message, data));
};
