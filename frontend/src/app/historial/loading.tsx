import OrderListSkeleton from '@/components/order-list-skeleton'

export default function Loading() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Mis compras</h1>
      <OrderListSkeleton />
    </main>
  )
}
