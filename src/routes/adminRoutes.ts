import { Router } from "express";
import * as adminController from "../controllers/adminController.js";

export const adminRoutes = Router();

adminRoutes.get("/usuarios", adminController.listarUsuarios);
adminRoutes.post("/usuarios", adminController.criarUsuario);
adminRoutes.patch("/usuarios/:id", adminController.alternarAtivo);
adminRoutes.get("/metricas", adminController.buscarMetricas);
