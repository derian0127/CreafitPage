import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { setHighContrast } from './lib/highContrast';

try {
  if (localStorage.getItem('creafit-high-contrast') === '1') {
    setHighContrast(true);
  }
} catch {
  /* sin storage */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
