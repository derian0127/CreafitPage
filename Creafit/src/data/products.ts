import catalog from './catalog.json';

/**
 * Catálogo versionado: edita `src/data/catalog.json` y sube la versión.
 * Para que el catálogo en `/catalog` cargue el mismo JSON por HTTP, copia el archivo a public:
 *   pnpm run sync-catalog
 * (o manualmente: `cp src/data/catalog.json public/data/catalog.json`).
 */

export type ProductTag = 'nuevo' | 'sin-lactosa' | 'mas-vendido';

export const TAG_LABELS: Record<ProductTag, string> = {
  nuevo: 'Nuevo',
  'sin-lactosa': 'Sin lactosa',
  'mas-vendido': 'Más vendido',
};

export type Category = (typeof catalog.categories)[number];

export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  weight: string;
  servings: number;
  category: Category;
  badge?: string;
  badgeRust?: boolean;
  image?: string;
  /** Miniaturas adicionales (misma pieza o variantes). Si falta, se usa solo `image`. */
  gallery?: string[];
  tags?: ProductTag[];
}

export const CATALOG_VERSION = catalog.version as number;
export const CATEGORIES = catalog.categories as Category[];
export const PRODUCTS = catalog.products as Product[];

/** Lista de URLs para galería: `gallery` o solo `image`. */
export function productImageUrls(p: Product): string[] {
  if (p.gallery?.length) return p.gallery;
  if (p.image) return [p.image];
  return [];
}
