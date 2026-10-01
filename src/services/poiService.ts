import * as poiRepository from "../repositories/poiRepository.js";

export async function listarNoBbox(
  bbox: [number, number, number, number],
  subcategorias: string[],
  limit: number,
) {
  if (subcategorias.length === 0) return [];

  const [minLng, minLat, maxLng, maxLat] = bbox;
  const rows = await poiRepository.listarNoBbox(minLng, minLat, maxLng, maxLat, subcategorias, limit);
  return rows.map((row) => ({
    id: row.id,
    categoria: row.categoria,
    subcategoria: row.subcategoria,
    nome: row.nome,
    fonte: row.fonte,
    metadata: row.metadata,
    localizacao: { lng: row.lng, lat: row.lat },
    shape: row.shapeGeoJson ? JSON.parse(row.shapeGeoJson) : null,
  }));
}

export async function listarCategorias() {
  const rows = await poiRepository.listarCategorias();
  return rows.map((row) => ({
    categoria: row.categoria,
    subcategoria: row.subcategoria,
    total: Number(row.total),
  }));
}
