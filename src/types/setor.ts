export interface SetorResumoRow {
  cdSetor: string;
  censoDate: Date;
  cdMunicipio: string | null;
  nmMunicipio: string | null;
  uf: string | null;
  regiao: string | null;
  lng: number;
  lat: number;
}

export interface SetorDetalheRow extends SetorResumoRow {
  situacao: string | null;
  areaKm2: number;
  populacao: number | null;
  rendaMedia: number | null;
  rendaMediana: number | null;
  densidadeHabKm2: number | null;
  tamanhoMedioFamilia: number | null;
  desvioPadraoRenda: number | null;
  coefVariacaoRenda: number | null;
  domiciliosOcupados: number | null;
  domiciliosUsoOcasional: number | null;
  domiciliosVagos: number | null;

  /** false quando o setor não tem linha em setores_demografia (LEFT JOIN vazio). */
  temDemografia: boolean;
  populacaoMasculina: number | null;
  populacaoFeminina: number | null;
  idade0a4: number | null;
  idade5a9: number | null;
  idade10a14: number | null;
  idade15a19: number | null;
  idade20a24: number | null;
  idade25a29: number | null;
  idade30a39: number | null;
  idade40a49: number | null;
  idade50a59: number | null;
  idade60a69: number | null;
  idade70Mais: number | null;
  populacaoBranca: number | null;
  populacaoPreta: number | null;
  populacaoAmarela: number | null;
  populacaoParda: number | null;
  populacaoIndigena: number | null;
  alfabetizados15Mais: number | null;
  naoAlfabetizados15Mais: number | null;

  /** false quando o setor não tem linha em setores_vulnerabilidade (LEFT JOIN vazio). */
  temVulnerabilidade: boolean;
  domiciliosAguaRede: number | null;
  domiciliosEsgotoRede: number | null;
  domiciliosLixoColetado: number | null;
  domiciliosCasa: number | null;
  domiciliosCasaCondominio: number | null;
  domiciliosApartamento: number | null;
  domiciliosPrecario: number | null;
  domiciliosComBanheiro: number | null;
  domiciliosSemBanheiro: number | null;
  facesTotal: number | null;
  facesComPavimentacao: number | null;
  facesComBueiro: number | null;
  facesComIluminacao: number | null;
  facesComPontoOnibus: number | null;
  facesComViaBicicleta: number | null;
  facesComCalcada: number | null;
  facesComObstaculo: number | null;
  facesComRampa: number | null;
  facesSemArvores: number | null;
}

export interface PoiRow {
  id: number;
  categoria: string;
  subcategoria: string;
  nome: string;
  fonte: string;
  metadata: unknown;
  lng: number;
  lat: number;
  distanciaM: number;
  shapeGeoJson: string | null;
}

export interface PoiMaisProximoRow {
  categoria: string;
  subcategoria: string;
  distanciaM: number;
}

export interface PoiContagemRow {
  categoria: string;
  subcategoria: string;
  total: bigint;
}

export interface SetorSimilarRow extends SetorResumoRow {
  distancia: number;
}
