import { useEffect, useRef, useState } from 'react';
import { setToastListener } from '../lib/toastBus';
import styles from './Toast.module.css';

export default function Toast() {
  const [msg, setMsg]     = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setToastListener((m: string) => {
      setMsg(m);
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 2600);
    });
    return () => {
      clearTimeout(timer.current);
      setToastListener(null);
    };
  }, []);

  return (
    <div
      className={`${styles.toast} ${visible ? styles.on : ''}`}
      dangerouslySetInnerHTML={{ __html: msg }}
    />
  );
}
