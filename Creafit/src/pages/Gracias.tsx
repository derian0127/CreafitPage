import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import {
  getLastOrderNotesFromStorage,
  openWhatsAppOrder,
} from '../lib/whatsappCheckout';

export default function Gracias() {
  const items = useCartStore((s) => s.items);
  const [orderNotes, setOrderNotes] = useState(() => getLastOrderNotesFromStorage());

  return (
    <div
      style={{
        minHeight: '70vh',
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)',
        maxWidth: '520px',
        margin: '0 auto',
        color: 'var(--white)',
      }}
    >
      <h1
        className="sec-t"
        style={{ fontSize: 'clamp(2rem,5vw,2.75rem)', marginBottom: '1rem' }}
      >
        Siguiente paso: WhatsApp
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
        Se abrió (o debió abrirse) una pestaña con tu pedido listo para enviar. Si el
        navegador bloqueó ventanas emergentes, usa el botón de abajo. Puedes editar las
        notas antes de reenviar.
      </p>

      <label
        htmlFor="gracias-notes"
        style={{
          display: 'block',
          marginBottom: '0.4rem',
          fontFamily: 'var(--C)',
          fontSize: '0.65rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        Notas (opcional)
      </label>
      <textarea
        id="gracias-notes"
        value={orderNotes}
        onChange={(e) => setOrderNotes(e.target.value)}
        rows={3}
        maxLength={500}
        style={{
          width: '100%',
          marginBottom: '1.25rem',
          padding: '0.75rem',
          background: 'var(--ink3)',
          border: '1px solid var(--wire2)',
          borderRadius: 'var(--r)',
          color: 'var(--white)',
          fontFamily: 'var(--B)',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          resize: 'vertical',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          type="button"
          style={{
            width: '100%',
            background: 'var(--lime)',
            color: '#000',
            border: 'none',
            borderRadius: 'var(--r)',
            padding: '1rem',
            fontFamily: 'var(--D)',
            fontSize: '1.1rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
          disabled={!items.length}
          onClick={() =>
            openWhatsAppOrder(items, {
              source: 'gracias-retry',
              notes: orderNotes,
            })
          }
        >
          Abrir WhatsApp otra vez
        </button>
        <Link
          to="/"
          style={{
            textAlign: 'center',
            color: 'var(--lime)',
            fontFamily: 'var(--C)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
