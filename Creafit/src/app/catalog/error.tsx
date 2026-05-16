'use client';

export default function CatalogError({
  error,
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
        No pudimos cargar el catálogo. Puede ser un problema temporal con la conexión.
      </p>
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
    </div>
  );
}
