import Link from 'next/link'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.id}`}
      className="border rounded-xl p-4 bg-white hover:shadow-lg transition-shadow flex flex-col"
    >
      {product.categoria && (
        <span className="text-xs font-medium text-blue-600 uppercase">{product.categoria}</span>
      )}
      <h2 className="font-semibold text-lg mt-1">{product.nombre}</h2>
      <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-1">{product.descripcion}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="font-bold">${Number(product.precio).toFixed(2)}</span>
        <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
        </span>
      </div>
    </Link>
  )
}
