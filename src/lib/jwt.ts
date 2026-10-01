import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/** Sessão dura 7 dias — sem "lembrar de mim", sem refresh token por enquanto. */
const EXPIRA_EM = "7d";

export interface TokenPayload {
  sub: number; // id do usuário
  role: string;
}

export function assinarToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: EXPIRA_EM });
}

/** null quando o token é inválido/expirado — quem chama decide o que fazer (401, etc). */
export function verificarToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as unknown as TokenPayload;
  } catch {
    return null;
  }
}
