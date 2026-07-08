import jwt, { JwtPayload } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string | number,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    console.error("Token verification failed:", error);
    return {
      success: false,
      message: error.message || "Token verification failed",
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
