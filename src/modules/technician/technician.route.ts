import { Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateProfileRules, availabilityRules } from "./technician.validation";

const router = Router();
const profileRouter = Router();
const availabilityRouter = Router();
const bookingRouter = Router();

router.get("/", technicianController.getAll);
router.get("/:id", technicianController.getById);

profileRouter.put(
  "/",
  auth(Role.TECHNICIAN),
  validateRequest(updateProfileRules),
  technicianController.updateProfile,
);

availabilityRouter.put(
  "/",
  auth(Role.TECHNICIAN),
  validateRequest(availabilityRules),
  technicianController.updateAvailability,
);

bookingRouter.get(
  "/",
  auth(Role.TECHNICIAN),
  technicianController.getMyBookings,
);

bookingRouter.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  technicianController.updateBookingStatus,
);

export const technicianRoutes = router;
export const technicianProfileRoutes = profileRouter;
export const technicianAvailabilityRoutes = availabilityRouter;
export const technicianBookingRoutes = bookingRouter;
