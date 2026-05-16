-- Create categories table
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  weight TEXT,
  servings INTEGER,
  category_name TEXT REFERENCES public.categories(name),
  badge TEXT,
  badge_rust BOOLEAN DEFAULT false,
  image TEXT,
  gallery TEXT[],
  tags TEXT[]
);

-- Insert categories
INSERT INTO public.categories (name) VALUES
  ('PROTEINAS LIMPIAS'),
  ('CREATINAS'),
  ('PROTEINAS HIPERCALORICAS'),
  ('PREENTRENOS'),
  ('AMINOACIDOS'),
  ('QUEMADORES'),
  ('OTROS PRODUCTOS');

-- Insert products
INSERT INTO public.products (id, name, description, price, weight, servings, category_name, badge, badge_rust, image, gallery, tags) VALUES
  (1, 'Whey Pro Isolate', '30 g de proteína ultra-pura por porción. Absorción rápida para recuperación muscular óptima post-entreno.', 89900, '900 g', 30, 'PROTEINAS LIMPIAS', 'Bestseller', false, 'https://images.unsplash.com/photo-1594381898411-846e7b193ebf?w=800&q=80', ARRAY['https://images.unsplash.com/photo-1594381898411-846e7b193ebf?w=800&q=80', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'], ARRAY['mas-vendido', 'sin-lactosa']),
  (2, 'Creatina Mono HCL', 'Creatina micronizada Creapure® de máxima pureza. Aumenta fuerza explosiva y volumen muscular sostenido.', 54900, '300 g', 60, 'CREATINAS', 'Nuevo', true, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'], ARRAY['nuevo']),
  (3, 'Ignite X-Pump', 'Cafeína anhidra, beta-alanina y L-citrulina en dosis efectivas. Energía, resistencia y pump máximos.', 72900, '300 g', 30, 'PREENTRENOS', NULL, false, NULL, NULL, ARRAY['mas-vendido']),
  (4, 'BCAA EAA Fusion', 'Aminoácidos esenciales y ramificados en ratio 8:1:1 para anti-catabolismo y recuperación ultra-rápida.', 62900, '400 g', 40, 'AMINOACIDOS', NULL, false, NULL, NULL, ARRAY['sin-lactosa']),
  (5, 'Mass Gainer Titan', 'Fórmula enriquecida con carbohidratos complejos y proteína concentrada para maximizar la fase de volumen.', 105900, '2 Kg', 25, 'PROTEINAS HIPERCALORICAS', NULL, false, NULL, NULL, ARRAY['nuevo']),
  (6, 'Thermo Shred', 'Complejo termogénico de alta potencia. Aumenta el metabolismo y apoya la quema de grasa sin pérdida muscular.', 68900, '60 cáp', 30, 'QUEMADORES', NULL, false, NULL, NULL, NULL),
  (7, 'Omega 3 Elite', 'Aceite de pescado de alta pureza. Apoyo esencial para articulaciones, salud cardíaca y recuperación.', 45900, '120 cáp', 60, 'OTROS PRODUCTOS', NULL, false, NULL, NULL, ARRAY['sin-lactosa']);

-- Set the sequence to the highest id
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
