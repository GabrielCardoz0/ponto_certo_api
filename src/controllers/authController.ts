import type { Request, Response } from "express";
import { z } from "zod";
import * as authService from "../services/authService.js";
import * as eventoUsoService from "../services/eventoUsoService.js";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../middlewares/AppError.js";

export const COOKIE_SESSAO = "ponto_certo_sessao";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProducao,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias — mesmo prazo do JWT
};

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  senha: z.string().min(1, "Informe a senha"),
});

export async function login(req: Request, res: Response) {
  const { email, senha } = loginSchema.parse(req.body);
  const { token, usuario } = await authService.login(email, senha);
  eventoUsoService.registrar(usuario.id, "login");
  res.cookie(COOKIE_SESSAO, token, COOKIE_OPTIONS);
  res.json({ usuario });
}

export async function logout(req: Request, res: Response) {
  // Passa por requireAuth (ver authRoutes.ts), então req.usuarioId sempre existe aqui.
  eventoUsoService.registrar(req.usuarioId!, "logout");
  res.clearCookie(COOKIE_SESSAO, { httpOnly: true, secure: env.isProducao, sameSite: "lax" });
  res.status(204).end();
}

export async function me(req: Request, res: Response) {
  if (!req.usuarioId) throw new UnauthorizedError();
  const usuario = await authService.buscarUsuarioLogado(req.usuarioId);
  res.json({ usuario });
}
