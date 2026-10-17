'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { Product } from '@/lib/types'

export type CartLine = {
  product: Product
  cantidad: number
}

type CartState = { lines: CartLine[] }

type CartAction =
  | { type: 'ADD'; product: Product; cantidad: number }
  | { type: 'REMOVE'; productId: number }
  | { type: 'SET_QTY'; productId: number; cantidad: number }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.lines.find((l) => l.product.id === action.product.id)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.product.id === action.product.id
              ? { ...l, cantidad: l.cantidad + action.cantidad }
              : l
          ),
        }
      }
      return { lines: [...state.lines, { product: action.product, cantidad: action.cantidad }] }
    }
    case 'REMOVE':
      return { lines: state.lines.filter((l) => l.product.id !== action.productId) }
    case 'SET_QTY':
      return {
        lines: state.lines.map((l) =>
          l.product.id === action.productId ? { ...l, cantidad: Math.max(1, action.cantidad) } : l
        ),
      }
    case 'CLEAR':
      return { lines: [] }
    default:
      return state
  }
}

type CartContextValue = {
  lines: CartLine[]
  addToCart: (product: Product, cantidad?: number) => void
  removeFromCart: (productId: number) => void
  setQuantity: (productId: number, cantidad: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] })

  const total = state.lines.reduce(
    (sum, l) => sum + Number(l.product.precio) * l.cantidad,
    0
  )
  const count = state.lines.reduce((sum, l) => sum + l.cantidad, 0)

  const value: CartContextValue = {
    lines: state.lines,
    addToCart: (product, cantidad = 1) => dispatch({ type: 'ADD', product, cantidad }),
    removeFromCart: (productId) => dispatch({ type: 'REMOVE', productId }),
    setQuantity: (productId, cantidad) => dispatch({ type: 'SET_QTY', productId, cantidad }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    total,
    count,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
