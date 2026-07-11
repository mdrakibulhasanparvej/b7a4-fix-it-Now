import httpStatus from "http-status";
export const notFound = (_req, res) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: "Route not found",
        errorDetails: {},
    });
};
//# sourceMappingURL=notFound.js.map