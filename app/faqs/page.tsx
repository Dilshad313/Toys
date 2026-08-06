export default function FAQsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">FAQs</h1>
      <div className="max-w-3xl space-y-4">
        <div>
          <h3 className="font-semibold">Q: How do I place an order?</h3>
          <p className="text-gray-600">A: Browse products, add to cart, and proceed to checkout.</p>
        </div>
        <div>
          <h3 className="font-semibold">Q: What are the payment methods?</h3>
          <p className="text-gray-600">A: We accept Visa, RuPay, UPI, and COD.</p>
        </div>
      </div>
    </div>
  )
}