import { supabase } from '../lib/supabaseClient';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

export default async function ProductGrid() {
  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, price, original_price, image, gallery, badge_type, stock_quantity, weight, servings')
    .order('id', { ascending: true })
    .limit(4);

  return (
    <section id="productos" className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className="sec-lbl">Catálogo</p>
          <h2 className="sec-t">El Arsenal<br/>del <em>Atleta</em></h2>
        </div>
        <p className={styles.tagline}>Dosis efectivas. Ingredientes transparentes. Sin rellenos.</p>
      </div>
      <div className={styles.grid}>
        {products?.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}
