import { prisma } from "../config/prisma.js";
import type { PoiCategoriaRow, PoiMapaRow } from "../types/poi.js";

export async function listarNoBbox(
  minLng: number,
  minLat: number,
  maxLng: number,
  maxLat: number,
  subcategorias: string[],
  limit: number,
): Promise<PoiMapaRow[]> {
  return prisma.$queryRaw<PoiMapaRow[]>`
    SELECT
      id,
      categoria,
      subcategoria,
      nome,
      fonte,
      metadata,
      ST_X(geom) AS lng,
      ST_Y(geom) AS lat,
      ST_AsGeoJSON(shape) AS "shapeGeoJson"
    FROM pois
    WHERE geom && ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326)
      AND subcategoria = ANY(${subcategorias}::text[])
    LIMIT ${limit}
  `;
}

export async function listarCategorias(): Promise<PoiCategoriaRow[]> {
  return prisma.$queryRaw<PoiCategoriaRow[]>`
    SELECT categoria, subcategoria, count(*) AS total
    FROM pois
    GROUP BY categoria, subcategoria
    ORDER BY categoria, subcategoria
  `;
}
