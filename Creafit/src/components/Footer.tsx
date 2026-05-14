import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { showToast } from '../lib/toastBus';
import { toggleHighContrast } from '../lib/highContrast';

const LINKS_PRODUCTS = ['Proteínas','Creatinas','Pre-entreno','Aminoácidos','Vitaminas'];
const LINKS_INFO     = ['Sobre CREAFIT','Blog & Ciencia','Privacidad','Devoluciones','Términos'];
const SOCIALS        = [{ label: 'IG', aria: 'Instagram' },{ label: 'TK', aria: 'TikTok' },{ label: 'YT', aria: 'YouTube' },{ label: 'FB', aria: 'Facebook' }];

export default function Footer() {
  const [email, setEmail] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      showToast('Email inválido.');
      return;
    }
    const formUrl = import.meta.env.VITE_NEWSLETTER_FORM_URL as string | undefined;
    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL as string | undefined;

    if (formUrl?.trim()) {
      window.open(formUrl.trim(), '_blank', 'noopener,noreferrer');
      showToast('Te abrimos el formulario de suscripción.');
    } else if (contactEmail?.trim()) {
      const subj = encodeURIComponent('Newsletter CREAFIT');
      const body = encodeURIComponent(`Quiero suscribirme con este correo: ${email}`);
      window.location.href = `mailto:${contactEmail.trim()}?subject=${subj}&body=${body}`;
      showToast('Abriendo tu app de correo…');
    } else {
      showToast(`Gracias. Registramos: <strong>${email}</strong> (configura VITE_NEWSLETTER_FORM_URL o VITE_CONTACT_EMAIL para envío real).`);
    }
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
          <ul>
            <li><Link to="/catalog">Ver catálogo</Link></li>
            {LINKS_PRODUCTS.map(l => <li key={l}><a href="#">{l}</a></li>)}
          </ul>
        </div>
        <div className={styles.col}>
          <h4>Información</h4>
          <ul>
            <li><Link to="/catalog">Catálogo</Link></li>
            <li><Link to="/envios-pagos">Envíos y pagos</Link></li>
            <li><Link to="/autenticidad">Autenticidad</Link></li>
            {LINKS_INFO.map(l => <li key={l}><a href="#">{l}</a></li>)}
          </ul>
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
        <button
          type="button"
          className={styles.a11yLink}
          onClick={() => {
            const on = toggleHighContrast();
            showToast(on ? 'Contraste alto activado.' : 'Contraste estándar.');
          }}
        >
          Contraste alto
        </button>
      </div>
    </footer>
  );
}
