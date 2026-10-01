-- CreateIndex
CREATE INDEX "pois_geom_gist_idx" ON "pois" USING GIST ("geom");
