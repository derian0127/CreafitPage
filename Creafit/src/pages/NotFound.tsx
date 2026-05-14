import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,4vw,3rem)',
        textAlign: 'center',
        color: 'var(--white)',
      }}
    >
      <p className="sec-lbl" style={{ justifyContent: 'center' }}>
        Error 404
      </p>
      <h1 className="sec-t" style={{ fontSize: 'clamp(3rem,10vw,6rem)', marginBottom: '1rem' }}>
        NO HAY <em>NADA</em> AQUÍ
      </h1>
      <p style={{ color: 'var(--muted)', maxWidth: '420px', margin: '0 auto 2rem', lineHeight: 1.75 }}>
        La ruta no existe o fue movida. Vuelve al inicio o revisa el catálogo.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/" className="btn-a">
          Inicio
        </Link>
        <Link to="/catalog" className="btn-b">
          Catálogo
        </Link>
      </div>
    </div>
  );
}
