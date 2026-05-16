export default function Loading() {
  return (
    <div
      style={{
        minHeight: '80vh',
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        alignItems: 'start',
      }}
    >
      {/* Imagen skeleton */}
      <div
        style={{
          background: 'var(--ink2)',
          border: '1px solid var(--wire)',
          borderRadius: 'var(--r)',
          aspectRatio: '1/1',
          animation: 'pulse 1.4s infinite',
        }}
      />

      {/* Info skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ height: 14, width: 80, background: 'var(--wire2)', borderRadius: 4, animation: 'pulse 1.4s infinite' }} />
        <div style={{ height: 52, width: '80%', background: 'var(--wire2)', borderRadius: 4, animation: 'pulse 1.4s 0.05s infinite' }} />
        <div style={{ height: 36, width: '40%', background: 'var(--wire2)', borderRadius: 4, animation: 'pulse 1.4s 0.1s infinite' }} />
        <div style={{ height: 80, background: 'var(--wire2)', borderRadius: 4, animation: 'pulse 1.4s 0.15s infinite' }} />
        <div style={{ height: 56, background: 'var(--wire2)', borderRadius: 4, animation: 'pulse 1.4s 0.2s infinite' }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
