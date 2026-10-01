export interface PoiMapaRow {
  id: number;
  categoria: string;
  subcategoria: string;
  nome: string | null;
  fonte: string;
  metadata: unknown;
  lng: number;
  lat: number;
  shapeGeoJson: string | null;
}

export interface PoiCategoriaRow {
  categoria: string;
  subcategoria: string;
  total: bigint;
}
