import Link from 'next/link'
import { getToken } from '@/lib/session'
import CartBadge from './cart-badge'
import LogoutButton from './logout-button'

export default async function Nav() {
  const token = await getToken()

  return (
    <nav className="border-b bg-white px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg">
        🛒 Carnalitos Shop
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/productos" className="text-sm text-gray-700 hover:underline">
          Catálogo
        </Link>
        <CartBadge />
        {token ? (
          <>
            <Link href="/historial" className="text-sm text-gray-700 hover:underline">
              Mis compras
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-gray-700 hover:underline">
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
