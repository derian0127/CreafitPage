-- Tabla para configuraciones sensibles (como la contraseña del admin)
CREATE TABLE IF NOT EXISTS admin_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insertamos la contraseña inicial (puedes cambiarla luego en Supabase)
INSERT INTO admin_config (key, value) 
VALUES ('admin_password', 'creafit2025')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Desactivamos acceso público a esta tabla
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;
-- Solo permitimos lectura desde el servidor (no hay políticas públicas)
