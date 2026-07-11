import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
const getAllServices = async (filters) => {
    const where = {};
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined)
            where.price.gte = filters.minPrice;
        if (filters.maxPrice !== undefined)
            where.price.lte = filters.maxPrice;
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
const getServiceById = async (id) => {
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
const createService = async (data) => {
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
const updateService = async (id, technicianId, data) => {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found");
    }
    if (service.technicianId !== technicianId) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only update your own services");
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
const deleteService = async (id, technicianId) => {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found");
    }
    if (service.technicianId !== technicianId) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only delete your own services");
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
//# sourceMappingURL=service.service.js.map