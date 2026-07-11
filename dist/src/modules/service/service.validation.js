export const createServiceRules = [
    {
        field: "title",
        required: true,
        type: "string",
        minLength: 1,
        message: "Service title is required",
    },
    {
        field: "price",
        required: true,
        type: "number",
        min: 0,
        message: "Price must be a positive number",
    },
    {
        field: "categoryId",
        required: true,
        type: "string",
        message: "Category ID is required",
    },
];
//# sourceMappingURL=service.validation.js.map