import type { ValidationRule } from "../../middlewares/validateRequest";

export const createReviewRules: ValidationRule[] = [
  {
    field: "bookingId",
    required: true,
    type: "string",
    message: "Booking ID is required",
  },
  {
    field: "rating",
    required: true,
    type: "number",
    min: 1,
    max: 5,
    message: "Rating must be between 1 and 5",
  },
  {
    field: "comment",
    type: "string",
  },
];
