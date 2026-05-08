import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCartStore, cop } from '../store/cartStore';

export default function ProductDetails() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === Number(id));
  const { addItem } = useCartStore();

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--white)' }}>
        <h2>Producto no encontrado</h2>
        <Link to="/" style={{ color: 'var(--lime)', marginTop: '1rem', textDecoration: 'underline' }}>Volver al catálogo</Link>
      </div>
    );
  }

  const handleAdd = () => addItem(product.name, product.price, product.image);

  return (
    <div style={{ minHeight: '80vh', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
      
      <div style={{ background: 'var(--ink3)', border: '1px solid var(--wire)', borderRadius: 'var(--r)', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
        ) : (
          <div style={{ color: 'var(--muted)', textAlign: 'center', opacity: 0.5 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <p style={{ marginTop: '1rem', fontFamily: 'var(--C)', letterSpacing: '2px', fontSize: '0.8rem' }}>IMAGEN DEL PRODUCTO</p>
          </div>
        )}
      </div>

      <div>
        <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'inline-block', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--lime)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>← Volver a inicio</Link>
        <h1 style={{ fontFamily: 'var(--C)', fontSize: '3rem', margin: '0 0 1rem 0', textTransform: 'uppercase', lineHeight: 1 }}>{product.name}</h1>
        <p style={{ color: 'var(--lime)', fontFamily: 'var(--D)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>{cop(product.price)}</p>
        
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>{product.desc}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem', borderTop: '1px solid var(--wire)', borderBottom: '1px solid var(--wire)', padding: '1.5rem 0' }}>
          <div>
            <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Peso</p>
            <p style={{ fontFamily: 'var(--B)', fontSize: '1.1rem' }}>{product.weight}</p>
          </div>
          <div>
            <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Servicios</p>
            <p style={{ fontFamily: 'var(--B)', fontSize: '1.1rem' }}>{product.servings}</p>
          </div>
        </div>

        <button 
          onClick={handleAdd}
          style={{ width: '100%', background: 'var(--lime)', color: '#000', border: 'none', borderRadius: 'var(--r)', padding: '1.2rem', fontFamily: 'var(--D)', fontSize: '1.4rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.25s, background 0.2s' }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'none'}
        >
          Añadir al carrito
        </button>
      </div>

    </div>
  );
}
