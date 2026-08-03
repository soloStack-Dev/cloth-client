/**
 * cartStore.ts
 * ------------
 * Global client-side cart state (Zustand).
 *
 * The cart lives in browser memory so users can add products and see
 * totals instantly without a server round-trip.
 */

import { create } from 'zustand'

/** One line item in the cart. */
interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  size: string
  colorName: string
}

/** Everything the store exposes: the items plus the actions to change them. */
interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  // Start with an empty cart.
  items: [],

  // Append one item to the cart.
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),

  // Remove an item by its unique id.
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  // Change the quantity of one item, keeping everything else untouched.
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  // Empty the whole cart (used after checkout).
  clearCart: () => set({ items: [] }),

  // How many pieces in total (sum of quantities).
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  // Total price in dollars (sum of price × quantity).
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}))
