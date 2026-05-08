import { useCartStore, cop } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const items = useCartStore(s => s.items);
  const cartTotal = useCartStore(s => s.items.reduce((sum, item) => sum + item.price * item.qty, 0));

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--white)' }}>
        <h2 style={{ fontFamily: 'var(--D)', fontSize: '2rem', letterSpacing: '1px' }}>TU CARRITO ESTÁ VACÍO</h2>
        <Link to="/" style={{ background: 'var(--lime)', color: '#000', padding: '0.8rem 1.5rem', fontFamily: 'var(--C)', fontWeight: 700, borderRadius: 'var(--r)', marginTop: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Ir a comprar</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)' }}>
      <h1 className="sec-t" style={{ fontSize: '3rem', marginBottom: '2rem' }}>CHECKOUT</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem' }}>
        
        {/* Formulario Placeholder */}
        <div style={{ background: 'var(--ink2)', padding: '2rem', borderRadius: 'var(--r)', border: '1px solid var(--wire)' }}>
          <h2 style={{ fontFamily: 'var(--C)', fontSize: '1.2rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid var(--wire)', paddingBottom: '1rem' }}>Datos de Envío</h2>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" placeholder="Nombre" required style={{ flex: 1, padding: '0.8rem', background: 'var(--ink3)', border: '1px solid var(--wire)', color: 'white', borderRadius: 'var(--r)' }} />
              <input type="text" placeholder="Apellido" required style={{ flex: 1, padding: '0.8rem', background: 'var(--ink3)', border: '1px solid var(--wire)', color: 'white', borderRadius: 'var(--r)' }} />
            </div>
            <input type="email" placeholder="Email" required style={{ padding: '0.8rem', background: 'var(--ink3)', border: '1px solid var(--wire)', color: 'white', borderRadius: 'var(--r)' }} />
            <input type="text" placeholder="Dirección" required style={{ padding: '0.8rem', background: 'var(--ink3)', border: '1px solid var(--wire)', color: 'white', borderRadius: 'var(--r)' }} />
            <input type="text" placeholder="Ciudad" required style={{ padding: '0.8rem', background: 'var(--ink3)', border: '1px solid var(--wire)', color: 'white', borderRadius: 'var(--r)' }} />
          </form>
        </div>

        {/* Resumen */}
        <div style={{ background: 'var(--ink2)', padding: '2rem', borderRadius: 'var(--r)', border: '1px solid var(--wire)', alignSelf: 'start' }}>
          <h2 style={{ fontFamily: 'var(--C)', fontSize: '1.2rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid var(--wire)', paddingBottom: '1rem' }}>Resumen</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--muted)' }}>{item.qty}x {item.name}</span>
                <span style={{ fontFamily: 'var(--B)' }}>{cop(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--wire)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--C)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>Total</span>
            <span style={{ fontFamily: 'var(--D)', fontSize: '2rem', color: 'var(--lime)' }}>{cop(cartTotal)}</span>
          </div>

          <button style={{ width: '100%', background: 'var(--lime)', color: '#000', border: 'none', borderRadius: 'var(--r)', padding: '1rem', fontFamily: 'var(--D)', fontSize: '1.3rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => alert('Integración con pasarela de pago')}>
            Pagar ahora
          </button>
        </div>

      </div>
    </div>
  );
}
