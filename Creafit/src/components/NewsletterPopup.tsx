"use client";
import { useState, useEffect } from 'react';
import styles from './NewsletterPopup.module.css';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Verificar si ya se mostró o si ya se suscribió
    const hasSeen = localStorage.getItem('creafit_newsletter_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // Mostrar después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('creafit_newsletter_seen', 'true');
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        localStorage.setItem('creafit_newsletter_seen', 'true');
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={closePopup} className={styles.closeBtn} aria-label="Cerrar">
          &times;
        </button>
        
        <div className={styles.content}>
          <div className={styles.badge}>OFERTA DE BIENVENIDA</div>
          <h2 className={styles.title}>
            ÚNETE AL <em>CLAN</em> Y OBTÉN UN <span>10% OFF</span>
          </h2>
          <p className={styles.desc}>
            Suscríbete para recibir tu código de descuento exclusivo y ser el primero en conocer nuevos lanzamientos.
          </p>

          {status === 'success' ? (
            <div className={styles.successMsg}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>¡Bienvenido! Revisa tu correo.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.form}>
              <input
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'ENVIANDO...' : 'OBTENER MI DESCUENTO'}
              </button>
              {status === 'error' && (
                <p className={styles.errorMsg}>Algo salió mal. Intenta de nuevo.</p>
              )}
            </form>
          )}

          <p className={styles.footerNote}>
            Sin spam. Solo rendimiento puro. Desascríbete cuando quieras.
          </p>
        </div>
      </div>
    </div>
  );
}
