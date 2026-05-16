-- ======================================================
-- Índices de rendimiento para Creafit — Supabase / PostgreSQL
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ======================================================

-- Productos: filtrado por categoría (catálogo con filtros)
CREATE INDEX IF NOT EXISTS idx_products_category
  ON products (category_name);

-- Productos: orden de presentación por defecto
CREATE INDEX IF NOT EXISTS idx_products_id_asc
  ON products (id ASC);

-- Productos: filtrar por stock (mostrar agotados u ocultar)
CREATE INDEX IF NOT EXISTS idx_products_stock
  ON products (stock_quantity);

-- Newsletter: orden cronológico para la lista de admin
CREATE INDEX IF NOT EXISTS idx_newsletter_created_at
  ON newsletter (created_at DESC);

-- Verificar los índices creados
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('products', 'newsletter')
ORDER BY tablename, indexname;
