import type { Request, Response } from "express";
import { z } from "zod";
import * as configService from "../services/configService.js";

const fatorCorrecaoQuerySchema = z.object({
  indice: z.string().trim().min(1).default("IPCA"),
});

export async function buscarFatorCorrecao(req: Request, res: Response) {
  const { indice } = fatorCorrecaoQuerySchema.parse(req.query);
  const resultado = await configService.buscarFatorCorrecao(indice);
  res.json(resultado);
}
