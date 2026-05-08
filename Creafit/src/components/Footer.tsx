import { useState } from 'react';
import styles from './Footer.module.css';

const LINKS_PRODUCTS = ['Proteínas','Creatinas','Pre-entreno','Aminoácidos','Vitaminas'];
const LINKS_INFO     = ['Sobre CREAFIT','Blog & Ciencia','Privacidad','Devoluciones','Términos'];
const SOCIALS        = [{ label: 'IG', aria: 'Instagram' },{ label: 'TK', aria: 'TikTok' },{ label: 'YT', aria: 'YouTube' },{ label: 'FB', aria: 'Facebook' }];

export default function Footer() {
  const [email, setEmail] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    alert(`Suscrito: ${email}`);
    setEmail('');
  };

  return (
    <footer id="contacto" className={styles.footer}>
      <div className={styles.deco}>CREAFIT</div>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <div className={styles.logo}>CREA<span>FIT</span></div>
          <p>Suplementos de alto rendimiento para atletas que no aceptan el promedio.</p>
          <div className={styles.socs}>
            {SOCIALS.map(s => <a key={s.label} href="#" className={styles.soc} aria-label={s.aria}>{s.label}</a>)}
          </div>
        </div>
        <div className={styles.col}>
          <h4>Productos</h4>
          <ul>{LINKS_PRODUCTS.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>
        <div className={styles.col}>
          <h4>Información</h4>
          <ul>{LINKS_INFO.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>
        <div className={styles.col}>
          <h4>Newsletter</h4>
          <p className={styles.nlDesc}>Descuentos exclusivos y artículos de rendimiento.</p>
          <form className={styles.nlf} onSubmit={subscribe}>
            <input
              type="email" placeholder="tu@email.com" required
              value={email} onChange={e => setEmail(e.target.value)}
              className={styles.nli}
            />
            <button type="submit" className={styles.nlb}>OK</button>
          </form>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© 2025 <span>CREAFIT</span>. Todos los derechos reservados.</p>
        <p>Hecho para atletas que van en serio</p>
      </div>
    </footer>
  );
}
