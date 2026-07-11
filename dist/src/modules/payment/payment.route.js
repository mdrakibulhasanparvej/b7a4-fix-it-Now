import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
const router = Router();
router.post("/create", auth(Role.CUSTOMER), paymentController.create);
router.post("/confirm", auth(Role.CUSTOMER), paymentController.confirm);
router.get("/", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getAll);
router.get("/:id", auth(Role.CUSTOMER), paymentController.getById);
export const paymentRoutes = router;
//# sourceMappingURL=payment.route.js.map