import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/resources'
import { ApiRequestError } from '@/lib/api'
import AddToCartButton from './add-to-cart-button'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const { data: product } = await getProduct(id)

    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/productos" className="text-blue-600 text-sm">&larr; Volver al catálogo</Link>

        <div className="bg-white border rounded-xl p-6 mt-4">
          {product.categoria && (
            <span className="text-xs font-medium text-blue-600 uppercase">{product.categoria}</span>
          )}
          <h1 className="text-3xl font-bold mt-1">{product.nombre}</h1>
          <p className="text-gray-600 mt-3">{product.descripcion}</p>

          <div className="flex items-center justify-between mt-6">
            <span className="text-2xl font-bold">${Number(product.precio).toFixed(2)}</span>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </span>
          </div>

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>
        </div>
      </main>
    )
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) {
      notFound()
    }
    throw err
  }
}
