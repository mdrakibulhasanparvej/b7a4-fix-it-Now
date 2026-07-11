export declare const adminService: {
    getAllUsers: () => Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../../generated/prisma/enums").Role;
        isBanned: boolean;
        createdAt: Date;
    }[]>;
    updateUserBanStatus: (userId: string, isBanned: boolean) => Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../../generated/prisma/enums").Role;
        isBanned: boolean;
    }>;
    getAllBookings: () => Promise<({
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
    getAllCategories: () => Promise<({
        services: {
            id: string;
            description: string | null;
            title: string;
            price: number;
            categoryId: string;
            technicianId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
    })[]>;
    createCategory: (data: {
        name: string;
        description?: string;
    }) => Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
};
//# sourceMappingURL=admin.service.d.ts.map