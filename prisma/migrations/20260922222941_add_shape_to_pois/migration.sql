-- CreateIndex
CREATE INDEX "pois_shape_gist_idx" ON "pois" USING GIST ("shape");
