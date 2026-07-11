import { Request, Response } from "express";
export declare const paymentController: {
    create: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    confirm: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    webhook: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=payment.controller.d.ts.map