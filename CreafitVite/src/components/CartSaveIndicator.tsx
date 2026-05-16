import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import styles from './CartSaveIndicator.module.css';

/**
 * Muestra "Guardado" cuando el carrito cambia después de rehidratar desde localStorage.
 * Zustand persist escribe en localStorage al cambiar `items`; esto solo da feedback visual.
 */
export default function CartSaveIndicator() {
  const [visible, setVisible] = useState(false);
  const baseline = useRef<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return useCartStore.persist.onFinishHydration((state) => {
      baseline.current = JSON.stringify(state?.items ?? []);
    });
  }, []);

  useEffect(() => {
    return useCartStore.subscribe((state) => {
      if (baseline.current === null) return;
      const serialized = JSON.stringify(state.items);
      if (baseline.current === serialized) return;
      baseline.current = serialized;
      setVisible(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), 2200);
    });
  }, []);

  return (
    <div className={`${styles.pill} ${visible ? styles.on : ''}`} role="status" aria-live="polite">
      Guardado
    </div>
  );
}
