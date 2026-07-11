export const createReviewRules = [
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
//# sourceMappingURL=review.validation.js.map