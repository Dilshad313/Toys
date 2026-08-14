'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
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
  createdAt?: string
  totalInventory?: number
  availableForSale?: boolean
  metafields?: Array<{
    namespace: string
    key: string
    value: string
    type: string
  }>
}

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const { addToCart } = useCart()

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (e) {
        console.error('Error loading wishlist:', e)
      }
    }
  }, [])

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  // Fetch products - New Arrivals (sorted by created date)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        console.log('🔄 Fetching New Arrivals...')

        const response = await fetch('/api/products?first=50')
        const result = await response.json()

        let allProducts: Product[] = []
        if (result.success && result.data?.products?.edges) {
          allProducts = result.data.products.edges.map((edge: any) => edge.node)
        }

        // Filter for available products and sort by creation date (newest first)
        const newArrivals = allProducts
          .filter(p => p.availableForSale !== false)
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateB - dateA
          })

        setProducts(newArrivals)
        console.log(`✅ Found ${newArrivals.length} new arrivals`)

      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (variantId: string, productId: string) => {
    if (!variantId) return
    try {
      setAddingToCart(productId)
      await addToCart(variantId, 1)
      setTimeout(() => setAddingToCart(null), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setAddingToCart(null)
    }
  }

  // Toggle wishlist
  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setWishlistItems(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const getProductDetails = (product: Product) => {
    const variant = product.variants?.edges?.[0]?.node
    const price = variant?.price?.amount || '0'
    const compareAt = variant?.compareAtPrice?.amount || null
    const imageUrl = product.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
    const variantId = variant?.id || ''

    let discount = 0
    if (compareAt && parseFloat(compareAt) > parseFloat(price)) {
      discount = Math.round(((parseFloat(compareAt) - parseFloat(price)) / parseFloat(compareAt)) * 100)
    }

    return { price, compareAt, imageUrl, variantId, discount }
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return ''
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            ✨ New Arrivals
          </h1>
          <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
            Discover the latest toys added to our collection
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-64 md:h-80 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F] flex items-center gap-3">
            ✨ New Arrivals
          </h1>
          <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
            Discover the latest toys added to our collection
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {products.length} products found
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No new arrivals yet</h3>
            <p className="text-gray-500">
              Check back soon for new products!
            </p>
            <Link 
              href="/collections" 
              className="inline-block mt-4 bg-[#FF6B35] text-white px-6 py-2 rounded-full hover:bg-[#e55a2b] transition"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((product, i) => {
              const { price, compareAt, imageUrl, variantId, discount } = getProductDetails(product)
              const isAdding = addingToCart === product.id
              const isInWishlist = wishlistItems.includes(product.id)
              const createdDate = formatDate(product.createdAt)

              // Check if product has "new" tag
              const hasNewTag = product.tags?.some(tag => 
                ['new', 'new-arrival', 'fresh', 'just-in'].includes(tag.toLowerCase())
              )

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100 hover:border-[#D32F2F] flex flex-col h-full relative"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500 cursor-pointer"
                      onClick={() => window.location.href = `/products/${product.handle}`}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                    {/* New Badge */}
                    {(hasNewTag || i < 4) && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full z-10">
                        NEW
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full z-10"
                        style={{ marginLeft: (hasNewTag || i < 4) ? '58px' : '0px' }}
                      >
                        {discount}% OFF
                      </span>
                    )}
                    {/* Wishlist Icon */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition hover:scale-110 z-20"
                    >
                      <Heart 
                        className={`w-4 h-4 transition ${
                          isInWishlist 
                            ? 'fill-[#D32F2F] text-[#D32F2F]' 
                            : 'text-gray-600 hover:text-[#D32F2F]'
                        }`} 
                      />
                    </button>
                    {/* Date Badge */}
                    {createdDate && (
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[8px] md:text-[10px] px-2 py-0.5 rounded-full">
                        🗓️ {createdDate}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-2.5 md:p-4 flex flex-col flex-1">
                    <Link href={`/products/${product.handle}`}>
                      <h3 
                        className="font-semibold text-[14px] md:text-[16px] text-gray-900 hover:text-[#D32F2F] transition leading-tight cursor-pointer"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxHeight: '3em',
                        }}
                      >
                        {product.title}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                        <span className="text-gray-700 text-[9px] md:text-xs ml-0.5">4.8</span>
                      </div>
                      <span className="text-gray-400 text-[8px] md:text-[10px]">(245)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1.5 mt-1 md:mt-2 flex-wrap">
                      <span className="text-[15px] md:text-[19px] font-bold text-[#D32F2F] font-comic">
                        ₹{parseFloat(price).toFixed(2)}
                      </span>
                      {compareAt && (
                        <span className="text-gray-400 line-through text-[10px] md:text-[13px]">
                          ₹{parseFloat(compareAt).toFixed(2)}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="bg-green-100 text-green-700 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-auto pt-2 md:pt-3">
                      <button
                        onClick={() => handleAddToCart(variantId, product.id)}
                        disabled={!variantId || isAdding}
                        className="w-full py-2 md:py-2.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs md:text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] md:min-h-[42px] cursor-pointer"
                      >
                        {isAdding ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}