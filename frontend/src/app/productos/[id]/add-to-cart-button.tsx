'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart-context'
import type { Product } from '@/lib/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (product.stock <= 0) {
    return (
      <button disabled className="px-5 py-2 rounded bg-gray-300 text-gray-500 cursor-not-allowed">
        Sin stock
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
    >
      {added ? '✓ Agregado' : 'Agregar al carrito'}
    </button>
  )
}
