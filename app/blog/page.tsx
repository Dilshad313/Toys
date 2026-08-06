export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-bold">How to Choose the Perfect Toy</h3>
          <p className="text-gray-600 text-sm">Tips for selecting age-appropriate toys.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-bold">Benefits of Educational Toys</h3>
          <p className="text-gray-600 text-sm">Why learning through play matters.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-bold">Top 10 Toys for 2026</h3>
          <p className="text-gray-600 text-sm">The most popular toys this year.</p>
        </div>
      </div>
    </div>
  )
}