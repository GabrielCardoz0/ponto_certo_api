import * as configRepository from "../repositories/configRepository.js";
import { NotFoundError } from "../middlewares/AppError.js";
import type { FatorCorrecaoDTO } from "../types/config.js";

export async function buscarFatorCorrecao(indice: string): Promise<FatorCorrecaoDTO> {
  const linha = await configRepository.buscarFatorAtual(indice);
  if (!linha) {
    throw new NotFoundError(`Nenhum fator de correção cadastrado para o índice "${indice}"`);
  }
  return {
    fatorAcumulado: linha.fatorAcumulado,
    mesReferencia: linha.mesReferencia.toISOString().slice(0, 10),
  };
}
