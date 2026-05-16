import { supabase } from '@/lib/supabaseClient';
import AdminClient from './AdminClient';

export const revalidate = 0; // Disable cache for admin

export default async function AdminPage() {
  const [productsResult, categoriesResult, subsResult] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, description, price, original_price, cost_price, weight, image, gallery, category_name, badge_type, stock_quantity, servings, serving_unit')
      .order('id', { ascending: false }),
    supabase
      .from('categories')
      .select('name'),
    supabase
      .from('newsletter')
      .select('id, email, created_at')
      .order('created_at', { ascending: false }),
  ]);

  const products = productsResult.data || [];
  const categories = categoriesResult.data?.map(c => c.name) || [];
  const subscribers = subsResult.data || [];

  return (
    <AdminClient 
      initialProducts={products} 
      categories={categories} 
      initialSubscribers={subscribers} 
    />
  );
}
