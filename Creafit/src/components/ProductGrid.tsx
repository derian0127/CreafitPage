import { PRODUCTS } from '../data/products';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid() {
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
        {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}
