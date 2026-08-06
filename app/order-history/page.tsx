import Link from "next/link"

export default function OrderHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
        <p className="text-gray-600">Your order history will appear here after you make a purchase.</p>
        <Link href="/collections" className="inline-block mt-4 bg-[#D32F2F] text-white px-6 py-2 rounded-full hover:bg-[#B71C1C] transition">
          Start Shopping
        </Link>
      </div>
    </div>
  )
}