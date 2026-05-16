import catalog from './catalog.json';

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
  desc?: string;
  description?: string;
  price: number;
  original_price?: number;
  weight?: string;
  servings?: number;
  serving_unit?: string;
  category_name?: Category;
  badge?: string;
  badge_type?: string;
  badgeRust?: boolean;
  image?: string;
  gallery?: string[];
  tags?: ProductTag[];
  stock_quantity?: number;
}

export const CATALOG_VERSION = catalog.version as number;
export const CATEGORIES = catalog.categories as Category[];
export const PRODUCTS = catalog.products as Product[];

export function productImageUrls(p: Product): string[] {
  if (p.gallery?.length) return p.gallery;
  if (p.image) return [p.image];
  return [];
}
