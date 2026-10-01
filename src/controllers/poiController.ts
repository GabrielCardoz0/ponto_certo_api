import type { Request, Response } from "express";
import { z } from "zod";
import * as poiService from "../services/poiService.js";
import { ValidationError } from "../middlewares/AppError.js";

const bboxQuerySchema = z.object({
  bbox: z.string().trim(),
  subcategorias: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(5000).default(1000),
});

function parseBbox(bbox: string): [number, number, number, number] {
  const partes = bbox.split(",").map(Number);
  if (partes.length !== 4 || partes.some((n) => !Number.isFinite(n))) {
    throw new ValidationError('bbox deve ter o formato "minLng,minLat,maxLng,maxLat"');
  }
  const [minLng, minLat, maxLng, maxLat] = partes as [number, number, number, number];
  if (minLng >= maxLng || minLat >= maxLat) {
    throw new ValidationError("bbox inválido: mínimos devem ser menores que os máximos");
  }
  return [minLng, minLat, maxLng, maxLat];
}

export async function listarNoBbox(req: Request, res: Response) {
  const { bbox, subcategorias, limit } = bboxQuerySchema.parse(req.query);
  const listaSubcategorias = subcategorias?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const resultado = await poiService.listarNoBbox(parseBbox(bbox), listaSubcategorias, limit);
  res.json(resultado);
}

export async function listarCategorias(_req: Request, res: Response) {
  const resultado = await poiService.listarCategorias();
  res.json(resultado);
}
