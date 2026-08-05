'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, isLoading } = useCart()

  const handleQuantityChange = (lineId: string, currentQuantity: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(lineId, newQuantity)
  }

  const handleRemove = (lineId: string) => {
    removeFromCart(lineId)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-comic text-[#D32F2F]">
          🛒 My Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse mb-4" />
            ))}
          </div>
          <div className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-comic text-[#D32F2F]">
            🛒 Your Cart is Empty
          </h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any toys to your cart yet.
            <br />
            Let's go shopping!
          </p>
          <Link 
            href="/"
            className="inline-block bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Start Shopping →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-comic text-[#D32F2F]">
            🛒 My Cart ({totalItems} items)
          </h1>
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-[#D32F2F] transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Link href={`/products/${item.handle}`}>
                          <h3 className="font-semibold text-lg hover:text-[#D32F2F] transition line-clamp-2 font-comic">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">
                          ₹{parseFloat(item.price).toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-gray-400 hover:text-[#D32F2F] transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 border border-gray-100">
              <h2 className="text-xl font-bold mb-4 font-comic text-[#D32F2F]">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">₹{parseFloat(totalPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold py-4 border-b border-gray-100">
                <span>Total</span>
                <span className="text-[#D32F2F]">₹{parseFloat(totalPrice).toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button className="w-full mt-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-3 rounded-full font-semibold transition flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>

              {/* Features */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-green-500" />
                  <span>Free Shipping on orders above ₹499</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw className="w-4 h-4 text-green-500" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}