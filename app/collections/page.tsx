'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Star, Filter, Grid, List, Heart } from 'lucide-react'
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

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { addToCart } = useCart()

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/products?first=50')
        const result = await response.json()
        
        if (result.success && result.data?.products?.edges) {
          const productList = result.data.products.edges.map((edge: any) => edge.node)
          setProducts(productList)
        } else {
          setError('No products found')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load products')
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

  // Buy Now - Redirect to Shopify Checkout
  const handleBuyNow = (variantId: string) => {
    if (!variantId) {
      console.error('No variant ID available for Buy Now')
      return
    }

    const storeDomain = "athvi-toys.myshopify.com"
    const numericVariantId = variantId.split("/").pop()

    if (!numericVariantId) {
      console.error('Invalid variant ID format')
      return
    }

    const checkoutUrl = `https://${storeDomain}/cart/${numericVariantId}:1`
    console.log('🛒 Redirecting to checkout:', checkoutUrl)
    window.location.href = checkoutUrl
  }

  // Filter products by search term
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true
    return product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.productType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.variants?.edges?.[0]?.node?.price?.amount || '0')
    const priceB = parseFloat(b.variants?.edges?.[0]?.node?.price?.amount || '0')
    const dateA = new Date(a.id).getTime()
    const dateB = new Date(b.id).getTime()
    const titleA = a.title.toLowerCase()
    const titleB = b.title.toLowerCase()

    switch (sortBy) {
      case 'price-low':
        return priceA - priceB
      case 'price-high':
        return priceB - priceA
      case 'name':
        return titleA.localeCompare(titleB)
      case 'newest':
      default:
        return dateB - dateA
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F] mb-8">
          🛍️ All Collections
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-56 md:h-72 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F] mb-8">
          🛍️ All Collections
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
          🛍️ All Collections
        </h1>
        <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
          Explore our complete range of premium toys
        </p>
      </div>

     

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-500 text-sm">
          {sortedProducts.length} products found
        </p>
      </div>

      {/* Products Grid - 2 columns on mobile */}
      {sortedProducts.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {sortedProducts.map((product, i) => {
            const variant = product.variants?.edges?.[0]?.node
            const price = variant?.price?.amount || '0'
            const compareAt = variant?.compareAtPrice?.amount || null
            const imageUrl = product.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
            const variantId = variant?.id || ''
            const isAdding = addingToCart === product.id

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
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100 hover:border-[#FF6B35] flex flex-col"
              >
                {/* Product Image - Clickable */}
                <Link href={`/products/${product.handle}`}>
                  <div className="relative overflow-hidden cursor-pointer">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-110 transition duration-500"
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-[9px] md:text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                    {product.tags?.includes('best-seller') && (
                      <span className="absolute top-2 left-2 bg-[#D32F2F] text-white text-[9px] md:text-xs font-bold px-1.5 py-0.5 rounded-full">
                        ⭐ Best Seller
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-2.5 md:p-4 flex flex-col flex-1">
                  {/* Product Title - Clickable */}
                  <Link href={`/products/${product.handle}`}>
                    <h3 className="font-semibold text-[11px] sm:text-xs md:text-base line-clamp-2 hover:text-[#FF6B35] transition min-h-[32px] sm:min-h-[36px] md:min-h-[48px] cursor-pointer">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3 md:h-3 fill-current" />
                      <span className="text-gray-700 text-[9px] sm:text-xs ml-0.5">4.8</span>
                    </div>
                    <span className="text-gray-400 text-[8px] sm:text-[9px] md:text-xs">(245)</span>
                  </div>

                  <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-2">
                    <span className="text-sm sm:text-base md:text-xl font-bold text-[#D32F2F] font-comic">
                      ₹{parseFloat(price).toFixed(2)}
                    </span>
                    {compareAt && (
                      <span className="text-gray-400 line-through text-[8px] sm:text-[9px] md:text-xs">
                        ₹{parseFloat(compareAt).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Two Buttons - Responsive */}
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2 mt-2 md:mt-3">
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(variantId, product.id)}
                      disabled={!variantId || isAdding}
                      className="py-1.5 md:py-2 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-[9px] sm:text-[10px] md:text-xs font-semibold transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <>
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="hidden sm:inline">Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                          <span className="hidden sm:inline">Add</span>
                        </>
                      )}
                    </button>

                    {/* Buy Now Button */}
                    <button
                      onClick={() => handleBuyNow(variantId)}
                      disabled={!variantId}
                      className="py-1.5 md:py-2 rounded-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white text-[9px] sm:text-[10px] md:text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}