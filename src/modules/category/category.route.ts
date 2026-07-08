import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategoryRules } from "./category.validation";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(createCategoryRules),
  categoryController.create,
);
router.put(
  "/:id",
  auth(Role.ADMIN),
  categoryController.update,
);
router.delete(
  "/:id",
  auth(Role.ADMIN),
  categoryController.remove,
);

export const categoryRoutes = router;
