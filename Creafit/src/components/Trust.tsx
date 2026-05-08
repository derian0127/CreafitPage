import styles from './Trust.module.css';

const ITEMS = [
  {
    label: 'Envío rápido', sub: 'Entrega 24–48 h hábiles',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
  {
    label: 'Calidad GMP', sub: 'Certificado laboratorio GMP',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    label: 'Pago seguro', sub: 'SSL + pasarelas certificadas',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  {
    label: 'Devoluciones fáciles', sub: '30 días sin preguntas',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  },
];

export default function Trust() {
  return (
    <section className={styles.trust}>
      <div className={styles.grid}>
        {ITEMS.map(item => (
          <div key={item.label} className={styles.item}>
            <div className={styles.ico}>{item.icon}</div>
            <div>
              <p className={styles.title}>{item.label}</p>
              <p className={styles.sub}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
