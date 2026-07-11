import { Request, Response } from "express";
export declare const authController: {
    loginUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    registerUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMe: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map