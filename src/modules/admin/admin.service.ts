import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserBanStatus = async (userId: string, isBanned: boolean) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === "ADMIN") {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot ban an admin");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { isBanned },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
    },
  });
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
      payment: true,
      review: true,
    },
    orderBy: { id: "desc" },
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    include: { services: true },
    orderBy: { name: "asc" },
  });
};

const createCategory = async (data: { name: string; description?: string }) => {
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  return prisma.category.create({ data });
};

export const adminService = {
  getAllUsers,
  updateUserBanStatus,
  getAllBookings,
  getAllCategories,
  createCategory,
};
