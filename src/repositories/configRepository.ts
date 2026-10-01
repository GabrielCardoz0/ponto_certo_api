import { prisma } from "../config/prisma.js";
import type { FatorCorrecaoRow } from "../types/config.js";

/** Linha mais recente (maior mes_referencia) para o índice pedido — "fator atual". */
export async function buscarFatorAtual(indice: string): Promise<FatorCorrecaoRow | null> {
  const linhas = await prisma.$queryRaw<FatorCorrecaoRow[]>`
    SELECT
      fator_acumulado::float8 AS "fatorAcumulado",
      mes_referencia AS "mesReferencia"
    FROM indices_correcao_monetaria
    WHERE indice = ${indice}
    ORDER BY mes_referencia DESC
    LIMIT 1
  `;
  return linhas[0] ?? null;
}
