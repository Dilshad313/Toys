'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, X, Trash2 } from 'lucide-react'

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
  const loadWishlistIds = useCallback(() => {
    const saved = localStorage.getItem('wishlist')
    console.log('📦 Loading wishlist from localStorage:', saved)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed
        }
      } catch {
        // ignore
      }
    }
    return []
  }, [])

  // Fetch products from wishlist
  const loadWishlistProducts = useCallback(async (ids: string[]) => {
    console.log('🔍 Loading products for wishlist IDs:', ids)
    
    if (ids.length === 0) {
      console.log('📭 No wishlist items found')
      setWishlistItems([])
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/simple-products?first=50')
      const result = await response.json()
      
      console.log('📦 API Response:', result)
      
      if (result.success && result.data?.products?.edges) {
        const allProducts = result.data.products.edges.map((edge: any) => edge.node)
        console.log('📦 Total products from API:', allProducts.length)
        
        // Filter products that are in wishlist
        const filtered = allProducts
          .filter((p: any) => ids.includes(p.id))
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            handle: p.handle,
            price: p.variants?.edges?.[0]?.node?.price?.amount || '0',
            image: p.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
          }))
        
        console.log('✅ Filtered wishlist products:', filtered.length)
        setWishlistItems(filtered)
      } else {
        console.log('⚠️ No products found in API response')
        setWishlistItems([])
      }
    } catch (error) {
      console.error('❌ Error fetching wishlist:', error)
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Load wishlist on mount - THIS IS CRITICAL
  useEffect(() => {
    console.log('🔄 Wishlist page mounted - loading data...')
    const ids = loadWishlistIds()
    console.log('📋 Loaded IDs from localStorage:', ids)
    setWishlistIds(ids)
    loadWishlistProducts(ids)
  }, [loadWishlistIds, loadWishlistProducts])

  // Listen for storage changes (when wishlist is updated in other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      console.log('🔄 Storage event detected:', e.key, e.newValue)
      if (e.key === 'wishlist') {
        const ids = loadWishlistIds()
        console.log('📋 Updated IDs from storage event:', ids)
        setWishlistIds(ids)
        setLoading(true)
        loadWishlistProducts(ids)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [loadWishlistIds, loadWishlistProducts])

  // Listen for custom event when wishlist changes in the same tab
  useEffect(() => {
    const handleWishlistUpdate = () => {
      console.log('🔄 Wishlist update event detected')
      const ids = loadWishlistIds()
      console.log('📋 Updated IDs from custom event:', ids)
      setWishlistIds(ids)
      setLoading(true)
      loadWishlistProducts(ids)
    }

    window.addEventListener('wishlist-updated', handleWishlistUpdate)
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate)
  }, [loadWishlistIds, loadWishlistProducts])

  const removeFromWishlist = (productId: string) => {
    console.log('🗑️ Removing from wishlist:', productId)
    // Get current wishlist from localStorage
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      try {
        const ids = JSON.parse(saved)
        // Remove the product ID
        const updated = ids.filter((id: string) => id !== productId)
        console.log('📋 Updated wishlist IDs:', updated)
        // Save back to localStorage
        localStorage.setItem('wishlist', JSON.stringify(updated))
        // Update state - remove the item from display
        setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
        setWishlistIds(updated)
        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'))
        // Trigger custom event for same tab
        window.dispatchEvent(new Event('wishlist-updated'))
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
        <p className="text-gray-500 mb-2">Your wishlist is empty.</p>
        <p className="text-gray-400 text-sm mb-6">Save your favorite toys by clicking the heart icon on any product!</p>
        <Link 
          href="/"
          className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-3 rounded-full font-semibold transition inline-block"
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
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 hover:border-[#D32F2F] flex flex-col relative group"
          >
            {/* Remove Button - appears on hover */}
            <button
              onClick={() => removeFromWishlist(item.id)}
              className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:shadow-lg transition hover:scale-110 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-[#D32F2F] transition" />
            </button>

            {/* Heart icon to show it's in wishlist - always visible */}
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md">
                <Heart className="w-4 h-4 fill-[#D32F2F] text-[#D32F2F]" />
              </div>
            </div>

            {/* Product Image with Link */}
            <Link href={`/products/${item.handle}`}>
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
              </div>
            </Link>

            <div className="p-4 flex flex-col flex-1">
              <Link href={`/products/${item.handle}`}>
                <h3 className="font-semibold text-lg mb-1 line-clamp-2 font-comic hover:text-[#D32F2F] transition min-h-[56px]">
                  {item.title}
                </h3>
              </Link>
              
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