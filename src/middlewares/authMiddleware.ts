import type { NextFunction, Request, Response } from "express";
import { verificarToken } from "../lib/jwt.js";
import { ForbiddenError, UnauthorizedError } from "./AppError.js";
import { COOKIE_SESSAO } from "../controllers/authController.js";

declare global {
  namespace Express {
    interface Request {
      usuarioId?: number;
      usuarioRole?: string;
    }
  }
}

/** Exige sessão válida (cookie httpOnly com JWT); popula `req.usuarioId`/`req.usuarioRole`. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_SESSAO];
  const payload = typeof token === "string" ? verificarToken(token) : null;
  if (!payload) {
    throw new UnauthorizedError();
  }
  req.usuarioId = payload.sub;
  req.usuarioRole = payload.role;
  next();
}

/** Exige role "admin" — usar sempre depois de `requireAuth` na cadeia de middlewares. */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.usuarioRole !== "admin") {
    throw new ForbiddenError();
  }
  next();
}
