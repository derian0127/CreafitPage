import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { getHighContrast, toggleHighContrast } from '../lib/highContrast';
import styles from './Nav.module.css';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [highContrast, setHighContrast] = useState(getHighContrast);
  const { openCart } = useCartStore();
  const cartCount = useCartStore(s => s.items.reduce((a, i) => a + i.qty, 0));

  const toggleContrast = () => {
    setHighContrast(toggleHighContrast());
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sync = () => setHighContrast(getHighContrast());
    window.addEventListener('creafit-contrast-change', sync);
    return () => window.removeEventListener('creafit-contrast-change', sync);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.logo}>CREA<span>FIT</span></Link>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        {['inicio','productos','beneficios','contacto'].map(id => (
          <li key={id}>
            {/* Si estamos en home bajará al ancla, si estamos en otra página navegará al hash */}
            <a href={`/#${id}`} onClick={() => setMenuOpen(false)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          </li>
        ))}
        <li>
          <Link to="/catalog" onClick={() => setMenuOpen(false)}>Catálogo</Link>
        </li>
        <li>
          <Link to="/envios-pagos" onClick={() => setMenuOpen(false)}>Envíos</Link>
        </li>
        <li>
          <Link to="/autenticidad" onClick={() => setMenuOpen(false)}>Sellos</Link>
        </li>
      </ul>

      <div className={styles.right}>
        <button
          type="button"
          className={`${styles.a11yBtn} ${highContrast ? styles.a11yOn : ''}`}
          onClick={toggleContrast}
          title="Aumenta contraste de bordes y texto"
          aria-pressed={highContrast}
        >
          Contraste
        </button>
        <button className={styles.cartBtn} onClick={openCart} aria-label="Carrito">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          <span className={`${styles.badge} ${cartCount > 0 ? styles.on : ''}`}>{cartCount}</span>
        </button>
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menú"
          aria-expanded={menuOpen}
        >
          <span className={menuOpen ? styles.open : ''} />
          <span className={menuOpen ? styles.open : ''} />
          <span className={menuOpen ? styles.open : ''} />
        </button>
      </div>
    </header>
  );
}
