import { Request, Response, NextFunction } from "express";
export type ValidationRule = {
    field: string;
    required?: boolean;
    type?: "string" | "number" | "boolean" | "email" | "array" | "object";
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    enum?: string[];
    message?: string;
};
export declare const validateRequest: (rules: ValidationRule[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validateRequest.d.ts.map