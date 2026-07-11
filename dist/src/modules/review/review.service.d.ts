export declare const reviewService: {
    createReview: (data: {
        bookingId: string;
        customerId: string;
        rating: number;
        comment?: string;
    }) => Promise<{
        technician: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
        booking: {
            id: string;
            technicianId: string;
            customerId: string;
            serviceId: string;
            status: import("../../../generated/prisma/enums").BookingStatus;
            scheduleDate: Date | null;
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
        bookingId: string;
        rating: number;
        comment: string | null;
    }>;
};
//# sourceMappingURL=review.service.d.ts.map