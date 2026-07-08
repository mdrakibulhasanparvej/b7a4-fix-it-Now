import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");
    }

    const verifiedToken = jwtUtils.verifyToken(
      token,
      process.env.JWT_ACCESS_SECRET!,
    );

    if (!verifiedToken.success) {
      throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.message);
    }

    const { id, name, email, role } = verifiedToken.data as {
      id: string;
      name: string;
      email: string;
      role: Role;
    };

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }

    if (user.isBanned) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your account has been banned",
      );
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
