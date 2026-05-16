import Link from 'next/link';
import styles from './Hero.module.css';
import { FadeIn } from './Motion';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.left}>
        <p className={styles.eye}>Suplementos de élite · 2025</p>
        <FadeIn>
          <h1 className={styles.h1}>
            SIN<br/><span className={styles.out}>LÍMITES</span><br/>REALES
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className={styles.sub}>
            Formulaciones de grado clínico para atletas que miden sus resultados con datos, no con promesas.
          </p>
        </FadeIn>
        <div className={styles.ctaRow}>
          <Link href="/catalog" className="btn-a">
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
          <Image 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80" 
            alt="Atleta CREAFIT" 
            fill 
            priority
            loading="eager"
            sizes="(max-width: 860px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  );
}
