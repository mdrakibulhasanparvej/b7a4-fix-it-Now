import { LoginPayload, RegisterPayload } from "./auth.interface";
export declare const authService: {
    loginUser: (payload: LoginPayload) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    registerUser: (payload: RegisterPayload) => Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../../generated/prisma/enums").Role;
        isBanned: boolean;
        createdAt: Date;
    }>;
    getMe: (userId: string) => Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../../generated/prisma/enums").Role;
        isBanned: boolean;
        createdAt: Date;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map