import { Router } from "express";
import * as configController from "../controllers/configController.js";

export const configRoutes = Router();

configRoutes.get("/fator-correcao", configController.buscarFatorCorrecao);
