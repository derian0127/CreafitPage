-- Actualización de esquema para gestión avanzada
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS badge_type TEXT;

-- Comentario: El campo gallery es un array de URLs
