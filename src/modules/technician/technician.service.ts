import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

// The technicianService object provides methods for managing technicians in the application. It includes functions to retrieve all technicians, get a technician by ID, update a technician's profile and availability, retrieve a technician's bookings, and update the status of a booking. Each method interacts with the database using Prisma and handles potential errors by throwing AppError instances with appropriate HTTP status codes and messages.

const getAllTechnicians = async () => {
  return prisma.user.findMany({
    where: { role: "TECHNICIAN", isBanned: false },
    omit: { password: true },
    include: {
      technicianProfile: true,
      services: true,
    },
  });
};

// The getTechnicianById function retrieves a technician by their ID from the database. It takes an ID as a parameter and queries the database for the corresponding technician record. If the technician is not found, it throws an AppError with a not found status code. If the technician is found, it returns the technician information along with their profile, services, and reviews.

const getTechnicianById = async (id: string) => {
  const technician = await prisma.user.findFirst({
    where: { id, role: "TECHNICIAN" },
    omit: { password: true },
    include: {
      technicianProfile: true,
      services: {
        include: { category: true },
      },
      reviewsAsTechnician: {
        include: {
          customer: {
            omit: { password: true },
          },
        },
      },
    },
  });

  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }

  return technician;
};

const updateProfile = async (
  userId: string,
  data: { bio?: string; experienceYears?: number },
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { technicianProfile: true },
  });

  if (!user || user.role !== "TECHNICIAN") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only technicians can update their profile",
    );
  }

  const profile = await prisma.technicianProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
    include: { user: { omit: { password: true } } },
  });

  return profile;
};

// The updateAvailability function updates the availability of a technician. It takes a userId and an availability object as parameters. The function first checks if the user exists and is a technician. If not, it throws an AppError with a forbidden status code. If the user is a technician, it updates or creates the technician's profile with the provided availability information and returns the updated profile along with the user information (excluding the password).

const updateAvailability = async (userId: string, availability: any) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== "TECHNICIAN") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only technicians can set availability",
    );
  }

  const profile = await prisma.technicianProfile.upsert({
    where: { userId },
    update: { availability },
    create: { userId, availability },
    include: { user: { omit: { password: true } } },
  });

  return profile;
};

// The getMyBookings function retrieves all bookings associated with a specific technician. It takes a technicianId as a parameter and queries the database for bookings where the technicianId matches. The function includes related information such as the associated service, customer (excluding their password), payment, and review. The results are ordered by booking ID in descending order.

const getMyBookings = async (technicianId: string) => {
  return prisma.booking.findMany({
    where: { technicianId },
    include: {
      service: true,
      customer: {
        omit: { password: true },
      },
      payment: true,
      review: true,
    },
    orderBy: { id: "desc" },
  });
};

// The updateBookingStatus function updates the status of a booking for a specific technician. It takes a bookingId, technicianId, and the new status as parameters. The function first checks if the booking exists and if it belongs to the specified technician. If not, it throws an AppError with a not found or forbidden status code. It then checks if the status transition is valid based on predefined rules. If the transition is invalid, it throws an AppError with a bad request status code. If all checks pass, it updates the booking status and returns the updated booking information along with related data such as the associated service, customer (excluding their password), and payment.

const updateBookingStatus = async (
  bookingId: string,
  technicianId: string,
  status: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This booking does not belong to you",
    );
  }

  const validTransitions: Record<string, string[]> = {
    REQUESTED: ["ACCEPTED", "DECLINED", "CANCELLED"],
    ACCEPTED: ["PAID", "CANCELLED"],
    PAID: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED"],
    COMPLETED: [],
    DECLINED: [],
    CANCELLED: [],
  };

  const allowed = validTransitions[booking.status] || [];

  if (!allowed.includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot transition from ${booking.status} to ${status}`,
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: status as any },
    include: {
      service: true,
      customer: { omit: { password: true } },
      payment: true,
    },
  });
};

export const technicianService = {
  getAllTechnicians,
  getTechnicianById,
  updateProfile,
  updateAvailability,
  getMyBookings,
  updateBookingStatus,
};
