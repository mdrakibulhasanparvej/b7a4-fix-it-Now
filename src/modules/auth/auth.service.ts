import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { LoginPayload, RegisterPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

// The authService object provides methods for user authentication and registration. It includes functions to log in a user, register a new user, and retrieve the authenticated user's information. Each method interacts with the database using Prisma and handles potential errors by throwing AppError instances with appropriate HTTP status codes and messages.

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

// The registerUser function registers a new user in the database. It takes a RegisterPayload object containing the user's name, email, password, and optional role. The function first checks if a user with the provided email already exists. If so, it throws an AppError with a conflict status code. If not, it hashes the password using bcrypt and creates a new user record in the database with the provided information. The newly created user information is returned without the password field.

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

// The getMe function retrieves the authenticated user's information from the database based on their userId. It takes a userId as a parameter and queries the database for the corresponding user record. If the user is not found, it throws an AppError with a not found status code. If the user is found, it returns the user information without the password field.

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
