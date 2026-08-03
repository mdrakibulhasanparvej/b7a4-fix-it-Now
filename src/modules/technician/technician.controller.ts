import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";
import httpStatus from "http-status";

// The `catchAsync` function is a higher-order function that takes an asynchronous Express request handler (fn) as an argument and returns a new request handler. The returned handler wraps the original handler in a try-catch block to catch any errors that may occur during its execution. If an error is caught, it is passed to the next middleware function (next) for centralized error handling.
const getAll = catchAsync(async (req: Request, res: Response) => {
  const { search, categoryId, minExperience, sort } = req.query;
  const technicians = await technicianService.getAllTechnicians({
    search: search as string | undefined,
    categoryId: categoryId as string | undefined,
    minExperience: minExperience ? Number(minExperience) : undefined,
    sort: sort as string | undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technicians fetched successfully",
    data: technicians,
  });
});

// The `catchAsync` function is a higher-order function that takes an asynchronous Express request handler (fn) as an argument and returns a new request handler. The returned handler wraps the original handler in a try-catch block to catch any errors that may occur during its execution. If an error is caught, it is passed to the next middleware function (next) for centralized error handling.
const getById = catchAsync(async (req: Request, res: Response) => {
  const technician = await technicianService.getTechnicianById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician fetched successfully",
    data: technician,
  });
});

// The `catchAsync` function is a higher-order function that takes an asynchronous Express request handler (fn) as an argument and returns a new request handler. The returned handler wraps the original handler in a try-catch block to catch any errors that may occur during its execution. If an error is caught, it is passed to the next middleware function (next) for centralized error handling.
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await technicianService.updateProfile(
    req.user!.id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: profile,
  });
});

// The `catchAsync` function is a higher-order function that takes an asynchronous Express request handler (fn) as an argument and returns a new request handler. The returned handler wraps the original handler in a try-catch block to catch any errors that may occur during its execution. If an error is caught, it is passed to the next middleware function (next) for centralized error handling.

const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const profile = await technicianService.updateAvailability(
    req.user!.id,
    req.body.availability,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Availability updated successfully",
    data: profile,
  });
});

// The `catchAsync` function is a higher-order function that takes an asynchronous Express request handler (fn) as an argument and returns a new request handler. The returned handler wraps the original handler in a try-catch block to catch any errors that may occur during its execution. If an error is caught, it is passed to the next middleware function (next) for centralized error handling.
const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await technicianService.getMyBookings(req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});


// The `catchAsync` function is a higher-order function that takes an asynchronous Express request handler (fn) as an argument and returns a new request handler. The returned handler wraps the original handler in a try-catch block to catch any errors that may occur during its execution. If an error is caught, it is passed to the next middleware function (next) for centralized error handling.
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const booking = await technicianService.updateBookingStatus(
    req.params.id as string,
    req.user!.id,
    req.body.status,
  );
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
