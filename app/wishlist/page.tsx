'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, X } from 'lucide-react'

interface WishlistItem {
  id: string
  title: string
  handle: string
  price: string
  image: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState<string[]>([])

  // Load wishlist IDs from localStorage
  useEffect(() => {
    const loadWishlistIds = () => {
      const saved = localStorage.getItem('wishlist')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            setWishlistIds(parsed)
            return parsed
          }
        } catch {
          // ignore
        }
      }
      return []
    }

    const fetchWishlistProducts = async (ids: string[]) => {
      if (ids.length === 0) {
        setWishlistItems([])
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/simple-products?first=20')
        const result = await response.json()
        
        if (result.success && result.data?.products?.edges) {
          const allProducts = result.data.products.edges.map((edge: any) => edge.node)
          const filtered = allProducts
            .filter((p: any) => ids.includes(p.id))
            .map((p: any) => ({
              id: p.id,
              title: p.title,
              handle: p.handle,
              price: p.variants?.edges?.[0]?.node?.price?.amount || '0',
              image: p.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
            }))
          setWishlistItems(filtered)
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    const ids = loadWishlistIds()
    fetchWishlistProducts(ids)
  }, [])

  const removeFromWishlist = (productId: string) => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      try {
        const ids = JSON.parse(saved)
        const updated = ids.filter((id: string) => id !== productId)
        localStorage.setItem('wishlist', JSON.stringify(updated))
        setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
        // Update wishlistIds state
        setWishlistIds(updated)
        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'))
      } catch {
        // ignore
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 font-comic text-[#D32F2F]">❤️ My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4 font-comic text-[#D32F2F]">❤️ My Wishlist</h1>
        <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
        <Link 
          href="/"
          className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Start Shopping →
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 font-comic text-[#D32F2F]">
        ❤️ My Wishlist ({wishlistItems.length})
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 hover:border-[#D32F2F] flex flex-col relative"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeFromWishlist(item.id)}
              className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:shadow-lg transition hover:scale-110"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-[#D32F2F] transition" />
            </button>

            {/* Heart icon to show it's in wishlist */}
            <div className="absolute top-3 left-3 z-10">
              <Heart className="w-4 h-4 fill-[#D32F2F] text-[#D32F2F]" />
            </div>

            <div className="relative overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1 font-comic">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-700 ml-1 text-sm">4.8</span>
                </div>
                <span className="text-gray-400 text-sm">(245 reviews)</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold text-[#D32F2F] font-comic">
                  ₹{parseFloat(item.price).toFixed(2)}
                </span>
              </div>
              
              <Link
                href={`/products/${item.handle}`}
                className="w-full py-3 rounded-full font-semibold text-sm bg-[#D32F2F] hover:bg-[#B71C1C] text-white transition flex items-center justify-center gap-2 mt-auto"
              >
                <ShoppingCart className="w-4 h-4" />
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}