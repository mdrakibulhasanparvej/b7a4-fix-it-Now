import type { ValidationRule } from "../../middlewares/validateRequest";

export const updateProfileRules: ValidationRule[] = [
  {
    field: "bio",
    type: "string",
  },
  {
    field: "experienceYears",
    type: "number",
    min: 0,
  },
];

export const availabilityRules: ValidationRule[] = [
  {
    field: "availability",
    required: true,
    type: "array",
    message: "Availability is required",
  },
];
