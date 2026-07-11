import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingRules } from "./booking.validation";
const router = Router();
router.post("/", auth(Role.CUSTOMER), validateRequest(createBookingRules), bookingController.create);
router.get("/", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), bookingController.getAll);
router.get("/:id", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), bookingController.getById);
router.patch("/:id/cancel", auth(Role.CUSTOMER), bookingController.cancel);
export const bookingRoutes = router;
//# sourceMappingURL=booking.route.js.map