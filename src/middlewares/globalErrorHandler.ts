import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";

// This middleware function is a global error handler that catches any errors thrown in the application and sends a standardized error response to the client. It checks if the error is an instance of AppError or a generic Error, and sets the appropriate HTTP status code, message, and error details in the response. If the error is not recognized, it defaults to a 500 Internal Server Error with a generic message.

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
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
