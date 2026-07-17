import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

// The bookingService object provides methods for managing bookings in the application. It includes functions to create a new booking, retrieve bookings for a specific user, get booking details by ID, and cancel a booking. Each method interacts with the database using Prisma and handles potential errors by throwing AppError instances with appropriate HTTP status codes and messages.

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

// The getMyBookings function retrieves bookings for a specific user based on their userId and role. It takes a userId and role as parameters and queries the database for bookings associated with the user. If the user is a customer, it retrieves bookings where they are the customer; if they are a technician, it retrieves bookings where they are the technician. The function includes related information such as the associated service, customer, technician, payment, and review, and orders the results by booking ID in descending order.

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

// The getBookingById function retrieves booking details by booking ID, user ID, and role. It takes a bookingId, userId, and role as parameters and queries the database for the corresponding booking record. If the booking is not found, it throws an AppError with a not found status code. If the user is a customer or technician, it checks if they are authorized to view the booking based on their role and associated IDs. If they are not authorized, it throws an AppError with a forbidden status code. If the checks pass, it returns the booking details along with related information such as the associated service, customer, technician, payment, and review.

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

// The cancelBooking function allows a customer to cancel their own booking based on the booking ID and customer ID. It first checks if the booking exists and if the customer is authorized to cancel it. It also verifies that the booking is in a cancellable status (REQUESTED, ACCEPTED, or PAID). If any of these checks fail, it throws an AppError with the appropriate HTTP status code and message. If the checks pass, it updates the booking status to CANCELLED and returns the updated booking details along with related information such as the associated service, customer, and technician.

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
