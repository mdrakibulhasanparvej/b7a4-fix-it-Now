import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";
export const auth = (...requiredRoles) => {
    return catchAsync(async (req, _res, next) => {
        const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");
        }
        const verifiedToken = jwtUtils.verifyToken(token, process.env.JWT_ACCESS_SECRET);
        if (!verifiedToken.success) {
            throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.message);
        }
        const { id, name, email, role } = verifiedToken.data;
        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this resource");
        }
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
        }
        if (user.isBanned) {
            throw new AppError(httpStatus.FORBIDDEN, "Your account has been banned");
        }
        req.user = {
            id,
            name,
            email,
            role,
        };
        next();
    });
};
//# sourceMappingURL=auth.js.map