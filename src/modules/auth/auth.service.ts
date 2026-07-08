import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { LoginPayload, RegisterPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (user.isBanned) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been banned");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret!,
    config.jwt_access_expiration || "1d",
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret!,
    config.jwt_refresh_expiration || "30d",
  );

  return { accessToken, refreshToken };
};

const registerUser = async (payload: RegisterPayload) => {
  const { name, email, password, role } = payload;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "CUSTOMER",
    },
    omit: { password: true },
  });

  return user;
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

export const authService = {
  loginUser,
  registerUser,
  getMe,
};
