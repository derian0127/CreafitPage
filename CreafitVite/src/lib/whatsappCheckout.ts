import type { CartItem } from '../store/cartStore';
import { cop } from '../store/cartStore';

const DEFAULT_WHATSAPP = '573001557404';

/** Últimas notas del pedido (para reabrir WhatsApp desde /gracias). */
export const LAST_ORDER_NOTES_KEY = 'creafit_last_order_notes';

export function getWhatsappDigits(): string {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
  const fromEnv = raw?.replace(/\D/g, '') ?? '';
  return fromEnv || DEFAULT_WHATSAPP;
}

export type WhatsAppOrderSource = 'checkout' | 'cart-drawer' | 'gracias-retry';

function refLine(source: WhatsAppOrderSource) {
  return `\n\n(Ref. web · utm_source=site&utm_medium=whatsapp&utm_campaign=${source})`;
}

/** Texto del pedido (sin URL). Útil para tests y reuso. */
export function buildOrderMessage(
  items: CartItem[],
  source: WhatsAppOrderSource = 'checkout',
  notes?: string
) {
  let message =
    '¡Hola CREAFIT! 👋 Me gustaría realizar el siguiente pedido:\n\n';
  let total = 0;

  for (const item of items) {
    const subtotal = item.price * item.qty;
    total += subtotal;
    message += `• ${item.name} x${item.qty} — ${cop(subtotal)}\n`;
  }

  message += `\n━━━━━━━━━━━━━━━\n*TOTAL: ${cop(total)}*\n━━━━━━━━━━━━━━━\n\n¿Me podrían confirmar disponibilidad y medios de pago?`;

  const trimmed = notes?.trim();
  if (trimmed) {
    message += `\n\n📝 *Notas / comentarios:*\n${trimmed}`;
  }

  message += refLine(source);
  return message;
}

export function buildWhatsAppOrderUrl(
  items: CartItem[],
  source: WhatsAppOrderSource = 'checkout',
  notes?: string
) {
  const message = buildOrderMessage(items, source, notes);
  const num = getWhatsappDigits();
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppOrder(
  items: CartItem[],
  opts?: {
    source?: WhatsAppOrderSource;
    afterOpen?: () => void;
    notes?: string;
  }
) {
  if (!items.length) return;
  const source = opts?.source ?? 'checkout';
  const notes = opts?.notes?.trim();
  try {
    if (notes) sessionStorage.setItem(LAST_ORDER_NOTES_KEY, notes);
    else sessionStorage.removeItem(LAST_ORDER_NOTES_KEY);
  } catch {
    /* modo privado / storage bloqueado */
  }
  const url = buildWhatsAppOrderUrl(items, source, notes);
  window.open(url, '_blank', 'noopener,noreferrer');
  opts?.afterOpen?.();
}

/** Botón flotante: conversación general (no incluye carrito). */
export function buildWhatsAppConsultUrl() {
  const msg =
    '¡Hola CREAFIT! 👋 Tengo una consulta.\n\n(Ref. web · utm_source=site&utm_medium=whatsapp&utm_campaign=float-btn)';
  return `https://wa.me/${getWhatsappDigits()}?text=${encodeURIComponent(msg)}`;
}

export function openWhatsAppConsult() {
  window.open(buildWhatsAppConsultUrl(), '_blank', 'noopener,noreferrer');
}

export function getLastOrderNotesFromStorage(): string {
  try {
    return sessionStorage.getItem(LAST_ORDER_NOTES_KEY) ?? '';
  } catch {
    return '';
  }
}
