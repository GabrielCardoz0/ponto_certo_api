import * as usuarioRepository from "../repositories/usuarioRepository.js";
import * as eventoUsoService from "./eventoUsoService.js";
import { conferirHash } from "../lib/hash.js";
import { assinarToken } from "../lib/jwt.js";
import { ForbiddenError, UnauthorizedError } from "../middlewares/AppError.js";
import type { UsuarioDTO, UsuarioRow } from "../types/usuario.js";

function paraDTO(usuario: UsuarioRow): UsuarioDTO {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
    isFirstAccess: usuario.isFirstAccess,
  };
}

export async function login(email: string, senha: string): Promise<{ token: string; usuario: UsuarioDTO }> {
  const usuario = await usuarioRepository.buscarPorEmail(email);

  // Mensagem genérica pra e-mail inexistente e senha errada — não dá pra um atacante
  // descobrir por tentativa se um e-mail está cadastrado. O evento de uso, ao contrário da
  // mensagem, distingue os dois casos (útil pra detectar força bruta) — por isso os dois
  // `if` separados em vez de uma condição só, mesmo lançando o mesmo erro nos dois.
  if (!usuario) {
    eventoUsoService.registrar(null, "erro", { tipo: "login_email_invalido", email_tentado: email });
    throw new UnauthorizedError("E-mail ou senha inválidos");
  }

  const senhaConfere = await conferirHash(senha, usuario.password);
  if (!senhaConfere) {
    eventoUsoService.registrar(usuario.id, "erro", { tipo: "login_senha_invalida", email_tentado: email });
    throw new UnauthorizedError("E-mail ou senha inválidos");
  }

  // Só chega aqui com a senha certa, então dizer que a conta está desativada não vaza nada novo.
  if (!usuario.isActive) {
    eventoUsoService.registrar(usuario.id, "erro", { tipo: "login_conta_inativa", email_tentado: email });
    throw new ForbiddenError("Conta desativada. Fale com o administrador.");
  }

  const token = assinarToken({ sub: usuario.id, role: usuario.role });
  return { token, usuario: paraDTO(usuario) };
}

export async function buscarUsuarioLogado(id: number): Promise<UsuarioDTO> {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario || !usuario.isActive) {
    throw new UnauthorizedError();
  }
  return paraDTO(usuario);
}
