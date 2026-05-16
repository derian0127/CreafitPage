# Optimizaciones internas — Next.js + TypeScript + Vite + Supabase

> Documento de referencia para agente de IA. Aplica estas optimizaciones en orden de impacto: **alto → medio → bajo**.

---

## 1. Rendering y estrategia de componentes

### Server Components (RSC) — alto impacto

- **Mover toda la lógica de fetch a Server Components.** Usar `'use client'` únicamente en componentes que requieran estado (`useState`, `useEffect`) o manejadores de eventos.
- **`generateStaticParams`** para páginas de productos con rutas conocidas en build time → SSG automático.
- **ISR con `revalidate`** para catálogos y listados que cambian con frecuencia moderada:

```ts
// app/products/page.tsx
export const revalidate = 60 // revalida cada 60 segundos
```

- **Streaming con `Suspense` y `loading.tsx`** por segmento de ruta → TTFB inmediato, la UI llega progresivamente sin bloquear el shell.

```tsx
// app/products/loading.tsx
export default function Loading() {
  return <ProductsSkeleton />
}
```

### Cache API de Next.js — alto impacto

- **Tags de revalidación por entidad.** Al mutar datos, llamar `revalidateTag()` para invalidar solo lo necesario:

```ts
import { unstable_cache } from 'next/cache'

const getProducts = unstable_cache(
  async () => supabase.from('products').select('id, name, price, slug'),
  ['products-list'],
  { tags: ['products'], revalidate: 300 }
)

// En Server Action o Route Handler tras una venta/edición:
import { revalidateTag } from 'next/cache'
revalidateTag('products')
```

- **Request deduplication automático en RSC:** `fetch()` con la misma URL dentro de un mismo render tree se deduplica sin código adicional.

---

## 2. Base de datos — Supabase / PostgreSQL

### Query optimization — alto impacto

**Índices obligatorios** en columnas usadas en `.eq()`, `.filter()` o JOINs:

```sql
-- Ejecutar en Supabase SQL Editor
CREATE INDEX idx_orders_user_id     ON orders(user_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_products_category  ON products(category_id);
CREATE INDEX idx_orders_created_at  ON orders(created_at DESC);
```

**Nunca usar `.select('*')`** — siempre selects explícitos:

```ts
// ❌ Malo
const { data } = await supabase.from('products').select('*')

// ✅ Bien
const { data } = await supabase
  .from('products')
  .select('id, name, price, slug, category_id')
```

**Paginación con cursor (keyset) en lugar de offset** para listas grandes:

```ts
// ❌ Offset — lento en páginas altas
.range(page * 20, page * 20 + 19)

// ✅ Keyset — rendimiento constante
.gt('id', lastId).limit(20).order('id')
```

**Mover queries complejas a RPCs (funciones PostgreSQL):**

```sql
CREATE OR REPLACE FUNCTION get_order_summary(p_user_id uuid)
RETURNS TABLE (order_id uuid, total numeric, item_count int) AS $$
  SELECT o.id, o.total, COUNT(oi.id)
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.user_id = p_user_id
  GROUP BY o.id, o.total
$$ LANGUAGE sql STABLE;
```

```ts
const { data } = await supabase.rpc('get_order_summary', { p_user_id: userId })
```

### Conexiones y seguridad

- **Cliente singleton** — no crear instancia en cada request:

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
}
```

- **`SUPABASE_SERVICE_ROLE_KEY` únicamente en server-side** — nunca en variables `NEXT_PUBLIC_*` ni en el cliente de navegador.
- **Realtime solo donde sea estrictamente necesario** — cada suscripción activa consume una conexión WebSocket permanente.

---

## 3. Bundle y carga de assets

### Bundle splitting — medio impacto

**Analizar el bundle antes de optimizar:**

```bash
# next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})

# Ejecutar
ANALYZE=true npm run build
```

**Dynamic imports para rutas pesadas o librerías del cliente:**

```tsx
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/SalesChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})
```

**Tree shaking — importar solo lo que se usa:**

```ts
// ❌ Importa toda la librería
import { format } from 'date-fns'

// ✅ Importa solo el módulo
import format from 'date-fns/format'
```

### Imágenes y fuentes — alto impacto

**`next/image` con `sizes` correcto** (convierte automáticamente a WebP/AVIF):

```tsx
<Image
  src={product.imageUrl}
  alt={product.name}
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold} // true solo en la imagen LCP (hero, primer producto)
/>
```

**`next/font` para fuentes** — elimina layout shift y peticiones externas:

```ts
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
```

---

## 4. TypeScript y arquitectura de código

### Data-access layer centralizado

Nunca hacer fetch directamente en componentes. Toda lógica de Supabase va en `/lib/queries/`:

```
/lib
  /queries
    products.ts   ← todas las queries de productos
    orders.ts     ← todas las queries de pedidos
    users.ts
  /supabase
    server.ts     ← cliente para Server Components
    client.ts     ← cliente para Client Components
```

```ts
// lib/queries/products.ts
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'

export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, description, images')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  },
  ['product-by-slug'],
  { tags: ['products'] }
)
```

### Fetches paralelos con `Promise.all`

```ts
// ❌ Serial — innecesariamente lento
const user     = await getUser(userId)
const products = await getFeaturedProducts()
const cart     = await getCart(userId)

// ✅ Paralelo — corre los tres a la vez
const [user, products, cart] = await Promise.all([
  getUser(userId),
  getFeaturedProducts(),
  getCart(userId),
])
```

### Tipos generados desde Supabase

Mantener los tipos sincronizados con el esquema real de la BD:

```bash
npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
```

```ts
// Usar Database types en todas las queries
import type { Database } from '@/types/supabase'
type Product = Database['public']['Tables']['products']['Row']
```

### Error boundaries por sección

```tsx
// app/products/error.tsx
'use client'
export default function ProductsError({ error, reset }: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <p>Error cargando productos.</p>
      <button onClick={reset}>Reintentar</button>
    </div>
  )
}
```

### Memoización selectiva

Usar `useMemo` y `useCallback` **solo** en cálculos costosos o callbacks que se pasan como props a componentes memorizados:

```ts
// ✅ Tiene sentido: filtrar lista grande
const filteredProducts = useMemo(
  () => products.filter(p => p.categoryId === selectedCategory),
  [products, selectedCategory]
)

// ❌ No tiene sentido: cálculo trivial
const total = useMemo(() => price * quantity, [price, quantity])
```

---

## 5. Checklist de prioridades

| Prioridad | Optimización | Impacto estimado |
|-----------|-------------|-----------------|
| 🔴 Alta | Índices en columnas filtradas en Supabase | Queries 10-100× más rápidas |
| 🔴 Alta | Selects explícitos en todas las queries | Reduce payload de red |
| 🔴 Alta | Server Components para fetches | Elimina waterfalls cliente |
| 🔴 Alta | `next/image` con `priority` en LCP | Core Web Vitals (LCP) |
| 🟡 Media | `revalidateTag` + `unstable_cache` | Menos roundtrips a Supabase |
| 🟡 Media | `Promise.all` para fetches paralelos | -30–60% tiempo de carga |
| 🟡 Media | Dynamic imports en rutas pesadas | Reduce JS inicial |
| 🟡 Media | Centralizar queries en data-access layer | Mantenibilidad + cacheabilidad |
| 🟢 Baja | `supabase gen types` automático en CI | DX + menos errores runtime |
| 🟢 Baja | Bundle analyzer + tree shaking | Depende del bundle actual |
| 🟢 Baja | `next/font` | Elimina layout shift |

---

## 6. Comandos de diagnóstico rápido

```bash
# Analizar bundle
ANALYZE=true npm run build

# Generar tipos de Supabase
npx supabase gen types typescript --project-id <id> > types/supabase.ts

# Ver queries lentas en Supabase
# Dashboard → Reports → Query Performance

# Lighthouse desde terminal
npx lighthouse https://tudominio.com --output html --view
```

---

*Stack: Next.js 14+ (App Router) · TypeScript · Vite · Supabase (PostgreSQL + PostgREST)*
