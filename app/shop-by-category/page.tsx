'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, ChevronRight, ChevronDown, Check, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Collection {
  id: string
  title: string
  handle: string
  description?: string
  image?: {
    url: string
    altText: string | null
  }
}

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
        title: string
        price: { amount: string }
        compareAtPrice?: { amount: string }
        availableForSale: boolean
      }
    }>
  }
  tags: string[]
}

function ShopByCategoryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryHandle = searchParams.get('category')
  const ageQuery = searchParams.get('age')

  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupProduct, setPopupProduct] = useState<Product | null>(null)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const { addToCart } = useCart()

  const ageMap: Record<string, string> = {
    '1-3-years': '1-3 Years',
    '2-4-years': '2-4 Years',
    '4-6-years': '4-6 Years',
    '6-8-years': '6-8 Years',
    '8+-years': '8+ Years',
  }

  // 1. Fetch all collections from Shopify on mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoadingCollections(true)
        const response = await fetch('/api/collections?first=50')
        const result = await response.json()

        console.log('Collections API response:', result)

        let list: Collection[] = []
        
        if (result.success && result.data?.collections) {
          list = result.data.collections.map((edge: any) => ({
            id: edge.node?.id || edge.id,
            title: edge.node?.title || edge.title,
            handle: edge.node?.handle || edge.handle,
            description: edge.node?.description || edge.description,
            image: edge.node?.image || edge.image,
          }))
        } else if (result.data?.collections?.edges) {
          list = result.data.collections.edges.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.handle,
            description: edge.node.description,
            image: edge.node.image,
          }))
        }

        setCollections(list)

        if (ageQuery && ageMap[ageQuery]) {
          // If viewing an age category, set a virtual collection
          setSelectedCollection({
            id: `age-${ageQuery}`,
            title: `Age: ${ageMap[ageQuery]}`,
            handle: `age-${ageQuery}`
          })
        } else if (list.length > 0) {
          let found = list[0]
          if (categoryHandle) {
            const matched = list.find((c: Collection) => c.handle === categoryHandle)
            if (matched) {
              found = matched
            }
          }
          setSelectedCollection(found)
          if (!categoryHandle) {
            router.push(`/shop-by-category?category=${found.handle}`, { scroll: false })
          }
        } else {
          setError('No collections found in your Shopify store.')
        }
      } catch (err) {
        console.error('Error fetching collections:', err)
        setError('Failed to load categories.')
      } finally {
        setLoadingCollections(false)
      }
    }

    fetchCollections()
  }, [categoryHandle, ageQuery, router])

  // 2. Fetch products inside the selected collection or by age
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCollection) return

      try {
        setLoadingProducts(true)
        setError(null)
        
        // Check if it's an age-based virtual collection
        if (selectedCollection.id.startsWith('age-')) {
          const ageKey = selectedCollection.id.replace('age-', '')
          const ageLabel = ageMap[ageKey]
          
          if (ageLabel) {
            // Fetch all products and filter by age variant
            const response = await fetch('/api/products?first=100')
            const result = await response.json()
            
            let allProducts: Product[] = []
            if (result.success && result.data?.products?.edges) {
              allProducts = result.data.products.edges.map((edge: any) => edge.node)
            }
            
            // Filter products that have the age as a variant option
            const filteredProducts = allProducts.filter(p => {
              return p.variants?.edges?.some(vEdge => {
                const title = vEdge.node.title || ''
                return title.includes(ageLabel)
              })
            })
            
            setProducts(filteredProducts)
          }
        } else {
          // Normal category fetch
          const response = await fetch(`/api/collections/${selectedCollection.handle}?first=50`)
          const result = await response.json()

          console.log('Products API response:', result)

          let fetchedProducts: Product[] = []
          
          if (result.success && result.data?.products?.edges) {
            fetchedProducts = result.data.products.edges.map((edge: any) => edge.node)
          } else if (result.data?.collectionByHandle?.products?.edges) {
            fetchedProducts = result.data.collectionByHandle.products.edges.map((edge: any) => edge.node)
          }

          setProducts(fetchedProducts)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products.')
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [selectedCollection])

  const handleCategorySelect = (collection: Collection) => {
    setSelectedCollection(collection)
    setIsMobileDropdownOpen(false)
    router.push(`/shop-by-category?category=${collection.handle}`, { scroll: false })
  }

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

  const handleBuyNow = (variantId: string) => {
    if (!variantId) return

    const storeDomain = "athvi-toys.myshopify.com"
    const numericVariantId = variantId.split("/").pop()
    const checkoutUrl = `https://${storeDomain}/cart/${numericVariantId}:1`
    window.location.href = checkoutUrl
  }

  if (loadingCollections) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            🛍️ Shop by Category
          </h1>
          <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
            Loading our curated collections...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            🛍️ Shop by Category
          </h1>
          <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
            Explore our wide range of premium toys by collection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-gray-800 font-comic">Categories</h3>
              <div className="space-y-1">
                {collections.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${
                      selectedCollection?.id === category.id
                        ? 'bg-[#FF6B35] text-white shadow-md'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium flex-1">{category.title}</span>
                    {selectedCollection?.id === category.id && (
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
                {selectedCollection?.title || 'Select Category'}
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
                  {collections.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-4 py-3 transition flex items-center gap-3 ${
                        selectedCollection?.id === category.id
                          ? 'bg-[#FF6B35] text-white'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-sm font-medium flex-1">{category.title}</span>
                      {selectedCollection?.id === category.id && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Products Grid - 2 columns on mobile */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold font-comic text-gray-800">
                {selectedCollection?.title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {products.length} products found
              </p>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-64 md:h-72 animate-pulse" />
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
                  href="/collections" 
                  className="inline-block mt-4 bg-[#FF6B35] text-white px-6 py-2 rounded-full hover:bg-[#e55a2b] transition"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {products.map((product, i) => {
                  const variant = product.variants?.edges?.[0]?.node
                  const price = variant?.price?.amount || '0'
                  const compareAt = variant?.compareAtPrice?.amount || null
                  const imageUrl = product.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
                  const variantId = variant?.id || ''
                  const isAdding = addingToCart === product.id
                  const isAdded = addedToCart === product.id

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
                            className="w-full h-36 sm:h-44 md:h-48 object-cover group-hover:scale-110 transition duration-500"
                          />
                          {discount > 0 && (
                            <span className="absolute top-2 right-2 bg-green-500 text-white text-[9px] md:text-xs font-bold px-1.5 py-0.5 rounded-full">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="p-2.5 md:p-4 flex flex-col flex-1">
                        <Link href={`/products/${product.handle}`}>
                          <h3 className="font-semibold text-[11px] sm:text-xs md:text-base line-clamp-2 hover:text-[#FF6B35] transition min-h-[32px] sm:min-h-[36px] md:min-h-[48px]">
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
                          <button
                            onClick={() => handleAddToCart(variantId, product.id, product)}
                            disabled={!variantId || isAdding}
                            className="w-full py-1.5 md:py-2 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-[9px] sm:text-[10px] md:text-xs font-semibold transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isAdding ? (
                              <>
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="hidden sm:inline">Adding...</span>
                              </>
                            ) : isAdded ? (
                              <>
                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                                <span className="hidden sm:inline">Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                                <span className="hidden sm:inline">Add to Cart</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleBuyNow(variantId)}
                            disabled={!variantId}
                            className="w-full py-1.5 md:py-2 rounded-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white text-[9px] sm:text-[10px] md:text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </div>

        <style jsx global>{`
          .font-comic {
            font-family: 'Baloo 2', 'Comic Neue', cursive;
          }
        `}</style>
      </div>

      {/* Cart Popup - Slides in from right */}
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

export default function ShopByCategoryPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            🛍️ Shop by Category
          </h1>
          <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
            Explore our wide range of premium toys
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <ShopByCategoryContent />
    </Suspense>
  )
}