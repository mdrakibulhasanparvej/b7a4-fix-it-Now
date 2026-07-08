import type { ValidationRule } from "../../middlewares/validateRequest";

export const createCategoryRules: ValidationRule[] = [
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
