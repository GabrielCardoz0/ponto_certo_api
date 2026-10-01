/*
  Warnings:

  - You are about to drop the `setores_censitarios_raw` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateTable
CREATE TABLE "setores_censitarios" (
    "cd_setor" TEXT NOT NULL,
    "censo_date" DATE NOT NULL,
    "cd_municipio" TEXT NOT NULL,
    "nm_municipio" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "situacao" TEXT NOT NULL,
    "area_km2" INTEGER NOT NULL,
    "populacao" INTEGER NOT NULL,
    "renda_media" INTEGER,
    "renda_mediana" INTEGER,
    "densidade_hab_km2" INTEGER,
    "tamanho_medio_familia" INTEGER,
    "desvio_padrao_renda" INTEGER,
    "coef_variacao_renda" INTEGER,
    "pct_agua_rede" INTEGER,
    "pct_esgoto_rede" INTEGER,
    "pct_coleta_lixo" INTEGER,
    "geom" geometry(MultiPolygon, 4326) NOT NULL,
    "perfil" vector(6),

    CONSTRAINT "setores_censitarios_pkey" PRIMARY KEY ("cd_setor","censo_date")
);

-- CreateTable
CREATE TABLE "pois" (
    "id" SERIAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "subcategoria" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "fonte" TEXT NOT NULL,
    "metadata" JSONB,
    "geom" geometry(Point, 4326) NOT NULL,

    CONSTRAINT "pois_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pois_categoria_subcategoria_idx" ON "pois"("categoria", "subcategoria");

-- CreateIndex (PostGIS/pgvector)
CREATE INDEX idx_setores_geom ON setores_censitarios USING GIST (geom);
CREATE INDEX idx_pois_geom ON pois USING GIST (geom);
CREATE INDEX idx_setores_censo_date ON setores_censitarios (censo_date);
CREATE INDEX idx_setores_perfil ON setores_censitarios USING hnsw (perfil vector_l2_ops);