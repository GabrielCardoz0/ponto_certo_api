import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

export const authRoutes = Router();

authRoutes.post("/login", authController.login);
authRoutes.post("/logout", requireAuth, authController.logout);
authRoutes.get("/me", requireAuth, authController.me);
