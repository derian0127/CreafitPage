import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PRODUCTS,
  productImageUrls,
  type Product,
} from '../data/products';
import { useCartStore, cop } from '../store/cartStore';
import { applyProductMeta, clearProductMeta } from '../lib/productMeta';
import { showToast } from '../lib/toastBus';

function ProductMedia({
  product,
  onChangeMain,
}: {
  product: Product;
  onChangeMain: (url: string | undefined) => void;
}) {
  const imgs = useMemo(() => productImageUrls(product), [product]);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const origin = window.location.origin;
    const path = `/product/${product.id}`;
    const cur = imgs[imgIdx] ?? imgs[0];
    const imageUrl = cur
      ? cur.startsWith('http')
        ? cur
        : `${origin}${cur.startsWith('/') ? '' : '/'}${cur}`
      : undefined;
    applyProductMeta({
      title: `${product.name} · CREAFIT`,
      description: product.desc,
      imageUrl,
      path,
    });
    return () => clearProductMeta('CREAFIT');
  }, [product, imgs, imgIdx]);

  useEffect(() => {
    onChangeMain(imgs[imgIdx] ?? imgs[0]);
  }, [imgs, imgIdx, onChangeMain]);

  const mainSrc = imgs[imgIdx] ?? imgs[0];

  return (
    <div>
      <div
        style={{
          background: 'var(--ink3)',
          border: '1px solid var(--wire)',
          borderRadius: 'var(--r)',
          aspectRatio: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {mainSrc ? (
          <img
            src={mainSrc}
            alt={`${product.name} — imagen ${imgIdx + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ color: 'var(--muted)', textAlign: 'center', opacity: 0.5 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p style={{ marginTop: '1rem', fontFamily: 'var(--C)', letterSpacing: '2px', fontSize: '0.8rem' }}>
              IMAGEN DEL PRODUCTO
            </p>
          </div>
        )}
      </div>
      {imgs.length > 1 && (
        <div
          style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}
          role="tablist"
          aria-label="Galería de imágenes"
        >
          {imgs.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="tab"
              aria-selected={i === imgIdx}
              aria-label={`Miniatura ${i + 1}`}
              onClick={() => setImgIdx(i)}
              style={{
                width: 72,
                height: 72,
                padding: 0,
                border: i === imgIdx ? '2px solid var(--lime)' : '1px solid var(--wire2)',
                borderRadius: 'var(--r)',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'var(--ink2)',
                opacity: i === imgIdx ? 1 : 0.75,
              }}
            >
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  const { addItem } = useCartStore();
  const [mainForCart, setMainForCart] = useState<string | undefined>(undefined);

  if (!product) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--white)',
        }}
      >
        <h2>Producto no encontrado</h2>
        <Link to="/catalog" style={{ color: 'var(--lime)', marginTop: '1rem', textDecoration: 'underline' }}>
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const handleAdd = () =>
    addItem(product.name, product.price, mainForCart ?? productImageUrls(product)[0]);

  const shareProduct = async () => {
    const origin = window.location.origin;
    const url = `${origin}/product/${product.id}?utm_source=share&utm_medium=product&utm_campaign=user`;
    const title = `${product.name} · CREAFIT`;
    const text = product.desc.slice(0, 120);
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showToast('Enlace con UTM copiado al portapapeles.');
      } else {
        showToast('Copia la URL desde la barra del navegador.');
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        showToast('Enlace copiado al portapapeles.');
      } catch {
        showToast('No se pudo compartir; copia la URL de la barra del navegador.');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        alignItems: 'start',
      }}
    >
      <ProductMedia key={product.id} product={product} onChangeMain={setMainForCart} />

      <div>
        <Link
          to="/catalog"
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
          ← Catálogo
        </Link>
        <h1
          style={{
            fontFamily: 'var(--C)',
            fontSize: '3rem',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          {product.name}
        </h1>
        <p style={{ color: 'var(--lime)', fontFamily: 'var(--D)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          {cop(product.price)}
        </p>

        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>{product.desc}</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2.5rem',
            borderTop: '1px solid var(--wire)',
            borderBottom: '1px solid var(--wire)',
            padding: '1.5rem 0',
          }}
        >
          <div>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '0.3rem',
              }}
            >
              Peso
            </p>
            <p style={{ fontFamily: 'var(--B)', fontSize: '1.1rem' }}>{product.weight}</p>
          </div>
          <div>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '0.3rem',
              }}
            >
              Servicios
            </p>
            <p style={{ fontFamily: 'var(--B)', fontSize: '1.1rem' }}>{product.servings}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleAdd}
            style={{
              width: '100%',
              background: 'var(--lime)',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--r)',
              padding: '1.2rem',
              fontFamily: 'var(--D)',
              fontSize: '1.1rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'transform 0.25s, background 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
            }}
          >
            Añadir al carrito
          </button>
          <button
            type="button"
            onClick={shareProduct}
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--white)',
              border: '1px solid var(--wire2)',
              borderRadius: 'var(--r)',
              padding: '1.2rem',
              fontFamily: 'var(--C)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--lime)';
              e.currentTarget.style.color = 'var(--lime)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--wire2)';
              e.currentTarget.style.color = 'var(--white)';
            }}
          >
            Compartir enlace
          </button>
        </div>
      </div>
    </div>
  );
}
