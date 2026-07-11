export declare const technicianService: {
    getAllTechnicians: () => Promise<({
        technicianProfile: {
            id: string;
            userId: string;
            bio: string | null;
            experienceYears: number | null;
            availability: import("@prisma/client/runtime/client").JsonValue | null;
        } | null;
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
        email: string;
        name: string;
        role: import("../../../generated/prisma/enums").Role;
        isBanned: boolean;
        createdAt: Date;
    })[]>;
    getTechnicianById: (id: string) => Promise<{
        technicianProfile: {
            id: string;
            userId: string;
            bio: string | null;
            experienceYears: number | null;
            availability: import("@prisma/client/runtime/client").JsonValue | null;
        } | null;
        services: ({
            category: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            id: string;
            description: string | null;
            title: string;
            price: number;
            categoryId: string;
            technicianId: string;
        })[];
        reviewsAsTechnician: ({
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
        })[];
    } & {
        id: string;
        email: string;
        name: string;
        role: import("../../../generated/prisma/enums").Role;
        isBanned: boolean;
        createdAt: Date;
    }>;
    updateProfile: (userId: string, data: {
        bio?: string;
        experienceYears?: number;
    }) => Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        userId: string;
        bio: string | null;
        experienceYears: number | null;
        availability: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    updateAvailability: (userId: string, availability: any) => Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        userId: string;
        bio: string | null;
        experienceYears: number | null;
        availability: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    getMyBookings: (technicianId: string) => Promise<({
        service: {
            id: string;
            description: string | null;
            title: string;
            price: number;
            categoryId: string;
            technicianId: string;
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
    updateBookingStatus: (bookingId: string, technicianId: string, status: string) => Promise<{
        service: {
            id: string;
            description: string | null;
            title: string;
            price: number;
            categoryId: string;
            technicianId: string;
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
    } & {
        id: string;
        technicianId: string;
        customerId: string;
        serviceId: string;
        status: import("../../../generated/prisma/enums").BookingStatus;
        scheduleDate: Date | null;
    }>;
};
//# sourceMappingURL=technician.service.d.ts.map