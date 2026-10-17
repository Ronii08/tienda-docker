import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getOrders } from '@/lib/resources'
import { ApiRequestError } from '@/lib/api'
import OrderListSkeleton from '@/components/order-list-skeleton'

async function OrderList() {
  let orders
  try {
    const res = await getOrders()
    orders = res.data
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 401) {
      redirect('/login?next=/historial')
    }
    throw err
  }

  if (orders.length === 0) {
    return (
      <p className="text-gray-500">
        Todavía no tenés compras.{' '}
        <Link href="/productos" className="text-blue-600 hover:underline">
          Ver catálogo
        </Link>
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/checkout/${order.id}`}
          className="flex items-center justify-between bg-white border rounded-lg p-4 hover:shadow-sm"
        >
          <div>
            <p className="font-medium">Orden #{order.id}</p>
            <p className="text-xs text-gray-500">
              {new Date(order.created_at).toLocaleDateString('es-ES')} · {order.items.length}{' '}
              producto(s)
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
            <span
              className={`text-xs capitalize ${
                order.payment ? 'text-green-600' : 'text-amber-600'
              }`}
            >
              {order.payment ? 'Pagada' : order.estado}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function HistorialPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Mis compras</h1>
      <Suspense fallback={<OrderListSkeleton />}>
        <OrderList />
      </Suspense>
    </main>
  )
}
