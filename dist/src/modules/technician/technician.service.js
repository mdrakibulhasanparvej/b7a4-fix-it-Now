import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
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
const getTechnicianById = async (id) => {
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
const updateProfile = async (userId, data) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { technicianProfile: true },
    });
    if (!user || user.role !== "TECHNICIAN") {
        throw new AppError(httpStatus.FORBIDDEN, "Only technicians can update their profile");
    }
    const profile = await prisma.technicianProfile.upsert({
        where: { userId },
        update: data,
        create: { userId, ...data },
        include: { user: { omit: { password: true } } },
    });
    return profile;
};
const updateAvailability = async (userId, availability) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "TECHNICIAN") {
        throw new AppError(httpStatus.FORBIDDEN, "Only technicians can set availability");
    }
    const profile = await prisma.technicianProfile.upsert({
        where: { userId },
        update: { availability },
        create: { userId, availability },
        include: { user: { omit: { password: true } } },
    });
    return profile;
};
const getMyBookings = async (technicianId) => {
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
const updateBookingStatus = async (bookingId, technicianId, status) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }
    if (booking.technicianId !== technicianId) {
        throw new AppError(httpStatus.FORBIDDEN, "This booking does not belong to you");
    }
    const validTransitions = {
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
        throw new AppError(httpStatus.BAD_REQUEST, `Cannot transition from ${booking.status} to ${status}`);
    }
    return prisma.booking.update({
        where: { id: bookingId },
        data: { status: status },
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
//# sourceMappingURL=technician.service.js.map