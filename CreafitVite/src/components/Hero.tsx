import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.left}>
        <p className={styles.eye}>Suplementos de élite · 2025</p>
        <h1 className={styles.h1}>
          SIN<br/><span className={styles.out}>LÍMITES</span><br/>REALES
        </h1>
        <p className={styles.sub}>
          Formulaciones de grado clínico para atletas que miden sus resultados con datos, no con promesas.
        </p>
        <div className={styles.ctaRow}>
          <Link to="/catalog" className="btn-a">
            Ver catálogo&nbsp;
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <a href="/#beneficios" className="btn-b">Por qué CREAFIT</a>
        </div>
        <div className={styles.stats}>
          {[
            { n: '50K+', l: 'Atletas activos' },
            { n: '98%',  l: 'Satisfacción' },
            { n: '7',    l: 'Años en el mercado' },
          ].map(s => (
            <div key={s.l} className={styles.stat}>
              <div className={styles.statN}>{s.n}</div>
              <div className={styles.statL}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.imgWrap}>
          {/* Coloca tu imagen: <img src="/hero.jpg" alt="Atleta CREAFIT" /> */}
          <div className={styles.imgPh}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Hero image</span>
          </div>
        </div>
      </div>
    </section>
  );
}
