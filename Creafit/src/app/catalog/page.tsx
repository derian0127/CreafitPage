import { supabase } from '@/lib/supabaseClient';
import CatalogClient from './CatalogClient';
import Link from 'next/link';

export const revalidate = 60;

const PRODUCT_FIELDS = 'id, name, description, price, original_price, weight, image, gallery, category_name, badge_type, stock_quantity, servings, serving_unit';

export default async function CatalogPage() {
  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select(PRODUCT_FIELDS)
      .order('id', { ascending: false }),
    supabase
      .from('categories')
      .select('name'),
  ]);

  const { data: products, error } = productsResult;
  const categories = categoriesResult.data?.map(c => c.name) || [];

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div
      style={{
        minHeight: '80vh',
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)',
      }}
    >
      <Link
        href="/"
        style={{
          color: 'var(--muted)',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
          display: 'inline-block',
          borderBottom: '1px solid transparent',
          transition: 'border-color 0.2s',
        }}
      >
        ← Volver a inicio
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <p className="sec-lbl">Arsenal completo</p>
        <h1 className="sec-t" style={{ fontSize: '3rem', margin: '0 0 0.5rem 0' }}>
          CATÁLOGO
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: '520px', lineHeight: 1.7 }}>
          Aquí encuentras todos los productos disponibles en nuestra tienda, actualizados en tiempo real desde Supabase.
        </p>
      </div>
      
      <CatalogClient initialProducts={products || []} categories={categories} />
    </div>
  );
}
