export const updateProfileRules = [
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
export const availabilityRules = [
    {
        field: "availability",
        required: true,
        type: "array",
        message: "Availability is required",
    },
];
//# sourceMappingURL=technician.validation.js.map