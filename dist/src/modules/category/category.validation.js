export const createCategoryRules = [
    {
        field: "name",
        required: true,
        type: "string",
        minLength: 1,
        message: "Category name is required",
    },
    {
        field: "description",
        type: "string",
    },
];
//# sourceMappingURL=category.validation.js.map