import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (name: string, price: number, image?: string) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  count: () => number;
}

let nextId = 1;

function syncNextIdFromItems(items: CartItem[]) {
  nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (name, price, image) => {
        set((state) => {
          const existing = state.items.find((i) => i.name === name);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.name === name ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return {
            items: [...state.items, { id: nextId++, name, price, qty: 1, image }],
          };
        });
        import('../lib/toastBus').then((m) =>
          m.showToast(`<strong>${name}</strong> añadido al carrito`)
        );
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) =>
        set((state) => ({
          items:
            qty < 1
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'creafit-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state?.items?.length) syncNextIdFromItems(state.items);
      },
    }
  )
);

/** Format number as Colombian peso */
export const cop = (n: number) => '$' + n.toLocaleString('es-CO');
