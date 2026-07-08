import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorDetails: unknown = {};

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = { stack: err.stack };
  } else if (err instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message;
    errorDetails = { stack: err.stack };
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};
