import { Suspense } from 'react'
import { getProducts } from '@/lib/resources'
import ProductCard from '@/components/product-card'
import ProductGridSkeleton from '@/components/product-grid-skeleton'

// Server Component asíncrono: es la "sección pesada" (hace el fetch a la API)
// que envolvemos en <Suspense> para no bloquear el resto de la página mientras
// carga, y mostrar un skeleton en su lugar.
async function ProductList() {
  const { data: products } = await getProducts()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.length === 0 && <p className="text-gray-500 col-span-full">No hay productos.</p>}
    </div>
  )
}

export default function ProductosPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Catálogo</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductList />
      </Suspense>
    </main>
  )
}
