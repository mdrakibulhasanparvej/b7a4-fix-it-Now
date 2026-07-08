import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";
import httpStatus from "http-status";

const getAll = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories fetched successfully",
    data: categories,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category fetched successfully",
    data: category,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: category,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: category,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: null,
  });
});

export const categoryController = {
  getAll,
  getById,
  create,
  update,
  remove,
};
