import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      <Link href="/productos" className="text-blue-600 mt-4 inline-block">
        Volver al catálogo
      </Link>
    </main>
  )
}
