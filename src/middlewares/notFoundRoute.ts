import type { Request, Response } from "express";

export function notFoundRoute(_req: Request, res: Response) {
  res.status(404).json({ erro: "Rota não encontrada" });
}
