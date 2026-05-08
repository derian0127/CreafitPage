import { useEffect, useRef, useState } from 'react';
import styles from './Toast.module.css';

// Simple global toast trigger
let _show: ((msg: string) => void) | null = null;
export const showToast = (msg: string) => _show?.(msg);

export default function Toast() {
  const [msg, setMsg]     = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    _show = (m: string) => {
      setMsg(m);
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 2600);
    };
    return () => { _show = null; };
  }, []);

  return (
    <div
      className={`${styles.toast} ${visible ? styles.on : ''}`}
      dangerouslySetInnerHTML={{ __html: msg }}
    />
  );
}
