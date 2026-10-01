-- CreateIndex
CREATE INDEX "setores_censitarios_geom_gist_idx" ON "setores_censitarios" USING GIST ("geom");
