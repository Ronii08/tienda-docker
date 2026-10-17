'use server'

import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { apiCreateOrder } from '@/lib/resources'
import { ApiRequestError } from '@/lib/api'

export type CreateOrderState = { error: string | null }

export async function createOrderAction(
  items: { product_id: number; cantidad: number }[]
): Promise<CreateOrderState> {
  if (items.length === 0) {
    return { error: 'Tu carrito está vacío.' }
  }

  let orderId: number

  try {
    const { data } = await apiCreateOrder(items)
    orderId = data.id
  } catch (err) {
    if (err instanceof ApiRequestError) {
      if (err.status === 401) {
        return { error: 'Necesitás iniciar sesión para completar la compra.' }
      }
      return { error: err.body.error || err.body.message || 'No se pudo crear la orden.' }
    }
    return { error: 'No se pudo crear la orden. Intentá de nuevo.' }
  }

  // El stock de los productos cambió: invalidamos el catálogo cacheado.
  updateTag('products')
  revalidatePath('/historial')

  redirect(`/checkout/${orderId}`)
}
