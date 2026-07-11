import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
const createReview = async (data) => {
    const booking = await prisma.booking.findUnique({
        where: { id: data.bookingId },
    });
    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }
    if (booking.customerId !== data.customerId) {
        throw new AppError(httpStatus.FORBIDDEN, "This booking does not belong to you");
    }
    if (booking.status !== "COMPLETED") {
        throw new AppError(httpStatus.BAD_REQUEST, "You can only review completed bookings");
    }
    const existing = await prisma.review.findUnique({
        where: { bookingId: data.bookingId },
    });
    if (existing) {
        throw new AppError(httpStatus.CONFLICT, "You have already reviewed this booking");
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
//# sourceMappingURL=review.service.js.map