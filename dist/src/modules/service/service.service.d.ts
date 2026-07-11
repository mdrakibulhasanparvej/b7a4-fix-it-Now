export declare const serviceService: {
    getAllServices: (filters: {
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
    }) => Promise<({
        category: {
            id: string;
            name: string;
            description: string | null;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        description: string | null;
        title: string;
        price: number;
        categoryId: string;
        technicianId: string;
    })[]>;
    getServiceById: (id: string) => Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        description: string | null;
        title: string;
        price: number;
        categoryId: string;
        technicianId: string;
    }>;
    createService: (data: {
        title: string;
        description?: string;
        price: number;
        categoryId: string;
        technicianId: string;
    }) => Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        description: string | null;
        title: string;
        price: number;
        categoryId: string;
        technicianId: string;
    }>;
    updateService: (id: string, technicianId: string, data: {
        title?: string;
        description?: string;
        price?: number;
    }) => Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            isBanned: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        description: string | null;
        title: string;
        price: number;
        categoryId: string;
        technicianId: string;
    }>;
    deleteService: (id: string, technicianId: string) => Promise<{
        id: string;
        description: string | null;
        title: string;
        price: number;
        categoryId: string;
        technicianId: string;
    }>;
};
//# sourceMappingURL=service.service.d.ts.map