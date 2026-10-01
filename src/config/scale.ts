/**
 * Fatores de escala dos campos numéricos de `setores_censitarios`.
 * Os valores são armazenados como inteiro (ver planejamento-backend-node.md) para
 * evitar erro de ponto flutuante entre banco, Prisma e frontend — este arquivo é o
 * único lugar que sabe converter de volta pra unidade "de verdade".
 */
export const SCALE = {
  areaKm2: 100,
  rendaMedia: 100,
  rendaMediana: 100,
  densidadeHabKm2: 100,
  tamanhoMedioFamilia: 100,
  desvioPadraoRenda: 100,
  coefVariacaoRenda: 10000,
} as const;

type ScaledField = keyof typeof SCALE;

export function unscale(field: ScaledField, value: number | null): number | null {
  if (value === null) return null;
  return value / SCALE[field];
}

export function scale(field: ScaledField, value: number): number {
  return Math.round(value * SCALE[field]);
}
