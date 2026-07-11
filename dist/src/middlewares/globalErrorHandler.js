import { AppError } from "../errors/AppError";
import httpStatus from "http-status";
export const globalErrorHandler = (err, _req, res, _next) => {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong";
    let errorDetails = {};
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = { stack: err.stack };
    }
    else if (err instanceof Error) {
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
//# sourceMappingURL=globalErrorHandler.js.map