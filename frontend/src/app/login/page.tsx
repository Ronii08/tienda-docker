'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { loginAction, type AuthState } from '@/app/actions/auth'

const initialState: AuthState = { error: null }

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/historial'

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form action={formAction} className="w-full max-w-sm bg-white border rounded-xl p-6 shadow-sm">
        <input type="hidden" name="next" value={next} />
        <h1 className="text-2xl font-bold mb-1">Iniciar sesión</h1>
        <p className="text-gray-500 text-sm mb-6">Ingresá con tu correo y contraseña.</p>

        {state.error && (
          <p className="text-red-700 bg-red-50 border border-red-200 text-sm rounded p-2 mb-4">
            {state.error}
          </p>
        )}

        <label className="block text-sm font-medium mb-1" htmlFor="email">Correo</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block text-sm font-medium mb-1" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 text-white rounded py-2 font-medium disabled:opacity-50"
        >
          {pending ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="text-blue-600 hover:underline">
            Registrate
          </Link>
        </p>
      </form>
    </main>
  )
}
