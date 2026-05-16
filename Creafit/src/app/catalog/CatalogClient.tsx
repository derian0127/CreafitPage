"use client";
import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import styles from './catalog.module.css';
import { type Product } from '@/data/products';

interface Props {
  initialProducts: Product[];
  categories: string[];
}

export default function CatalogClient({ initialProducts, categories }: Props) {
  const [tab, setTab] = useState<string>('ALL');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Efecto de "Searching..." para feedback visual
  useEffect(() => {
    if (query) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [query]);

  const filteredProducts = useMemo(() => {
    let list = initialProducts;
    if (tab !== 'ALL') {
      list = list.filter(p => p.category_name === tab);
    }
    const q = query.toLowerCase().trim();
    if (q) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialProducts, tab, query]);

  return (
    <>
      <div className={styles.toolbar}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <input
            type="search"
            placeholder="Buscar suplemento..."
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <svg 
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3, color: isSearching ? 'var(--lime)' : 'white', transition: 'color 0.2s' }} 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          {isSearching && (
            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
               <div className={styles.spinner} />
            </div>
          )}
        </div>
        <div className={styles.meta}>
          {filteredProducts.length} producto{filteredProducts.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'ALL' ? styles.tabActive : ''}`}
          onClick={() => setTab('ALL')}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tab} ${tab === cat ? styles.tabActive : ''}`}
            onClick={() => setTab(cat)}
          >
            {cat.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className={`${styles.gridWrap} ${isSearching ? styles.pending : ''}`}>
        <div className={styles.grid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <div className={styles.noResults}>
              <div style={{ opacity: 0.2, marginBottom: '1rem' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M10 10l4 4m0-4l-4 4m9 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--C)', fontSize: '1.2rem', color: 'var(--white)', marginBottom: '0.5rem' }}>SIN RESULTADOS</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No encontramos nada para &quot;{query}&quot;. Intenta con otro término.</p>
              <button 
                onClick={() => { setQuery(''); setTab('ALL'); }}
                style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--wire2)', color: 'var(--white)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--C)', fontSize: '0.7rem' }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }
        .${styles.spinner} {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: var(--lime);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </>
  );
}
