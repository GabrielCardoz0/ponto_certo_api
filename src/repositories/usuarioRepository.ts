import { prisma } from "../config/prisma.js";
import type { UsuarioRow } from "../types/usuario.js";

function mapRow(row: {
  id: number;
  nome: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  is_first_access: boolean;
  accept_terms_at: Date | null;
  created_at: Date;
  updated_at: Date;
}): UsuarioRow {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    password: row.password,
    role: row.role,
    isActive: row.is_active,
    isFirstAccess: row.is_first_access,
    acceptTermsAt: row.accept_terms_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function buscarPorEmail(email: string): Promise<UsuarioRow | null> {
  const row = await prisma.users.findUnique({ where: { email } });
  return row ? mapRow(row) : null;
}

export async function buscarPorId(id: number): Promise<UsuarioRow | null> {
  const row = await prisma.users.findUnique({ where: { id } });
  return row ? mapRow(row) : null;
}

export async function listarTodos(): Promise<UsuarioRow[]> {
  const rows = await prisma.users.findMany({ orderBy: { created_at: "desc" } });
  return rows.map(mapRow);
}

export interface NovoUsuario {
  nome: string;
  email: string;
  passwordHash: string;
}

export async function criar({ nome, email, passwordHash }: NovoUsuario): Promise<UsuarioRow> {
  const row = await prisma.users.create({
    data: { nome, email, password: passwordHash },
  });
  return mapRow(row);
}

export async function atualizarAtivo(id: number, isActive: boolean): Promise<UsuarioRow | null> {
  try {
    const row = await prisma.users.update({
      where: { id },
      data: { is_active: isActive },
    });
    return mapRow(row);
  } catch {
    // P2025: registro não encontrado — devolve null, o service decide o 404.
    return null;
  }
}
