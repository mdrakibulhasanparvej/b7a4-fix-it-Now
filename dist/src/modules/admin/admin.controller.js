import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import httpStatus from "http-status";
const getAllUsers = catchAsync(async (_req, res) => {
    const users = await adminService.getAllUsers();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users fetched successfully",
        data: users,
    });
});
const updateUserBanStatus = catchAsync(async (req, res) => {
    const user = await adminService.updateUserBanStatus(req.params.id, req.body.isBanned);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`,
        data: user,
    });
});
const getAllBookings = catchAsync(async (_req, res) => {
    const bookings = await adminService.getAllBookings();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Bookings fetched successfully",
        data: bookings,
    });
});
const getAllCategories = catchAsync(async (_req, res) => {
    const categories = await adminService.getAllCategories();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories fetched successfully",
        data: categories,
    });
});
const createCategory = catchAsync(async (req, res) => {
    const category = await adminService.createCategory(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: category,
    });
});
export const adminController = {
    getAllUsers,
    updateUserBanStatus,
    getAllBookings,
    getAllCategories,
    createCategory,
};
//# sourceMappingURL=admin.controller.js.map