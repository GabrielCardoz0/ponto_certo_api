import { Router } from "express";
import * as poiController from "../controllers/poiController.js";

export const poiRoutes = Router();

poiRoutes.get("/categorias", poiController.listarCategorias);
poiRoutes.get("/", poiController.listarNoBbox);
