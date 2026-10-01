import { Router } from "express";
import * as setorController from "../controllers/setorController.js";

export const setorRoutes = Router();

setorRoutes.get("/busca", setorController.buscar);
setorRoutes.get("/localizar", setorController.localizar);
setorRoutes.get("/comparar", setorController.comparar);
setorRoutes.get("/:cdSetor/pois", setorController.listarPois);
setorRoutes.get("/:cdSetor/relatorio", setorController.relatorio);
setorRoutes.get("/:cdSetor/similares", setorController.similares);
setorRoutes.get("/:cdSetor", setorController.detalhar);
