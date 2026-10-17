'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-red-600">No se pudo cargar el catálogo</h1>
      <p className="text-gray-500 mt-2">
        Verificá que la API de Laravel esté corriendo (php artisan serve) e intentá de nuevo.
      </p>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Reintentar
      </button>
    </main>
  )
}
