'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Check } from 'lucide-react'

interface AddToCartButtonProps {
  variantId: string
}

export default function AddToCartButton({ variantId }: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    try {
      await addToCart(variantId, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || !variantId}
      className={`mt-6 w-full py-4 rounded-full font-bold text-lg transition flex items-center justify-center gap-2 ${
        added
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-[#FF6B35] hover:bg-[#e55a2b] text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  )
}