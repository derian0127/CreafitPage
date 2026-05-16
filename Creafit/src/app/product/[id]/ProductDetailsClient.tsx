"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore, cop } from '@/store/cartStore';
import ProductCard from '@/components/ProductCard';

function ProductMedia({ product, onChangeMain }: { product: any; onChangeMain: (url: string | undefined) => void; }) {
  const imgs = useMemo(() => {
    const list = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
    return list.filter(Boolean);
  }, [product]);
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const mainSrc = imgs[imgIdx] ?? imgs[0];
  const nextSrc = imgs.length > 1 ? imgs[(imgIdx + 1) % imgs.length] : null;

  return (
    <div>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
          padding: '2rem',
          cursor: 'zoom-in'
        }}
      >
        {mainSrc ? (
          <>
            <Image
              src={mainSrc}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ 
                objectFit: 'contain', 
                opacity: hovered && nextSrc ? 0 : 1,
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transform: hovered ? 'scale(1.2)' : 'scale(1)'
              }}
            />
            {nextSrc && (
              <Image
                src={nextSrc}
                alt={`${product.name} - vista previa`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ 
                  objectFit: 'contain', 
                  opacity: hovered ? 1 : 0,
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  transform: hovered ? 'scale(1.2)' : 'scale(1)',
                  padding: '2rem'
                }}
              />
            )}
          </>
        ) : (
          <div style={{ color: 'var(--muted)', textAlign: 'center', opacity: 0.5 }}>
            <p style={{ marginTop: '1rem', fontFamily: 'var(--C)', letterSpacing: '2px', fontSize: '0.8rem' }}>
              IMAGEN DEL PRODUCTO
            </p>
          </div>
        )}
      </div>
      {imgs.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {imgs.map((src: string, i: number) => (
            <button
              key={src + i}
              type="button"
              onClick={() => {
                setImgIdx(i);
                onChangeMain(src);
              }}
              style={{
                width: 72,
                height: 72,
                padding: '0.5rem',
                border: i === imgIdx ? '2px solid var(--lime)' : '1px solid var(--wire2)',
                borderRadius: 'var(--r)',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'var(--ink2)',
                opacity: i === imgIdx ? 1 : 0.75,
                position: 'relative'
              }}
            >
              <Image src={src} alt="" fill sizes="72px" style={{ objectFit: 'contain' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ServingsCalculator({ servings, unit }: { servings: number, unit: string }) {
  const [daily, setDaily] = useState(1);
  if (!servings || servings <= 0) return null;

  const days = Math.floor(servings / daily);
  const unitLabel = unit || 'servicios';

  return (
    <div style={{ background: 'var(--ink2)', padding: '1.2rem', borderRadius: 'var(--r)', marginBottom: '2.5rem', border: '1px solid var(--wire2)' }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '1px' }}>
        Planificador de Consumo
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem' }}>Consumo diario: <strong>{daily} {daily === 1 ? unitLabel.replace(/s$/, '') : unitLabel}</strong></span>
        <span style={{ color: 'var(--lime)', fontFamily: 'var(--C)', fontSize: '0.8rem' }}>Te durará {days} días</span>
      </div>
      <input 
        type="range" min="1" max="6" step="1" 
        value={daily} 
        onChange={(e) => setDaily(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--lime)', cursor: 'pointer' }}
      />
      <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
        Basado en un contenido total de {servings} {unitLabel}.
      </p>
    </div>
  );
}

export default function ProductDetailsClient({ product, relatedProducts = [] }: { product: any, relatedProducts?: any[] }) {
  const { addItem } = useCartStore();
  const [shareOpen, setShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState('✓ Enlace copiado');

  const defaultImage = product.gallery && product.gallery.length > 0 ? product.gallery[0] : product.image;
  const [mainForCart, setMainForCart] = useState<string | undefined>(defaultImage);

  const handleAdd = () => addItem(product.name, product.price, mainForCart ?? defaultImage);

  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.id}` : '';
  const shareText = `${product.name} · CREAFIT — ${productUrl}`;

  const copyToClipboard = async (text: string, customMsg?: string) => {
    try {
      setToastMsg(customMsg || '✓ Enlace copiado');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
      }
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3500);
      setShareOpen(false);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const shareActions = {
    whatsapp: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank'),
    messenger: () => window.open(`fb-messenger://share/?link=${encodeURIComponent(productUrl)}`, '_blank'),
    instagram: async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title: `${product.name} · CREAFIT`, url: productUrl });
          return;
        } catch (_) {}
      }
      copyToClipboard(productUrl, '✓ Enlace copiado. ¡Pégalo en Instagram!');
    },
    copy: () => copyToClipboard(productUrl)
  };

  return (
    <div style={{ minHeight: '80vh', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)' }}>
      {/* Detalle Principal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start', marginBottom: '6rem' }}>
        <ProductMedia key={product.id} product={product} onChangeMain={setMainForCart} />
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Link href="/catalog" style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'inline-block' }}>← Catálogo</Link>
            {product.stock_quantity <= 0 && <span style={{ background: '#ff4444', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--C)' }}>AGOTADO</span>}
          </div>

          <h1 style={{ fontFamily: 'var(--C)', fontSize: '3rem', margin: '0 0 1rem 0', textTransform: 'uppercase', lineHeight: 1 }}>{product.name}</h1>
          
          <div style={{ marginBottom: '1.5rem' }}>
            {product.original_price && product.original_price > product.price && (
              <p style={{ textDecoration: 'line-through', color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '0.2rem', fontFamily: 'var(--B)' }}>{cop(product.original_price)}</p>
            )}
            <p style={{ color: 'var(--lime)', fontFamily: 'var(--D)', fontSize: '2.5rem' }}>{cop(product.price)}</p>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>{product.desc}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', borderTop: '1px solid var(--wire)', padding: '1.5rem 0 0.5rem 0' }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Peso</p>
              <p style={{ fontFamily: 'var(--B)', fontSize: '1.1rem' }}>{product.weight}</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Stock</p>
              <p style={{ fontFamily: 'var(--B)', fontSize: '1.1rem', color: product.stock_quantity < 5 ? '#ffbb33' : 'white' }}>{product.stock_quantity <= 0 ? 'Agotado' : `${product.stock_quantity} unidades`}</p>
            </div>
          </div>

          <ServingsCalculator servings={product.servings} unit={product.serving_unit} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button" onClick={handleAdd} disabled={product.stock_quantity <= 0}
              style={{ width: '100%', height: '56px', background: product.stock_quantity <= 0 ? 'var(--ink3)' : 'var(--lime)', color: product.stock_quantity <= 0 ? 'var(--muted)' : '#000', border: 'none', borderRadius: 'var(--r)', fontFamily: 'var(--D)', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: product.stock_quantity <= 0 ? 'not-allowed' : 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { if (product.stock_quantity > 0) { (e.currentTarget as any).style.transform = 'translateY(-2px)'; (e.currentTarget as any).style.boxShadow = '0 8px 20px rgba(227,170,43,0.4)'; } }}
              onMouseLeave={e => { (e.currentTarget as any).style.transform = ''; (e.currentTarget as any).style.boxShadow = ''; }}
              onMouseDown={e => { (e.currentTarget as any).style.transform = 'scale(0.97)'; }}
              onMouseUp={e => { (e.currentTarget as any).style.transform = ''; }}
            >
              {product.stock_quantity <= 0 ? 'Sin stock' : 'Añadir al carrito'}
            </button>

            <div style={{ position: 'relative' }}>
              <button
                type="button" onClick={() => setShareOpen(!shareOpen)}
                style={{ width: '100%', height: '56px', background: shareOpen ? 'var(--ink3)' : 'transparent', color: 'var(--white)', border: '1px solid var(--wire2)', borderRadius: 'var(--r)', fontFamily: 'var(--C)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'transform 0.15s, background 0.2s, box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as any).style.transform = 'translateY(-2px)'; (e.currentTarget as any).style.boxShadow = '0 6px 20px rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as any).style.transform = ''; (e.currentTarget as any).style.boxShadow = ''; }}
                onMouseDown={e => { (e.currentTarget as any).style.transform = 'scale(0.97)'; }}
                onMouseUp={e => { (e.currentTarget as any).style.transform = ''; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Compartir
              </button>

              {shareOpen && (
                <div style={{ position: 'absolute', bottom: 'calc(100% + 0.75rem)', left: 0, right: 0, minWidth: '200px', background: 'var(--ink)', border: '1px solid var(--wire2)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 50, boxShadow: '0 20px 60px rgba(0,0,0,0.6)', animation: 'menuSlide 0.2s ease forwards' }}>
                  <button onClick={shareActions.whatsapp} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(37,211,102,0.12)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--C)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', transition: 'background 0.2s' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp
                  </button>
                  <button onClick={shareActions.messenger} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,120,255,0.12)', color: '#0078FF', border: '1px solid rgba(0,120,255,0.3)', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--C)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', transition: 'background 0.2s' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0078FF"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/></svg> Messenger
                  </button>
                  <button onClick={shareActions.instagram} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(225,48,108,0.12)', color: '#E1306C', border: '1px solid rgba(225,48,108,0.3)', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--C)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', transition: 'background 0.2s' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> Instagram
                  </button>
                  <button onClick={shareActions.copy} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--muted)', border: '1px solid var(--wire2)', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--C)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', transition: 'background 0.2s' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copiar enlace
                  </button>
                </div>
              )}
            </div>
          </div>

          {linkCopied && (
            <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--lime)', color: '#000', fontFamily: 'var(--C)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1.5px', padding: '0.7rem 1.5rem', borderRadius: '999px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', zIndex: 9999, animation: 'toastIn 0.3s ease forwards', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              {toastMsg}
            </div>
          )}
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div style={{ borderTop: '1px solid var(--wire)', paddingTop: '4rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="sec-lbl">Sugerencias</p>
            <h2 className="sec-t" style={{ fontSize: '2.5rem' }}>Podría <em>interesarte</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
