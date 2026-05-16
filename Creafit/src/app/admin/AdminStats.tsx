"use client";
import { cop } from '@/store/cartStore';

export default function AdminStats({ products }: { products: any[] }) {
  const total = products.length;
  const inventoryValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.cost_price || 0), 0);
  const potentialProfit = inventoryValue - totalCost;
  const margin = inventoryValue > 0 ? (potentialProfit / inventoryValue) * 100 : 0;
  
  const outOfStock = products.filter(p => (p.stock_quantity || 0) <= 0).length;
  const lowStock = products.filter(p => (p.stock_quantity || 0) > 0 && (p.stock_quantity || 0) < 5).length;

  const categories = products.reduce((acc: any, p) => {
    acc[p.category_name] = (acc[p.category_name] || 0) + 1;
    return acc;
  }, {});

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const cardStyle = {
    background: 'var(--ink2)',
    padding: '1.5rem',
    borderRadius: 'var(--r)',
    border: '1px solid var(--wire2)'
  };

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={statsStyle}>
        <div style={cardStyle}>
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Inversión Total</p>
          <h2 style={{ fontFamily: 'var(--C)', fontSize: '1.5rem', color: '#ff4444' }}>{cop(totalCost)}</h2>
        </div>
        <div style={cardStyle}>
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ganancia Potencial</p>
          <h2 style={{ fontFamily: 'var(--C)', fontSize: '1.5rem', color: 'var(--lime)' }}>{cop(potentialProfit)}</h2>
        </div>
        <div style={cardStyle}>
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Margen de Ganancia</p>
          <h2 style={{ fontFamily: 'var(--C)', fontSize: '1.5rem' }}>{margin.toFixed(1)}%</h2>
        </div>
        <div style={cardStyle}>
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Alertas Stock</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ color: outOfStock > 0 ? '#ff4444' : 'var(--muted)' }}>
              <strong>{outOfStock}</strong> Agotados
            </div>
            <div style={{ color: lowStock > 0 ? '#ffbb33' : 'var(--muted)' }}>
              <strong>{lowStock}</strong> Bajos
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Stock por Categoría</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {Object.entries(categories).map(([cat, count]: any) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--lime)', fontWeight: 'bold' }}>{count}</span>
              <span style={{ fontSize: '0.85rem' }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
