'use client'

import { logoutAction } from '@/app/actions/auth'

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-sm px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-700"
      >
        Cerrar sesión
      </button>
    </form>
  )
}
