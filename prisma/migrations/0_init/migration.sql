CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."setores_censitarios_raw" (
    "fid" SERIAL NOT NULL,
    "cd_setor" VARCHAR,
    "situacao" VARCHAR,
    "cd_sit" VARCHAR,
    "cd_tipo" VARCHAR,
    "area_km2" DOUBLE PRECISION,
    "cd_regiao" VARCHAR,
    "nm_regiao" VARCHAR,
    "cd_uf" VARCHAR,
    "nm_uf" VARCHAR,
    "cd_mun" VARCHAR,
    "nm_mun" VARCHAR,
    "cd_dist" VARCHAR,
    "nm_dist" VARCHAR,
    "cd_subdist" VARCHAR,
    "nm_subdist" VARCHAR,
    "cd_bairro" VARCHAR,
    "nm_bairro" VARCHAR,
    "cd_nu" VARCHAR,
    "nm_nu" VARCHAR,
    "cd_fcu" VARCHAR,
    "nm_fcu" VARCHAR,
    "cd_aglom" VARCHAR,
    "nm_aglom" VARCHAR,
    "cd_rgint" VARCHAR,
    "nm_rgint" VARCHAR,
    "cd_rgi" VARCHAR,
    "nm_rgi" VARCHAR,
    "cd_concurb" VARCHAR,
    "nm_concurb" VARCHAR,
    "qtd_domicilios_responsavel" DOUBLE PRECISION,
    "qtd_moradores" DOUBLE PRECISION,
    "variancia_moradores" DOUBLE PRECISION,
    "renda_media" DOUBLE PRECISION,
    "variancia_renda" DOUBLE PRECISION,
    "renda_mediana" DOUBLE PRECISION,
    "densidade_hab_km2" DOUBLE PRECISION,
    "tamanho_medio_familia" DOUBLE PRECISION,
    "desvio_padrao_renda" DOUBLE PRECISION,
    "coef_variacao_renda" DOUBLE PRECISION,
    "geom" geometry,

    CONSTRAINT "setores_censitarios_raw_pkey" PRIMARY KEY ("fid")
);

-- CreateIndex
CREATE INDEX "setores_censitarios_raw_geom_geom_idx" ON "public"."setores_censitarios_raw" USING GIST ("geom" gist_geometry_ops_2d);

