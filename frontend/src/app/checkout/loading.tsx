export default function Loading() {
  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    </main>
  )
}
