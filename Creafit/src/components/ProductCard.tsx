import { useRef } from 'react';
import { useCartStore, cop } from '../store/cartStore';
import type { Product } from '../data/products';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

interface Props { product: Product; index: number; }

const ImgPlaceholder = () => (
  <div className={styles.imgPh}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <span>imagen</span>
  </div>
);

export default function ProductCard({ product, index }: Props) {
  const { addItem } = useCartStore();
  const ref = useRef<HTMLDivElement>(null);

  const handleAdd = () => addItem(product.name, product.price, product.image);

  return (
    <div className={styles.card} ref={ref}>
      <div className={styles.num}>0{index + 1}</div>
      {product.badge && (
        <span className={`${styles.badge} ${product.badgeRust ? styles.rust : ''}`}>
          {product.badge}
        </span>
      )}
      <Link to={`/product/${product.id}`} className={styles.img}>
        {product.image
          ? <img src={product.image} alt={product.name} />
          : <ImgPlaceholder />}
        <div className={styles.overlay}>
          <button className={styles.quickAdd} onClick={(e) => { e.preventDefault(); handleAdd(); }}>
            + Añadir al carrito
          </button>
        </div>
      </Link>
      <div className={styles.body}>
        <Link to={`/product/${product.id}`} className={styles.name}>{product.name}</Link>
        <p className={styles.desc}>{product.desc}</p>
        <div className={styles.foot}>
          <div className={styles.price}>
            {cop(product.price)}
            <small>{product.weight} / {product.servings} servicios</small>
          </div>
          <button className={styles.addBtn} onClick={handleAdd}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
