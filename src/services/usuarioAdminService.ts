import * as usuarioRepository from "../repositories/usuarioRepository.js";
import { gerarHash } from "../lib/hash.js";
import { NotFoundError, ValidationError } from "../middlewares/AppError.js";
import type { UsuarioAdminDTO, UsuarioRow } from "../types/usuario.js";

function paraAdminDTO(usuario: UsuarioRow): UsuarioAdminDTO {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
    isActive: usuario.isActive,
    createdAt: usuario.createdAt.toISOString(),
  };
}

export async function listar(): Promise<UsuarioAdminDTO[]> {
  const usuarios = await usuarioRepository.listarTodos();
  return usuarios.map(paraAdminDTO);
}

export async function criar(nome: string, email: string, senha: string): Promise<UsuarioAdminDTO> {
  const passwordHash = await gerarHash(senha);
  try {
    // Conta criada pelo admin já nasce ativa; role fica em "usuario" — sem seletor de role
    // no formulário por enquanto, pra não abrir brecha de virar admin por engano.
    const usuario = await usuarioRepository.criar({ nome, email, passwordHash });
    return paraAdminDTO(usuario);
  } catch (erro) {
    // P2002: violação de índice único — só pode ser o e-mail (é a única coluna @unique).
    if (typeof erro === "object" && erro !== null && "code" in erro && erro.code === "P2002") {
      throw new ValidationError("Já existe um usuário com esse e-mail");
    }
    throw erro;
  }
}

export async function alternarAtivo(id: number, isActive: boolean): Promise<UsuarioAdminDTO> {
  const usuario = await usuarioRepository.atualizarAtivo(id, isActive);
  if (!usuario) {
    throw new NotFoundError("Usuário não encontrado");
  }
  return paraAdminDTO(usuario);
}
