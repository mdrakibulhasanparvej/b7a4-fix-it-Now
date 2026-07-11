import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";
import httpStatus from "http-status";
const create = catchAsync(async (req, res) => {
    const review = await reviewService.createReview({
        bookingId: req.body.bookingId,
        customerId: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment,
    });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review created successfully",
        data: review,
    });
});
export const reviewController = {
    create,
};
//# sourceMappingURL=review.controller.js.map