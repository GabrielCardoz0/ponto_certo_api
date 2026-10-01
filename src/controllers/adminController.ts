import type { Request, Response } from "express";
import { z } from "zod";
import * as usuarioAdminService from "../services/usuarioAdminService.js";
import * as metricasService from "../services/metricasService.js";
import { ValidationError } from "../middlewares/AppError.js";

export async function listarUsuarios(_req: Request, res: Response) {
  const usuarios = await usuarioAdminService.listar();
  res.json(usuarios);
}

const criarUsuarioSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome"),
  email: z.string().trim().toLowerCase().email(),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
});

export async function criarUsuario(req: Request, res: Response) {
  const { nome, email, senha } = criarUsuarioSchema.parse(req.body);
  const usuario = await usuarioAdminService.criar(nome, email, senha);
  res.status(201).json(usuario);
}

const idParamSchema = z.object({ id: z.coerce.number().int().positive() });
const alternarAtivoSchema = z.object({ isActive: z.boolean() });

export async function alternarAtivo(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const { isActive } = alternarAtivoSchema.parse(req.body);

  // Autoadministração indevida: não deixa o admin se desativar sozinho (ficaria trancado de fora).
  if (id === req.usuarioId && !isActive) {
    throw new ValidationError("Você não pode desativar a própria conta");
  }

  const usuario = await usuarioAdminService.alternarAtivo(id, isActive);
  res.json(usuario);
}

export async function buscarMetricas(_req: Request, res: Response) {
  const metricas = await metricasService.buscar();
  res.json(metricas);
}
