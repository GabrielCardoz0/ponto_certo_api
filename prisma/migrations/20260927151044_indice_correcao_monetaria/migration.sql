-- CreateTable
CREATE TABLE "indices_correcao_monetaria" (
    "id" SERIAL NOT NULL,
    "indice" TEXT NOT NULL,
    "mes_referencia" DATE NOT NULL,
    "fator_acumulado" DECIMAL(10,6) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indices_correcao_monetaria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "indices_correcao_monetaria_indice_mes_referencia_key" ON "indices_correcao_monetaria"("indice", "mes_referencia");
