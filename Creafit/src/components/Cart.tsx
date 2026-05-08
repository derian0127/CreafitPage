import { useEffect } from 'react';
import { useCartStore, cop } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

export default function Cart() {
  const items     = useCartStore(s => s.items);
  const isOpen    = useCartStore(s => s.isOpen);
  const closeCart = useCartStore(s => s.closeCart);
  const removeItem = useCartStore(s => s.removeItem);
  const updateQty  = useCartStore(s => s.updateQty);
  const cartTotal  = useCartStore(s => s.items.reduce((sum, i) => sum + i.price * i.qty, 0));
  const cartCount  = useCartStore(s => s.items.reduce((sum, i) => sum + i.qty, 0));
  const navigate   = useNavigate();


  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.on : ''}`} onClick={closeCart} />
      <aside className={`${styles.panel} ${isOpen ? styles.on : ''}`} aria-label="Carrito de compras">
        <div className={styles.header}>
          <h2>Tu Carrito <span className={styles.countBadge}>{cartCount}</span></h2>
          <button className={styles.close} onClick={closeCart} aria-label="Cerrar carrito">✕</button>
        </div>

        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              <p>Carrito vacío</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.item}>
                <div className={styles.thumb}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div className={styles.info}>
                  <p className={styles.iname}>{item.name}</p>
                  <p className={styles.iprice}>{cop(item.price * item.qty)}</p>
                  <div className={styles.qtyRow}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <button className={styles.rm} onClick={() => removeItem(item.id)} aria-label="Eliminar">✕</button>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.totalRow}>
            <span className={styles.totalLbl}>Total</span>
            <span className={styles.totalAmt}>{cop(cartTotal)}</span>
          </div>
          <button
            className={styles.checkout}
            disabled={items.length === 0}
            onClick={() => {
              closeCart();
              navigate('/checkout');
            }}
          >
            Proceder al Pago →
          </button>
        </div>
      </aside>
    </>
  );
}
