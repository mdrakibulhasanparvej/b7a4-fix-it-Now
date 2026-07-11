import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createServiceRules } from "./service.validation";
const router = Router();
router.get("/", serviceController.getAll);
router.get("/:id", serviceController.getById);
router.post("/", auth(Role.TECHNICIAN, Role.ADMIN), validateRequest(createServiceRules), serviceController.create);
router.put("/:id", auth(Role.TECHNICIAN, Role.ADMIN), serviceController.update);
router.delete("/:id", auth(Role.TECHNICIAN, Role.ADMIN), serviceController.remove);
export const serviceRoutes = router;
//# sourceMappingURL=service.route.js.map