// This file defines a custom error class called AppError that extends the built-in Error class in TypeScript. It is used to represent application-specific errors with an associated HTTP status code.

export class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
