'use client';
import Link from 'next/link';

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '3rem',
        textAlign: 'center',
      }}
    >
      <p style={{ fontFamily: 'var(--C)', fontSize: '3rem', color: 'var(--lime)', letterSpacing: '4px' }}>ERROR</p>
      <p style={{ color: 'var(--muted)', maxWidth: 400, lineHeight: 1.7 }}>
        No pudimos cargar este producto. Es posible que ya no esté disponible.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            background: 'var(--lime)',
            color: '#000',
            border: 'none',
            padding: '0.9rem 2rem',
            borderRadius: 'var(--r)',
            fontFamily: 'var(--C)',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
        <Link
          href="/catalog"
          style={{
            background: 'transparent',
            color: 'var(--white)',
            border: '1px solid var(--wire2)',
            padding: '0.9rem 2rem',
            borderRadius: 'var(--r)',
            fontFamily: 'var(--C)',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          Ver Catálogo
        </Link>
      </div>
    </div>
  );
}
