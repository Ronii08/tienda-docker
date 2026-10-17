import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getOrder } from '@/lib/resources'
import { ApiRequestError } from '@/lib/api'
import PayButton from './pay-button'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  let order
  try {
    const res = await getOrder(orderId)
    order = res.data
  } catch (err) {
    // Defensa en profundidad: si el token no es válido (venció, o no existe),
    // el middleware ya debería haber redirigido, pero por si acaso.
    if (err instanceof ApiRequestError && err.status === 401) {
      redirect(`/login?next=/checkout/${orderId}`)
    }
    throw err
  }

  const yaPagada = order.estado !== 'pendiente' || !!order.payment

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <Link href="/historial" className="text-blue-600 text-sm">&larr; Mis compras</Link>

      <div className="bg-white border rounded-xl p-6 mt-4">
        <h1 className="text-2xl font-bold mb-1">Orden #{order.id}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Estado: <span className="font-medium capitalize">{order.estado}</span>
        </p>

        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span>
                {item.product?.nombre ?? `Producto #${item.product_id}`} × {item.cantidad}
              </span>
              <span>${(Number(item.precio_unitario) * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold mt-3 pt-3 border-t">
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>

        {yaPagada && order.payment ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="font-semibold text-green-800">✅ Esta orden ya fue pagada</p>
            <p className="text-sm text-green-700 mt-1">
              ID de pago: <span className="font-mono text-xs">{order.payment.stripe_payment_id}</span>
            </p>
          </div>
        ) : (
          <PayButton orderId={order.id} />
        )}
      </div>
    </main>
  )
}
