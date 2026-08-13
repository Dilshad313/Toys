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
  RotateCcw,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, isLoading, clearCart } = useCart()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdatingId(lineId)
    try {
      await updateQuantity(lineId, newQuantity)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemove = async (lineId: string) => {
    setUpdatingId(lineId)
    try {
      await removeFromCart(lineId)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }))
  }

  // Remove all items from cart
  const handleRemoveAll = () => {
    if (items.length === 0) return
    if (confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart()
    }
  }

  // Proceed to Checkout - Redirect to Shopify Checkout
  const handleCheckout = () => {
    const storeDomain = "athvi-toys.myshopify.com"
    
    let checkoutUrl = `https://${storeDomain}/cart/`
    
    const cartItems = items.map(item => {
      const numericVariantId = item.variantId.split("/").pop()
      return `${numericVariantId}:${item.quantity}`
    })
    
    checkoutUrl += cartItems.join(',')
    
    window.location.href = checkoutUrl
  }

  // ✅ Only show full-page skeleton on initial load when cart is empty
  if (isLoading && items.length === 0) {
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
    <div className="bg-gray-50 min-h-screen py-8 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-3xl md:text-4xl font-bold font-comic text-[#D32F2F]">
            🛒 My Cart ({totalItems} items)
          </h1>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={handleRemoveAll}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 transition font-medium text-[13.5px] md:text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full"
              >
                <X className="w-4 h-4" />
                Remove All
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Grid layout for mobile */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <AnimatePresence>
                {items.map((item, index) => {
                  const isUpdating = updatingId === item.id
                  const hasError = imageErrors[item.id]
                  const imageSrc = hasError ? '/placeholder.jpg' : (item.image || '/placeholder.jpg')
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ 
                        type: 'spring', 
                        damping: 25, 
                        stiffness: 300,
                        delay: index * 0.05
                      }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100 relative group"
                    >
                      {/* Remove Button - Top Right */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={isUpdating}
                        className="absolute top-2 right-2 z-10 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 p-1.5 rounded-full transition disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="p-2.5 sm:p-3">
                        {/* Product Image - Square */}
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={imageSrc}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(item.id)}
                          />
                          {isUpdating && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="mt-2 sm:mt-3">
                          <Link href={`/products/${item.handle}`}>
                            <h3 className="font-semibold text-[15.5px] sm:text-[16px] md:text-[17px] hover:text-[#D32F2F] transition line-clamp-2 font-comic leading-tight">
                              {item.title}
                            </h3>
                          </Link>
                          <div className="text-[13px] sm:text-[13.5px] md:text-[14px] text-gray-500 mt-0.5 font-medium">
                            ₹{parseFloat(item.price).toFixed(2)}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-50">
                            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating}
                                className="p-1.5 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 sm:w-8 text-center font-semibold text-[13px]">
                                {isUpdating ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={isUpdating}
                                className="p-1.5 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Total Price */}
                            <span className="text-[13px] sm:text-[13.5px] md:text-[14px] font-bold text-[#D32F2F]">
                              ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold font-comic text-[#D32F2F]">
                  Order Summary
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={handleRemoveAll}
                    className="text-[11.5px] md:text-xs text-red-500 hover:text-red-700 transition font-medium flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Remove All
                  </button>
                )}
              </div>

              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-[13.5px] md:text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">₹{parseFloat(totalPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13.5px] md:text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-[13.5px] md:text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-lg md:text-xl font-bold py-4 border-b border-gray-100">
                <span>Total</span>
                <span className="text-[#D32F2F]">₹{parseFloat(totalPrice).toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                className="w-full mt-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-3 rounded-full font-semibold transition flex items-center justify-center gap-2 text-[13.5px] md:text-sm"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>

              {/* Features */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-3 text-[13.5px] md:text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-green-500" />
                  <span>Free Shipping on orders above ₹499</span>
                </div>
                <div className="flex items-center gap-3 text-[13.5px] md:text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 text-[13.5px] md:text-sm text-gray-600">
                  <RotateCcw className="w-4 h-4 text-green-500" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </motion.div>
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