import ProductGridSkeleton from '@/components/product-grid-skeleton'

export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Catálogo</h1>
      <ProductGridSkeleton />
    </main>
  )
}
