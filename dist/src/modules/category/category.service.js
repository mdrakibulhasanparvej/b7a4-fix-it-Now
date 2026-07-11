import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
const getAllCategories = async () => {
    return prisma.category.findMany({
        include: { services: true },
        orderBy: { name: "asc" },
    });
};
const getCategoryById = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: { services: true },
    });
    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
    return category;
};
const createCategory = async (data) => {
    const existing = await prisma.category.findUnique({
        where: { name: data.name },
    });
    if (existing) {
        throw new AppError(httpStatus.CONFLICT, "Category already exists");
    }
    return prisma.category.create({ data });
};
const updateCategory = async (id, data) => {
    await getCategoryById(id);
    return prisma.category.update({ where: { id }, data });
};
const deleteCategory = async (id) => {
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
//# sourceMappingURL=category.service.js.map