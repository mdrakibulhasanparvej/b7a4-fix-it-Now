import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

// The adminService object provides various methods for managing users, bookings, and categories in the application. It includes functions to retrieve all users, update a user's ban status, get all bookings, retrieve all categories, and create a new category. Each method interacts with the database using Prisma and handles potential errors by throwing AppError instances with appropriate HTTP status codes and messages.

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

// The updateUserBanStatus function updates the ban status of a user in the database. It takes a userId and a boolean isBanned as parameters. The function first checks if the user exists and if the user is an admin. If the user does not exist or is an admin, it throws an AppError with the appropriate HTTP status code and message. If the checks pass, it updates the user's ban status and returns the updated user information.

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

// The getAllBookings function retrieves all bookings from the database, including related information such as the associated service, customer, technician, payment, and review. It orders the results by booking ID in descending order.

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

// The getAllCategories function retrieves all categories from the database, including their associated services. It orders the results by category name in ascending order.

const getAllCategories = async () => {
  return prisma.category.findMany({
    include: { services: true },
    orderBy: { name: "asc" },
  });
};

// The createCategory function creates a new category in the database. It takes an object containing the category name and an optional description as a parameter. Before creating the category, it checks if a category with the same name already exists. If it does, it throws an AppError with a conflict status code. If not, it creates the new category and returns the created category information.

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
