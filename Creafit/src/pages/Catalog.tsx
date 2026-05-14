import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import {
  PRODUCTS,
  CATEGORIES,
  CATALOG_VERSION,
  type Product,
  type Category,
} from '../data/products';
import ProductCard from '../components/ProductCard';
import CatalogSkeleton from '../components/CatalogSkeleton';
import { Link } from 'react-router-dom';
import styles from './Catalog.module.css';

type Tab = 'ALL' | Category;

export default function Catalog() {
  const [remote, setRemote] = useState<Product[] | null>(null);
  const [tab, setTab] = useState<Tab>('ALL');
  const [query, setQuery] = useState('');
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let ok = true;
    const url = `${import.meta.env.BASE_URL}data/catalog.json?v=${CATALOG_VERSION}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d: { products: Product[] }) => {
        if (ok) setRemote(d.products);
      })
      .catch(() => {
        if (ok) setRemote(PRODUCTS);
      });
    return () => {
      ok = false;
    };
  }, []);

  const list = remote ?? PRODUCTS;
  const loading = remote === null;

  const filtered = useMemo(() => {
    let rows = list;
    if (tab !== 'ALL') rows = rows.filter((p) => p.category === tab);
    const s = query.trim().toLowerCase();
    if (s) rows = rows.filter((p) => p.name.toLowerCase().includes(s));
    return rows;
  }, [list, tab, query]);

  const setTabT = useCallback((next: Tab) => {
    startTransition(() => setTab(next));
  }, []);

  const setQueryT = useCallback((v: string) => {
    startTransition(() => setQuery(v));
  }, []);

  const categoriesWithStock = useMemo(
    () => CATEGORIES.filter((c) => list.some((p) => p.category === c)),
    [list]
  );

  return (
    <div
      style={{
        minHeight: '80vh',
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)',
      }}
    >
      <Link
        to="/"
        style={{
          color: 'var(--muted)',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
          display: 'inline-block',
          borderBottom: '1px solid transparent',
          transition: 'border-color 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = 'var(--lime)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = 'transparent';
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
          Filtra por categoría o busca por nombre. Los datos se cargan desde{' '}
          <code style={{ color: 'var(--lime)', fontSize: '0.85em' }}>/data/catalog.json</code>{' '}
          (versión {CATALOG_VERSION}); al cambiar el archivo en el servidor puedes actualizar el
          catálogo sin tocar el bundle de lógica.
        </p>
      </div>

      {loading ? (
        <CatalogSkeleton />
      ) : (
        <>
          <div className={styles.toolbar}>
            <input
              type="search"
              className={styles.search}
              placeholder="Buscar por nombre…"
              value={query}
              onChange={(e) => setQueryT(e.target.value)}
              aria-label="Buscar productos por nombre"
            />
            <span className={styles.meta}>
              {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Categorías">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'ALL'}
              className={`${styles.tab} ${tab === 'ALL' ? styles.tabActive : ''}`}
              onClick={() => setTabT('ALL')}
            >
              Todas
            </button>
            {categoriesWithStock.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={tab === c}
                className={`${styles.tab} ${tab === c ? styles.tabActive : ''}`}
                onClick={() => setTabT(c)}
              >
                {c.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())}
              </button>
            ))}
          </div>

          <div
            className={`${styles.gridWrap} ${pending ? styles.pending : ''}`}
          >
            {filtered.length === 0 ? (
              <p
                style={{
                  padding: '3rem 1rem',
                  textAlign: 'center',
                  color: 'var(--muted)',
                  fontFamily: 'var(--C)',
                  letterSpacing: '1px',
                }}
              >
                No hay productos con esos criterios. Prueba otra categoría o limpia la búsqueda.
              </p>
            ) : (
              <div className={styles.grid}>
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
