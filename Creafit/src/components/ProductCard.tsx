"use client";
import { useRef } from 'react';
import { useCartStore, cop } from '../store/cartStore';
import {
  productImageUrls,
  TAG_LABELS,
  type Product,
} from '../data/products';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { FadeIn } from './Motion';

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
  const imgs = productImageUrls(product);
  const mainImg = imgs[0];

  const handleAdd = () => addItem(product.name, product.price, mainImg);

  return (
    <FadeIn delay={index * 0.05}>
      <div className={styles.card} ref={ref}>
        <div className={styles.num}>0{index + 1}</div>
        
        {(product.stock_quantity ?? 0) <= 0 ? (
          <span className={styles.badge} style={{ background: '#ff4444', color: 'white' }}>
            AGOTADO
          </span>
        ) : product.badge_type ? (
          <span className={`${styles.badge} ${product.badge_type === 'HOT SALE' ? styles.rust : ''}`}>
            {product.badge_type}
          </span>
        ) : product.badge ? (
          <span className={`${styles.badge} ${product.badgeRust ? styles.rust : ''}`}>
            {product.badge}
          </span>
        ) : null}

        <Link href={`/product/${product.id}`} className={styles.img}>
          {mainImg ? (
            <>
              <Image 
                src={mainImg} 
                alt={product.name} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.primaryImg}
                style={{ objectFit: 'contain' }}
              />
              {imgs.length > 1 && (
                <Image 
                  src={imgs[1]} 
                  alt={`${product.name} - vista secundaria`} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.secondaryImg}
                  style={{ objectFit: 'contain' }}
                />
              )}
            </>
          ) : (
            <ImgPlaceholder />
          )}
          <div className={styles.overlay}>
            <button 
              className={styles.quickAdd} 
              disabled={(product.stock_quantity ?? 0) <= 0}
              onClick={(e) => { e.preventDefault(); handleAdd(); }}
            >
              {(product.stock_quantity ?? 0) <= 0 ? 'Sin existencias' : '+ Añadir al carrito'}
            </button>
          </div>
        </Link>
      <div className={styles.body}>
        <Link href={`/product/${product.id}`} className={styles.name}>{product.name}</Link>
        {product.tags && product.tags.length > 0 && (
          <div className={styles.tags} aria-label="Etiquetas del producto">
            {product.tags.map((t) => (
              <span key={t} className={styles.tag}>
                {TAG_LABELS[t]}
              </span>
            ))}
          </div>
        )}
        <p className={styles.desc}>{product.description || product.desc}</p>
        <div className={styles.foot}>
          <div className={styles.price}>
            {product.original_price && product.original_price > product.price && (
              <span style={{ 
                textDecoration: 'line-through', 
                color: 'var(--muted)', 
                fontSize: '0.75rem', 
                marginRight: '0.5rem',
                display: 'block',
                fontFamily: 'var(--B)'
              }}>
                {cop(product.original_price)}
              </span>
            )}
            {cop(product.price)}
            <small>{product.weight} / {product.servings} servicios</small>
          </div>
          <button 
            className={styles.addBtn} 
            onClick={handleAdd}
            disabled={(product.stock_quantity ?? 0) <= 0}
            style={{ opacity: (product.stock_quantity ?? 0) <= 0 ? 0.5 : 1 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {(product.stock_quantity ?? 0) <= 0 ? 'Agotado' : 'Añadir'}
          </button>
        </div>
      </div>
      </div>
    </FadeIn>
  );
}
