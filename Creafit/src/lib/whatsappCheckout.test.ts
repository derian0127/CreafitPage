import { describe, it, expect } from 'vitest';
import { buildOrderMessage, buildWhatsAppOrderUrl, getWhatsappDigits } from './whatsappCheckout';
import type { CartItem } from '../store/cartStore';

const sample: CartItem[] = [
  { id: 1, name: 'Whey Test', price: 10000, qty: 2 },
];

describe('whatsappCheckout', () => {
  it('buildOrderMessage incluye producto y ref utm', () => {
    const msg = buildOrderMessage(sample, 'cart-drawer');
    expect(msg).toContain('Whey Test');
    expect(msg).toContain('x2');
    expect(msg).toContain('utm_campaign=cart-drawer');
  });

  it('buildOrderMessage añade notas si vienen', () => {
    const msg = buildOrderMessage(sample, 'checkout', 'Entregar por la tarde');
    expect(msg).toContain('Entregar por la tarde');
    expect(msg).toContain('Notas / comentarios');
  });

  it('buildWhatsAppOrderUrl usa wa.me y texto codificado', () => {
    const url = buildWhatsAppOrderUrl(sample, 'checkout');
    expect(url.startsWith(`https://wa.me/${getWhatsappDigits()}?text=`)).toBe(true);
    const text = new URL(url).searchParams.get('text') ?? '';
    expect(text.length).toBeGreaterThan(10);
    expect(text).toContain('Whey Test');
  });
});
