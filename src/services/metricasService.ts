import * as eventoUsoRepository from "../repositories/eventoUsoRepository.js";

/** Ações somadas no card de métricas por tipo — os outros valores de `acao` (erro, logout, pois_visualizados) não entram aqui por enquanto. */
const ACOES_METRICA = ["login", "setor_selecionado", "comparacao_criada"];
const LIMITE_EVENTOS_RECENTES = 30;

/** Segunda-feira 00:00 da semana atual (hora do próprio servidor). */
function inicioDaSemanaAtual(): Date {
  const agora = new Date();
  const diaSemana = agora.getDay(); // 0 = domingo, 1 = segunda, ...
  const diasDesdeSegunda = (diaSemana + 6) % 7;
  const inicio = new Date(agora);
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() - diasDesdeSegunda);
  return inicio;
}

export interface MetricasAdmin {
  usuariosAtivosSemana: number;
  eventosPorAcao: Array<{ acao: string; total: number }>;
  ultimosEventos: Array<{
    id: number;
    acao: string;
    usuario: string | null;
    criadoEm: string;
  }>;
}

export async function buscar(): Promise<MetricasAdmin> {
  const desde = inicioDaSemanaAtual();

  const [usuariosAtivosSemana, porAcao, recentes] = await Promise.all([
    eventoUsoRepository.contarUsuariosAtivosDesde(desde),
    eventoUsoRepository.contarPorAcaoDesde(desde, ACOES_METRICA),
    eventoUsoRepository.listarRecentes(LIMITE_EVENTOS_RECENTES),
  ]);

  return {
    usuariosAtivosSemana,
    eventosPorAcao: ACOES_METRICA.map((acao) => ({ acao, total: porAcao[acao] ?? 0 })),
    ultimosEventos: recentes.map((e) => ({
      id: e.id,
      acao: e.acao,
      usuario: e.usuarioNome ?? e.usuarioEmail,
      criadoEm: e.createdAt.toISOString(),
    })),
  };
}
