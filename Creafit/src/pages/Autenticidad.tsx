import { Link } from 'react-router-dom';

export default function Autenticidad() {
  return (
    <div
      style={{
        minHeight: '75vh',
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)',
        maxWidth: '720px',
        margin: '0 auto',
        color: 'var(--white)',
      }}
    >
      <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Inicio
      </Link>
      <p className="sec-lbl">Confianza</p>
      <h1 className="sec-t" style={{ fontSize: 'clamp(2.2rem,5vw,3.2rem)', marginBottom: '1.5rem' }}>
        AUTENTICIDAD Y <em>SELLOS</em>
      </h1>

      <div style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>
          Aquí puedes detallar certificaciones que ya mencionas en la web: GMP, Informed Sport, análisis de
          laboratorio por lote, trazabilidad de ingredientes, etc.
        </p>
        <ul style={{ paddingLeft: '1.2rem', listStyle: 'disc', color: 'var(--white)' }}>
          <li style={{ marginBottom: '0.5rem' }}>Proveedores y marcas de materia prima (ej. Creapure®).</li>
          <li style={{ marginBottom: '0.5rem' }}>Política frente a falsificaciones y lotes.</li>
          <li>Enlaces a PDFs o páginas oficiales de certificación si los tienes.</li>
        </ul>
        <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>
          Sustituye este contenido por el definitivo; sirve como ancla SEO para búsquedas tipo “suplementos
          certificados Colombia”.
        </p>
      </div>
    </div>
  );
}
