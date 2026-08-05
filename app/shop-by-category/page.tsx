'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, ChevronRight, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const categories = [
  { id: 'educational', name: 'Educational Toys' },
  { id: 'rc-cars', name: 'RC & Remote Control' },
  { id: 'ride-on', name: 'Ride-on Toys' },
  { id: 'musical', name: 'Musical Toys' },
  { id: 'soft-toys', name: 'Soft Toys' },
  { id: 'wooden', name: 'Wooden Toys' },
  { id: 'activity', name: 'Activity Toys' },
  { id: 'outdoor', name: 'Outdoor Toys' },
]

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
}

export default function ShopByCategoryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const { addToCart } = useCart()

  // Set selected category from URL
  useEffect(() => {
    if (categoryId) {
      const found = categories.find(c => c.id === categoryId)
      if (found) {
        setSelectedCategory(found)
      }
    } else {
      // If no category in URL, default to first category
      router.push(`/shop-by-category?category=${categories[0].id}`)
    }
  }, [categoryId, router])

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // First try: search by tag
        const searchQuery = `tag:${selectedCategory.id}`
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&first=20`)
        const result = await response.json()
        
        if (result.success && result.data?.products?.edges && result.data.products.edges.length > 0) {
          setProducts(result.data.products.edges.map((edge: any) => edge.node))
        } else {
          // Second try: search by category name
          const fallbackResponse = await fetch(`/api/products/search?q=${encodeURIComponent(selectedCategory.name)}&first=20`)
          const fallbackResult = await fallbackResponse.json()
          
          if (fallbackResult.success && fallbackResult.data?.products?.edges) {
            setProducts(fallbackResult.data.products.edges.map((edge: any) => edge.node))
          } else {
            setProducts([])
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    if (selectedCategory) {
      fetchProducts()
    }
  }, [selectedCategory])

  const handleCategorySelect = (category: typeof categories[0]) => {
    setSelectedCategory(category)
    setIsMobileDropdownOpen(false)
    router.push(`/shop-by-category?category=${category.id}`)
  }

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

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
          🛍️ Shop by Category
        </h1>
        <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
          Explore our wide range of premium toys
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-800 font-comic">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${
                    selectedCategory.id === category.id
                      ? 'bg-[#FF6B35] text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium flex-1">{category.name}</span>
                  {selectedCategory.id === category.id && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories - Mobile Dropdown */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-md border border-gray-200"
          >
            <span className="font-semibold text-gray-800">
              {selectedCategory.name}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isMobileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full text-left px-4 py-3 transition flex items-center gap-3 ${
                      selectedCategory.id === category.id
                        ? 'bg-[#FF6B35] text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium flex-1">{category.name}</span>
                    {selectedCategory.id === category.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-comic text-gray-800">
               {selectedCategory.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {products.length} products found
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-[#FF6B35] hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">
                We couldn't find any products in this category yet.
                <br />
                Check back soon for new arrivals!
              </p>
              <Link 
                href="/products" 
                className="inline-block mt-4 bg-[#FF6B35] text-white px-6 py-2 rounded-full hover:bg-[#e55a2b] transition"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => {
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
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100 hover:border-[#FF6B35] flex flex-col"
                  >
                    <Link href={`/products/${product.handle}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                        />
                        {discount > 0 && (
                          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      <Link href={`/products/${product.handle}`}>
                        <h3 className="font-semibold text-base line-clamp-2 hover:text-[#FF6B35] transition min-h-[48px]">
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

                      <button
                        onClick={() => handleAddToCart(variantId, product.id)}
                        disabled={!variantId || isAdding}
                        className="w-full mt-3 py-2 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAdding ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
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