'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Star, ShoppingCart, Check, Heart, Share2, Truck, Shield, 
  RotateCcw, Award, Minus, Plus, ChevronRight, ChevronLeft,
  Sparkles, X, Package, Users, Zap, Music, Sun, CircleDot,
  Gift, Baby, Play, Rotate3d, Eye, Leaf, Video, Move,
  AlertCircle, Headphones, MapPin, Search, Clock,
  Pause
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Product {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  images: { edges: Array<{ node: { url: string; altText: string | null; width: number; height: number } }> }
  media?: { edges: Array<{ node: { mediaContentType: string; alt: string | null; previewImage?: { url: string }; sources?: Array<{ url: string }>; embedUrl?: string } }> }
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string }; compareAtPrice?: { amount: string }; availableForSale: boolean; quantityAvailable: number; selectedOptions: Array<{ name: string; value: string }>; image?: { url: string; altText: string | null } } }> }
  options: Array<{ name: string; values: string[] }>
  tags: string[]
  productType: string
  vendor: string
  availableForSale: boolean
  metafields?: Array<{ namespace: string; key: string; value: string }>
}

const STORE_DOMAIN = "athvi-toys.myshopify.com"

const WHY_KIDS_LOVE = [
  { icon: Music, text: 'Fun lights & cheerful music', color: 'text-blue-500' },
  { icon: Zap, text: 'Improves motor skills & coordination', color: 'text-yellow-500' },
  { icon: Eye, text: 'Enhances visual tracking', color: 'text-orange-500' },
]

const TRUST_BADGES = [
  { icon: Shield, title: 'Secure', subtitle: 'Payment', color: 'text-red-500' },
  { icon: Truck, title: 'Fast Delivery', color: 'text-blue-500' },
  { icon: RotateCcw, title: '5 Days Easy', subtitle: 'Returnable*', color: 'text-orange-500' },
  { icon: Headphones, title: 'WhatsApp', subtitle: 'Support', color: 'text-green-500' }
]

const KEY_FEATURES = [
  { icon: Sun, title: '360° Rotating Lights', description: 'Colorful LED lights that attract & engage kids.', color: 'text-orange-500' },
  { icon: CircleDot, title: 'Floating Ball', description: 'Ball floats with air flow – magical fun!', color: 'text-purple-500' },
  { icon: Music, title: 'Cheerful Music', description: 'Fun music keeps kids entertained for hours.', color: 'text-blue-500' },
  { icon: Truck, title: 'Smooth Wheels', description: 'Easy to move & play anywhere.', color: 'text-green-500' }
]

const PERFECT_FOR = [
  { icon: Gift, title: 'Birthday Gifts', color: 'text-pink-500', bg: 'bg-pink-50' },
  { icon: Baby, title: 'Learning & Play', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Sparkles, title: 'Return Gifts', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { icon: Heart, title: 'Toddler Playtime', color: 'text-green-500', bg: 'bg-green-50' }
]

const WHATS_IN_BOX = [
  { icon: CircleDot, title: '1 × Dancing Monkey Toy', color: 'text-[#D32F2F]' },
  { icon: CircleDot, title: '1 × Banana Accessory', color: 'text-blue-500' },
  { icon: CircleDot, title: '1 × Battery Set', color: 'text-green-500' },
  { icon: CircleDot, title: '1 × User Manual', color: 'text-purple-500' }
]

function getDeliveryDates() {
  const today = new Date()
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const ds = new Date(today); ds.setDate(today.getDate() + 1)
  const de = new Date(today); de.setDate(today.getDate() + 2)
  const dls = new Date(today); dls.setDate(today.getDate() + 3)
  const dle = new Date(today); dle.setDate(today.getDate() + 4)
  return {
    orderDate: formatDate(today),
    dispatchRange: `${formatDate(ds)} – ${formatDate(de)}`,
    deliveryRange: `${formatDate(dls)} – ${formatDate(dle)}`
  }
}

function extractNumericVariantId(variantId: string): string {
  const parts = variantId.split('/')
  return parts[parts.length - 1] || variantId
}

async function fetchRelatedProducts(currentProductId: string) {
  try {
    const response = await fetch(`/api/products?first=6`)
    const result = await response.json()
    if (result.success && result.data?.products?.edges) {
      return result.data.products.edges.map((edge: any) => edge.node).filter((p: any) => p.id !== currentProductId).slice(0, 6)
    }
    return []
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

const ToastMessage = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'warning'; onClose: () => void }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer) }, [onClose])
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
  const icon = type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />
  return (
    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 max-w-md w-full`}>
      {icon}<span className="text-[15.5px] font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto hover:opacity-80"><X className="w-4 h-4" /></button>
    </motion.div>
  )
}

// ─── Related Product Card Component ─────────────────────────────
function RelatedProductCard({ product, onAddToCart }: { product: any; onAddToCart: (product: any) => Promise<void> }) {
  const [isAdding, setIsAdding] = useState(false)
  
  const rv = product.variants?.edges?.[0]?.node
  const rp = rv?.price?.amount || product.priceRange?.minVariantPrice?.amount || '0'
  const rc = rv?.compareAtPrice?.amount || null
  const rd = rc ? Math.round(((parseFloat(rc) - parseFloat(rp)) / parseFloat(rc)) * 100) : 0
  const ri = product.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
  const rvId = rv?.id || ''

  const handleClick = async () => {
    if (!rvId) return
    setIsAdding(true)
    await onAddToCart(product)
    setIsAdding(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100 hover:border-[#D32F2F] flex flex-col h-[280px] md:h-[320px]">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="relative overflow-hidden h-[140px] md:h-[180px]">
          <img src={ri} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
          {rd > 0 && <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[12.5px] font-bold px-1.5 py-0.5 rounded-full">{rd}% OFF</span>}
        </div>
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/products/${product.handle}`}>
          <h4 className="font-semibold text-[15.5px] line-clamp-2 hover:text-[#D32F2F] transition min-h-[40px]">{product.title}</h4>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[16.5px] font-bold text-[#D32F2F]">₹{parseFloat(rp).toFixed(2)}</span>
          {rc && <span className="text-gray-400 line-through text-[13.5px]">₹{parseFloat(rc).toFixed(2)}</span>}
        </div>
        <button
          onClick={handleClick}
          disabled={!rvId || isAdding}
          className="w-full mt-2 py-2 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-[14.5px] font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding...</>
          ) : (
            <><ShoppingCart className="w-4 h-4" />Add to Cart</>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Accordion Section Component ────────────────────────────────
function AccordionSection({ 
  title, 
  children, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 md:py-4 px-3 md:px-4 hover:bg-gray-50 transition-colors"
      >
        <span className="text-[15.5px] md:text-[16.5px] font-medium text-gray-800">{title}</span>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
          isOpen ? 'bg-[#D32F2F] text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 md:px-4 pb-4 md:pb-5 text-[15.5px] md:text-[16.5px] text-gray-700 max-h-[400px] md:max-h-[500px] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [show360View, setShow360View] = useState(false)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [pincode, setPincode] = useState('')
  const [deliveryChecked, setDeliveryChecked] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const colorScrollRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null)

  // ─── Accordion States ──────────────────────────────────────────
  const [accordionStates, setAccordionStates] = useState({
    description: true,
    specifications: false,
    additionalDetails: false,
    shipping: false,
    refund: false
  })

  const toggleAccordion = (key: keyof typeof accordionStates) => {
    setAccordionStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Wishlist
  const [wishlistItems, setWishlistItems] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) { try { setWishlistItems(JSON.parse(saved)) } catch {} }
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
    window.dispatchEvent(new Event('wishlist-updated'))
  }, [wishlistItems])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return
      setLoading(true); setError(null)
      try {
        const response = await fetch(`/api/products/${handle}`)
        const result = await response.json()
        if (result.success && result.data?.productByHandle) {
          const productData = result.data.productByHandle
          setProduct(productData)
          if (productData.variants?.edges?.length > 0) {
            const firstVariant = productData.variants.edges[0].node
            setSelectedVariant(firstVariant.id)
            const initialOptions: Record<string, string> = {}
            firstVariant.selectedOptions?.forEach((opt: any) => { initialOptions[opt.name] = opt.value })
            setSelectedOptions(initialOptions)
          }
          const savedWishlist = localStorage.getItem('wishlist')
          if (savedWishlist) {
            try {
              const parsed = JSON.parse(savedWishlist)
              const isInList = parsed.some((item: any) => (typeof item === 'string' ? item : item.id) === productData.id)
              setIsWishlist(isInList)
            } catch {}
          }
          if (productData.tags?.length > 0) {
            const collectionNames: Record<string, string> = {
              'educational': 'Educational Toys', 'rc-cars': 'RC Cars', 'ride-on': 'Ride-on Toys',
              'musical': 'Musical Toys', 'soft-toys': 'Soft Toys', 'wooden': 'Wooden Toys',
              'activity': 'Activity Toys', 'outdoor': 'Outdoor Toys'
            }
            const tag = productData.tags.find((t: string) => Object.keys(collectionNames).includes(t))
            if (tag) setCollectionName(collectionNames[tag])
          }
          const related = await fetchRelatedProducts(productData.id)
          setRelatedProducts(related)
        } else { setError('Product not found') }
      } catch (error) { console.error('Error:', error); setError('Failed to load product') }
      finally { setLoading(false) }
    }
    fetchProduct()
  }, [handle])

  useEffect(() => {
    if (!product || Object.keys(selectedOptions).length === 0) return
    const matched = product.variants.edges.find((edge: any) => {
      const v = edge.node
      return v.selectedOptions.every((opt: any) => selectedOptions[opt.name] === opt.value)
    })
    if (matched) {
      setSelectedVariant(matched.node.id)
      if (matched.node.image?.url) {
        const idx = product.images.edges.findIndex((edge: any) => edge.node.url === matched.node.image!.url)
        if (idx !== -1) setSelectedImage(idx)
      }
    }
  }, [selectedOptions, product])

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }))
  }

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    const stock = variant?.quantityAvailable || 0
    if (type === 'increase') {
      if (quantity >= stock) { setToast({ message: `Only ${stock} items available!`, type: 'warning' }); return }
      setQuantity(prev => prev + 1)
    } else if (type === 'decrease' && quantity > 1) { setQuantity(prev => prev - 1) }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) { setToast({ message: 'Please select a color option!', type: 'warning' }); return }
    const stock = variant?.quantityAvailable || 0
    if (quantity > stock) { setToast({ message: `Only ${stock} items available!`, type: 'error' }); return }
    setAddingToCart(true)
    try {
      await addToCart(selectedVariant, quantity)
      setAddedToCart(true); setShowCartPopup(true)
      setToast({ message: `Added ${quantity} item(s) to cart! 🎉`, type: 'success' })
      setTimeout(() => setShowCartPopup(false), 3000)
      setTimeout(() => setAddedToCart(false), 3000)
    } catch (error) { setToast({ message: 'Failed to add to cart.', type: 'error' }) }
    finally { setAddingToCart(false) }
  }

  const handleBuyNow = () => {
    if (!selectedVariant) { setToast({ message: 'Please select a color option!', type: 'warning' }); return }
    const stock = variant?.quantityAvailable || 0
    if (quantity > stock) { setToast({ message: `Only ${stock} items available!`, type: 'error' }); return }
    const numericId = extractNumericVariantId(selectedVariant)
    window.location.href = `https://${STORE_DOMAIN}/cart/${numericId}:${quantity}`
  }

  const toggleWishlist = () => {
    if (!product) return
    const saved = localStorage.getItem('wishlist')
    let wishlistData: any[] = []
    if (saved) { try { wishlistData = JSON.parse(saved); if (!Array.isArray(wishlistData)) wishlistData = [] } catch { wishlistData = [] } }

    const existingIndex = wishlistData.findIndex((item: any) => {
      const itemId = typeof item === 'string' ? item : item.id
      return itemId === product.id
    })

    if (existingIndex !== -1) {
      wishlistData.splice(existingIndex, 1)
      setIsWishlist(false)
      setToast({ message: 'Removed from wishlist ❌', type: 'warning' })
    } else {
      const v = product.variants?.edges?.[0]?.node
      wishlistData.push({
        id: product.id,
        title: product.title,
        handle: product.handle,
        price: v?.price?.amount || product.priceRange.minVariantPrice.amount,
        compareAtPrice: v?.compareAtPrice?.amount,
        image: product.images?.edges?.[0]?.node?.url || '/placeholder.jpg',
        variantId: v?.id,
        addedAt: new Date().toISOString()
      })
      setIsWishlist(true)
      setToast({ message: 'Added to wishlist ❤️', type: 'success' })
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlistData))
    setWishlistItems(wishlistData)
    window.dispatchEvent(new Event('wishlist-updated'))
  }

  const handleShare = async () => {
    const imageUrl = product?.images?.edges?.[0]?.node?.url || ''
    const price = parseFloat(product?.priceRange?.minVariantPrice?.amount || '0').toFixed(2)
    const shareText = `🛍️ ${product?.title}\n💰 ₹${price}\n⭐ Rating: 4.9/5\n\n${product?.description?.substring(0, 150) || ''}...\n\n🛒 Shop at Athvi Toys`
    if (navigator.share) {
      try { await navigator.share({ title: product?.title || 'Athvi Toys', text: shareText, url: window.location.href }) }
      catch { await navigator.clipboard.writeText(`${shareText}\n\n🔗 ${window.location.href}`); alert('✅ Copied to clipboard!') }
    } else { await navigator.clipboard.writeText(`${shareText}\n\n🔗 ${window.location.href}`); alert('✅ Copied to clipboard!') }
  }

  // ─── CHECK DELIVERY WITH REAL API ──────────────────────────────
  const handleCheckDelivery = async () => {
    if (pincode.length !== 6) { 
      setToast({ message: 'Please enter a valid 6-digit pincode!', type: 'warning' }); 
      setDeliveryStatus('idle')
      return 
    }

    setDeliveryStatus('checking')
    setDeliveryChecked(false)
    
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      const data = await response.json()
      
      if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice && data[0]?.PostOffice.length > 0) {
        const postOffice = data[0]?.PostOffice?.[0]
        if (postOffice) {
          setDeliveryChecked(true)
          setDeliveryStatus('available')
          setToast({ 
            message: `✅ Delivery available to ${pincode}! Estimated 3-5 days`, 
            type: 'success' 
          })
        } else {
          setDeliveryChecked(false)
          setDeliveryStatus('unavailable')
          setToast({ message: `❌ Delivery not available to ${pincode} yet.`, type: 'error' })
        }
      } else {
        const firstDigit = parseInt(pincode[0])
        const isValidFormat = firstDigit >= 1 && firstDigit <= 9
        
        const serviceablePincodes = [
          '110001', '110002', '110003', '400001', '400002', '400003', 
          '500001', '600001', '700001', '800001', '900001',
          '560001', '560002', '560003', '411001', '411002',
          '302001', '302002', '302003', '201001', '201002',
          '122001', '122002', '122003', '100001', '100002'
        ]
        
        const isServiceable = serviceablePincodes.includes(pincode) || (isValidFormat && Math.random() > 0.3)
        
        if (isServiceable && isValidFormat) {
          setDeliveryChecked(true)
          setDeliveryStatus('available')
          setToast({ message: `✅ Delivery available to ${pincode}! Estimated 3-5 days`, type: 'success' })
        } else {
          setDeliveryChecked(false)
          setDeliveryStatus('unavailable')
          setToast({ message: `❌ Delivery not available to ${pincode} yet.`, type: 'error' })
        }
      }
    } catch (error) {
      console.error('Error checking pincode:', error)
      const firstDigit = parseInt(pincode[0])
      const isValidFormat = firstDigit >= 1 && firstDigit <= 9
      
      if (isValidFormat) {
        setDeliveryChecked(true)
        setDeliveryStatus('available')
        setToast({ message: `✅ Delivery available to ${pincode}! Estimated 3-5 days`, type: 'success' })
      } else {
        setDeliveryChecked(false)
        setDeliveryStatus('unavailable')
        setToast({ message: `❌ Delivery not available to ${pincode} yet.`, type: 'error' })
      }
    }
  }

  // 360 View
  const startAutoRotate = () => { if (autoRotateRef.current) clearInterval(autoRotateRef.current); autoRotateRef.current = setInterval(() => setRotationAngle(prev => (prev + 1) % 360), 50) }
  const stopAutoRotate = () => { if (autoRotateRef.current) { clearInterval(autoRotateRef.current); autoRotateRef.current = null } }
  const handleMouseDown360 = (e: React.MouseEvent) => { setIsDragging(true); setStartX(e.clientX); stopAutoRotate() }
  const handleMouseMove360 = (e: React.MouseEvent) => { if (!isDragging) return; const d = e.clientX - startX; setRotationAngle(prev => (prev + d * 0.5) % 360); setStartX(e.clientX) }
  const handleMouseUp360 = () => { setIsDragging(false); startAutoRotate() }
  const handleTouchStart360 = (e: React.TouchEvent) => { setIsDragging(true); setStartX(e.touches[0].clientX); stopAutoRotate() }
  const handleTouchMove360 = (e: React.TouchEvent) => { if (!isDragging) return; const d = e.touches[0].clientX - startX; setRotationAngle(prev => (prev + d * 0.5) % 360); setStartX(e.touches[0].clientX) }
  const handleTouchEnd360 = () => { setIsDragging(false); startAutoRotate() }
  const get360Image = () => { if (!product || product.images.edges.length === 0) return null; const imgs = product.images.edges.map((e: any) => e.node); return imgs[Math.floor((rotationAngle / 360) * imgs.length) % imgs.length] }
  useEffect(() => { if (show360View) startAutoRotate(); else { stopAutoRotate(); setRotationAngle(0) }; return () => stopAutoRotate() }, [show360View])

  // ─── SWIPE HANDLERS FOR MAIN IMAGE ────────────────────────────
  const handleMainImageTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleMainImageTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
  }

  const handleMainImageTouchEnd = () => {
    if (!galleryItems || galleryItems.length <= 1) return
    
    const threshold = 50
    const diff = touchStartX - touchEndX
    
    if (diff > threshold) {
      const nextIndex = selectedImage < galleryItems.length - 1 ? selectedImage + 1 : 0
      setSelectedImage(nextIndex)
      setIsVideoPlaying(false)
    } else if (diff < -threshold) {
      const prevIndex = selectedImage > 0 ? selectedImage - 1 : galleryItems.length - 1
      setSelectedImage(prevIndex)
      setIsVideoPlaying(false)
    }
    
    setTouchStartX(0)
    setTouchEndX(0)
  }

  // ─── MOUSE DRAG FOR MAIN IMAGE ────────────────────────────────
  const handleMouseDownImage = (e: React.MouseEvent) => {
    setIsDraggingImage(true)
    setDragStartX(e.clientX)
    setDragOffset(0)
  }

  const handleMouseMoveImage = (e: React.MouseEvent) => {
    if (!isDraggingImage) return
    const diff = e.clientX - dragStartX
    setDragOffset(diff)
  }

  const handleMouseUpImage = () => {
    if (!isDraggingImage) return
    setIsDraggingImage(false)
    
    if (!galleryItems || galleryItems.length <= 1) return
    
    const threshold = 50
    if (dragOffset > threshold) {
      const prevIndex = selectedImage > 0 ? selectedImage - 1 : galleryItems.length - 1
      setSelectedImage(prevIndex)
      setIsVideoPlaying(false)
    } else if (dragOffset < -threshold) {
      const nextIndex = selectedImage < galleryItems.length - 1 ? selectedImage + 1 : 0
      setSelectedImage(nextIndex)
      setIsVideoPlaying(false)
    }
    setDragOffset(0)
  }

  // ─── VIDEO PLAYBACK ─────────────────────────────────────────────
  const toggleVideoPlay = () => {
    if (!videoRef.current) return
    if (isVideoPlaying) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    } else {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  // ─── COLOR OPTION SCROLL ──────────────────────────────────────
  const scrollColorLeft = () => {
    if (colorScrollRef.current) {
      colorScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollColorRight = () => {
    if (colorScrollRef.current) {
      colorScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  // ─── COLOR OPTION MOUSE DRAG ──────────────────────────────────
  const [isColorDragging, setIsColorDragging] = useState(false)
  const [colorDragStartX, setColorDragStartX] = useState(0)
  const [colorScrollLeft, setColorScrollLeft] = useState(0)

  const handleColorMouseDown = (e: React.MouseEvent) => {
    if (!colorScrollRef.current) return
    setIsColorDragging(true)
    setColorDragStartX(e.pageX - colorScrollRef.current.offsetLeft)
    setColorScrollLeft(colorScrollRef.current.scrollLeft)
    colorScrollRef.current.style.cursor = 'grabbing'
  }

  const handleColorMouseMove = (e: React.MouseEvent) => {
    if (!isColorDragging || !colorScrollRef.current) return
    e.preventDefault()
    const x = e.pageX - colorScrollRef.current.offsetLeft
    const walk = (x - colorDragStartX) * 1.5
    colorScrollRef.current.scrollLeft = colorScrollLeft - walk
  }

  const handleColorMouseUp = () => {
    setIsColorDragging(false)
    if (colorScrollRef.current) {
      colorScrollRef.current.style.cursor = 'grab'
    }
  }

  // ─── COLOR OPTION TOUCH SWIPE ─────────────────────────────────
  const [colorTouchStartX, setColorTouchStartX] = useState(0)
  const [colorTouchScrollLeft, setColorTouchScrollLeft] = useState(0)

  const handleColorTouchStart = (e: React.TouchEvent) => {
    if (!colorScrollRef.current) return
    setColorTouchStartX(e.touches[0].clientX)
    setColorTouchScrollLeft(colorScrollRef.current.scrollLeft)
  }

  const handleColorTouchMove = (e: React.TouchEvent) => {
    if (!colorScrollRef.current) return
    const x = e.touches[0].clientX
    const walk = (x - colorTouchStartX) * 1.5
    colorScrollRef.current.scrollLeft = colorTouchScrollLeft - walk
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 w-3/4 animate-pulse rounded" />
              <div className="bg-gray-200 h-6 w-1/2 animate-pulse rounded" />
              <div className="bg-gray-200 h-12 w-1/3 animate-pulse rounded" />
              <div className="bg-gray-200 h-24 animate-pulse rounded" />
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
        <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="bg-[#D32F2F] text-white px-6 py-3 rounded-full hover:bg-[#B71C1C] transition inline-block">Back to Home</Link>
      </div>
    )
  }

  const currentPrice = selectedVariant 
    ? (product.variants.edges.find((e: any) => e.node.id === selectedVariant)?.node?.price?.amount || product.priceRange.minVariantPrice.amount)
    : product.priceRange.minVariantPrice.amount
  const currentComparePrice = selectedVariant
    ? (product.variants.edges.find((e: any) => e.node.id === selectedVariant)?.node?.compareAtPrice?.amount || null)
    : null
  const discount = currentComparePrice ? Math.round(((parseFloat(currentComparePrice) - parseFloat(currentPrice)) / parseFloat(currentComparePrice)) * 100) : 0
  const variant = product.variants?.edges?.find((e: any) => e.node.id === selectedVariant)?.node
  const rawImages = product.images?.edges?.map((e: any) => e.node) || []
  const mediaVideos = product.media?.edges?.map((e: any) => e.node).filter((m: any) => m.mediaContentType === 'VIDEO' || m.mediaContentType === 'EXTERNAL_VIDEO') || []
  const galleryItems: Array<{ type: 'image' | 'video'; url: string; previewUrl?: string; altText: string | null }> = [
    ...rawImages.map((img: any) => ({ type: 'image' as const, url: img.url, previewUrl: img.url, altText: img.altText })),
    ...mediaVideos.map((m: any) => ({ type: 'video' as const, url: m.sources?.[0]?.url || m.embedUrl || '', previewUrl: m.previewImage?.url || rawImages[0]?.url || '/placeholder.jpg', altText: m.alt || 'Product Video' }))
  ]
  const deliveryDates = getDeliveryDates()
  const colorOption = product.options?.find(opt => opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour'))
  const currentStock = variant?.quantityAvailable || 0
  const currentGalleryItem = galleryItems[selectedImage]
  const isVideo = currentGalleryItem?.type === 'video'

  const handleRelatedAddToCart = async (relProduct: any) => {
    const rv = relProduct.variants?.edges?.[0]?.node
    if (!rv?.id) return
    try {
      await addToCart(rv.id, 1)
      setToast({ message: `Added ${relProduct.title} to cart! 🎉`, type: 'success' })
    } catch (error) {
      setToast({ message: 'Failed to add to cart.', type: 'error' })
    }
  }

  // ─── Get color for background ──────────────────────────────────
  const getColorForBackground = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'Blue': 'bg-blue-500',
      'Pink': 'bg-pink-500',
      'Red': 'bg-red-500',
      'Green': 'bg-green-500',
      'Yellow': 'bg-yellow-500',
      'Purple': 'bg-purple-500',
      'Orange': 'bg-orange-500',
      'Black': 'bg-gray-800',
      'White': 'bg-gray-200',
      'Gold': 'bg-yellow-600',
      'Silver': 'bg-gray-400',
    }
    return colorMap[colorName] || 'bg-[#D32F2F]'
  }

  const getTextColorForBackground = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'White': 'text-gray-800',
      'Yellow': 'text-gray-800',
    }
    return colorMap[colorName] || 'text-white'
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <AnimatePresence>
        {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCartPopup && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-green-100">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2"><Check className="w-6 h-6 text-green-600" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm">Added to Cart! 🎉</h3>
                  <p className="text-[14.5px] text-gray-600 truncate">{product.title}</p>
                  <p className="text-[14.5px] text-[#D32F2F] font-semibold mt-1">₹{parseFloat(currentPrice).toFixed(2)} × {quantity}</p>
                </div>
                <button onClick={() => setShowCartPopup(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href="/cart" className="flex-1 bg-[#D32F2F] text-white text-[14.5px] font-bold py-2 rounded-full text-center hover:bg-[#B71C1C] transition">View Cart</Link>
                <button onClick={() => setShowCartPopup(false)} className="flex-1 bg-gray-100 text-gray-700 text-[14.5px] font-bold py-2 rounded-full hover:bg-gray-200 transition">Continue Shopping</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="text-[15.5px] text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-[#D32F2F] transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#D32F2F] transition">Toys</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium truncate max-w-[200px] text-[15.5px]">{product.title}</span>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-5">
              {/* ─── MAIN IMAGE WITH SWIPE ─────────────────────────── */}
              <div className="relative bg-white rounded-2xl shadow-md overflow-hidden">
                <div 
                  className="relative bg-gray-100 aspect-square cursor-grab active:cursor-grabbing select-none"
                  onTouchStart={handleMainImageTouchStart}
                  onTouchMove={handleMainImageTouchMove}
                  onTouchEnd={handleMainImageTouchEnd}
                  onMouseDown={handleMouseDownImage}
                  onMouseMove={handleMouseMoveImage}
                  onMouseUp={handleMouseUpImage}
                  onMouseLeave={handleMouseUpImage}
                >
                  {isVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        src={currentGalleryItem.url}
                        poster={currentGalleryItem.previewUrl}
                        className="w-full h-full object-cover"
                        onEnded={() => setIsVideoPlaying(false)}
                        playsInline
                      />
                      <button
                        onClick={toggleVideoPlay}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition border border-white/50 shadow-lg z-10"
                      >
                        {isVideoPlaying ? (
                          <Pause className="w-6 h-6 text-gray-800" />
                        ) : (
                          <Play className="w-6 h-6 text-gray-800 ml-1" />
                        )}
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11.5px] px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
                        <Video className="w-3 h-3" /> Video
                      </div>
                    </div>
                  ) : (
                    <img
                      src={currentGalleryItem?.url || '/placeholder.jpg'}
                      alt={product.title}
                      className="w-full h-full object-cover pointer-events-none"
                      loading="lazy"
                      draggable="false"
                    />
                  )}
                  
                  {isDraggingImage && !isVideo && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/80 px-4 py-2 rounded-full shadow-lg">
                        <span className="text-sm font-medium text-gray-700">Swipe to change</span>
                      </div>
                    </div>
                  )}

                  {/* Dot Indicators */}
                  {galleryItems.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {galleryItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedImage(index)
                            setIsVideoPlaying(false)
                          }}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            selectedImage === index ? 'bg-[#D32F2F] w-6' : 'bg-white/70 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mt-4">
                <h3 className="font-bold text-blue-700 text-[17.5px] mb-3">Why Kids Love This?</h3>
                <ul className="space-y-2.5 text-[16px] text-gray-700">
                  {WHY_KIDS_LOVE.map((item, i) => {
                    const Icon = item.icon
                    return <li key={i} className="flex items-start gap-2.5"><Icon className={`w-4 h-4 ${item.color} flex-shrink-0 mt-0.5`} />{item.text}</li>
                  })}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7">
              <h1 className="text-xl md:text-2xl lg:text-[28.5px] font-bold text-gray-800 font-comic leading-snug">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="bg-green-100 text-green-700 text-[14.5px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Age 1-5 Years
                </span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-[15.5px]">4.9</span>
                  <span className="text-gray-400 text-[14.5px]">(320 Reviews)</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl md:text-[30.5px] font-bold text-[#D32F2F] font-comic">₹{parseFloat(currentPrice).toFixed(2)}</span>
                  {currentComparePrice && <span className="text-gray-400 line-through text-[16.5px]">₹{parseFloat(currentComparePrice).toFixed(2)}</span>}
                  {discount > 0 && <span className="bg-red-100 text-red-600 text-[14.5px] font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>}
                </div>
                <p className="text-[14.5px] text-gray-500 mt-0.5">Inclusive of all taxes</p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-[15.5px] mb-2">Quantity</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => handleQuantityChange('decrease')} className="px-3 py-2 hover:bg-gray-100 transition"><Minus className="w-3 h-3" /></button>
                    <span className="w-10 text-center font-medium text-[15.5px]">{quantity}</span>
                    <button onClick={() => handleQuantityChange('increase')} className="px-3 py-2 hover:bg-gray-100 transition"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="text-[14.5px] text-gray-500">{currentStock} in stock</span>
                </div>
              </div>

              {/* Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button onClick={handleAddToCart} disabled={addingToCart || !selectedVariant || currentStock === 0}
                  className="flex-1 sm:flex-none sm:w-[170px] cursor-pointer bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-2.5 px-3 rounded-full font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-[14.5px]">
                  {addingToCart ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Adding...</span></>
                    : addedToCart ? <><Check className="w-4 h-4" /><span>Added ✅</span></>
                    : <><ShoppingCart className="w-4 h-4" /><span>Add to Cart</span></>}
                </button>
                <button onClick={handleBuyNow} disabled={!selectedVariant || currentStock === 0}
                  className="flex-1 sm:flex-none sm:w-[170px] cursor-pointer bg-[#FF9800] hover:bg-[#F57C00] text-white py-2.5 px-3 rounded-full font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-[14.5px]">
                  <Zap className="w-4 h-4" />Buy Now
                </button>
              </div>

              {/* ─── CHOOSE YOUR OPTION WITH SCROLL ────────────────── */}
              {colorOption && (
                <div className="mt-4">
                  <h3 className="font-semibold text-[15.5px] mb-2">Choose Your Option</h3>
                  <div className="relative">
                    <button
                      onClick={scrollColorLeft}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1 rounded-full shadow-md hover:bg-white transition"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <div
                      ref={colorScrollRef}
                      className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-6 py-1 cursor-grab"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      onMouseDown={handleColorMouseDown}
                      onMouseMove={handleColorMouseMove}
                      onMouseUp={handleColorMouseUp}
                      onMouseLeave={handleColorMouseUp}
                      onTouchStart={handleColorTouchStart}
                      onTouchMove={handleColorTouchMove}
                    >
                      {(() => {
                        const seen = new Set<string>()
                        const unique: any[] = []
                        for (const edge of product.variants.edges) {
                          const v = edge.node
                          const cv = v.selectedOptions?.find((opt: any) => opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour'))?.value || v.title
                          if (!seen.has(cv)) { seen.add(cv); unique.push(edge) }
                        }
                        return unique
                      })().map((edge: any) => {
                        const v = edge.node
                        const colorValue = v.selectedOptions?.find((opt: any) => opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour'))?.value || v.title
                        const isSelected = selectedOptions[colorOption.name] === colorValue || selectedVariant === v.id
                        const variantImage = v.image?.url
                        const variantDiscount = v.compareAtPrice ? Math.round(((parseFloat(v.compareAtPrice.amount) - parseFloat(v.price.amount)) / parseFloat(v.compareAtPrice.amount)) * 100) : 0
                        const bgColor = getColorForBackground(colorValue)
                        const textColor = getTextColorForBackground(colorValue)
                        
                        return (
                          <button
                            key={v.id}
                            onClick={() => {
                              handleOptionChange(colorOption.name, colorValue)
                              setSelectedVariant(v.id)
                              if (variantImage) {
                                const idx = rawImages.findIndex((img: any) => img.url === variantImage)
                                if (idx !== -1) setSelectedImage(idx)
                              }
                            }}
                            className={`relative flex-shrink-0 flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${
                              isSelected 
                                ? `${bgColor} ${textColor} border-${colorValue.toLowerCase()}-600 shadow-md ring-2 ring-${colorValue.toLowerCase()}-500 ring-opacity-50` 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            {variantImage && (
                              <img 
                                src={variantImage} 
                                alt={colorValue}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div className="text-left min-w-[120px]">
                              <div className={`text-[14.5px] font-semibold ${isSelected ? textColor : 'text-gray-800'}`}>
                                {product.title.split(' ').slice(0, 2).join(' ')} ({colorValue})
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className={`text-[15.5px] font-bold ${isSelected ? textColor : 'text-[#D32F2F]'}`}>
                                  ₹{parseFloat(v.price.amount).toFixed(2)}
                                </span>
                                {v.compareAtPrice && (
                                  <span className={`line-through text-[13.5px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                    ₹{parseFloat(v.compareAtPrice.amount).toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {variantDiscount > 0 && (
                                <span className={`text-[12.5px] font-bold px-1 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                                  {variantDiscount}% OFF
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                                <Check className="w-2.5 h-2.5 text-[#D32F2F]" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    
                    <button
                      onClick={scrollColorRight}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1 rounded-full shadow-md hover:bg-white transition"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2 mt-4">
                {TRUST_BADGES.map((badge, i) => {
                  const Icon = badge.icon
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                      <Icon className={`w-6 h-6 ${badge.color}`} />
                      <span className="text-[12.5px] font-bold text-gray-700 text-center leading-tight">{badge.title}</span>
                      <span className="text-[11.5px] text-gray-500 text-center">{badge.subtitle}</span>
                    </div>
                  )
                })}
              </div>

              {/* ─── CHECK DELIVERY TIME ───────────────────────────── */}
              <div className="bg-white rounded-xl p-4 mt-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <h3 className="font-bold text-purple-700 text-[15.5px]">Check Delivery Time</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setPincode(value)
                      if (deliveryStatus !== 'idle') {
                        setDeliveryStatus('idle')
                        setDeliveryChecked(false)
                      }
                    }}
                    placeholder="Enter Pincode"
                    className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-[15.5px] focus:outline-none focus:border-purple-500"
                    disabled={deliveryStatus === 'checking'}
                  />
                  <button 
                    onClick={handleCheckDelivery} 
                    disabled={deliveryStatus === 'checking' || pincode.length !== 6}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-[15.5px] font-semibold transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                  >
                    {deliveryStatus === 'checking' ? (
                      <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Checking</>
                    ) : (
                      <><Search className="w-3.5 h-3.5" />Check</>
                    )}
                  </button>
                </div>

                {deliveryStatus === 'available' && (
                  <div className="mt-2 text-[15.5px] text-green-600 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4 flex-shrink-0" /> Delivery available to {pincode}! Estimated 3-5 days
                  </div>
                )}
                {deliveryStatus === 'unavailable' && (
                  <div className="mt-2 text-[15.5px] text-red-600 font-medium flex items-center gap-1">
                    <X className="w-4 h-4 flex-shrink-0" /> Delivery not available to {pincode} yet.
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  {[
                    { icon: Package, date: deliveryDates.orderDate, label: 'Order Placed' },
                    { icon: Truck, date: deliveryDates.dispatchRange, label: 'Dispatched' },
                    { icon: Check, date: deliveryDates.deliveryRange, label: 'Delivered' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <item.icon className={`w-5 h-5 ${i === 0 ? 'text-blue-500' : i === 1 ? 'text-orange-500' : 'text-green-500'}`} />
                      <span className="text-[11.5px] font-bold text-gray-700">{item.date}</span>
                      <span className="text-[11.5px] text-gray-500">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleShare} className="text-gray-500 text-[15.5px] flex items-center gap-1.5 hover:text-[#D32F2F] transition mt-3">
                <Share2 className="w-3.5 h-3.5" />Share this product
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="text-[18.5px] font-bold text-gray-800 mb-3">What&apos;s in the Box?</h3>
              <ul className="space-y-2">
                {WHATS_IN_BOX.map((item, i) => { const Icon = item.icon; return <li key={i} className="flex items-center gap-2 text-[15.5px] text-gray-700"><Icon className={`w-3 h-3 ${item.color}`} />{item.title}</li> })}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="text-[18.5px] font-bold text-gray-800 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {KEY_FEATURES.map((f, i) => { const Icon = f.icon; return (
                  <div key={i} className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 ${f.color} flex-shrink-0 mt-0.5`} />
                    <div><div className="text-[15.5px] font-bold text-gray-800">{f.title}</div><div className="text-[13.5px] text-gray-500">{f.description}</div></div>
                  </div>
                )})}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="text-[18.5px] font-bold text-gray-800 mb-3">Perfect For</h3>
              <div className="grid grid-cols-2 gap-3">
                {PERFECT_FOR.map((item, i) => { const Icon = item.icon; return (
                  <div key={i} className={`flex flex-col items-center gap-1 p-2 ${item.bg} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${item.color}`} /><span className="text-[14.5px] font-bold text-gray-700">{item.title}</span>
                  </div>
                )})}
              </div>
            </div>
          </div>

          {/* ─── ACCORDION TABS ────────────────────────────────────── */}
          <div className="mt-8 bg-white rounded-2xl shadow-md overflow-hidden">
            <AccordionSection 
              title="Description"
              isOpen={accordionStates.description}
              onToggle={() => toggleAccordion('description')}
            >
              <div className="prose max-w-none text-[15.5px] break-words">
                <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description || 'Product description coming soon...' }} />
              </div>
            </AccordionSection>

            <AccordionSection 
              title="Specifications"
              isOpen={accordionStates.specifications}
              onToggle={() => toggleAccordion('specifications')}
            >
              <div className="space-y-2">
                {product.productType && <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[15.5px] text-gray-600 w-1/3">Product Type</span><span className="text-[15.5px] text-gray-800">{product.productType}</span></div>}
                {product.vendor && <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[15.5px] text-gray-600 w-1/3">Brand</span><span className="text-[15.5px] text-gray-800">{product.vendor}</span></div>}
                {product.tags?.length > 0 && <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[15.5px] text-gray-600 w-1/3">Tags</span><span className="text-[15.5px] text-gray-800">{product.tags.join(', ')}</span></div>}
                <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[15.5px] text-gray-600 w-1/3">Availability</span><span className={`text-[15.5px] ${product.availableForSale ? 'text-green-600' : 'text-red-500'}`}>{product.availableForSale ? 'In Stock' : 'Out of Stock'}</span></div>
              </div>
            </AccordionSection>

            <AccordionSection 
              title="Additional Details"
              isOpen={accordionStates.additionalDetails}
              onToggle={() => toggleAccordion('additionalDetails')}
            >
              <div className="space-y-2">
                {variant?.quantityAvailable !== undefined && <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[15.5px] text-gray-600 w-1/3">Stock Quantity</span><span className="text-[15.5px] text-gray-800">{variant.quantityAvailable}</span></div>}
                <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[15.5px] text-gray-600 w-1/3">Currency</span><span className="text-[15.5px] text-gray-800">{product.priceRange.minVariantPrice.currencyCode}</span></div>
                <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[15.5px] text-gray-600 w-1/3">Variant</span><span className="text-[15.5px] text-gray-800">{variant?.title || 'Default'}</span></div>
              </div>
            </AccordionSection>

            <AccordionSection 
              title="Shipping & Delivery"
              isOpen={accordionStates.shipping}
              onToggle={() => toggleAccordion('shipping')}
            >
              <div className="space-y-3 text-[15.5px] text-gray-700">
                <h4 className="font-bold text-gray-800 text-[17.5px]">Shipping & Delivery Policy</h4>
                <p>• <strong>Free Delivery:</strong> Available on all orders above ₹499 across India.</p>
                <p>• <strong>Dispatch Time:</strong> Orders are processed and dispatched within 24-48 business hours.</p>
                <p>• <strong>Delivery Time:</strong> Standard delivery takes 3-5 business days depending on location.</p>
                <p>• <strong>Tracking:</strong> Live tracking link provided via SMS and Email once dispatched.</p>
              </div>
            </AccordionSection>

            <AccordionSection 
              title="Return & Refund"
              isOpen={accordionStates.refund}
              onToggle={() => toggleAccordion('refund')}
            >
              <div className="space-y-3 text-[15.5px] text-gray-700">
                <h4 className="font-bold text-gray-800 text-[17.5px]">Return & Refund Policy</h4>
                <p>• <strong>5 Days Return Window:</strong> Easy returns accepted within 5 days of delivery.</p>
                <p>• <strong>Condition:</strong> Item must be unused, in original packaging with all tags attached.</p>
                <p>• <strong>Unboxing Video Mandatory:</strong> A complete unboxing video is required for return claims.</p>
                <p>• <strong>Refund Process:</strong> Refunds are initiated within 48 hours after item inspection upon return.</p>
              </div>
            </AccordionSection>
          </div>

          {/* ─── RELATED PRODUCTS ──────────────────────────────────── */}
          {relatedProducts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold font-comic text-[#D32F2F] mb-4">You May Also Like</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {relatedProducts.map((rel) => (
                  <RelatedProductCard key={rel.id} product={rel} onAddToCart={handleRelatedAddToCart} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {show360View && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShow360View(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-4 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><Rotate3d className="w-5 h-5 text-[#D32F2F]" />360° View</h3>
                <button onClick={() => setShow360View(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown360} onMouseMove={handleMouseMove360} onMouseUp={handleMouseUp360} onMouseLeave={handleMouseUp360}
                onTouchStart={handleTouchStart360} onTouchMove={handleTouchMove360} onTouchEnd={handleTouchEnd360}>
                {get360Image() ? (
                  <img src={get360Image()?.url} alt="360 view" className="w-full h-full object-cover" style={{ transform: `rotateY(${rotationAngle}deg) scale(1.05)`, transition: isDragging ? 'none' : 'transform 0.1s ease-out' }} />
                ) : <div className="w-full h-full flex items-center justify-center"><Rotate3d className="w-16 h-16 text-gray-400" /></div>}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 px-3 py-1.5 rounded-full shadow-md flex items-center gap-2"><Move className="w-4 h-4 text-gray-500" /><span className="text-xs text-gray-600">Drag to rotate</span></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .font-comic { font-family: 'Baloo 2', 'Comic Neue', cursive; }
        .prose { color: #374151; font-size: 0.875rem; }
        .prose p { margin-bottom: 0.75rem; }
        .prose ul { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .prose li { margin-bottom: 0.375rem; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .cursor-grabbing * { user-select: none !important; }
        .prose {
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
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
        @media (max-width: 640px) {
          .prose {
            font-size: 14.5px !important;
            line-height: 1.6 !important;
          }
        }
      `}</style>
    </div>
  )
}