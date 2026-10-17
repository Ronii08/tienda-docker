'use server'

import { revalidatePath } from 'next/cache'
import { apiPay } from '@/lib/resources'
import { ApiRequestError } from '@/lib/api'

export type PayState = {
  error: string | null
  success?: { stripe_payment_id: string; monto: string; estado: string }
}

export async function payAction(_prevState: PayState, formData: FormData): Promise<PayState> {
  const orderId = Number(formData.get('orderId'))

  if (!orderId) {
    return { error: 'Orden inválida.' }
  }

  try {
    const { data } = await apiPay(orderId)
    revalidatePath(`/checkout/${orderId}`)
    revalidatePath('/historial')
    return { error: null, success: data }
  } catch (err) {
    if (err instanceof ApiRequestError) {
      if (err.status === 402) return { error: 'El pago fue rechazado por Stripe.' }
      if (err.status === 422) return { error: 'Esta orden ya fue procesada anteriormente.' }
      return { error: err.body.message || 'No se pudo procesar el pago.' }
    }
    return { error: 'No se pudo procesar el pago. Intentá de nuevo.' }
  }
}
