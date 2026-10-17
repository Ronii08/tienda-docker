export default function OrderListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white border rounded-lg p-4 animate-pulse h-16" />
      ))}
    </div>
  )
}
