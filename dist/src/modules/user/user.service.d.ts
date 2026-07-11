import { RegisterUserPayload } from "./user.interface";
import { Role } from "../../../generated/prisma/enums";
export declare const userService: {
    registerUserIntoDB: (payload: RegisterUserPayload) => Promise<{
        id: string;
        email: string;
        name: string;
        role: Role;
        isBanned: boolean;
        createdAt: Date;
    }>;
    getMyProfileFromDB: (userId: string) => Promise<{
        id: string;
        email: string;
        name: string;
        role: Role;
        isBanned: boolean;
        createdAt: Date;
    }>;
    updateMyProfileInDB: (userId: string, payload: any) => Promise<{
        id: string;
        email: string;
        name: string;
        role: Role;
        isBanned: boolean;
        createdAt: Date;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map