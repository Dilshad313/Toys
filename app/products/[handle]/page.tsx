'use client'

import { useState, useEffect, useRef } from 'react'
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
  ChevronLeft,
  Sparkles,
  X,
  Package,
  Clock,
  CreditCard,
  Users,
  Zap,
  Music,
  Sun,
  CircleDot,
  Gift,
  Baby,
  Play,
  Rotate3d,
  Smile,
  Eye,
  Leaf,
  Video,
  Move,
  AlertCircle
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
        image?: {
          url: string
          altText: string | null
        }
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
  metafields?: Array<{
    namespace: string
    key: string
    value: string
  }>
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

// Mock data for features not available in Shopify API
const MOCK_VIEWERS_COUNT = 23
const MOCK_STOCK_LEFT = 16

// Delivery dates calculation - Dynamic based on current date
function getDeliveryDates() {
  const today = new Date()
  
  // Order placed today
  const orderDate = new Date(today)
  
  // Dispatched: tomorrow to day after tomorrow
  const dispatchStart = new Date(today)
  dispatchStart.setDate(today.getDate() + 1)
  const dispatchEnd = new Date(today)
  dispatchEnd.setDate(today.getDate() + 2)
  
  // Delivery: 3 to 4 days from now
  const deliveryStart = new Date(today)
  deliveryStart.setDate(today.getDate() + 3)
  const deliveryEnd = new Date(today)
  deliveryEnd.setDate(today.getDate() + 4)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return {
    orderDate: formatDate(orderDate),
    dispatchRange: `${formatDate(dispatchStart)} – ${formatDate(dispatchEnd)}`,
    deliveryRange: `${formatDate(deliveryStart)} – ${formatDate(deliveryEnd)}`
  }
}

// Why Kids Love This data from the image
const WHY_KIDS_LOVE = [
  { icon: Music, text: 'Fun lights & cheerful music', color: 'text-blue-500' },
  { icon: Zap, text: 'Improves motor skills & coordination', color: 'text-yellow-500' },
  { icon: Eye, text: 'Enhances visual tracking', color: 'text-orange-500' },
  { icon: Leaf, text: 'Safe, durable & non-toxic material', color: 'text-green-500' }
]

// Key Features data from the image
const KEY_FEATURES = [
  { icon: Sun, title: '360° Rotating Lights', description: 'Colorful LED lights that attract & engage kids.', color: 'text-orange-500' },
  { icon: CircleDot, title: 'Floating Ball', description: 'Ball floats with air flow – magical fun!', color: 'text-purple-500' },
  { icon: Music, title: 'Cheerful Music', description: 'Fun music keeps kids entertained for hours.', color: 'text-blue-500' },
  { icon: Truck, title: 'Smooth Wheels', description: 'Easy to move & play anywhere.', color: 'text-green-500' }
]

// Perfect For data from the image
const PERFECT_FOR = [
  { icon: Gift, title: 'Birthday Gifts', color: 'text-pink-500', bg: 'bg-pink-50' },
  { icon: Baby, title: 'Learning & Play', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Sparkles, title: 'Return Gifts', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { icon: Heart, title: 'Toddler Playtime', color: 'text-green-500', bg: 'bg-green-50' }
]

// What's in the Box data from the image
const WHATS_IN_BOX = [
  { icon: CircleDot, title: '1 × Elephant Drummer Toy', color: 'text-[#D32F2F]' },
  { icon: CircleDot, title: '1 × Floating Ball', color: 'text-blue-500' },
  { icon: CircleDot, title: '1 × Drum Sticks (Built-in)', color: 'text-green-500' },
  { icon: CircleDot, title: '1 × User Manual', color: 'text-purple-500' }
]

// Function to get color classes based on color name
const getColorClasses = (colorName: string) => {
  const colorMap: Record<string, { border: string, bg: string, text: string, ring: string }> = {
    'Blue': { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-500' },
    'Pink': { border: 'border-pink-500', bg: 'bg-pink-50', text: 'text-pink-700', ring: 'ring-pink-500' },
    'Red': { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-500' },
    'Green': { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-500' },
    'Yellow': { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700', ring: 'ring-yellow-500' },
    'Purple': { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-500' },
    'Orange': { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-500' },
    'Black': { border: 'border-gray-800', bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-800' },
    'White': { border: 'border-gray-300', bg: 'bg-gray-50', text: 'text-gray-700', ring: 'ring-gray-400' },
    'Gold': { border: 'border-yellow-600', bg: 'bg-yellow-50', text: 'text-yellow-700', ring: 'ring-yellow-600' },
    'Silver': { border: 'border-gray-400', bg: 'bg-gray-50', text: 'text-gray-600', ring: 'ring-gray-400' },
  }
  return colorMap[colorName] || { border: 'border-[#D32F2F]', bg: 'bg-red-50', text: 'text-[#D32F2F]', ring: 'ring-[#D32F2F]' }
}

// Toast Message Component
const ToastMessage = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'warning', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
  const icon = type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 max-w-md w-full`}
    >
      {icon}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const handle = params?.handle as string
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [collectionName, setCollectionName] = useState<string>('Musical Toys')
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
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [show360View, setShow360View] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'warning' } | null>(null)
  const { addToCart } = useCart()
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Wishlist management
  const [wishlistItems, setWishlistItems] = useState<string[]>([])

  // 360 Degree View Functions
  const startAutoRotate = () => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current)
    }
    autoRotateRef.current = setInterval(() => {
      setRotationAngle(prev => (prev + 1) % 360)
    }, 50)
  }

  const stopAutoRotate = () => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current)
      autoRotateRef.current = null
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    stopAutoRotate()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX
    setRotationAngle(prev => (prev + deltaX * 0.5) % 360)
    setStartX(e.clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    startAutoRotate()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    stopAutoRotate()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - startX
    setRotationAngle(prev => (prev + deltaX * 0.5) % 360)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    startAutoRotate()
  }

  // Get image for 360 view based on rotation angle
  const get360Image = () => {
    if (!product || product.images.edges.length === 0) return null
    const images = product.images.edges.map((e: any) => e.node)
    const totalImages = images.length
    const index = Math.floor((rotationAngle / 360) * totalImages) % totalImages
    return images[index]
  }

  // Scroll functions for color options
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

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

  useEffect(() => {
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

          // Check if product has video (check metafields for video URL)
          if (productData.metafields) {
            const videoMetafield = productData.metafields.find(
              (mf: any) => mf.namespace === 'custom' && mf.key === 'video_url'
            )
            if (videoMetafield && videoMetafield.value) {
              setHasVideo(true)
            }
          }

          // Also check if description contains video embed
          if (productData.descriptionHtml && productData.descriptionHtml.includes('youtube') || 
              productData.descriptionHtml && productData.descriptionHtml.includes('vimeo') ||
              productData.descriptionHtml && productData.descriptionHtml.includes('video')) {
            setHasVideo(true)
          }

          // Initialize selected options from first variant
          if (productData.variants?.edges?.length > 0) {
            const firstVariant = productData.variants.edges[0].node
            setSelectedVariant(firstVariant.id)

            // Build selected options from first variant
            const initialOptions: Record<string, string> = {}
            firstVariant.selectedOptions?.forEach((opt: any) => {
              initialOptions[opt.name] = opt.value
            })
            setSelectedOptions(initialOptions)
          }

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

  // Update selected variant when options change
  useEffect(() => {
    if (!product || Object.keys(selectedOptions).length === 0) return

    const matchedVariant = product.variants.edges.find((edge: any) => {
      const variant = edge.node
      return variant.selectedOptions.every((opt: any) => 
        selectedOptions[opt.name] === opt.value
      )
    })

    if (matchedVariant) {
      setSelectedVariant(matchedVariant.node.id)
      // Update selected image to variant image if available
      if (matchedVariant.node.image?.url) {
        const variantImageIndex = product.images.edges.findIndex(
          (edge: any) => edge.node.url === matchedVariant.node.image!.url
        )
        if (variantImageIndex !== -1) {
          setSelectedImage(variantImageIndex)
        }
      }
    }
  }, [selectedOptions, product])

  // Start auto-rotate when 360 view opens
  useEffect(() => {
    if (show360View) {
      startAutoRotate()
    } else {
      stopAutoRotate()
      setRotationAngle(0)
    }
    return () => stopAutoRotate()
  }, [show360View])

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }))
  }

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    const currentStock = variant?.quantityAvailable || 0
    if (type === 'increase') {
      if (quantity >= currentStock) {
        setToast({ message: `Only ${currentStock} items available in stock!`, type: 'warning' })
        return
      }
      setQuantity(prev => prev + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setToast({ message: 'Please select a color option first!', type: 'warning' })
      return
    }

    const currentStock = variant?.quantityAvailable || 0
    if (quantity > currentStock) {
      setToast({ message: `Only ${currentStock} items available in stock!`, type: 'error' })
      return
    }

    setAddingToCart(true)
    try {
      await addToCart(selectedVariant, quantity)
      setAddedToCart(true)
      setShowCartPopup(true)
      setToast({ message: `Added ${quantity} item(s) to cart! 🎉`, type: 'success' })

      setTimeout(() => {
        setShowCartPopup(false)
      }, 3000)

      setTimeout(() => setAddedToCart(false), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setToast({ message: 'Failed to add to cart. Please try again.', type: 'error' })
    } finally {
      setAddingToCart(false)
    }
  }

  // Buy Now - Redirect to Shopify Checkout with selected variant
  const handleBuyNow = () => {
    if (!selectedVariant) {
      setToast({ message: 'Please select a color option first!', type: 'warning' })
      return
    }

    const currentStock = variant?.quantityAvailable || 0
    if (quantity > currentStock) {
      setToast({ message: `Only ${currentStock} items available in stock!`, type: 'error' })
      return
    }

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

  // Get selected variant title
  const getSelectedVariantTitle = () => {
    if (!product) return ''
    const variant = product.variants?.edges?.find((e: any) => e.node.id === selectedVariant)?.node
    return variant?.title || ''
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
        <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
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
  const deliveryDates = getDeliveryDates() // Dynamic dates
  const selectedVariantTitle = getSelectedVariantTitle()
  const currentStock = variant?.quantityAvailable || 0

  const specifications = getSpecifications()
  const additionalDetails = getAdditionalDetails()

  // Group variants by option for the "Choose Your Option" selector
  const colorOption = product.options?.find(opt => 
    opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
  )

  const otherOptions = product.options?.filter(opt => 
    !opt.name.toLowerCase().includes('color') && !opt.name.toLowerCase().includes('colour')
  )

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
                <p className="text-xs text-gray-500">Variant: {selectedVariantTitle}</p>
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

      {/* Toast Messages */}
      <AnimatePresence>
        {toast && (
          <ToastMessage 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="text-[13.5px] md:text-[14px] text-gray-500 mb-4 md:mb-6 flex items-center gap-1 md:gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#D32F2F] transition">Home</Link>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hover:text-[#D32F2F] transition">Toys</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          <span className="text-gray-700 font-medium truncate max-w-[120px] md:max-w-none text-[13.5px] md:text-[14px]">{product.title}</span>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column - Images (5 cols) */}
            <div className="lg:col-span-5">
              <div className="flex gap-3">
                {/* Thumbnail column with vertical scroll */}
                <div className="flex flex-col gap-2 w-16 md:w-20 flex-shrink-0 max-h-[400px] md:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                        selectedImage === index ? 'border-[#D32F2F]' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                      {hasVideo && index === 1 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                  {/* 360 View button */}
                  <button
                    onClick={() => setShow360View(true)}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 border-gray-200 hover:border-[#D32F2F] flex flex-col items-center justify-center gap-1 transition bg-white flex-shrink-0"
                  >
                    <Rotate3d className="w-5 h-5 text-gray-600" />
                    <span className="text-[8px] text-gray-500 font-medium">360° View</span>
                  </button>
                </div>

                {/* Main image - Square with reduced height */}
                <div className="flex-1 relative bg-white rounded-2xl overflow-hidden shadow-md aspect-square max-h-[400px] md:max-h-[500px]">
                  <img
                    src={images[selectedImage]?.url || '/placeholder.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  <button
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 mt-8 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:shadow-xl transition"
                  >
                    <Heart className={`w-5 h-5 ${isWishlist ? 'fill-[#D32F2F] text-[#D32F2F]' : 'text-gray-400'}`} />
                  </button>

                  {/* Image navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-1.5 rounded-full shadow-md hover:bg-white transition"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-1.5 rounded-full shadow-md hover:bg-white transition"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Trust badges row - moved up 70px */}
              <div className="grid grid-cols-3 gap-2 mt-[-10px] relative z-10">
                <div className="bg-white rounded-xl p-2 md:p-3 text-center shadow-sm border border-gray-100 flex flex-col items-center gap-1">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="text-[13.5px] md:text-[13px] font-bold text-gray-700">Free Shipping</span>
                  <span className="text-[11.5px] md:text-[11px] text-gray-500">Above ₹499</span>
                </div>
                <div className="bg-white rounded-xl p-2 md:p-3 text-center shadow-sm border border-gray-100 flex flex-col items-center gap-1">
                  <RotateCcw className="w-5 h-5 text-green-500" />
                  <span className="text-[13.5px] md:text-[13px] font-bold text-gray-700">5 Days</span>
                  <span className="text-[11.5px] md:text-[11px] text-gray-500">Easy Returns</span>
                  <span className="text-[10.5px] md:text-[11px] text-gray-400">Unboxing video is required</span>
                </div>
                <div className="bg-white rounded-xl p-2 md:p-3 text-center shadow-sm border border-gray-100 flex flex-col items-center gap-1">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <span className="text-[13.5px] md:text-[13px] font-bold text-gray-700">Secure</span>
                  <span className="text-[11.5px] md:text-[11px] text-gray-500">Payments</span>
                </div>
              </div>

              {/* Delivery Timeline - moved below trust badges */}
              <div className="bg-white rounded-xl p-3 md:p-4 mt-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <Package className="w-5 h-5 text-blue-500" />
                    <span className="text-[12.5px] md:text-[13px] font-bold text-gray-700">{deliveryDates.orderDate}</span>
                    <span className="text-[10.5px] md:text-[11px] text-gray-500">Order Placed</span>
                  </div>
                  <div className="w-8 md:w-12 h-0.5 bg-gray-200" />
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <Truck className="w-5 h-5 text-orange-500" />
                    <span className="text-[12.5px] md:text-[13px] font-bold text-gray-700">{deliveryDates.dispatchRange}</span>
                    <span className="text-[10.5px] md:text-[11px] text-gray-500">Dispatched</span>
                  </div>
                  <div className="w-8 md:w-12 h-0.5 bg-gray-200" />
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-[12.5px] md:text-[13px] font-bold text-gray-700">{deliveryDates.deliveryRange}</span>
                    <span className="text-[10.5px] md:text-[11px] text-gray-500">Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Info (7 cols) */}
            <div className="lg:col-span-7">
              <div className="mb-3 md:mb-4">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-comic leading-tight">
                  {product.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                  <span className="bg-green-100 text-green-700 text-[13.5px] md:text-[13px] px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Age 1-5 Years
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-[13.5px] md:text-[14px]">4.9</span>
                    <span className="text-gray-400 text-[12.5px] md:text-[13px]">(320 Reviews)</span>
                  </div>
                  <span className="bg-[#D32F2F] text-white text-[13.5px] md:text-[13px] px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium">
                    #1 Best Seller
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-[13.5px] md:text-[13px] px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium">
                    in {collectionName}
                  </span>
                </div>
              </div>

              {/* Price */}
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
                    <span className="bg-red-100 text-red-600 text-xs md:text-sm font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-[13.5px] md:text-[13px] text-gray-500 mt-0.5">Inclusive of all taxes</p>
              </div>

              {/* Why Kids Love This - Using data from image */}
              <div className="bg-blue-50 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                <h3 className="font-bold text-blue-700 text-[13.5px] md:text-[14px] mb-2">Why Kids Love This?</h3>
                <ul className="space-y-1.5 text-[13.5px] md:text-[14px] text-gray-700">
                  {WHY_KIDS_LOVE.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <li key={index} className="flex items-start gap-2">
                        <Icon className={`w-4 h-4 ${item.color} flex-shrink-0 mt-0.5`} />
                        {item.text}
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Choose Your Option - Scrollable Variant Selector */}
              {colorOption && (
                <div className="mb-3 md:mb-4">
                  <h3 className="font-semibold text-[13.5px] md:text-[14px] mb-2">Choose Your Option</h3>
                  <div className="relative">
                    {/* Left Scroll Button */}
                    <button
                      onClick={scrollLeft}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-1.5 rounded-full shadow-md hover:bg-white transition"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Scrollable Container with mouse drag support */}
                    <div
                      ref={scrollContainerRef}
                      className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-6 cursor-grab active:cursor-grabbing"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      onMouseDown={(e) => {
                        const container = e.currentTarget
                        let startX = e.pageX - container.offsetLeft
                        let scrollLeft = container.scrollLeft

                        const onMouseMove = (e: MouseEvent) => {
                          const x = e.pageX - container.offsetLeft
                          const walk = (x - startX) * 1.5
                          container.scrollLeft = scrollLeft - walk
                        }

                        const onMouseUp = () => {
                          document.removeEventListener('mousemove', onMouseMove)
                          document.removeEventListener('mouseup', onMouseUp)
                          container.style.cursor = 'grab'
                        }

                        container.style.cursor = 'grabbing'
                        document.addEventListener('mousemove', onMouseMove)
                        document.addEventListener('mouseup', onMouseUp)
                      }}
                    >
                      {product.variants.edges.map((edge: any) => {
                        const v = edge.node
                        const colorValue = v.selectedOptions?.find((opt: any) => 
                          opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
                        )?.value

                        if (!colorValue) return null

                        const isSelected = selectedOptions[colorOption.name] === colorValue
                        const variantImage = v.image?.url
                        const colorClasses = getColorClasses(colorValue)

                        return (
                          <button
                            key={v.id}
                            onClick={() => {
                              // Update the selected option
                              handleOptionChange(colorOption.name, colorValue)
                              // Update the selected variant - THIS IS KEY FOR PURCHASING
                              setSelectedVariant(v.id)
                              // If there's a variant image, update the main image
                              if (variantImage) {
                                const imageIndex = images.findIndex(img => img.url === variantImage)
                                if (imageIndex !== -1) {
                                  setSelectedImage(imageIndex)
                                }
                              }
                            }}
                            className={`relative flex-shrink-0 flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border-2 transition-all duration-300 ${
                              isSelected 
                                ? `${colorClasses.border} ${colorClasses.bg} shadow-md ring-2 ${colorClasses.ring} ring-opacity-50` 
                                : `border-2 ${colorClasses.border} bg-white hover:${colorClasses.bg} hover:shadow-sm`
                            }`}
                          >
                            {variantImage && (
                              <img 
                                src={variantImage} 
                                alt={colorValue}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                              />
                            )}
                            <div className="text-left min-w-[140px] md:min-w-[160px]">
                              <div className={`text-[13.5px] md:text-[14px] font-semibold ${isSelected ? colorClasses.text : 'text-gray-800'}`}>
                                Elephant Drummer ({colorValue})
                              </div>
                              <div className="flex items-center gap-1 md:gap-2 mt-0.5">
                                <span className={`text-[13.5px] md:text-[14px] font-bold ${isSelected ? colorClasses.text : 'text-[#D32F2F]'}`}>
                                  ₹{parseFloat(v.price.amount).toFixed(2)}
                                </span>
                                {v.compareAtPrice && (
                                  <span className="text-gray-400 line-through text-[12.5px] md:text-[13px]">
                                    ₹{parseFloat(v.compareAtPrice.amount).toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {v.compareAtPrice && (
                                <span className="text-[11.5px] md:text-[11px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                                  {Math.round(((parseFloat(v.compareAtPrice.amount) - parseFloat(v.price.amount)) / parseFloat(v.compareAtPrice.amount)) * 100)}% OFF
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <div className={`absolute -top-1 -right-1 ${colorClasses.text} bg-white rounded-full p-0.5 shadow-md border ${colorClasses.border}`}>
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                      onClick={scrollRight}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-1.5 rounded-full shadow-md hover:bg-white transition"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* Quantity & Stock */}
              <div className="mb-3 md:mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[13.5px] md:text-[14px]">Quantity</h3>
                  <span className="text-[12.5px] md:text-[13px] text-gray-500">
                    {currentStock} in stock
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition"
                    >
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <span className="w-10 md:w-12 text-center font-medium text-[13.5px] md:text-[14px]">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                  {quantity >= currentStock && currentStock > 0 && (
                    <span className="text-[11px] text-red-500 font-medium">
                      Max {currentStock} available
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart & Buy Now - Uses selectedVariant */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-3 md:mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !selectedVariant || currentStock === 0}
                  className="flex-1 sm:flex-none sm:w-[180px] md:w-[200px] bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-2.5 md:py-3 px-4 md:px-6 rounded-full font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-[13.5px] md:text-[14px]"
                >
                  {addingToCart ? (
                    <>
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-[13.5px] md:text-[14px]">Adding...</span>
                    </>
                  ) : addedToCart ? (
                    <>
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-[13.5px] md:text-[14px]">Added ✅</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-[13.5px] md:text-[14px]">
                        {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || currentStock === 0}
                  className="flex-1 sm:flex-none sm:w-[180px] md:w-[200px] bg-[#FF9800] hover:bg-[#F57C00] text-white py-2.5 md:py-3 px-4 md:px-6 rounded-full font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-[13.5px] md:text-[14px]"
                >
                  <Zap className="w-4 h-4 md:w-5 md:h-5" />
                  {currentStock === 0 ? 'Out of Stock' : 'Buy Now'}
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="text-gray-500 text-[13.5px] md:text-[14px] flex items-center gap-1.5 md:gap-2 hover:text-[#D32F2F] transition"
              >
                <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Share this product
              </button>
            </div>
          </div>

          {/* What's in the Box & Key Features */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* What's in the Box */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">What&apos;s in the Box?</h3>
              <ul className="space-y-2">
                {WHATS_IN_BOX.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <li key={index} className="flex items-center gap-2 text-[13.5px] md:text-[14px] text-gray-700">
                      <Icon className={`w-3 h-3 ${item.color}`} />
                      {item.title}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {KEY_FEATURES.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start gap-2">
                      <Icon className={`w-4 h-4 ${feature.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <div className="text-[13.5px] md:text-[14px] font-bold text-gray-800">{feature.title}</div>
                        <div className="text-[12.5px] md:text-[13px] text-gray-500">{feature.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Perfect For */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">Perfect For</h3>
              <div className="grid grid-cols-2 gap-3">
                {PERFECT_FOR.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className={`flex flex-col items-center gap-1 p-2 md:p-3 ${item.bg} rounded-xl`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                      <span className="text-[13.5px] md:text-[14px] font-bold text-gray-700">{item.title}</span>
                    </div>
                  )
                })}
              </div>
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
                    className={`px-4 md:px-6 py-2.5 md:py-3 text-[13.5px] md:text-[14px] font-medium whitespace-nowrap border-b-2 transition ${
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
                <div className="prose max-w-none text-[13.5px] md:text-[14px]">
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description || 'Product description coming soon...' }} />
                </div>
              )}
              {activeTab === 1 && (
                <div className="space-y-2 md:space-y-3">
                  {specifications.length > 0 ? (
                    specifications.map((spec, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 py-2 border-b border-gray-50">
                        <span className="font-semibold text-[13.5px] md:text-[14px] text-gray-600 md:w-1/3">{spec.label}</span>
                        <span className="text-[13.5px] md:text-[14px] text-gray-800">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-[13.5px] md:text-[14px]">No specifications available</p>
                  )}
                </div>
              )}
              {activeTab === 2 && (
                <div className="space-y-2 md:space-y-3">
                  {additionalDetails.length > 0 ? (
                    additionalDetails.map((detail, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 py-2 border-b border-gray-50">
                        <span className="font-semibold text-[13.5px] md:text-[14px] text-gray-600 md:w-1/3">{detail.label}</span>
                        <span className="text-[13.5px] md:text-[14px] text-gray-800">{detail.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-[13.5px] md:text-[14px]">No additional details available</p>
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
                            <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[10.5px] md:text-[11px] font-bold px-1.5 md:px-2 py-0.5 rounded-full">
                              {relDiscount}% OFF
                            </span>
                          )}
                        </div>
                        <div className="p-2 md:p-3">
                          <h4 className="font-semibold text-[12.5px] md:text-[13px] line-clamp-1">{relProduct.title}</h4>
                          <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                            <span className="text-[13.5px] md:text-[14px] font-bold text-[#D32F2F]">₹{parseFloat(relPrice).toFixed(2)}</span>
                            {relCompare && (
                              <span className="text-gray-400 line-through text-[11.5px] md:text-[12px]">₹{parseFloat(relCompare).toFixed(2)}</span>
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
          {/* <div className="mt-8 md:mt-12 bg-[#D32F2F] text-white rounded-2xl p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <div>
                <div className="text-xl md:text-3xl font-bold font-comic">25K+</div>
                <div className="text-[12.5px] md:text-[14px] opacity-80">Happy Families</div>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold font-comic">500+</div>
                <div className="text-[12.5px] md:text-[14px] opacity-80">Premium Toys</div>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold font-comic">1M+</div>
                <div className="text-[12.5px] md:text-[14px] opacity-80">Orders Delivered</div>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold font-comic">4.9 ★</div>
                <div className="text-[12.5px] md:text-[14px] opacity-80">Rating</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* 360 View Modal - Fully Working */}
      <AnimatePresence>
        {show360View && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShow360View(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-4 md:p-6 max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Rotate3d className="w-5 h-5 text-[#D32F2F]" />
                  360° View
                </h3>
                <button onClick={() => setShow360View(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div 
                ref={imageContainerRef}
                className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {get360Image() ? (
                  <img 
                    src={get360Image()?.url} 
                    alt="360 degree view"
                    className="w-full h-full object-cover transition-transform duration-75"
                    style={{ 
                      transform: `rotateY(${rotationAngle}deg) scale(1.05)`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Rotate3d className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Loading 360° view...</p>
                    </div>
                  </div>
                )}
                
                {/* Drag indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-md flex items-center gap-2">
                  <Move className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">Drag to rotate</span>
                </div>

                {/* Rotation angle indicator */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded-lg shadow-md">
                  <span className="text-xs font-medium text-gray-600">{Math.round(rotationAngle)}°</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Auto-rotate:</span>
                  <button 
                    onClick={() => {
                      if (autoRotateRef.current) {
                        stopAutoRotate()
                      } else {
                        startAutoRotate()
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      autoRotateRef.current ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {autoRotateRef.current ? 'Stop' : 'Start'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {images.length} images • Drag to rotate
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Prevent text selection while dragging 360 view */
        .cursor-grabbing * {
          user-select: none !important;
        }
        /* Custom scrollbar for thumbnail */
        .scrollbar-thin::-webkit-scrollbar {
          width: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  )
}