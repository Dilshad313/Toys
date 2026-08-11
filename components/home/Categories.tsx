'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react'
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
}

type TabType = 'trending' | 'new-arrivals' | 'best-sellers'

const ageCategories = [
  { name: '0-2 Years', image: '/age1.png' },
  { name: '2-4 Years', image: '/age2.png' },
  { name: '4-6 Years', image: '/age3.png' },
  { name: '6-8 Years', image: '/age4.png' },
  { name: '8+ Years', image: '/age5.png' },
]

export default function Categories() {
  const [activeTab, setActiveTab] = useState<TabType>('trending')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const { addToCart } = useCart()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const ageScrollRef = useRef<HTMLDivElement>(null)

  // Fetch products based on active tab
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        console.log(`Fetching ${activeTab} products...`)

        // First, fetch all products
        const allResponse = await fetch('/api/products?first=50')
        const allResult = await allResponse.json()

        let allProducts: Product[] = []
        if (allResult.success && allResult.data?.products?.edges) {
          allProducts = allResult.data.products.edges.map((edge: any) => edge.node)
        }

        let filteredProducts: Product[] = []

        switch (activeTab) {
          case 'trending':
            filteredProducts = allProducts
              .filter(p => p.availableForSale !== false)
              .sort((a, b) => {
                const aHasTag = a.tags?.some(tag => 
                  ['trending', 'popular', 'hot', 'viral'].includes(tag.toLowerCase())
                ) || false
                const bHasTag = b.tags?.some(tag => 
                  ['trending', 'popular', 'hot', 'viral'].includes(tag.toLowerCase())
                ) || false

                if (aHasTag && !bHasTag) return -1
                if (!aHasTag && bHasTag) return 1

                const aInventory = a.totalInventory || 0
                const bInventory = b.totalInventory || 0
                return bInventory - aInventory
              })
            break

          case 'new-arrivals':
            filteredProducts = allProducts
              .filter(p => p.availableForSale !== false)
              .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                return dateB - dateA
              })
            break

          case 'best-sellers':
            filteredProducts = allProducts
              .filter(p => p.availableForSale !== false)
              .sort((a, b) => {
                const aHasTag = a.tags?.some(tag => 
                  ['bestseller', 'best-seller', 'top-seller', 'popular'].includes(tag.toLowerCase())
                ) || false
                const bHasTag = b.tags?.some(tag => 
                  ['bestseller', 'best-seller', 'top-seller', 'popular'].includes(tag.toLowerCase())
                ) || false

                if (aHasTag && !bHasTag) return -1
                if (!aHasTag && bHasTag) return 1

                const aInventory = a.totalInventory || 0
                const bInventory = b.totalInventory || 0
                return bInventory - aInventory
              })
            break

          default:
            filteredProducts = allProducts
        }

        setProducts(filteredProducts.slice(0, 8))

        console.log(`${activeTab}: Found ${filteredProducts.length} products`)

      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeTab])

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

  const tabs = [
    { 
      id: 'trending' as TabType, 
      label: 'Trending',
    },
    { 
      id: 'new-arrivals' as TabType, 
      label: 'New Arrivals',
    },
    { 
      id: 'best-sellers' as TabType, 
      label: 'Best Sellers',
    },
  ]

  // Scroll functions for products
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' })
    }
  }

  // Scroll functions for age categories
  const ageScrollLeft = () => {
    if (ageScrollRef.current) {
      ageScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const ageScrollRight = () => {
    if (ageScrollRef.current) {
      ageScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-8 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-3 md:px-4">

        {/* ==================== SPECIAL PRODUCTS SECTION (FIRST) ==================== */}
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#D32F2F] font-comic">
            Loved by kids ❤️
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 md:mb-10">
          <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1 flex-wrap justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#D32F2F] rounded-full shadow-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - Horizontal Scroll on Mobile - 2 products visible */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-64 md:h-80 animate-pulse" />
              ))}
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <h3 className="text-xl font-semibold text-gray-700">No Products Found</h3>
              <p className="text-gray-500 mt-2">Check back later for new arrivals!</p>
            </motion.div>
          ) : (
            <div className="relative">
              {/* Scroll Buttons - Desktop Only */}
              <div className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={scrollLeft}
                  className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={scrollRight}
                  className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                ref={scrollContainerRef}
                className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scroll-smooth scrollbar-hide"
              >
                {products.slice(0, 8).map((product, i) => {
                  const { price, compareAt, imageUrl, variantId, discount } = getProductDetails(product)
                  const isAdding = addingToCart === product.id

                  // Check if product has specific tags for the active tab
                  const hasTrendingTag = product.tags?.some(tag => 
                    ['trending', 'popular', 'hot', 'viral'].includes(tag.toLowerCase())
                  )
                  const hasNewTag = product.tags?.some(tag => 
                    ['new', 'new-arrival', 'fresh'].includes(tag.toLowerCase())
                  )
                  const hasBestsellerTag = product.tags?.some(tag => 
                    ['bestseller', 'best-seller', 'top-seller'].includes(tag.toLowerCase())
                  )

                  let productBadge = ''
                  if (activeTab === 'trending' && hasTrendingTag) productBadge = 'Hot'
                  if (activeTab === 'new-arrivals' && hasNewTag) productBadge = 'New'
                  if (activeTab === 'best-sellers' && hasBestsellerTag) productBadge = 'Top'

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="min-w-[45vw] md:min-w-0 bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100 hover:border-[#D32F2F] flex flex-col"
                    >
                      {/* Product Image */}
                      <Link href={`/products/${product.handle}`}>
                        <div className="relative overflow-hidden aspect-square">
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg'
                            }}
                          />
                          {discount > 0 && (
                            <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full">
                              {discount}% OFF
                            </span>
                          )}
                          {productBadge && (
                            <span className={`absolute top-2 left-2 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full ${
                              activeTab === 'trending' ? 'bg-orange-500' :
                              activeTab === 'new-arrivals' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}>
                              {productBadge}
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="p-2 md:p-4 flex flex-col flex-1">
                        {/* Title - STRICTLY 2 LINES ONLY */}
                        <Link href={`/products/${product.handle}`}>
                          <h3 
                            className="font-semibold text-[10px] md:text-sm text-gray-900 hover:text-[#D32F2F] transition leading-tight"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxHeight: '2.8em',
                            }}
                          >
                            {product.title}
                          </h3>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                            <span className="text-gray-700 text-[10px] md:text-xs ml-0.5">4.8</span>
                          </div>
                          <span className="text-gray-400 text-[9px] md:text-xs">(245)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-1.5 mt-1 md:mt-2 flex-wrap">
                          <span className="text-sm md:text-lg font-bold text-[#D32F2F] font-comic">
                            Rs. {parseFloat(price).toFixed(2)}
                          </span>
                          {compareAt && (
                            <span className="text-gray-400 line-through text-[10px] md:text-xs">
                              Rs. {parseFloat(compareAt).toFixed(2)}
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="bg-green-100 text-green-700 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Single Centered Add to Cart Button - REMOVED BUY NOW */}
                        <div className="mt-2 md:mt-3">
                          <button
                            onClick={() => handleAddToCart(variantId, product.id)}
                            disabled={!variantId || isAdding}
                            className="w-full py-2 md:py-2.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs md:text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ==================== SHOP BY AGE SECTION (SECOND) - FULL WIDTH BLUE-600 BACKGROUND ==================== */}
        <div className="w-screen relative left-1/2 -translate-x-1/2 mt-12 md:mt-16">
          <div className="bg-blue-600 py-8 md:py-12 px-3 md:px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="container mx-auto"
            >
              {/* Shop by Age Title */}
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white font-comic">
                  Shop by Age
                </h2>
                <p className="text-white/80 text-sm md:text-base mt-2 font-comic">
                  Find the perfect toy for every stage
                </p>
              </div>

              {/* Age Categories - Horizontal Scroll on Mobile */}
              <div className="relative">
                {/* Scroll Buttons - Desktop Only */}
                <div className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={ageScrollLeft}
                    className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition border border-gray-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={ageScrollRight}
                    className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition border border-gray-200"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div
                  ref={ageScrollRef}
                  className="flex gap-8 md:gap-12 overflow-x-auto md:justify-center pb-4 scroll-smooth scrollbar-hide"
                >
                  {ageCategories.map((cat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col items-center group cursor-pointer flex-shrink-0"
                    >
                      <Link href={`/shop-by-category?age=${cat.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        {/* ROUND Image Container */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-110 border-4 border-white/30 group-hover:border-[#FFD700]">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg'
                            }}
                          />
                        </div>
                        {/* Age Label Below */}
                        <div className="mt-3 md:mt-4 text-center">
                          <span className="inline-block bg-white text-blue-600 text-xs md:text-sm font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full font-comic shadow-md">
                            {cat.name}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Dots for Age Categories */}
              <div className="flex justify-center mt-4 md:mt-6 gap-1.5 md:gap-2">
                {ageCategories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (ageScrollRef.current) {
                        const scrollAmount = ageScrollRef.current.scrollWidth / ageCategories.length
                        ageScrollRef.current.scrollTo({
                          left: scrollAmount * index,
                          behavior: 'smooth'
                        })
                      }
                    }}
                    className="rounded-full transition-all w-1.5 md:w-2 h-1.5 md:h-2 bg-white/40 hover:bg-white/60"
                    aria-label={`Go to age category ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </section>
  )
}