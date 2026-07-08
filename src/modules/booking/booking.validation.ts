import type { ValidationRule } from "../../middlewares/validateRequest";

export const createBookingRules: ValidationRule[] = [
  {
    field: "serviceId",
    required: true,
    type: "string",
    message: "Service ID is required",
  },
];
