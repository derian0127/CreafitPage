"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { cop } from '@/store/cartStore';

interface Product {
  id: number;
  name: string;
  price: number;
  category_name: string;
}

export default function AdminProducts({ initialProducts, onEdit }: { initialProducts: Product[], onEdit: (p: Product) => void }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
    setLoading(false);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--wire2)' }}>
            <th style={{ padding: '1rem' }}>ID</th>
            <th style={{ padding: '1rem' }}>Nombre</th>
            <th style={{ padding: '1rem' }}>PVP</th>
            <th style={{ padding: '1rem' }}>Costo</th>
            <th style={{ padding: '1rem' }}>Categoría</th>
            <th style={{ padding: '1rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid var(--wire)' }}>
              <td style={{ padding: '1rem' }}>{p.id}</td>
              <td style={{ padding: '1rem' }}>{p.name}</td>
              <td style={{ padding: '1rem' }}>{cop(p.price)}</td>
              <td style={{ padding: '1rem', color: '#ff4444' }}>{cop((p as any).cost_price || 0)}</td>
              <td style={{ padding: '1rem' }}>{p.category_name}</td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => onEdit(p)}
                  style={{ 
                    background: 'var(--lime)', 
                    color: 'black', 
                    border: 'none', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'var(--C)',
                    fontSize: '0.65rem'
                  }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  disabled={loading}
                  style={{ 
                    background: '#ff4444', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.65rem'
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
