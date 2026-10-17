'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { registerAction, type AuthState } from '@/app/actions/auth'

const initialState: AuthState = { error: null }

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState)

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form action={formAction} className="w-full max-w-sm bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Crear cuenta</h1>
        <p className="text-gray-500 text-sm mb-6">Registrate para poder comprar.</p>

        {state.error && (
          <p className="text-red-700 bg-red-50 border border-red-200 text-sm rounded p-2 mb-4">
            {state.error}
          </p>
        )}

        <label className="block text-sm font-medium mb-1" htmlFor="name">Nombre completo</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full border rounded px-3 py-2 mb-4"
        />

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
          minLength={8}
          autoComplete="new-password"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block text-sm font-medium mb-1" htmlFor="password_confirmation">
          Confirmar contraseña
        </label>
        <input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 text-white rounded py-2 font-medium disabled:opacity-50"
        >
          {pending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </main>
  )
}
