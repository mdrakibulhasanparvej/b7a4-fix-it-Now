import { NextFunction, Request, RequestHandler, Response } from "express";

// This function is a higher-order function that takes an asynchronous Express request handler (fn) as an argument and returns a new request handler. The returned handler wraps the original handler in a try-catch block to catch any errors that may occur during its execution. If an error is caught, it is passed to the next middleware function (next) for centralized error handling.
export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
