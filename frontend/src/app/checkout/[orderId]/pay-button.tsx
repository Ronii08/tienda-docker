'use client'

import { useActionState } from 'react'
import { payAction, type PayState } from '@/app/actions/payments'

const initialState: PayState = { error: null }

export default function PayButton({ orderId }: { orderId: number }) {
  const [state, formAction, pending] = useActionState(payAction, initialState)

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <p className="font-semibold text-green-800">✅ Pago procesado exitosamente</p>
        <dl className="text-sm text-green-700 mt-2 space-y-1">
          <div className="flex justify-between">
            <dt>ID de pago (Stripe)</dt>
            <dd className="font-mono text-xs">{state.success.stripe_payment_id}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Monto</dt>
            <dd>${state.success.monto}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Estado</dt>
            <dd className="capitalize">{state.success.estado}</dd>
          </div>
        </dl>
      </div>
    )
  }

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="orderId" value={orderId} />
      {state.error && (
        <p className="text-red-700 bg-red-50 border border-red-200 text-sm rounded p-2 mb-3">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 disabled:opacity-50"
      >
        {pending ? 'Procesando pago...' : 'Pagar con Stripe'}
      </button>
    </form>
  )
}
