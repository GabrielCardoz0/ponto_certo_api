import type { Request, Response } from "express";
import { z } from "zod";
import * as setorService from "../services/setorService.js";
import * as eventoUsoService from "../services/eventoUsoService.js";

const buscaQuerySchema = z.object({
  q: z.string().trim().min(2, "Informe ao menos 2 caracteres para buscar"),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function buscar(req: Request, res: Response) {
  const { q, limit } = buscaQuerySchema.parse(req.query);
  const resultado = await setorService.buscar(q, limit);
  res.json(resultado);
}

const localizarQuerySchema = z.object({
  lat: z.coerce.number().min(-34).max(6),
  lng: z.coerce.number().min(-74).max(-28),
});

export async function localizar(req: Request, res: Response) {
  const { lat, lng } = localizarQuerySchema.parse(req.query);
  const resultado = await setorService.localizarPorPonto(lng, lat);
  res.json(resultado);
}

export async function detalhar(req: Request, res: Response) {
  const { cdSetor } = req.params as { cdSetor: string };
  const resultado = await setorService.detalhar(cdSetor);
  // Só aqui, não dentro de setorService.detalhar: essa função também é reaproveitada
  // internamente por comparar() (uma vez por ponto), o que disparia evento fantasma a cada
  // setor de uma comparação em vez de só quando o usuário escolhe um ponto de verdade.
  eventoUsoService.registrar(req.usuarioId!, "setor_selecionado", { cd_setor: cdSetor });
  res.json(resultado);
}

const poisQuerySchema = z.object({
  raio: z.coerce.number().positive().max(20000).default(800),
  categoria: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
});

export async function listarPois(req: Request, res: Response) {
  const { cdSetor } = req.params as { cdSetor: string };
  const { raio, categoria, limit } = poisQuerySchema.parse(req.query);
  const resultado = await setorService.listarPois(cdSetor, raio, categoria, limit);
  eventoUsoService.registrar(req.usuarioId!, "pois_visualizados", { cd_setor: cdSetor, categoria, raio });
  res.json(resultado);
}

const relatorioQuerySchema = z.object({
  raio: z.coerce.number().positive().max(20000).default(1000),
});

export async function relatorio(req: Request, res: Response) {
  const { cdSetor } = req.params as { cdSetor: string };
  const { raio } = relatorioQuerySchema.parse(req.query);
  const resultado = await setorService.relatorio(cdSetor, raio);
  res.json(resultado);
}

const compararQuerySchema = z.object({
  ids: z.string().trim().min(1, "Informe ao menos um setor em \"ids\""),
});

export async function comparar(req: Request, res: Response) {
  const { ids } = compararQuerySchema.parse(req.query);
  const cdSetores = ids.split(",").map((id) => id.trim()).filter(Boolean);
  const resultado = await setorService.comparar(cdSetores);
  eventoUsoService.registrar(req.usuarioId!, "comparacao_criada", { qtd_pontos: cdSetores.length });
  res.json(resultado);
}

const similaresQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  raioExclusaoKm: z.coerce.number().nonnegative().max(2000).default(50),
});

export async function similares(req: Request, res: Response) {
  const { cdSetor } = req.params as { cdSetor: string };
  const { limit, raioExclusaoKm } = similaresQuerySchema.parse(req.query);
  const resultado = await setorService.similares(cdSetor, limit, raioExclusaoKm * 1000);
  res.json(resultado);
}
