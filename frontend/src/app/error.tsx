'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-red-600">Algo salió mal</h1>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Reintentar
      </button>
    </main>
  )
}
