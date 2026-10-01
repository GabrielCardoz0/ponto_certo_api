# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma7.config.ts tsconfig.json ./
# O client gerado (generated/prisma) é gitignored, então precisa ser gerado aqui.
RUN npx prisma generate --config prisma7.config.ts

COPY src ./src
RUN npm run build


FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# node_modules completo de propósito: src/config/env.ts importa "dotenv/config", que hoje
# só existe como dependência transitiva do prisma (devDependency). Se adicionar dotenv em
# "dependencies", dá para trocar por `npm ci --omit=dev` e reduzir a imagem.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY prisma ./prisma
COPY prisma7.config.ts ./

USER node
EXPOSE 3000
CMD ["node", "dist/src/server.js"]
