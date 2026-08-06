'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Check, Heart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  handle: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string | null
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        price: { amount: string }
        compareAtPrice?: { amount: string }
        availableForSale: boolean
        quantityAvailable?: number
      }
    }>
  }
}

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const { addToCart } = useCart()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist)
        if (Array.isArray(parsed)) {
          setWishlist(parsed)
        }
      } catch {
        setWishlist([])
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    } else {
      localStorage.removeItem('wishlist')
    }
  }, [wishlist])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔄 Fetching products...')
        
        let response = await fetch('/api/simple-products?first=12')
        
        if (!response.ok) {
          console.log('⚠️ simple-products failed, trying test API...')
          response = await fetch('/api/test')
        }
        
        const result = await response.json()
        console.log('📦 Response:', result)
        
        if (response.ok && result.success) {
          if (result.data?.products?.edges) {
            const productsList = result.data.products.edges.map((edge: any) => edge.node)
            setProducts(productsList)
            setDebugInfo({ message: 'Products loaded', count: productsList.length })
          } else {
            setDebugInfo(result)
            setError('No products found in response')
          }
        } else {
          setError(result.error || 'Failed to fetch products')
          setDebugInfo(result)
        }
      } catch (error: any) {
        console.error('❌ Error:', error)
        setError(error.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (variantId: string, productId: string) => {
    if (!variantId) {
      console.error('No variant ID available')
      return
    }

    try {
      setAddingToCart(productId)
      await addToCart(variantId, 1)
      setAddedToCart(productId)
      setTimeout(() => {
        setAddedToCart(null)
        setAddingToCart(null)
      }, 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setAddingToCart(null)
    }
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isInWishlist = prev.includes(productId)
      if (isInWishlist) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId)
  }

  // Buy Now - Redirect to Shopify Default Checkout Page
  const handleBuyNow = (variantId: string) => {
  if (!variantId) return

  const storeDomain = "athvi-toys.myshopify.com"

  // Extract numeric variant ID
  const numericVariantId = variantId.split("/").pop()

  const checkoutUrl = `https://${storeDomain}/cart/${numericVariantId}:1`

  window.location.href = checkoutUrl
}

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-comic text-[#D32F2F]">⭐ Best Sellers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl h-56 animate-pulse shadow-md" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-comic text-[#D32F2F]">⭐ Best Sellers</h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-2xl mx-auto">
            <p className="text-red-600 font-medium text-lg">⚠️ Error loading products</p>
            <p className="text-gray-600 text-sm mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#FF6B35] text-white px-6 py-2 rounded-full text-sm hover:bg-[#e55a2b] transition"
            >
              🔄 Retry
            </button>
            {debugInfo && (
              <div className="mt-4 text-left bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-40">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-comic text-[#D32F2F]">⭐ Best Sellers</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center max-w-2xl mx-auto">
            <p className="text-yellow-600 font-medium">📦 No products found</p>
            <p className="text-gray-600 text-sm mt-2">
              Add products to your Shopify store. They will appear here automatically.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-comic text-[#D32F2F]">
              ⭐ Best Sellers
            </h2>
            <p className="text-gray-600 mt-1 font-medium font-comic text-sm md:text-base">
              Our premium collection loved by kids everywhere! 🎉
            </p>
          </div>
          <Link 
            href="/collections"
            className="text-[#FF6B35] font-semibold hover:underline font-comic text-sm md:text-base"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {products.slice(0, 12).map((product, i) => {
            const variant = product.variants?.edges?.[0]?.node
            const price = variant?.price?.amount || '0'
            const compareAt = variant?.compareAtPrice?.amount || null
            const imageUrl = product.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
            const variantId = variant?.id || ''
            const isAdding = addingToCart === product.id
            const isAdded = addedToCart === product.id
            const inWishlist = isInWishlist(product.id)
            
            let discount = 0
            if (compareAt && parseFloat(compareAt) > parseFloat(price)) {
              discount = Math.round(((parseFloat(compareAt) - parseFloat(price)) / parseFloat(compareAt)) * 100)
            }

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 6) * 0.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden group border border-gray-100 hover:border-[#D32F2F] flex flex-col relative"
              >
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(product.id)
                  }}
                  className="absolute top-1.5 right-1.5 z-10 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:shadow-lg transition hover:scale-110"
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-colors ${
                      inWishlist 
                        ? 'fill-[#D32F2F] text-[#D32F2F]' 
                        : 'text-gray-400 hover:text-[#D32F2F]'
                    }`}
                  />
                </button>

                {/* Product Image */}
                <Link href={`/products/${product.handle}`}>
                  <div className="relative overflow-hidden cursor-pointer">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-36 object-cover group-hover:scale-110 transition duration-500"
                    />
                    {discount > 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                </Link>

                {/* Product Details */}
                <Link href={`/products/${product.handle}`} className="flex-1">
                  <div className="p-2 flex flex-col flex-1 cursor-pointer">
                    <h3 className="font-semibold text-[11px] line-clamp-2 hover:text-[#FF6B35] transition min-h-[32px] font-comic leading-tight">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span className="text-gray-700 ml-0.5 text-[9px]">4.8</span>
                      </div>
                      <span className="text-gray-400 text-[8px]">(245)</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-sm font-bold text-[#D32F2F] font-comic">
                        ₹{parseFloat(price).toFixed(2)}
                      </span>
                      {compareAt && (
                        <span className="text-gray-400 line-through text-[8px]">
                          ₹{parseFloat(compareAt).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Two Buttons */}
                <div className="p-2 pt-0 grid grid-cols-2 gap-1.5">
                  {/* Add to Cart Button */}
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.button
                        key="added"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="py-1.5 rounded-lg font-semibold text-[9px] bg-green-500 text-white flex items-center justify-center gap-1 cursor-default"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Check className="w-2.5 h-2.5" />
                        Added
                      </motion.button>
                    ) : isAdding ? (
                      <motion.button
                        key="adding"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="py-1.5 rounded-lg font-semibold text-[9px] bg-[#D32F2F] text-white flex items-center justify-center gap-1 opacity-70 cursor-wait"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </motion.button>
                    ) : (
                      <motion.button
                        key="add"
                        initial={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(variantId, product.id)
                        }}
                        disabled={!variantId}
                        className="py-1.5 rounded-lg font-semibold text-[9px] bg-[#D32F2F] hover:bg-[#B71C1C] text-white transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-2.5 h-2.5" />
                        Add
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Buy Now Button - Redirects to Shopify Default Checkout */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBuyNow(variantId)
                    }}
                    disabled={!variantId}
                    className="py-1.5 rounded-lg font-semibold text-[9px] bg-[#FF6B35] hover:bg-[#e55a2b] text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </section>
  )
}