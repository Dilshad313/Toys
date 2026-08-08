'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, 
  ShoppingCart, 
  Check, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw, 
  Award,
  Minus,
  Plus,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Product {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
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
        width: number
        height: number
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
        quantityAvailable: number
        selectedOptions: Array<{
          name: string
          value: string
        }>
      }
    }>
  }
  options: Array<{
    name: string
    values: string[]
  }>
  tags: string[]
  productType: string
  vendor: string
  availableForSale: boolean
}

// Related products function to fetch from Shopify
async function fetchRelatedProducts(currentProductId: string) {
  try {
    const response = await fetch(`/api/products?first=6`)
    const result = await response.json()
    
    if (result.success && result.data?.products?.edges) {
      const allProducts = result.data.products.edges.map((edge: any) => edge.node)
      return allProducts.filter((p: any) => p.id !== currentProductId).slice(0, 6)
    }
    return []
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const handle = params?.handle as string
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [collectionName, setCollectionName] = useState<string>('Toys')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlist, setIsWishlist] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showCartPopup, setShowCartPopup] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const { addToCart } = useCart()

  // Wishlist management
  const [wishlistItems, setWishlistItems] = useState<string[]>([])

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (e) {
        console.error('Error loading wishlist:', e)
      }
    }
  }, [])

  useEffect(() => {
    // Save wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/products/${handle}`)
        const result = await response.json()
        
        if (result.success && result.data?.productByHandle) {
          const productData = result.data.productByHandle
          setProduct(productData)
          
          if (productData.variants?.edges?.length > 0) {
            setSelectedVariant(productData.variants.edges[0].node.id)
          }

          // Check if product is in wishlist
          if (wishlistItems.includes(productData.id)) {
            setIsWishlist(true)
          }

          // Get collection name from product tags
          if (productData.tags && productData.tags.length > 0) {
            const collectionTag = productData.tags.find((tag: string) => 
              ['educational', 'rc-cars', 'ride-on', 'musical', 'soft-toys', 'wooden', 'activity', 'outdoor'].includes(tag)
            )
            if (collectionTag) {
              const collectionNames: Record<string, string> = {
                'educational': 'Educational Toys',
                'rc-cars': 'RC Cars',
                'ride-on': 'Ride-on Toys',
                'musical': 'Musical Toys',
                'soft-toys': 'Soft Toys',
                'wooden': 'Wooden Toys',
                'activity': 'Activity Toys',
                'outdoor': 'Outdoor Toys'
              }
              setCollectionName(collectionNames[collectionTag] || 'Toys')
            }
          }

          const related = await fetchRelatedProducts(productData.id)
          setRelatedProducts(related)
        } else {
          setError('Product not found')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [handle, wishlistItems])

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    
    setAddingToCart(true)
    try {
      await addToCart(selectedVariant, quantity)
      setAddedToCart(true)
      setShowCartPopup(true)
      
      // Auto hide popup after 3 seconds
      setTimeout(() => {
        setShowCartPopup(false)
      }, 3000)
      
      setTimeout(() => setAddedToCart(false), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  // Buy Now - Redirect to Shopify Checkout
  const handleBuyNow = () => {
    if (!selectedVariant) return
    
    const storeDomain = "athvi-toys.myshopify.com"
    const numericVariantId = selectedVariant.split("/").pop()
    const checkoutUrl = `https://${storeDomain}/cart/${numericVariantId}:${quantity}`
    window.location.href = checkoutUrl
  }

  // Toggle Wishlist
  const toggleWishlist = () => {
    if (!product) return
    
    if (isWishlist) {
      setWishlistItems(wishlistItems.filter(id => id !== product.id))
      setIsWishlist(false)
    } else {
      setWishlistItems([...wishlistItems, product.id])
      setIsWishlist(true)
    }
  }

  // Share Product with Image
  const handleShare = async () => {
    const imageUrl = product?.images?.edges?.[0]?.node?.url || ''
    const price = parseFloat(product?.priceRange?.minVariantPrice?.amount || '0').toFixed(2)
    
    const shareText = `🛍️ ${product?.title}\n💰 ₹${price}\n⭐ Rating: 4.9/5\n\n${product?.description?.substring(0, 150) || ''}...\n\n🛒 Shop at Athvi Toys`
    
    if (navigator.share && imageUrl) {
      try {
        // Try to share with image
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], 'product.jpg', { type: 'image/jpeg' })
        
        await navigator.share({
          title: product?.title || 'Athvi Toys',
          text: shareText,
          url: window.location.href,
          files: [file]
        })
      } catch (error) {
        console.log('Share cancelled or failed')
        // Fallback: copy to clipboard
        await fallbackShare(shareText, imageUrl)
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title || 'Athvi Toys',
          text: shareText,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled')
        await fallbackShare(shareText, imageUrl)
      }
    } else {
      await fallbackShare(shareText, imageUrl)
    }
  }

  const fallbackShare = async (text: string, imageUrl: string) => {
    const fullText = `${text}\n\n🔗 ${window.location.href}\n📸 ${imageUrl}`
    
    try {
      await navigator.clipboard.writeText(fullText)
      alert('✅ Product details copied to clipboard!\n\nShare with your friends and family.')
    } catch (error) {
      // If clipboard fails, open a share dialog with the text
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`, '_blank')
    }
  }

  const getSpecifications = () => {
    const specs = []
    if (product?.productType) {
      specs.push({ label: 'Product Type', value: product.productType })
    }
    if (product?.vendor) {
      specs.push({ label: 'Brand', value: product.vendor })
    }
    if (product?.tags?.length) {
      specs.push({ label: 'Tags', value: product.tags.join(', ') })
    }
    if (product?.availableForSale !== undefined) {
      specs.push({ label: 'Availability', value: product.availableForSale ? 'In Stock' : 'Out of Stock' })
    }
    return specs
  }

  const getAdditionalDetails = () => {
    const details = []
    if (product?.variants?.edges?.length) {
      const variant = product.variants.edges[0].node
      if (variant.quantityAvailable !== undefined) {
        details.push({ label: 'Stock Quantity', value: variant.quantityAvailable.toString() })
      }
    }
    if (product?.priceRange?.minVariantPrice?.currencyCode) {
      details.push({ label: 'Currency', value: product.priceRange.minVariantPrice.currencyCode })
    }
    return details
  }

  // Get current variant price
  const getCurrentPrice = () => {
    if (!product) return '0'
    const variant = product.variants?.edges?.find((e: any) => e.node.id === selectedVariant)?.node
    return variant?.price?.amount || product.priceRange.minVariantPrice.amount
  }

  // Get current compare at price
  const getCurrentComparePrice = () => {
    if (!product) return null
    const variant = product.variants?.edges?.find((e: any) => e.node.id === selectedVariant)?.node
    return variant?.compareAtPrice?.amount || null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-gray-200 rounded-2xl h-72 md:h-96 animate-pulse" />
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 w-3/4 animate-pulse rounded" />
              <div className="bg-gray-200 h-6 w-1/2 animate-pulse rounded" />
              <div className="bg-gray-200 h-12 w-1/3 animate-pulse rounded" />
              <div className="bg-gray-200 h-24 animate-pulse rounded" />
              <div className="bg-gray-200 h-12 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="bg-[#D32F2F] text-white px-6 py-3 rounded-full hover:bg-[#B71C1C] transition inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  const currentPrice = getCurrentPrice()
  const currentComparePrice = getCurrentComparePrice()
  const discount = currentComparePrice ? Math.round(((parseFloat(currentComparePrice) - parseFloat(currentPrice)) / parseFloat(currentComparePrice)) * 100) : 0
  const variant = product.variants?.edges?.find((e: any) => e.node.id === selectedVariant)?.node
  const images = product.images?.edges?.map((e: any) => e.node) || []

  const specifications = getSpecifications()
  const additionalDetails = getAdditionalDetails()

  // Cart Popup Component
  const CartPopup = () => (
    <AnimatePresence>
      {showCartPopup && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-4 border border-green-100">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-sm">Added to Cart! 🎉</h3>
                <p className="text-xs text-gray-600 truncate">{product?.title}</p>
                <p className="text-xs text-[#D32F2F] font-semibold mt-1">
                  ₹{parseFloat(currentPrice).toFixed(2)} × {quantity}
                </p>
              </div>
              <button
                onClick={() => setShowCartPopup(false)}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href="/cart"
                className="flex-1 bg-[#D32F2F] text-white text-xs font-bold py-2 rounded-full text-center hover:bg-[#B71C1C] transition"
              >
                View Cart
              </Link>
              <button
                onClick={() => setShowCartPopup(false)}
                className="flex-1 bg-gray-100 text-gray-700 text-xs font-bold py-2 rounded-full hover:bg-gray-200 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      <CartPopup />
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6 flex items-center gap-1 md:gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#D32F2F] transition">Home</Link>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          <span className="text-gray-700 font-medium">{collectionName}</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          <span className="text-gray-700 font-medium truncate max-w-[120px] md:max-w-none">{product.title}</span>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Images */}
            <div>
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-md aspect-square">
                <img
                  src={images[selectedImage]?.url || '/placeholder.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {discount > 0 && (
                  <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {discount}% OFF
                  </span>
                )}
                <button
                  onClick={toggleWishlist}
                  className="absolute top-3 left-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:shadow-xl transition"
                >
                  <Heart className={`w-5 h-5 ${isWishlist ? 'fill-[#D32F2F] text-[#D32F2F]' : 'text-gray-400'}`} />
                </button>
              </div>

              <div className="flex gap-2 md:gap-3 mt-3 overflow-x-auto pb-2">
                {images.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                      selectedImage === index ? 'border-[#D32F2F]' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 md:mt-6">
                {[
                  { icon: Shield, label: 'Non-Toxic' },
                  { icon: Award, label: 'BIS Certified' },
                  { icon: Star, label: 'Premium' },
                  { icon: Truck, label: 'Made in India' },
                ].map((badge, i) => (
                  <div key={i} className="bg-white rounded-xl p-2 md:p-3 text-center shadow-sm border border-gray-100">
                    <badge.icon className="w-4 h-4 md:w-5 md:h-5 text-[#D32F2F] mx-auto mb-0.5 md:mb-1" />
                    <span className="text-[8px] md:text-[10px] font-medium text-gray-600">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div>
              <div className="mb-3 md:mb-4">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-comic">
                  {product.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1.5 md:mt-2">
                  <span className="bg-blue-100 text-blue-700 text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium">
                    Age 1-5 Years
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-xs md:text-sm">4.9</span>
                    <span className="text-gray-400 text-[10px] md:text-xs">(320)</span>
                  </div>
                  <span className="bg-[#D32F2F] text-white text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium">
                    #1 Best Seller
                  </span>
                  <span className="bg-orange-100 text-orange-700 text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium">
                    in {collectionName}
                  </span>
                </div>
              </div>

              <div className="mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-2xl md:text-3xl font-bold text-[#D32F2F] font-comic">
                    ₹{parseFloat(currentPrice).toFixed(2)}
                  </span>
                  {currentComparePrice && (
                    <span className="text-gray-400 line-through text-base md:text-lg">
                      ₹{parseFloat(currentComparePrice).toFixed(2)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-green-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                <h3 className="font-bold text-blue-700 text-xs md:text-sm mb-1.5 md:mb-2">Why Kids Love This?</h3>
                <ul className="space-y-1 text-xs md:text-sm text-gray-700">
                  <li className="flex items-start gap-1.5 md:gap-2">✨ Fun lights & cheerful music</li>
                  <li className="flex items-start gap-1.5 md:gap-2">🧠 Improves motor skills & coordination</li>
                  <li className="flex items-start gap-1.5 md:gap-2">👀 Enhances visual tracking</li>
                  <li className="flex items-start gap-1.5 md:gap-2">🛡️ Safe, durable & non-toxic material</li>
                </ul>
              </div>

              {/* Choose Your Option - Variants */}
              {product.options && product.options.length > 0 && (
                <div className="mb-3 md:mb-4">
                  <h3 className="font-semibold text-xs md:text-sm mb-1.5 md:mb-2">Choose Your Option</h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {product.variants?.edges?.map((e: any) => {
                      const v = e.node
                      const isSelected = selectedVariant === v.id
                      const vPrice = v.price.amount
                      const vCompare = v.compareAtPrice?.amount || null
                      const vDiscount = vCompare ? Math.round(((parseFloat(vCompare) - parseFloat(vPrice)) / parseFloat(vCompare)) * 100) : 0

                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVariant(v.id)
                            setQuantity(1)
                          }}
                          className={`p-2 md:p-3 rounded-xl border-2 transition text-left flex-1 min-w-[80px] md:min-w-[100px] ${
                            isSelected ? 'border-[#D32F2F] bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-[10px] md:text-xs font-medium text-gray-500">Price</div>
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            <span className="text-xs md:text-sm text-[#D32F2F] font-bold">₹{parseFloat(vPrice).toFixed(2)}</span>
                            {vCompare && (
                              <span className="text-gray-400 line-through text-[8px] md:text-[10px]">₹{parseFloat(vCompare).toFixed(2)}</span>
                            )}
                            {vDiscount > 0 && (
                              <span className="bg-green-500 text-white text-[8px] px-1 py-0.5 rounded-full">
                                {vDiscount}% OFF
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-3 md:mb-4">
                <h3 className="font-semibold text-xs md:text-sm mb-1.5 md:mb-2">Quantity</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition"
                    >
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <span className="w-10 md:w-12 text-center font-medium text-sm md:text-base">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] md:text-xs text-gray-500">
                    {variant?.quantityAvailable || 0} in stock
                  </span>
                </div>
              </div>

              {/* Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-3 md:mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-2.5 md:py-3 px-4 md:px-6 rounded-full font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base"
                >
                  {addingToCart ? (
                    <>
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs md:text-sm">Adding...</span>
                    </>
                  ) : addedToCart ? (
                    <>
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm">Added ✅</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm">Add to Cart</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-2.5 md:py-3 px-4 md:px-6 rounded-full font-bold transition flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  Buy Now
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="text-gray-500 text-xs md:text-sm flex items-center gap-1.5 md:gap-2 hover:text-[#D32F2F] transition"
              >
                <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Share this product
              </button>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-8 md:mt-12 bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex min-w-max">
                {['Description', 'Specifications', 'Additional Details'].map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition ${
                      activeTab === i ? 'border-[#D32F2F] text-[#D32F2F]' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 md:p-6">
              {activeTab === 0 && (
                <div className="prose max-w-none text-sm md:text-base">
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description || 'Product description coming soon...' }} />
                </div>
              )}
              {activeTab === 1 && (
                <div className="space-y-2 md:space-y-3">
                  {specifications.length > 0 ? (
                    specifications.map((spec, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 py-2 border-b border-gray-50">
                        <span className="font-semibold text-xs md:text-sm text-gray-600 md:w-1/3">{spec.label}</span>
                        <span className="text-xs md:text-sm text-gray-800">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs md:text-sm">No specifications available</p>
                  )}
                </div>
              )}
              {activeTab === 2 && (
                <div className="space-y-2 md:space-y-3">
                  {additionalDetails.length > 0 ? (
                    additionalDetails.map((detail, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 py-2 border-b border-gray-50">
                        <span className="font-semibold text-xs md:text-sm text-gray-600 md:w-1/3">{detail.label}</span>
                        <span className="text-xs md:text-sm text-gray-800">{detail.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs md:text-sm">No additional details available</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* You May Also Like */}
          {relatedProducts.length > 0 && (
            <div className="mt-8 md:mt-12">
              <h3 className="text-xl md:text-2xl font-bold font-comic text-[#D32F2F] mb-4 md:mb-6">You May Also Like</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {relatedProducts.map((relProduct) => {
                  const relVariant = relProduct.variants?.edges?.[0]?.node
                  const relPrice = relVariant?.price?.amount || relProduct.priceRange.minVariantPrice.amount
                  const relCompare = relVariant?.compareAtPrice?.amount || null
                  const relDiscount = relCompare ? Math.round(((parseFloat(relCompare) - parseFloat(relPrice)) / parseFloat(relCompare)) * 100) : 0
                  const relImage = relProduct.images?.edges?.[0]?.node?.url || '/placeholder.jpg'

                  return (
                    <Link href={`/products/${relProduct.handle}`} key={relProduct.id}>
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group">
                        <div className="relative overflow-hidden h-32 md:h-40">
                          <img src={relImage} alt={relProduct.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          {relDiscount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full">
                              {relDiscount}% OFF
                            </span>
                          )}
                        </div>
                        <div className="p-2 md:p-3">
                          <h4 className="font-semibold text-[10px] md:text-xs line-clamp-1">{relProduct.title}</h4>
                          <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                            <span className="text-xs md:text-sm font-bold text-[#D32F2F]">₹{parseFloat(relPrice).toFixed(2)}</span>
                            {relCompare && (
                              <span className="text-gray-400 line-through text-[8px] md:text-[10px]">₹{parseFloat(relCompare).toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Trust Stats */}
          <div className="mt-8 md:mt-12 bg-[#D32F2F] text-white rounded-2xl p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <div>
                <div className="text-xl md:text-3xl font-bold font-comic">25K+</div>
                <div className="text-[10px] md:text-sm opacity-80">Happy Families</div>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold font-comic">500+</div>
                <div className="text-[10px] md:text-sm opacity-80">Premium Toys</div>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold font-comic">1M+</div>
                <div className="text-[10px] md:text-sm opacity-80">Orders Delivered</div>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold font-comic">4.9 ★</div>
                <div className="text-[10px] md:text-sm opacity-80">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
        .prose {
          color: #374151;
          font-size: 0.875rem;
        }
        .prose p {
          margin-bottom: 0.75rem;
        }
        .prose ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .prose li {
          margin-bottom: 0.375rem;
        }
        @media (min-width: 768px) {
          .prose {
            font-size: 1rem;
          }
          .prose p {
            margin-bottom: 1rem;
          }
          .prose ul {
            padding-left: 1.5rem;
            margin-bottom: 1rem;
          }
          .prose li {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}