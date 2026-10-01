/*
  Warnings:

  - You are about to drop the column `pct_agua_rede` on the `setores_censitarios` table. All the data in the column will be lost.
  - You are about to drop the column `pct_coleta_lixo` on the `setores_censitarios` table. All the data in the column will be lost.
  - You are about to drop the column `pct_esgoto_rede` on the `setores_censitarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "setores_censitarios" DROP COLUMN "pct_agua_rede",
DROP COLUMN "pct_coleta_lixo",
DROP COLUMN "pct_esgoto_rede";

-- CreateTable
CREATE TABLE "setores_demografia" (
    "cd_setor" TEXT NOT NULL,
    "censo_date" DATE NOT NULL,
    "populacao_masculina" INTEGER,
    "populacao_feminina" INTEGER,
    "idade_0_4" INTEGER,
    "idade_5_9" INTEGER,
    "idade_10_14" INTEGER,
    "idade_15_19" INTEGER,
    "idade_20_24" INTEGER,
    "idade_25_29" INTEGER,
    "idade_30_39" INTEGER,
    "idade_40_49" INTEGER,
    "idade_50_59" INTEGER,
    "idade_60_69" INTEGER,
    "idade_70_mais" INTEGER,
    "populacao_branca" INTEGER,
    "populacao_preta" INTEGER,
    "populacao_amarela" INTEGER,
    "populacao_parda" INTEGER,
    "populacao_indigena" INTEGER,
    "alfabetizados_15_mais" INTEGER,
    "nao_alfabetizados_15_mais" INTEGER,

    CONSTRAINT "setores_demografia_pkey" PRIMARY KEY ("cd_setor","censo_date")
);

-- CreateTable
CREATE TABLE "setores_vulnerabilidade" (
    "cd_setor" TEXT NOT NULL,
    "censo_date" DATE NOT NULL,
    "domicilios_agua_rede" INTEGER,
    "domicilios_esgoto_rede" INTEGER,
    "domicilios_lixo_coletado" INTEGER,
    "domicilios_casa" INTEGER,
    "domicilios_casa_condominio" INTEGER,
    "domicilios_apartamento" INTEGER,
    "domicilios_precario" INTEGER,
    "domicilios_com_banheiro" INTEGER,
    "domicilios_sem_banheiro" INTEGER,
    "faces_total" INTEGER,
    "faces_com_pavimentacao" INTEGER,
    "faces_com_bueiro" INTEGER,
    "faces_com_iluminacao" INTEGER,
    "faces_com_ponto_onibus" INTEGER,
    "faces_com_via_bicicleta" INTEGER,
    "faces_com_calcada" INTEGER,
    "faces_com_obstaculo" INTEGER,
    "faces_com_rampa" INTEGER,
    "faces_sem_arvores" INTEGER,

    CONSTRAINT "setores_vulnerabilidade_pkey" PRIMARY KEY ("cd_setor","censo_date")
);
