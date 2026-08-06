export default function TrackOrderPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
      <div className="max-w-md">
        <p className="text-gray-600 mb-4">Enter your order ID to track your shipment.</p>
        <input 
          type="text" 
          placeholder="Order ID" 
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        <button className="bg-[#D32F2F] text-white px-6 py-2 rounded-lg hover:bg-[#B71C1C]">
          Track Order
        </button>
      </div>
    </div>
  )
}