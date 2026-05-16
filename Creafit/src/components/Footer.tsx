"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { showToast } from '../lib/toastBus';
import { toggleHighContrast } from '../lib/highContrast';

import { supabase } from '@/lib/supabaseClient';

const LINKS_PRODUCTS = ['Proteínas','Creatinas','Pre-entreno','Aminoácidos','Vitaminas'];
const LINKS_INFO     = ['Sobre CREAFIT','Blog & Ciencia','Privacidad','Devoluciones','Términos'];
const SOCIALS        = [{ label: 'IG', aria: 'Instagram' },{ label: 'TK', aria: 'TikTok' },{ label: 'YT', aria: 'YouTube' },{ label: 'FB', aria: 'Facebook' }];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      showToast('Email inválido.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Error al suscribirse.');
      } else {
        showToast(data.warning || '¡Bienvenido al arsenal! Revisa tu correo.');
        setEmail('');
      }
    } catch (err) {
      showToast('Error de conexión. Intenta de nuevo.');
    }
    setLoading(false);
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
            <li><Link href="/catalog">Ver catálogo</Link></li>
            {LINKS_PRODUCTS.map(l => <li key={l}><a href="#">{l}</a></li>)}
          </ul>
        </div>
        <div className={styles.col}>
          <h4>Información</h4>
          <ul>
            <li><Link href="/catalog">Catálogo</Link></li>
            <li><Link href="/envios-pagos">Envíos y pagos</Link></li>
            <li><Link href="/autenticidad">Autenticidad</Link></li>
            <li><Link href="/admin">Panel Admin</Link></li>
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
