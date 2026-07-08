import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import type { ValidationRule } from "../../middlewares/validateRequest";

const router = Router();

const registerRules: ValidationRule[] = [
  { field: "name", required: true, type: "string", minLength: 1, message: "Name is required" },
  { field: "email", required: true, type: "email", message: "Valid email is required" },
  { field: "password", required: true, type: "string", minLength: 6, message: "Password must be at least 6 characters" },
  { field: "role", enum: ["CUSTOMER", "TECHNICIAN"] },
];

const loginRules: ValidationRule[] = [
  { field: "email", required: true, type: "email", message: "Valid email is required" },
  { field: "password", required: true, type: "string", message: "Password is required" },
];

router.post("/register", validateRequest(registerRules), authController.registerUser);
router.post("/login", validateRequest(loginRules), authController.loginUser);
router.get("/me", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), authController.getMe);

export const authRoutes = router;
