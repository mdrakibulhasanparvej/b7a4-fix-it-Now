import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

// The categoryService object provides methods for managing categories in the application. It includes functions to retrieve all categories, get a category by ID, create a new category, update an existing category, and delete a category. Each method interacts with the database using Prisma and handles potential errors by throwing AppError instances with appropriate HTTP status codes and messages.

const getAllCategories = async () => {
  return prisma.category.findMany({
    include: { services: true },
    orderBy: { name: "asc" },
  });
};

// The getCategoryById function retrieves a category by its ID from the database. It takes an ID as a parameter and queries the database for the corresponding category record. If the category is not found, it throws an AppError with a not found status code. If the category is found, it returns the category information along with its associated services.

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { services: true },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
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

const updateCategory = async (
  id: string,
  data: { name?: string; description?: string },
) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data });
};

const deleteCategory = async (id: string) => {
  await getCategoryById(id);
  return prisma.category.delete({ where: { id } });
};

export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
