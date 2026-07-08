import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Name, email, and password are required");
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
      role: role || "CUSTOMER",
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
