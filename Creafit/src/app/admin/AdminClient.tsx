"use client";
import { useState } from 'react';
import AdminProducts from './AdminProducts';
import AdminForm from './AdminForm';
import AdminStats from './AdminStats';
import AdminSubscribers from './AdminSubscribers';
import Link from 'next/link';

export default function AdminClient({ 
  initialProducts, 
  categories, 
  initialSubscribers 
}: { 
  initialProducts: any[], 
  categories: string[],
  initialSubscribers: any[]
}) {
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [view, setView] = useState<'products' | 'newsletter'>('products');

  return (
    <div style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <p className="sec-lbl">Gestión Interna</p>
          <h1 className="sec-t" style={{ fontSize: '3rem' }}>PANEL ADMIN</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setView('products')} className={view === 'products' ? 'btn-a' : 'btn-b'} style={{ padding: '0.6rem 1.2rem' }}>Inventario</button>
          <button onClick={() => setView('newsletter')} className={view === 'newsletter' ? 'btn-a' : 'btn-b'} style={{ padding: '0.6rem 1.2rem' }}>Newsletter</button>
          <a href="/api/admin/logout" className="btn-b" style={{ padding: '0.6rem 1.2rem', background: '#ff4444', color: 'white', borderColor: '#ff4444' }}>Salir</a>
        </div>
      </div>

      <AdminStats products={initialProducts} />

      {view === 'products' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--C)', marginBottom: '1rem' }}>Productos Actuales</h3>
            <AdminProducts 
              initialProducts={initialProducts} 
              onEdit={(p) => {
                setProductToEdit(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </div>
          
          <AdminForm 
            categories={categories} 
            productToEdit={productToEdit} 
            onClear={() => setProductToEdit(null)}
          />
        </div>
      ) : (
        <AdminSubscribers initialSubscribers={initialSubscribers} />
      )}
    </div>
  );
}
