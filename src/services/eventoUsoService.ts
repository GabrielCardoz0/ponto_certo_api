import * as eventoUsoRepository from "../repositories/eventoUsoRepository.js";
import type { NovoEventoUso } from "../repositories/eventoUsoRepository.js";

/**
 * Fire-and-forget: registra um evento de uso sem nunca deixar uma falha aqui derrubar ou
 * atrasar a ação principal que já teve sucesso (login, seleção de setor, comparação etc).
 * Por isso não é `async`/não é `await`ado por quem chama — só dispara e engole erro.
 */
export function registrar(userId: number | null, acao: string, metadata?: NovoEventoUso["metadata"]): void {
  eventoUsoRepository
    .criar({ userId, acao, ...(metadata !== undefined && { metadata }) })
    .catch((erro: unknown) => {
      console.error(`Falha ao registrar evento de uso "${acao}":`, erro);
    });
}
