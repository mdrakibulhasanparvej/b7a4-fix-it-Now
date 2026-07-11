import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createReviewRules } from "./review.validation";
const router = Router();
router.post("/", auth(Role.CUSTOMER), validateRequest(createReviewRules), reviewController.create);
export const reviewRoutes = router;
//# sourceMappingURL=review.route.js.map