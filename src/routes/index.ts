import { Router } from "express";
import { setorRoutes } from "./setorRoutes.js";
import { poiRoutes } from "./poiRoutes.js";
import { configRoutes } from "./configRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { adminRoutes } from "./adminRoutes.js";
import { requireAdmin, requireAuth } from "../middlewares/authMiddleware.js";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

routes.use("/auth", authRoutes);

// Tudo abaixo exige sessão — sem cadastro público, então sem motivo pra deixar aberto.
routes.use("/setores", requireAuth, setorRoutes);
routes.use("/pois", requireAuth, poiRoutes);
routes.use("/config", requireAuth, configRoutes);
routes.use("/admin", requireAuth, requireAdmin, adminRoutes);
