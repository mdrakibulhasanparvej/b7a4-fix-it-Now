export declare const categoryService: {
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
    getCategoryById: (id: string) => Promise<{
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
    }>;
    createCategory: (data: {
        name: string;
        description?: string;
    }) => Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    updateCategory: (id: string, data: {
        name?: string;
        description?: string;
    }) => Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    deleteCategory: (id: string) => Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
};
//# sourceMappingURL=category.service.d.ts.map