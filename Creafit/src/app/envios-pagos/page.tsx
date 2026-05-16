import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Envíos y Pagos · CREAFIT',
};

export default function EnviosPagos() {
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
      <Link href="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Inicio
      </Link>
      <p className="sec-lbl">Compra</p>
      <h1 className="sec-t" style={{ fontSize: 'clamp(2.2rem,5vw,3.2rem)', marginBottom: '1.5rem' }}>
        ENVÍOS Y <em>PAGOS</em>
      </h1>

      <div style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <section>
          <h2 style={{ fontFamily: 'var(--C)', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: '0.6rem' }}>
            Envíos
          </h2>
          <p>
            Ajusta aquí tus ciudades, tiempos de entrega y coste de envío. Ejemplo: entregas en Bogotá en 24–48 h;
            resto del país con transportadora en 3–5 días hábiles.
          </p>
        </section>
        <section>
          <h2 style={{ fontFamily: 'var(--C)', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: '0.6rem' }}>
            Pagos
          </h2>
          <p>
            Indica medios aceptados: transferencia, Nequi/Daviplata, contraentrega donde aplique, etc. El pedido por
            WhatsApp permite confirmar total y datos antes de pagar.
          </p>
        </section>
        <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>
          Este texto es plantilla: sustitúyelo por tus condiciones reales y enlaza esta página desde el footer o el
          carrito si quieres más visibilidad.
        </p>
      </div>
    </div>
  );
}
