import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductDetailsClient from './ProductDetailsClient';

// Selects explícitos para reducir payload de red
const PRODUCT_FIELDS = 'id, name, description, price, original_price, weight, image, gallery, category_name, badge_type, stock_quantity, servings, serving_unit';
const RELATED_FIELDS = 'id, name, price, original_price, image, gallery, badge_type, stock_quantity';
const METADATA_FIELDS = 'id, name, description, image';

export const revalidate = 60;

// Pre-renderiza las páginas de producto en build time (SSG)
export async function generateStaticParams() {
  const { data: products } = await supabase
    .from('products')
    .select('id');

  return (products || []).map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await supabase
    .from('products')
    .select(METADATA_FIELDS)
    .eq('id', id)
    .single();

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.name} · CREAFIT`,
    description: product.description,
    openGraph: {
      title: `${product.name} · CREAFIT`,
      description: product.description,
      images: [product.image || ''],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Buscamos el producto actual
  const { data: product, error } = await supabase
    .from('products')
    .select(PRODUCT_FIELDS)
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  // 2. Buscamos productos relacionados (misma categoría, excluyendo el actual)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(RELATED_FIELDS)
    .eq('category_name', product.category_name)
    .neq('id', id)
    .limit(4);

  const formattedProduct = {
    ...product,
    desc: product.description,
  };

  return (
    <ProductDetailsClient 
      product={formattedProduct} 
      relatedProducts={relatedProducts || []} 
    />
  );
}
