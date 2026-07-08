import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import httpStatus from "http-status";

const create = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking({
    customerId: req.user!.id,
    serviceId: req.body.serviceId,
    scheduleDate: req.body.scheduleDate,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully",
    data: booking,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const bookings = await bookingService.getMyBookings(
    req.user!.id,
    req.user!.role,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.getBookingById(
    req.params.id,
    req.user!.id,
    req.user!.role,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking fetched successfully",
    data: booking,
  });
});

const cancel = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(
    req.params.id,
    req.user!.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking cancelled successfully",
    data: booking,
  });
});

export const bookingController = {
  create,
  getAll,
  getById,
  cancel,
};
