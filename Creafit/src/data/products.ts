export type Category = 
  | 'PROTEINAS LIMPIAS'
  | 'CREATINAS'
  | 'PROTEINAS HIPERCALORICAS'
  | 'PREENTRENOS'
  | 'AMINOACIDOS'
  | 'QUEMADORES'
  | 'OTROS PRODUCTOS';

export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  weight: string;
  servings: number;
  category: Category;      // <-- Nueva propiedad
  badge?: string;
  badgeRust?: boolean;
  image?: string;
}

export const CATEGORIES: Category[] = [
  'PROTEINAS LIMPIAS',
  'CREATINAS',
  'PROTEINAS HIPERCALORICAS',
  'PREENTRENOS',
  'AMINOACIDOS',
  'QUEMADORES',
  'OTROS PRODUCTOS',
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Whey Pro Isolate',
    desc: '30 g de proteína ultra-pura por porción. Absorción rápida para recuperación muscular óptima post-entreno.',
    price: 89900,
    weight: '900 g',
    servings: 30,
    badge: 'Bestseller',
    category: 'PROTEINAS LIMPIAS',
  },
  {
    id: 2,
    name: 'Creatina Mono HCL',
    desc: 'Creatina micronizada Creapure® de máxima pureza. Aumenta fuerza explosiva y volumen muscular sostenido.',
    price: 54900,
    weight: '300 g',
    servings: 60,
    badge: 'Nuevo',
    badgeRust: true,
    category: 'CREATINAS',
  },
  {
    id: 3,
    name: 'Ignite X-Pump',
    desc: 'Cafeína anhidra, beta-alanina y L-citrulina en dosis efectivas. Energía, resistencia y pump máximos.',
    price: 72900,
    weight: '300 g',
    servings: 30,
    category: 'PREENTRENOS',
  },
  {
    id: 4,
    name: 'BCAA EAA Fusion',
    desc: 'Aminoácidos esenciales y ramificados en ratio 8:1:1 para anti-catabolismo y recuperación ultra-rápida.',
    price: 62900,
    weight: '400 g',
    servings: 40,
    category: 'AMINOACIDOS',
  },
  {
    id: 5,
    name: 'Mass Gainer Titan',
    desc: 'Fórmula enriquecida con carbohidratos complejos y proteína concentrada para maximizar la fase de volumen.',
    price: 105900,
    weight: '2 Kg',
    servings: 25,
    category: 'PROTEINAS HIPERCALORICAS',
  },
  {
    id: 6,
    name: 'Thermo Shred',
    desc: 'Complejo termogénico de alta potencia. Aumenta el metabolismo y apoya la quema de grasa sin pérdida muscular.',
    price: 68900,
    weight: '60 cáp',
    servings: 30,
    category: 'QUEMADORES',
  },
  {
    id: 7,
    name: 'Omega 3 Elite',
    desc: 'Aceite de pescado de alta pureza. Apoyo esencial para articulaciones, salud cardíaca y recuperación.',
    price: 45900,
    weight: '120 cáp',
    servings: 60,
    category: 'OTROS PRODUCTOS',
  }
];
