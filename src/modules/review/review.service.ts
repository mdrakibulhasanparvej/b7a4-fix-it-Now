import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

// The reviewService object provides methods for managing reviews in the application. It includes a function to create a new review for a completed booking. The createReview function checks if the booking exists, verifies that the booking belongs to the customer, ensures that the booking is completed, and checks if a review already exists for the booking. If all checks pass, it creates a new review in the database and returns the created review information along with related data such as the associated booking, customer, and technician.

const createReview = async (data: {
  bookingId: string;
  customerId: string;
  rating: number;
  comment?: string;
}) => {
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== data.customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This booking does not belong to you",
    );
  }

  if (booking.status !== "COMPLETED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only review completed bookings",
    );
  }

  // Check if a review already exists for this booking

  const existing = await prisma.review.findUnique({
    where: { bookingId: data.bookingId },
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already reviewed this booking",
    );
  }

  const review = await prisma.review.create({
    data: {
      bookingId: data.bookingId,
      customerId: data.customerId,
      technicianId: booking.technicianId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      booking: true,
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
    },
  });

  return review;
};

export const reviewService = {
  createReview,
};
