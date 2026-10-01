/*
  Warnings:

  - You are about to drop the `setores_censitarios_raw` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "idx_pois_geom";

-- DropIndex
DROP INDEX "idx_setores_censo_date";

-- DropIndex
DROP INDEX "idx_setores_geom";

-- DropIndex
DROP INDEX "idx_setores_perfil";

-- DropTable
DROP TABLE "setores_censitarios_raw";
