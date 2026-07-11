import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const loginUser = catchAsync(async (req, res) => {
    const { accessToken, refreshToken } = await authService.loginUser(req.body);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: { accessToken, refreshToken },
    });
});
const registerUser = catchAsync(async (req, res) => {
    const user = await authService.registerUser(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { user },
    });
});
const getMe = catchAsync(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User fetched successfully",
        data: user,
    });
});
export const authController = {
    loginUser,
    registerUser,
    getMe,
};
//# sourceMappingURL=auth.controller.js.map