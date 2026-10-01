import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundRoute } from "./middlewares/notFoundRoute.js";
import { routes } from "./routes/index.js";

export const app = express();

// origin:true reflete o Origin da requisição (em vez de fixar um host) — o front roda em
// IPs de rede local variáveis em dev. Com sessão em cookie, credentials:true é obrigatório
// dos dois lados (aqui e no fetch do front) pra o cookie ir e voltar entre domínios.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.use(notFoundRoute);
app.use(errorHandler);
