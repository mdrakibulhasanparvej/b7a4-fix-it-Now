import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

// The serviceService object provides methods for managing services in the application. It includes functions to retrieve all services, get a service by ID, create a new service, update an existing service, and delete a service. Each method interacts with the database using Prisma and handles potential errors by throwing AppError instances with appropriate HTTP status codes and messages.

const getAllServices = async (filters: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) => {
  const where: any = {};

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.service.findMany({
    where,
    include: {
      category: true,
      technician: {
        omit: { password: true },
      },
    },
    orderBy: { id: "desc" },
  });
};

// serviceService provides methods for managing services in the application. It includes functions to retrieve all services, get a service by ID, create a new service, update an existing service, and delete a service. Each method interacts with the database using Prisma and handles potential errors by throwing AppError instances with appropriate HTTP status codes and messages.

const getServiceById = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      category: true,
      technician: {
        omit: { password: true },
      },
    },
  });
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }
  return service;
};

// The createService function creates a new service in the database. It takes an object containing the service title, description, price, categoryId, and technicianId as a parameter. Before creating the service, it checks if the specified category exists. If the category does not exist, it throws an AppError with a not found status code. If the category exists, it creates the new service and returns the created service information along with its associated category and technician (excluding their passwords).

const createService = async (data: {
  title: string;
  description?: string;
  price: number;
  categoryId: string;
  technicianId: string;
}) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return prisma.service.create({
    data,
    include: {
      category: true,
      technician: {
        omit: { password: true },
      },
    },
  });
};

// The updateService function updates an existing service in the database. It takes the service ID, technician ID, and an object containing the updated service title, description, and price as parameters. The function first checks if the specified service exists. If the service does not exist, it throws an AppError with a not found status code. It then checks if the service belongs to the specified technician. If it does not, it throws an AppError with a forbidden status code. If both checks pass, it updates the service with the provided data and returns the updated service information along with its associated category and technician (excluding their passwords).

const updateService = async (
  id: string,
  technicianId: string,
  data: { title?: string; description?: string; price?: number },
) => {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }
  if (service.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update your own services",
    );
  }

  return prisma.service.update({
    where: { id },
    data,
    include: {
      category: true,
      technician: {
        omit: { password: true },
      },
    },
  });
};

// The deleteService function deletes an existing service from the database. It takes the service ID and technician ID as parameters. The function first checks if the specified service exists. If the service does not exist, it throws an AppError with a not found status code. It then checks if the service belongs to the specified technician. If it does not, it throws an AppError with a forbidden status code. If both checks pass, it deletes the service and returns a success message.

const deleteService = async (id: string, technicianId: string) => {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }
  if (service.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only delete your own services",
    );
  }

  return prisma.service.delete({ where: { id } });
};

export const serviceService = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
