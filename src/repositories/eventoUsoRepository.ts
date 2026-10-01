import { prisma } from "../config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export interface NovoEventoUso {
  userId: number | null;
  acao: string;
  metadata?: Prisma.InputJsonValue;
}

export async function criar({ userId, acao, metadata }: NovoEventoUso): Promise<void> {
  await prisma.eventoUso.create({
    // exactOptionalPropertyTypes: spread condicional em vez de `metadata` sempre presente
    // (mesmo como `undefined`), que o Prisma não aceita pra um campo Json opcional.
    data: { user_id: userId, acao, ...(metadata !== undefined && { metadata }) },
  });
}

/** Usuários distintos que geraram algum evento a partir de `desde` — "ativo" = usou o app, não a conta ligada/desligada. */
export async function contarUsuariosAtivosDesde(desde: Date): Promise<number> {
  const grupos = await prisma.eventoUso.groupBy({
    by: ["user_id"],
    where: { created_at: { gte: desde }, user_id: { not: null } },
  });
  return grupos.length;
}

export async function contarPorAcaoDesde(desde: Date, acoes: string[]): Promise<Record<string, number>> {
  const grupos = await prisma.eventoUso.groupBy({
    by: ["acao"],
    where: { created_at: { gte: desde }, acao: { in: acoes } },
    _count: { _all: true },
  });
  const porAcao = Object.fromEntries(acoes.map((acao) => [acao, 0]));
  for (const grupo of grupos) {
    porAcao[grupo.acao] = grupo._count._all;
  }
  return porAcao;
}

export interface EventoRecenteRow {
  id: number;
  acao: string;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
  usuarioNome: string | null;
  usuarioEmail: string | null;
}

export async function listarRecentes(limit: number): Promise<EventoRecenteRow[]> {
  const eventos = await prisma.eventoUso.findMany({
    take: limit,
    orderBy: { created_at: "desc" },
    include: { user: { select: { nome: true, email: true } } },
  });
  return eventos.map((e) => ({
    id: e.id,
    acao: e.acao,
    metadata: e.metadata,
    createdAt: e.created_at,
    usuarioNome: e.user?.nome ?? null,
    usuarioEmail: e.user?.email ?? null,
  }));
}
