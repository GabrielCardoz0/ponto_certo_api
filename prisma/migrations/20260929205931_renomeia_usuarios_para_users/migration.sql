-- Renomeia a tabela sem apagar os dados (o diff automático do Prisma faria DROP + CREATE,
-- que perderia as linhas existentes).
ALTER TABLE "usuarios" RENAME TO "users";
