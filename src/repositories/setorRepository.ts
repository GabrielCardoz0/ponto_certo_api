import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/prisma.js";
import type {
  PoiContagemRow,
  PoiMaisProximoRow,
  PoiRow,
  SetorDetalheRow,
  SetorResumoRow,
  SetorSimilarRow,
} from "../types/setor.js";

export async function buscar(q: string, limit: number): Promise<SetorResumoRow[]> {
  const termo = `%${q}%`;

  return prisma.$queryRaw<SetorResumoRow[]>`
    SELECT * FROM (
      SELECT DISTINCT ON (cd_setor)
        cd_setor AS "cdSetor",
        censo_date AS "censoDate",
        cd_municipio AS "cdMunicipio",
        nm_municipio AS "nmMunicipio",
        uf,
        regiao,
        ST_X(ST_Centroid(geom)) AS lng,
        ST_Y(ST_Centroid(geom)) AS lat
      FROM setores_censitarios
      WHERE nm_municipio ILIKE ${termo} OR uf ILIKE ${termo}
      ORDER BY cd_setor, censo_date DESC
    ) t
    ORDER BY "nmMunicipio"
    LIMIT ${limit}
  `;
}

/**
 * Colunas do detalhe de um setor: setores_censitarios (s) + demografia (d) + vulnerabilidade (v).
 * Compartilhado por buscarMaisRecente e buscarPorPonto pra não duplicar ~70 colunas.
 * Os LEFT JOINs deixam passar setores sem linha nas tabelas novas (~9 mil) — `temDemografia`/
 * `temVulnerabilidade` dizem se o join achou algo.
 */
const COLUNAS_DETALHE = Prisma.sql`
  s.cd_setor AS "cdSetor",
  s.censo_date AS "censoDate",
  s.cd_municipio AS "cdMunicipio",
  s.nm_municipio AS "nmMunicipio",
  s.uf,
  s.regiao,
  s.situacao,
  s.area_km2 AS "areaKm2",
  s.populacao,
  s.renda_media AS "rendaMedia",
  s.renda_mediana AS "rendaMediana",
  s.densidade_hab_km2 AS "densidadeHabKm2",
  s.tamanho_medio_familia AS "tamanhoMedioFamilia",
  s.desvio_padrao_renda AS "desvioPadraoRenda",
  s.coef_variacao_renda AS "coefVariacaoRenda",
  s.domicilios_ocupados AS "domiciliosOcupados",
  s.domicilios_uso_ocasional AS "domiciliosUsoOcasional",
  s.domicilios_vagos AS "domiciliosVagos",
  ST_X(ST_Centroid(s.geom)) AS lng,
  ST_Y(ST_Centroid(s.geom)) AS lat,

  (d.cd_setor IS NOT NULL) AS "temDemografia",
  d.populacao_masculina AS "populacaoMasculina",
  d.populacao_feminina AS "populacaoFeminina",
  d.idade_0_4 AS "idade0a4",
  d.idade_5_9 AS "idade5a9",
  d.idade_10_14 AS "idade10a14",
  d.idade_15_19 AS "idade15a19",
  d.idade_20_24 AS "idade20a24",
  d.idade_25_29 AS "idade25a29",
  d.idade_30_39 AS "idade30a39",
  d.idade_40_49 AS "idade40a49",
  d.idade_50_59 AS "idade50a59",
  d.idade_60_69 AS "idade60a69",
  d.idade_70_mais AS "idade70Mais",
  d.populacao_branca AS "populacaoBranca",
  d.populacao_preta AS "populacaoPreta",
  d.populacao_amarela AS "populacaoAmarela",
  d.populacao_parda AS "populacaoParda",
  d.populacao_indigena AS "populacaoIndigena",
  d.alfabetizados_15_mais AS "alfabetizados15Mais",
  d.nao_alfabetizados_15_mais AS "naoAlfabetizados15Mais",

  (v.cd_setor IS NOT NULL) AS "temVulnerabilidade",
  v.domicilios_agua_rede AS "domiciliosAguaRede",
  v.domicilios_esgoto_rede AS "domiciliosEsgotoRede",
  v.domicilios_lixo_coletado AS "domiciliosLixoColetado",
  v.domicilios_casa AS "domiciliosCasa",
  v.domicilios_casa_condominio AS "domiciliosCasaCondominio",
  v.domicilios_apartamento AS "domiciliosApartamento",
  v.domicilios_precario AS "domiciliosPrecario",
  v.domicilios_com_banheiro AS "domiciliosComBanheiro",
  v.domicilios_sem_banheiro AS "domiciliosSemBanheiro",
  v.faces_total AS "facesTotal",
  v.faces_com_pavimentacao AS "facesComPavimentacao",
  v.faces_com_bueiro AS "facesComBueiro",
  v.faces_com_iluminacao AS "facesComIluminacao",
  v.faces_com_ponto_onibus AS "facesComPontoOnibus",
  v.faces_com_via_bicicleta AS "facesComViaBicicleta",
  v.faces_com_calcada AS "facesComCalcada",
  v.faces_com_obstaculo AS "facesComObstaculo",
  v.faces_com_rampa AS "facesComRampa",
  v.faces_sem_arvores AS "facesSemArvores"
`;

const ORIGEM_DETALHE = Prisma.sql`
  FROM setores_censitarios s
  LEFT JOIN setores_demografia d ON d.cd_setor = s.cd_setor AND d.censo_date = s.censo_date
  LEFT JOIN setores_vulnerabilidade v ON v.cd_setor = s.cd_setor AND v.censo_date = s.censo_date
`;

export async function buscarMaisRecente(cdSetor: string): Promise<SetorDetalheRow | null> {
  const rows = await prisma.$queryRaw<SetorDetalheRow[]>`
    SELECT ${COLUNAS_DETALHE}
    ${ORIGEM_DETALHE}
    WHERE s.cd_setor = ${cdSetor}
    ORDER BY s.censo_date DESC
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function buscarPorPonto(lng: number, lat: number): Promise<SetorDetalheRow | null> {
  const rows = await prisma.$queryRaw<SetorDetalheRow[]>`
    SELECT ${COLUNAS_DETALHE}
    ${ORIGEM_DETALHE}
    WHERE ST_Contains(s.geom, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))
    ORDER BY s.censo_date DESC
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function existe(cdSetor: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ existe: boolean }[]>`
    SELECT EXISTS(SELECT 1 FROM setores_censitarios WHERE cd_setor = ${cdSetor}) AS existe
  `;

  return rows[0]?.existe ?? false;
}

export async function possuiPerfil(cdSetor: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ possui: boolean }[]>`
    SELECT EXISTS(
      SELECT 1 FROM setores_censitarios WHERE cd_setor = ${cdSetor} AND perfil IS NOT NULL
    ) AS possui
  `;

  return rows[0]?.possui ?? false;
}

export async function listarPoisNoRaio(
  cdSetor: string,
  raioMetros: number,
  categoria: string | undefined,
  limit: number,
): Promise<PoiRow[]> {
  return prisma.$queryRaw<PoiRow[]>`
    SELECT
      p.id,
      p.categoria,
      p.subcategoria,
      p.nome,
      p.fonte,
      p.metadata,
      ST_X(p.geom) AS lng,
      ST_Y(p.geom) AS lat,
      ST_Distance(p.geom::geography, s.geom::geography) AS "distanciaM",
      ST_AsGeoJSON(p.shape) AS "shapeGeoJson"
    FROM pois p
    JOIN setores_censitarios s ON s.cd_setor = ${cdSetor}
    WHERE s.censo_date = (SELECT MAX(censo_date) FROM setores_censitarios WHERE cd_setor = ${cdSetor})
      AND p.geom && ST_Expand(s.geom, ${raioMetros}::double precision / 90000.0)
      AND ST_DWithin(p.geom::geography, s.geom::geography, ${raioMetros})
      AND (${categoria ?? null}::text IS NULL OR p.categoria = ${categoria ?? null})
    ORDER BY "distanciaM"
    LIMIT ${limit}
  `;
}

export async function contarPoisPorCategoria(
  cdSetor: string,
  raioMetros: number,
): Promise<PoiContagemRow[]> {
  return prisma.$queryRaw<PoiContagemRow[]>`
    SELECT p.categoria, p.subcategoria, count(*) AS total
    FROM pois p
    JOIN setores_censitarios s ON s.cd_setor = ${cdSetor}
    WHERE s.censo_date = (SELECT MAX(censo_date) FROM setores_censitarios WHERE cd_setor = ${cdSetor})
      AND p.geom && ST_Expand(s.geom, ${raioMetros}::double precision / 90000.0)
      AND ST_DWithin(p.geom::geography, s.geom::geography, ${raioMetros})
    GROUP BY p.categoria, p.subcategoria
    ORDER BY p.categoria, p.subcategoria
  `;
}

/**
 * POI mais próximo de cada categoria existente no banco, medido a partir do polígono do
 * setor (mesma referência do raio em listarPoisNoRaio; 0 m = tem POI dentro do setor).
 * O ORDER BY com `<->` usa o GiST de pois.geom (KNN), então não varre a tabela toda.
 */
export async function listarPoiMaisProximoPorCategoria(cdSetor: string): Promise<PoiMaisProximoRow[]> {
  return prisma.$queryRaw<PoiMaisProximoRow[]>`
    WITH setor AS (
      SELECT geom FROM setores_censitarios
      WHERE cd_setor = ${cdSetor}
      ORDER BY censo_date DESC
      LIMIT 1
    )
    SELECT c.categoria, near.subcategoria, near."distanciaM"
    FROM (SELECT DISTINCT categoria FROM pois) c
    CROSS JOIN setor
    CROSS JOIN LATERAL (
      SELECT
        p.subcategoria,
        ST_Distance(p.geom::geography, setor.geom::geography) AS "distanciaM"
      FROM pois p
      WHERE p.categoria = c.categoria
      ORDER BY p.geom <-> setor.geom
      LIMIT 1
    ) near
    ORDER BY c.categoria
  `;
}

export async function listarSimilares(
  cdSetor: string,
  raioExclusaoMetros: number,
  limit: number,
): Promise<SetorSimilarRow[]> {
  return prisma.$queryRaw<SetorSimilarRow[]>`
    WITH origem AS (
      SELECT cd_setor, geom, perfil
      FROM setores_censitarios
      WHERE cd_setor = ${cdSetor} AND perfil IS NOT NULL
      ORDER BY censo_date DESC
      LIMIT 1
    ),
    candidatos AS (
      SELECT DISTINCT ON (cd_setor)
        cd_setor, censo_date, cd_municipio, nm_municipio, uf, regiao, geom, perfil
      FROM setores_censitarios
      WHERE perfil IS NOT NULL
      ORDER BY cd_setor, censo_date DESC
    )
    SELECT
      c.cd_setor AS "cdSetor",
      c.censo_date AS "censoDate",
      c.cd_municipio AS "cdMunicipio",
      c.nm_municipio AS "nmMunicipio",
      c.uf,
      c.regiao,
      ST_X(ST_Centroid(c.geom)) AS lng,
      ST_Y(ST_Centroid(c.geom)) AS lat,
      (c.perfil <-> o.perfil) AS distancia
    FROM candidatos c, origem o
    WHERE c.cd_setor <> o.cd_setor
      AND NOT ST_DWithin(c.geom::geography, o.geom::geography, ${raioExclusaoMetros})
    ORDER BY distancia
    LIMIT ${limit}
  `;
}
