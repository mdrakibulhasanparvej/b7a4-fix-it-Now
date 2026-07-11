import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import httpStatus from "http-status";
const create = catchAsync(async (req, res) => {
    const result = await paymentService.createPaymentIntent(req.user.id, req.body.bookingId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment intent created successfully",
        data: result,
    });
});
const confirm = catchAsync(async (req, res) => {
    const payment = await paymentService.confirmPayment(req.body.paymentIntentId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment confirmed successfully",
        data: payment,
    });
});
const getAll = catchAsync(async (req, res) => {
    const payments = await paymentService.getMyPayments(req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payments fetched successfully",
        data: payments,
    });
});
const getById = catchAsync(async (req, res) => {
    const payment = await paymentService.getPaymentById(req.params.id, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment fetched successfully",
        data: payment,
    });
});
const webhook = catchAsync(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const result = await paymentService.handleStripeWebhook(req.body, sig);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Webhook received",
        data: result,
    });
});
export const paymentController = {
    create,
    confirm,
    getAll,
    getById,
    webhook,
};
//# sourceMappingURL=payment.controller.js.map