'use client'

import Link from 'next/link'
import { useCart } from './cart-context'

export default function CartBadge() {
  const { count } = useCart()

  return (
    <Link href="/carrito" className="relative text-sm text-gray-700 hover:underline">
      Carrito
      {count > 0 && (
        <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  )
}
