export declare const bookingService: {
    createBooking: (data: {
        customerId: string;
        serviceId: string;
        scheduleDate?: string;
    }) => Promise<{
        service: {
            id: string;
            description: string | null;
            title: string;
            price: number;
            categoryId: string;
            technicianId: string;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
        customer: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        technicianId: string;
        customerId: string;
        serviceId: string;
        status: import("../../../generated/prisma/enums").BookingStatus;
        scheduleDate: Date | null;
    }>;
    getMyBookings: (userId: string, role: string) => Promise<({
        service: {
            id: string;
            description: string | null;
            title: string;
            price: number;
            categoryId: string;
            technicianId: string;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
        customer: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
        payment: {
            id: string;
            userId: string;
            status: string;
            bookingId: string;
            amount: number;
            provider: string;
            transactionId: string | null;
        } | null;
        review: {
            id: string;
            technicianId: string;
            customerId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        } | null;
    } & {
        id: string;
        technicianId: string;
        customerId: string;
        serviceId: string;
        status: import("../../../generated/prisma/enums").BookingStatus;
        scheduleDate: Date | null;
    })[]>;
    getBookingById: (bookingId: string, userId: string, role: string) => Promise<{
        service: {
            id: string;
            description: string | null;
            title: string;
            price: number;
            categoryId: string;
            technicianId: string;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
        customer: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
        payment: {
            id: string;
            userId: string;
            status: string;
            bookingId: string;
            amount: number;
            provider: string;
            transactionId: string | null;
        } | null;
        review: {
            id: string;
            technicianId: string;
            customerId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        } | null;
    } & {
        id: string;
        technicianId: string;
        customerId: string;
        serviceId: string;
        status: import("../../../generated/prisma/enums").BookingStatus;
        scheduleDate: Date | null;
    }>;
    cancelBooking: (bookingId: string, customerId: string) => Promise<{
        service: {
            id: string;
            description: string | null;
            title: string;
            price: number;
            categoryId: string;
            technicianId: string;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
        customer: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        technicianId: string;
        customerId: string;
        serviceId: string;
        status: import("../../../generated/prisma/enums").BookingStatus;
        scheduleDate: Date | null;
    }>;
};
//# sourceMappingURL=booking.service.d.ts.map