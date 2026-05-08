import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

export default function Catalog() {
  return (
    <div style={{ minHeight: '80vh', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)' }}>
      <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'inline-block', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--lime)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>← Volver a inicio</Link>
      
      <div style={{ marginBottom: '3rem' }}>
        <p className="sec-lbl">Arsenal Completo</p>
        <h1 className="sec-t" style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>CATÁLOGO POR <br/><em>CATEGORÍAS</em></h1>
      </div>

      {CATEGORIES.map(category => {
        const categoryProducts = PRODUCTS.filter(p => p.category === category);
        
        // No renderizar si la categoría no tiene productos
        if (categoryProducts.length === 0) return null;

        return (
          <section key={category} style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--C)', fontSize: '1.5rem', letterSpacing: '2px', borderBottom: '1px solid var(--wire)', paddingBottom: '0.8rem', marginBottom: '1.5rem', color: 'var(--white)' }}>
              {category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1px', background: 'var(--wire)', border: '1px solid var(--wire)' }}>
              {categoryProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
