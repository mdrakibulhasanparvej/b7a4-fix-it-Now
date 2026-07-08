import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  userController.getMyProfile,
);

router.put(
  "/my-profile",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  userController.updateMyProfile,
);

export const userRouter = router;
