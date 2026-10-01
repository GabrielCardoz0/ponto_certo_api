import * as setorRepository from "../repositories/setorRepository.js";
import { unscale } from "../config/scale.js";
import { NotFoundError, ValidationError } from "../middlewares/AppError.js";
import type { SetorDetalheRow, SetorResumoRow } from "../types/setor.js";

function mapResumo(row: SetorResumoRow) {
  return {
    cdSetor: row.cdSetor,
    censoDate: row.censoDate,
    cdMunicipio: row.cdMunicipio,
    nmMunicipio: row.nmMunicipio,
    uf: row.uf,
    regiao: row.regiao,
    localizacao: { lng: row.lng, lat: row.lat },
  };
}

const FAIXAS_ETARIAS = [
  ["0-4", "idade0a4"],
  ["5-9", "idade5a9"],
  ["10-14", "idade10a14"],
  ["15-19", "idade15a19"],
  ["20-24", "idade20a24"],
  ["25-29", "idade25a29"],
  ["30-39", "idade30a39"],
  ["40-49", "idade40a49"],
  ["50-59", "idade50a59"],
  ["60-69", "idade60a69"],
  ["70+", "idade70Mais"],
] as const;

/** null quando o setor não tem linha em setores_demografia. Valores são contagens brutas. */
function mapDemografia(row: SetorDetalheRow) {
  if (!row.temDemografia) return null;
  return {
    sexo: { masculina: row.populacaoMasculina, feminina: row.populacaoFeminina },
    piramideEtaria: FAIXAS_ETARIAS.map(([faixa, campo]) => ({ faixa, total: row[campo] })),
    raca: {
      branca: row.populacaoBranca,
      preta: row.populacaoPreta,
      amarela: row.populacaoAmarela,
      parda: row.populacaoParda,
      indigena: row.populacaoIndigena,
    },
    alfabetizacao: {
      alfabetizados: row.alfabetizados15Mais,
      naoAlfabetizados: row.naoAlfabetizados15Mais,
    },
  };
}

/**
 * null quando o setor não tem linha em setores_vulnerabilidade. Contagens brutas de domicílios
 * (o percentual é sobre `domiciliosOcupados`, feito na exibição). `entorno` é null em setor
 * rural — só setor urbano tem dado de face de quadra.
 */
function mapVulnerabilidade(row: SetorDetalheRow) {
  if (!row.temVulnerabilidade) return null;
  return {
    saneamento: {
      aguaRede: row.domiciliosAguaRede,
      esgotoRede: row.domiciliosEsgotoRede,
      lixoColetado: row.domiciliosLixoColetado,
    },
    tipoDomicilio: {
      casa: row.domiciliosCasa,
      casaCondominio: row.domiciliosCasaCondominio,
      apartamento: row.domiciliosApartamento,
      precario: row.domiciliosPrecario,
    },
    banheiro: { com: row.domiciliosComBanheiro, sem: row.domiciliosSemBanheiro },
    entorno:
      row.facesTotal === null
        ? null
        : {
            facesTotal: row.facesTotal,
            comPavimentacao: row.facesComPavimentacao,
            comBueiro: row.facesComBueiro,
            comIluminacao: row.facesComIluminacao,
            comPontoOnibus: row.facesComPontoOnibus,
            comViaBicicleta: row.facesComViaBicicleta,
            comCalcada: row.facesComCalcada,
            comObstaculo: row.facesComObstaculo,
            comRampa: row.facesComRampa,
            semArvores: row.facesSemArvores,
          },
  };
}

function mapDetalhe(row: SetorDetalheRow) {
  return {
    ...mapResumo(row),
    situacao: row.situacao,
    populacao: row.populacao,
    areaKm2: unscale("areaKm2", row.areaKm2),
    rendaMedia: unscale("rendaMedia", row.rendaMedia),
    rendaMediana: unscale("rendaMediana", row.rendaMediana),
    densidadeHabKm2: unscale("densidadeHabKm2", row.densidadeHabKm2),
    tamanhoMedioFamilia: unscale("tamanhoMedioFamilia", row.tamanhoMedioFamilia),
    desvioPadraoRenda: unscale("desvioPadraoRenda", row.desvioPadraoRenda),
    coefVariacaoRenda: unscale("coefVariacaoRenda", row.coefVariacaoRenda),
    domiciliosOcupados: row.domiciliosOcupados,
    domiciliosUsoOcasional: row.domiciliosUsoOcasional,
    domiciliosVagos: row.domiciliosVagos,
    demografia: mapDemografia(row),
    vulnerabilidade: mapVulnerabilidade(row),
  };
}

export type SetorDetalheDTO = ReturnType<typeof mapDetalhe>;

export async function buscar(q: string, limit: number) {
  const rows = await setorRepository.buscar(q, limit);
  return rows.map(mapResumo);
}

export async function detalhar(cdSetor: string): Promise<SetorDetalheDTO> {
  const row = await setorRepository.buscarMaisRecente(cdSetor);
  if (!row) {
    throw new NotFoundError(`Setor censitário "${cdSetor}" não encontrado`);
  }
  return mapDetalhe(row);
}

export async function localizarPorPonto(lng: number, lat: number): Promise<SetorDetalheDTO> {
  const row = await setorRepository.buscarPorPonto(lng, lat);
  if (!row) {
    throw new NotFoundError(`Nenhum setor censitário encontrado para o ponto (${lat}, ${lng})`);
  }
  return mapDetalhe(row);
}

export async function listarPois(
  cdSetor: string,
  raioMetros: number,
  categoria: string | undefined,
  limit: number,
) {
  const existe = await setorRepository.existe(cdSetor);
  if (!existe) {
    throw new NotFoundError(`Setor censitário "${cdSetor}" não encontrado`);
  }

  const rows = await setorRepository.listarPoisNoRaio(cdSetor, raioMetros, categoria, limit);
  return rows.map((row) => ({
    id: row.id,
    categoria: row.categoria,
    subcategoria: row.subcategoria,
    nome: row.nome,
    fonte: row.fonte,
    metadata: row.metadata,
    localizacao: { lng: row.lng, lat: row.lat },
    distanciaM: Math.round(row.distanciaM),
    shape: row.shapeGeoJson ? JSON.parse(row.shapeGeoJson) : null,
  }));
}

export async function relatorio(cdSetor: string, raioMetros: number) {
  const setor = await detalhar(cdSetor);
  const contagem = await setorRepository.contarPoisPorCategoria(cdSetor, raioMetros);

  return {
    setor,
    raioMetros,
    poisPorCategoria: contagem.map((row) => ({
      categoria: row.categoria,
      subcategoria: row.subcategoria,
      total: Number(row.total),
    })),
  };
}

const MAX_SETORES_COMPARACAO = 10;
const RAIO_COMPARACAO_METROS = 1000;

export async function comparar(cdSetores: string[]) {
  if (cdSetores.length === 0) {
    throw new ValidationError("Informe ao menos um setor para comparar");
  }
  if (cdSetores.length > MAX_SETORES_COMPARACAO) {
    throw new ValidationError(`No máximo ${MAX_SETORES_COMPARACAO} setores por comparação`);
  }
  if (new Set(cdSetores).size !== cdSetores.length) {
    throw new ValidationError("Os setores comparados devem ser diferentes entre si");
  }

  const setores = await Promise.all(
    cdSetores.map(async (cdSetor) => {
      const [setor, contagem, maisProximos] = await Promise.all([
        detalhar(cdSetor),
        setorRepository.contarPoisPorCategoria(cdSetor, RAIO_COMPARACAO_METROS),
        setorRepository.listarPoiMaisProximoPorCategoria(cdSetor),
      ]);
      return {
        ...setor,
        poisPorCategoria: contagem.map((row) => ({
          categoria: row.categoria,
          subcategoria: row.subcategoria,
          total: Number(row.total),
        })),
        poiMaisProximo: maisProximos.map((row) => ({
          categoria: row.categoria,
          subcategoria: row.subcategoria,
          distanciaM: Math.round(row.distanciaM),
        })),
      };
    }),
  );

  return { raioMetros: RAIO_COMPARACAO_METROS, setores };
}

export async function similares(cdSetor: string, limit: number, raioExclusaoMetros: number) {
  const existe = await setorRepository.existe(cdSetor);
  if (!existe) {
    throw new NotFoundError(`Setor censitário "${cdSetor}" não encontrado`);
  }

  const possuiPerfil = await setorRepository.possuiPerfil(cdSetor);
  if (!possuiPerfil) {
    throw new ValidationError(
      `Setor censitário "${cdSetor}" ainda não possui perfil de market matching calculado`,
    );
  }

  const rows = await setorRepository.listarSimilares(cdSetor, raioExclusaoMetros, limit);
  return rows.map((row) => ({
    ...mapResumo(row),
    distancia: row.distancia,
  }));
}
