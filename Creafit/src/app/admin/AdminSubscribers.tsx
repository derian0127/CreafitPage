"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminSubscribers({ initialSubscribers }: { initialSubscribers: any[] }) {
  const [subs, setSubs] = useState<any[]>(initialSubscribers);
  const [loading, setLoading] = useState(false);

  async function fetchSubs() {
    setLoading(true);
    const { data } = await supabase.from('newsletter').select('id, email, created_at').order('created_at', { ascending: false });
    setSubs(data || []);
    setLoading(false);
  }

  return (
    <div style={{ background: 'var(--ink2)', padding: '2rem', borderRadius: 'var(--r)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--C)' }}>Lista de Suscriptores</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={fetchSubs} className="btn-b" style={{ fontSize: '0.7rem' }}>Refrescar</button>
          <button onClick={() => {
            const emails = subs.map(s => s.email).join(', ');
            navigator.clipboard.writeText(emails);
            alert('¡Emails copiados al portapapeles!');
          }} className="btn-b" style={{ fontSize: '0.7rem' }}>Copiar todos los emails</button>
        </div>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--wire2)', fontSize: '0.8rem', color: 'var(--muted)' }}>
              <th style={{ padding: '0.8rem' }}>Email</th>
              <th style={{ padding: '0.8rem' }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--wire)', fontSize: '0.85rem' }}>
                <td style={{ padding: '0.8rem' }}>{s.email}</td>
                <td style={{ padding: '0.8rem' }}>{new Date(s.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p style={{ textAlign: 'center', padding: '1rem' }}>Actualizando...</p>}
        {subs.length === 0 && !loading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No hay suscriptores aún.</p>}
      </div>
    </div>
  );
}
