import Link from 'next/link'

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Carnalitos Shop</h1>
      <p className="text-gray-600 mb-8">
        Catálogo, carrito y pago con Stripe, consumiendo la API de Laravel mediante
        Server Components y Server Actions.
      </p>
      <Link
        href="/productos"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
      >
        Ver catálogo
      </Link>
    </main>
  )
}
