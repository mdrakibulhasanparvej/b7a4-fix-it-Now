import { AppError } from "../errors/AppError";
import httpStatus from "http-status";
export const validateRequest = (rules) => {
    return (req, _res, next) => {
        const errors = [];
        for (const rule of rules) {
            const value = req.body[rule.field];
            if (rule.required && (value === undefined || value === null || value === "")) {
                errors.push({
                    field: rule.field,
                    message: rule.message || `${rule.field} is required`,
                });
                continue;
            }
            if (value === undefined || value === null)
                continue;
            if (rule.type === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push({
                        field: rule.field,
                        message: rule.message || `Invalid email format`,
                    });
                }
            }
            if (rule.type === "string" && typeof value === "string") {
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push({
                        field: rule.field,
                        message: rule.message || `${rule.field} must be at least ${rule.minLength} characters`,
                    });
                }
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors.push({
                        field: rule.field,
                        message: rule.message || `${rule.field} must be at most ${rule.maxLength} characters`,
                    });
                }
            }
            if (rule.type === "number") {
                const num = Number(value);
                if (isNaN(num)) {
                    errors.push({
                        field: rule.field,
                        message: rule.message || `${rule.field} must be a number`,
                    });
                }
                else {
                    if (rule.min !== undefined && num < rule.min) {
                        errors.push({
                            field: rule.field,
                            message: rule.message || `${rule.field} must be at least ${rule.min}`,
                        });
                    }
                    if (rule.max !== undefined && num > rule.max) {
                        errors.push({
                            field: rule.field,
                            message: rule.message || `${rule.field} must be at most ${rule.max}`,
                        });
                    }
                }
            }
            if (rule.enum && !rule.enum.includes(value)) {
                errors.push({
                    field: rule.field,
                    message: rule.message || `${rule.field} must be one of: ${rule.enum.join(", ")}`,
                });
            }
        }
        if (errors.length > 0) {
            return next(new AppError(httpStatus.BAD_REQUEST, errors[0].message));
        }
        next();
    };
};
//# sourceMappingURL=validateRequest.js.map