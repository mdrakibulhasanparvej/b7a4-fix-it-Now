import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const createBooking = async (data: {
  customerId: string;
  serviceId: string;
  scheduleDate?: string;
}) => {
  const service = await prisma.service.findUnique({
    where: { id: data.serviceId },
  });

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: data.customerId,
      serviceId: data.serviceId,
      technicianId: service.technicianId,
      scheduleDate: data.scheduleDate ? new Date(data.scheduleDate) : null,
    },
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
    },
  });

  return booking;
};

const getMyBookings = async (userId: string, role: string) => {
  const where =
    role === "CUSTOMER"
      ? { customerId: userId }
      : role === "TECHNICIAN"
        ? { technicianId: userId }
        : {};

  return prisma.booking.findMany({
    where,
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

const getBookingById = async (
  bookingId: string,
  userId: string,
  role: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
      payment: true,
      review: true,
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (role === "CUSTOMER" && booking.customerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only view your own bookings",
    );
  }

  if (role === "TECHNICIAN" && booking.technicianId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only view your own bookings",
    );
  }

  return booking;
};

const cancelBooking = async (bookingId: string, customerId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only cancel your own bookings",
    );
  }

  const cancellableStatuses = ["REQUESTED", "ACCEPTED", "PAID"];

  if (!cancellableStatuses.includes(booking.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel booking at current status",
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
    },
  });
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
