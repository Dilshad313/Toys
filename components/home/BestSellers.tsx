'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Check, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [showPopup, setShowPopup] = useState(false)
  const [popupProduct, setPopupProduct] = useState<Product | null>(null)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔄 Fetching Educational Toys...')
        
        const response = await fetch('/api/collections/educational-toys?first=12')
        const result = await response.json()
        console.log('📦 Response:', result)
        
        if (result.success) {
          let productsList = []
          
          // Check all possible response formats
          if (result.data?.products?.edges) {
            productsList = result.data.products.edges.map((edge: any) => edge.node)
          } else if (result.data?.collectionByHandle?.products?.edges) {
            productsList = result.data.collectionByHandle.products.edges.map((edge: any) => edge.node)
          } else if (result.data?.collection?.products?.edges) {
            productsList = result.data.collection.products.edges.map((edge: any) => edge.node)
          } else if (result.products && Array.isArray(result.products)) {
            productsList = result.products
          } else if (result.data?.products && Array.isArray(result.data.products)) {
            productsList = result.data.products
          }
          
          console.log('✅ Products found:', productsList.length)
          
          if (productsList.length > 0) {
            setProducts(productsList)
            setDebugInfo({ message: 'Products loaded', count: productsList.length })
          } else {
            setError('No products found in this collection')
            setDebugInfo(result)
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

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      scrollRight()
    }

    if (touchStartX - touchEndX < -50) {
      scrollLeft()
    }

    setTouchStartX(0)
    setTouchEndX(0)
  }

  const handleAddToCart = async (variantId: string, productId: string, product: Product) => {
    if (!variantId) {
      console.error('No variant ID available')
      return
    }

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

  // Helper function to get product image URL
  const getProductImage = (product: Product) => {
    if (product.images?.edges?.length > 0) {
      return product.images.edges[0].node.url
    }
    return '/placeholder.jpg'
  }

  // Helper function to get product price
  const getProductPrice = (product: Product) => {
    const variant = product.variants?.edges?.[0]?.node
    return variant?.price?.amount || '0'
  }

  // Helper function to get compare at price
  const getCompareAtPrice = (product: Product) => {
    const variant = product.variants?.edges?.[0]?.node
    return variant?.compareAtPrice?.amount || null
  }

  // Helper function to get variant ID
  const getVariantId = (product: Product) => {
    const variant = product.variants?.edges?.[0]?.node
    return variant?.id || ''
  }

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-comic text-[#D32F2F]">🧠 Educational Toys</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse shadow-md" />
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-comic text-[#D32F2F]">🧠 Educational Toys</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-comic text-[#D32F2F]">🧠 Educational Toys</h2>
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
    <>
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-comic text-[#D32F2F]">
                🧠 Educational Toys
              </h2>
              <p className="text-gray-600 mt-1 font-medium font-comic text-sm md:text-base">
                Our premium collection loved by kids everywhere!
              </p>
            </div>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            {/* Scroll Buttons */}
            <button
              onClick={scrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#D32F2F] w-10 h-10 rounded-full flex items-center justify-center transition ${
                canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } -ml-4 hidden md:flex`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={scrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#D32F2F] w-10 h-10 rounded-full flex items-center justify-center transition ${
                canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } -mr-4 hidden md:flex`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Scrollable Products - MOBILE: 2 products, DESKTOP: 4+ products */}
            <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={checkScroll}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {products.slice(0, 12).map((product, i) => {
                const price = getProductPrice(product)
                const compareAt = getCompareAtPrice(product)
                const imageUrl = getProductImage(product)
                const variantId = getVariantId(product)
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex-shrink-0 w-[45vw] sm:w-[200px] md:w-[240px] lg:w-[260px] snap-start"
                  >
                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden group border border-gray-100 hover:border-[#D32F2F] flex flex-col relative h-full">
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWishlist(product.id)
                        }}
                        className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:shadow-lg transition hover:scale-110"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
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
                            className="w-full h-36 sm:h-44 md:h-52 lg:h-56 object-cover group-hover:scale-110 transition duration-500"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg'
                            }}
                          />
                          {discount > 0 && (
                            <span className="absolute top-2 left-2 bg-green-500 text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-full">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Product Details */}
                      <Link href={`/products/${product.handle}`} className="flex-1">
                        <div className="p-2.5 md:p-3 flex flex-col flex-1 cursor-pointer">
                          <h3 
                            className="font-semibold text-[13px] sm:text-xs md:text-sm hover:text-[#FF6B35] transition font-comic leading-tight"
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
                          
                          <div className="flex items-center gap-1 mt-1.5">
                            <div className="flex items-center text-yellow-400">
                              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 fill-current" />
                              <span className="text-gray-700 ml-0.5 text-[9px] sm:text-[10px] md:text-xs">4.8</span>
                            </div>
                            <span className="text-gray-400 text-[8px] sm:text-[9px] md:text-[10px]">(245)</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-sm sm:text-base md:text-lg font-bold text-[#D32F2F] font-comic">
                              ₹{parseFloat(price).toFixed(2)}
                            </span>
                            {compareAt && (
                              <span className="text-gray-400 line-through text-[8px] sm:text-[9px] md:text-[10px]">
                                ₹{parseFloat(compareAt).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* Single Centered Add to Cart Button - REMOVED BUY NOW */}
                      <div className="p-2.5 md:p-3 pt-0">
                        <AnimatePresence mode="wait">
                          {isAdded ? (
                            <motion.button
                              key="added"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="w-full py-2.5 md:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base bg-green-500 text-white flex items-center justify-center gap-2 cursor-default"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span>Added to Cart</span>
                            </motion.button>
                          ) : isAdding ? (
                            <motion.button
                              key="adding"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="w-full py-2.5 md:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base bg-[#D32F2F] text-white flex items-center justify-center gap-2 opacity-70 cursor-wait"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Adding...</span>
                            </motion.button>
                          ) : (
                            <motion.button
                              key="add"
                              initial={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddToCart(variantId, product.id, product)
                              }}
                              disabled={!variantId}
                              className="w-full py-2.5 md:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base bg-[#D32F2F] hover:bg-[#B71C1C] text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span>Add to Cart</span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* ✅ View All Educational Toys Button */}
          <div className="flex justify-center mt-8">
            <Link 
              href="/shop-by-category?category=educational-toys"
              className="inline-block bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-3 rounded-full font-semibold transition shadow-md hover:shadow-lg text-sm md:text-base"
            >
              View All Educational Toys →
            </Link>
          </div>
        </div>

        <style jsx global>{`
          .font-comic {
            font-family: 'Baloo 2', 'Comic Neue', cursive;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

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
    </>
  )
}