import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";

// The userService object provides methods for managing user-related operations in the application. It includes functions to register a new user, retrieve the authenticated user's profile, and update the authenticated user's profile. Each method interacts with the database using Prisma and handles potential errors by throwing AppError instances with appropriate HTTP status codes and messages.

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Name, email, and password are required",
    );
  }

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: (role || "CUSTOMER") as Role,
    },
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: createdUser.id },
    omit: {
      password: true,
    },
  });

  return user;
};

// The getMyProfileFromDB function retrieves the profile of a user from the database based on their userId. It takes a userId as a parameter and queries the database for the corresponding user record. If the user is not found, it throws an AppError with a not found status code. If the user is found, it returns the user information without the password field.

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });
  return user;
};

const updateMyProfileInDB = async (userId: string, payload: any) => {
  const { name, email } = payload;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
