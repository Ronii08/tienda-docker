'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/cart-context'
import { createOrderAction } from '@/app/actions/orders'

export default function CarritoPage() {
  const { lines, removeFromCart, setQuantity, total, clearCart } = useCart()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleCheckout() {
    setError(null)
    const items = lines.map((l) => ({ product_id: l.product.id, cantidad: l.cantidad }))

    startTransition(async () => {
      const result = await createOrderAction(items)
      // Si createOrderAction hace redirect(), esta línea no se ejecuta.
      if (result?.error) {
        setError(result.error)
      } else {
        clearCart()
      }
    })
  }

  if (lines.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <Link href="/productos" className="text-blue-600 hover:underline">
          Ir al catálogo
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Tu carrito</h1>

      {error && (
        <p className="text-red-700 bg-red-50 border border-red-200 text-sm rounded p-2 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {lines.map((line) => (
          <div
            key={line.product.id}
            className="flex items-center justify-between bg-white border rounded-lg p-4"
          >
            <div>
              <p className="font-medium">{line.product.nombre}</p>
              <p className="text-sm text-gray-500">${Number(line.product.precio).toFixed(2)} c/u</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={line.product.stock}
                value={line.cantidad}
                onChange={(e) => setQuantity(line.product.id, Number(e.target.value) || 1)}
                className="w-16 border rounded px-2 py-1 text-center"
              />
              <button
                onClick={() => removeFromCart(line.product.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 border-t pt-4">
        <span className="text-lg font-bold">Total: ${total.toFixed(2)}</span>
        <button
          onClick={handleCheckout}
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Creando orden...' : 'Crear orden'}
        </button>
      </div>
    </main>
  )
}
