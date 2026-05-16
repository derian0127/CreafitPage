const STORAGE_KEY = 'creafit-high-contrast';

export function getHighContrast(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dataset.highContrast === 'true';
}

export function setHighContrast(on: boolean): void {
  const root = document.documentElement;
  if (on) {
    root.dataset.highContrast = 'true';
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* */
    }
  } else {
    delete root.dataset.highContrast;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* */
    }
  }
  window.dispatchEvent(new CustomEvent('creafit-contrast-change'));
}

export function toggleHighContrast(): boolean {
  const next = !getHighContrast();
  setHighContrast(next);
  return next;
}
