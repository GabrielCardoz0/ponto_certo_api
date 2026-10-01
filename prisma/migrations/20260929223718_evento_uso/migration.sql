-- AlterTable
ALTER TABLE "users" RENAME CONSTRAINT "usuarios_pkey" TO "users_pkey";

-- CreateTable
CREATE TABLE "eventos_uso" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "acao" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_uso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "eventos_uso_user_id_acao_idx" ON "eventos_uso"("user_id", "acao");

-- CreateIndex
CREATE INDEX "eventos_uso_created_at_idx" ON "eventos_uso"("created_at");

-- AddForeignKey
ALTER TABLE "eventos_uso" ADD CONSTRAINT "eventos_uso_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "usuarios_email_key" RENAME TO "users_email_key";
