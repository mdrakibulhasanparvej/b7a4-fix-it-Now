import jwt, { JwtPayload } from "jsonwebtoken";
export declare const jwtUtils: {
    createToken: (payload: JwtPayload, secret: string, expiresIn: string | number) => string;
    verifyToken: (token: string, secret: string) => {
        success: boolean;
        data: jwt.JwtPayload;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    };
};
//# sourceMappingURL=jwt.d.ts.map