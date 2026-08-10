'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Star, Check, Heart, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Product {
  id: string
  title: string
  handle: string
  description: string
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
      }
    }>
  }
  tags: string[]
  productType: string
  vendor: string
}

export default function TrendingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [popupProduct, setPopupProduct] = useState<Product | null>(null)
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

  // Fetch all products and filter for trending
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/products?first=50')
        const result = await response.json()

        if (result.success && result.data?.products?.edges) {
          const productList: Product[] = result.data.products.edges.map((edge: any) => edge.node)

          // Filter for trending products
          // If product tags contain "trending", "popular", "hot", "viral", or if the product is popular,
          // or as a fallback if no products have the tag, we can sort them or take a subset of products.
          const trendingList = productList.filter(product => {
            const hasTrendingTag = product.tags?.some(tag =>
              ['trending', 'popular', 'hot', 'viral', 'best-seller', 'bestseller'].includes(tag.toLowerCase())
            )
            return hasTrendingTag || product.variants?.edges?.[0]?.node?.availableForSale
          })

          setProducts(trendingList.slice(0, 16))
        } else {
          setError('No trending products found')
        }
      } catch (error) {
        console.error('Error fetching trending products:', error)
        setError('Failed to load trending products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (variantId: string, productId: string, product: Product) => {
    if (!variantId) return

    try {
      setAddingToCart(productId)
      await addToCart(variantId, 1)
      setAddedToCart(productId)
      setPopupProduct(product)
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false)
        setPopupProduct(null)
      }, 3000)
      setTimeout(() => {
        setAddedToCart(null)
        setAddingToCart(null)
      }, 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setAddingToCart(null)
    }
  }

  // Buy Now - Redirect to Shopify Checkout
  const handleBuyNow = (variantId: string) => {
    if (!variantId) return

    const storeDomain = "athvi-toys.myshopify.com"
    const numericVariantId = variantId.split("/").pop()
    const checkoutUrl = `https://${storeDomain}/cart/${numericVariantId}:1`
    window.location.href = checkoutUrl
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F] mb-8">
          🔥 Trending Toys
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F] mb-8">
          🔥 Trending Toys
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-[#FF6B35] hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
          🔥 Trending Toys
        </h1>
        <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
          The most popular and sought-after toys right now!
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No trending products found</h3>
          <p className="text-gray-500">
            Check back soon for popular arrivals!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => {
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 4) * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100 hover:border-[#FF6B35] flex flex-col relative"
              >
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(product.id)
                  }}
                  className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:shadow-lg transition hover:scale-110"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      inWishlist
                        ? 'fill-[#D32F2F] text-[#D32F2F]'
                        : 'text-gray-400 hover:text-[#D32F2F]'
                    }`}
                  />
                </button>

                {/* Product Image - Clickable */}
                <Link href={`/products/${product.handle}`}>
                  <div className="relative overflow-hidden cursor-pointer">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 bg-[#FAC310] text-[#1a1a2e] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      🔥 Trending
                    </span>
                  </div>
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  {/* Product Title - Clickable */}
                  <Link href={`/products/${product.handle}`}>
                    <h3 className="font-semibold text-base line-clamp-2 hover:text-[#FF6B35] transition min-h-[48px] cursor-pointer">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-gray-700 text-xs ml-1">4.8</span>
                    </div>
                    <span className="text-gray-400 text-xs">(245)</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-[#D32F2F] font-comic">
                      ₹{parseFloat(price).toFixed(2)}
                    </span>
                    {compareAt && (
                      <span className="text-gray-400 line-through text-xs">
                        ₹{parseFloat(compareAt).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Two Buttons - Add to Cart & Buy Now */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(variantId, product.id, product)}
                      disabled={!variantId || isAdding}
                      className="py-2 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add
                        </>
                      )}
                    </button>

                    {/* Buy Now Button */}
                    <button
                      onClick={() => handleBuyNow(variantId)}
                      disabled={!variantId}
                      className="py-2 rounded-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Cart Popup */}
      <AnimatePresence>
        {showPopup && popupProduct && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={popupProduct.images?.edges?.[0]?.node?.url || '/placeholder.jpg'}
                      alt={popupProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
                      {popupProduct.title}
                    </h4>
                    <p className="text-xs text-green-600 font-medium">✅ Added to cart!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href="/cart"
                  className="flex-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-center py-2 rounded-lg text-sm font-semibold transition"
                  onClick={() => setShowPopup(false)}
                >
                  View Cart
                </Link>
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}