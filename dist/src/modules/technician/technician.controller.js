import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";
import httpStatus from "http-status";
const getAll = catchAsync(async (_req, res) => {
    const technicians = await technicianService.getAllTechnicians();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technicians fetched successfully",
        data: technicians,
    });
});
const getById = catchAsync(async (req, res) => {
    const technician = await technicianService.getTechnicianById(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technician fetched successfully",
        data: technician,
    });
});
const updateProfile = catchAsync(async (req, res) => {
    const profile = await technicianService.updateProfile(req.user.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile updated successfully",
        data: profile,
    });
});
const updateAvailability = catchAsync(async (req, res) => {
    const profile = await technicianService.updateAvailability(req.user.id, req.body.availability);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Availability updated successfully",
        data: profile,
    });
});
const getMyBookings = catchAsync(async (req, res) => {
    const bookings = await technicianService.getMyBookings(req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Bookings fetched successfully",
        data: bookings,
    });
});
const updateBookingStatus = catchAsync(async (req, res) => {
    const booking = await technicianService.updateBookingStatus(req.params.id, req.user.id, req.body.status);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking status updated successfully",
        data: booking,
    });
});
export const technicianController = {
    getAll,
    getById,
    updateProfile,
    updateAvailability,
    getMyBookings,
    updateBookingStatus,
};
//# sourceMappingURL=technician.controller.js.map