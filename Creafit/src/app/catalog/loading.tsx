export default function Loading() {
  return (
    <div
      style={{
        minHeight: '80vh',
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)',
      }}
    >
      {/* Cabecera skeleton */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ width: 100, height: 14, background: 'var(--wire2)', borderRadius: 4, marginBottom: 12, animation: 'pulse 1.4s infinite' }} />
        <div style={{ width: 220, height: 40, background: 'var(--wire2)', borderRadius: 4, marginBottom: 12, animation: 'pulse 1.4s infinite' }} />
        <div style={{ width: 380, height: 16, background: 'var(--wire2)', borderRadius: 4, animation: 'pulse 1.4s infinite' }} />
      </div>

      {/* Grid skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: 'var(--ink2)',
              border: '1px solid var(--wire)',
              borderRadius: 'var(--r)',
              overflow: 'hidden',
              animation: `pulse 1.4s ${i * 0.08}s infinite`,
            }}
          >
            <div style={{ aspectRatio: '1/1', background: 'var(--ink3)' }} />
            <div style={{ padding: '1rem' }}>
              <div style={{ height: 14, background: 'var(--wire2)', borderRadius: 4, marginBottom: 8 }} />
              <div style={{ height: 22, width: '60%', background: 'var(--wire2)', borderRadius: 4 }} />
            </div>
          </div>
        ))}
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
