'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Star, ShoppingCart, Check, Heart, Share2, Truck, Shield, 
  RotateCcw, Award, Minus, Plus, ChevronRight, ChevronLeft,
  Sparkles, X, Package, Users, Zap, Music, Sun, CircleDot,
  Gift, Baby, Play, Rotate3d, Eye, Leaf, Video, Move,
  AlertCircle, Headphones, MapPin, Search, Clock
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
  { icon: Leaf, text: 'Safe, durable & non-toxic material', color: 'text-green-500' }
]

const TRUST_BADGES = [
  { icon: Shield, title: '100% Secure', subtitle: 'Payment', color: 'text-red-500' },
  { icon: Truck, title: 'Fast Delivery', subtitle: 'Pan India', color: 'text-blue-500' },
  { icon: RotateCcw, title: '5 Days Easy', subtitle: 'Returnable*', color: 'text-orange-500' },
  { icon: Headphones, title: '24/7 WhatsApp', subtitle: 'Support', color: 'text-green-500' }
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
      {icon}<span className="text-[14px] font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto hover:opacity-80"><X className="w-4 h-4" /></button>
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
  const [show360View, setShow360View] = useState(false)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [pincode, setPincode] = useState('')
  const [deliveryChecked, setDeliveryChecked] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
  const { addToCart } = useCart()
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const handleCheckDelivery = () => {
    if (pincode.length !== 6) { 
      setToast({ message: 'Please enter a valid 6-digit pincode!', type: 'warning' }); 
      setDeliveryStatus('idle')
      return 
    }

    setDeliveryStatus('checking')
    
    setTimeout(() => {
      const firstDigit = parseInt(pincode[0])
      const serviceablePincodes = [
        '110001', '110002', '110003', '400001', '400002', '400003', 
        '500001', '600001', '700001', '800001', '900001',
        '560001', '560002', '560003', '411001', '411002',
        '302001', '302002', '302003', '201001', '201002',
        '122001', '122002', '122003', '100001', '100002'
      ]
      const isServiceable = serviceablePincodes.includes(pincode) || (firstDigit >= 1 && firstDigit <= 9 && Math.random() > 0.2)
      
      if (isServiceable) {
        setDeliveryChecked(true)
        setDeliveryStatus('available')
        setToast({ message: `✅ Delivery available to ${pincode}! Estimated 3-5 days`, type: 'success' })
      } else {
        setDeliveryChecked(false)
        setDeliveryStatus('unavailable')
        setToast({ message: `❌ Delivery not available to ${pincode} yet.`, type: 'error' })
      }
    }, 1000)
  }

  // 360 View
  const startAutoRotate = () => { if (autoRotateRef.current) clearInterval(autoRotateRef.current); autoRotateRef.current = setInterval(() => setRotationAngle(prev => (prev + 1) % 360), 50) }
  const stopAutoRotate = () => { if (autoRotateRef.current) { clearInterval(autoRotateRef.current); autoRotateRef.current = null } }
  const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setStartX(e.clientX); stopAutoRotate() }
  const handleMouseMove = (e: React.MouseEvent) => { if (!isDragging) return; const d = e.clientX - startX; setRotationAngle(prev => (prev + d * 0.5) % 360); setStartX(e.clientX) }
  const handleMouseUp = () => { setIsDragging(false); startAutoRotate() }
  const handleTouchStart = (e: React.TouchEvent) => { setIsDragging(true); setStartX(e.touches[0].clientX); stopAutoRotate() }
  const handleTouchMove = (e: React.TouchEvent) => { if (!isDragging) return; const d = e.touches[0].clientX - startX; setRotationAngle(prev => (prev + d * 0.5) % 360); setStartX(e.touches[0].clientX) }
  const handleTouchEnd = () => { setIsDragging(false); startAutoRotate() }
  const get360Image = () => { if (!product || product.images.edges.length === 0) return null; const imgs = product.images.edges.map((e: any) => e.node); return imgs[Math.floor((rotationAngle / 360) * imgs.length) % imgs.length] }
  useEffect(() => { if (show360View) startAutoRotate(); else { stopAutoRotate(); setRotationAngle(0) }; return () => stopAutoRotate() }, [show360View])

  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' })

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
                  <p className="text-[13px] text-gray-600 truncate">{product.title}</p>
                  <p className="text-[13px] text-[#D32F2F] font-semibold mt-1">₹{parseFloat(currentPrice).toFixed(2)} × {quantity}</p>
                </div>
                <button onClick={() => setShowCartPopup(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href="/cart" className="flex-1 bg-[#D32F2F] text-white text-[13px] font-bold py-2 rounded-full text-center hover:bg-[#B71C1C] transition">View Cart</Link>
                <button onClick={() => setShowCartPopup(false)} className="flex-1 bg-gray-100 text-gray-700 text-[13px] font-bold py-2 rounded-full hover:bg-gray-200 transition">Continue Shopping</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="text-[14px] text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-[#D32F2F] transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#D32F2F] transition">Toys</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium truncate max-w-[200px] text-[14px]">{product.title}</span>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-5">
              <div className="bg-gradient-to-r from-[#C2185B] to-[#E91E63] rounded-t-2xl px-4 py-3 flex items-center w-auto h-15 justify-between">
              
                
              </div>

              <div className="flex gap-2 bg-white rounded-b-2xl shadow-md p-3">
                <div className="flex flex-col gap-2 w-16 flex-shrink-0 max-h-[380px] overflow-y-auto scrollbar-thin">
                  {galleryItems.map((item, index) => (
                    <button key={index} onClick={() => setSelectedImage(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${selectedImage === index ? 'border-[#D32F2F]' : 'border-gray-200 hover:border-gray-400'}`}>
                      <img src={item.type === 'video' ? item.previewUrl : item.url} alt={item.altText || ''} className="w-full h-full object-cover" />
                      {item.type === 'video' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Play className="w-4 h-4 text-white fill-white" /></div>}
                    </button>
                  ))}
                  <button onClick={() => setShow360View(true)} className="w-16 h-16 rounded-lg border-2 border-gray-200 hover:border-[#D32F2F] flex flex-col items-center justify-center gap-0.5 transition bg-white flex-shrink-0">
                    <Rotate3d className="w-4 h-4 text-gray-600" /><span className="text-[8px] text-gray-500 font-medium">360°</span>
                  </button>
                </div>

                <div className="flex-1 relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
                  {galleryItems[selectedImage]?.type === 'video' ? (
                    <video controls autoPlay className="w-full h-full object-cover" poster={galleryItems[selectedImage].previewUrl} src={galleryItems[selectedImage].url}>Your browser does not support video.</video>
                  ) : (
                    <img src={galleryItems[selectedImage]?.url || '/placeholder.jpg'} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                  )}
                  {galleryItems.length > 1 && (
                    <>
                      <button onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : galleryItems.length - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-md hover:bg-white transition"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
                      <button onClick={() => setSelectedImage(prev => prev < galleryItems.length - 1 ? prev + 1 : 0)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-md hover:bg-white transition"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mt-4">
                <h3 className="font-bold text-blue-700 text-[16px] mb-3">Why Kids Love This?</h3>
                <ul className="space-y-2.5 text-[14.5px] text-gray-700">
                  {WHY_KIDS_LOVE.map((item, i) => {
                    const Icon = item.icon
                    return <li key={i} className="flex items-start gap-2.5"><Icon className={`w-4 h-4 ${item.color} flex-shrink-0 mt-0.5`} />{item.text}</li>
                  })}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7">
              <h1 className="text-xl md:text-2xl lg:text-[27px] font-bold text-gray-800 font-comic leading-snug">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="bg-green-100 text-green-700 text-[13px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Age 1-5 Years
                </span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-[14px]">4.9</span>
                  <span className="text-gray-400 text-[13px]">(320 Reviews)</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl md:text-[29px] font-bold text-[#D32F2F] font-comic">₹{parseFloat(currentPrice).toFixed(2)}</span>
                  {currentComparePrice && <span className="text-gray-400 line-through text-[15px]">₹{parseFloat(currentComparePrice).toFixed(2)}</span>}
                  {discount > 0 && <span className="bg-red-100 text-red-600 text-[13px] font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>}
                </div>
                <p className="text-[13px] text-gray-500 mt-0.5">Inclusive of all taxes</p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-[14px] mb-2">Quantity</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => handleQuantityChange('decrease')} className="px-3 py-2 hover:bg-gray-100 transition"><Minus className="w-3 h-3" /></button>
                    <span className="w-10 text-center font-medium text-[14px]">{quantity}</span>
                    <button onClick={() => handleQuantityChange('increase')} className="px-3 py-2 hover:bg-gray-100 transition"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="text-[13px] text-gray-500">{currentStock} in stock</span>
                </div>
              </div>

              {/* Add to Cart & Buy Now - REDUCED WIDTH */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button onClick={handleAddToCart} disabled={addingToCart || !selectedVariant || currentStock === 0}
                  className="flex-1 sm:flex-none sm:w-[170px] cursor-pointer bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-2.5 px-3 rounded-full font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-[13px]">
                  {addingToCart ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Adding...</span></>
                    : addedToCart ? <><Check className="w-4 h-4" /><span>Added ✅</span></>
                    : <><ShoppingCart className="w-4 h-4" /><span>Add to Cart</span></>}
                </button>
                <button onClick={handleBuyNow} disabled={!selectedVariant || currentStock === 0}
                  className="flex-1 sm:flex-none sm:w-[170px] cursor-pointer bg-[#FF9800] hover:bg-[#F57C00] text-white py-2.5 px-3 rounded-full font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-[13px]">
                  <Zap className="w-4 h-4" />Buy Now
                </button>
              </div>

              {/* Choose Your Option - WITH MOUSE SCROLL */}
              {colorOption && (
                <div className="mt-4">
                  <h3 className="font-semibold text-[14px] mb-2">Choose Your Option</h3>
                  <div className="relative">
                    <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1 rounded-full shadow-md hover:bg-white transition"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
                    <div 
                      ref={scrollContainerRef} 
                      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-6 cursor-grab active:cursor-grabbing"
                      style={{ scrollbarWidth: 'none' }}
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
                        return (
                          <button key={v.id} onClick={() => { handleOptionChange(colorOption.name, colorValue); setSelectedVariant(v.id); if (variantImage) { const idx = rawImages.findIndex((img: any) => img.url === variantImage); if (idx !== -1) setSelectedImage(idx) } }}
                            className={`relative flex-shrink-0 flex items-center gap-2 p-2 rounded-xl border-2 transition ${isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                            {variantImage && <img src={variantImage} alt={colorValue} className="w-10 h-10 rounded-lg object-cover" />}
                            <div className="text-left min-w-[120px]">
                              <div className="text-[13px] font-semibold text-gray-800">{product.title.split(' ').slice(0, 2).join(' ')} ({colorValue})</div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[14px] font-bold text-[#D32F2F]">₹{parseFloat(v.price.amount).toFixed(2)}</span>
                                {v.compareAtPrice && <span className="text-gray-400 line-through text-[12px]">₹{parseFloat(v.compareAtPrice.amount).toFixed(2)}</span>}
                              </div>
                              {variantDiscount > 0 && <span className="text-[11px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold">{variantDiscount}% OFF</span>}
                            </div>
                            {isSelected && <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5"><Check className="w-2.5 h-2.5" /></div>}
                          </button>
                        )
                      })}
                    </div>
                    <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1 rounded-full shadow-md hover:bg-white transition"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2 mt-4">
                {TRUST_BADGES.map((badge, i) => {
                  const Icon = badge.icon
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                      <Icon className={`w-6 h-6 ${badge.color}`} />
                      <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">{badge.title}</span>
                      <span className="text-[10px] text-gray-500 text-center">{badge.subtitle}</span>
                    </div>
                  )
                })}
              </div>

              <div className="bg-white rounded-xl p-4 mt-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <h3 className="font-bold text-purple-700 text-[14px]">Check Delivery Time</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter Pincode"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-purple-500"
                    disabled={deliveryStatus === 'checking'}
                  />
                  <button 
                    onClick={handleCheckDelivery} 
                    disabled={deliveryStatus === 'checking'}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-[14px] font-semibold transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deliveryStatus === 'checking' ? (
                      <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Checking</>
                    ) : (
                      <><Search className="w-3.5 h-3.5" />Check</>
                    )}
                  </button>
                </div>

                {deliveryStatus === 'available' && (
                  <div className="mt-2 text-[14px] text-green-600 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> Delivery available to {pincode}! Estimated 3-5 days
                  </div>
                )}
                {deliveryStatus === 'unavailable' && (
                  <div className="mt-2 text-[14px] text-red-600 font-medium flex items-center gap-1">
                    <X className="w-4 h-4" /> Delivery not available to {pincode} yet.
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
                      <span className="text-[12px] font-bold text-gray-700">{item.date}</span>
                      <span className="text-[10px] text-gray-500">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleShare} className="text-gray-500 text-[14px] flex items-center gap-1.5 hover:text-[#D32F2F] transition mt-3">
                <Share2 className="w-3.5 h-3.5" />Share this product
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="text-[17px] font-bold text-gray-800 mb-3">What&apos;s in the Box?</h3>
              <ul className="space-y-2">
                {WHATS_IN_BOX.map((item, i) => { const Icon = item.icon; return <li key={i} className="flex items-center gap-2 text-[14px] text-gray-700"><Icon className={`w-3 h-3 ${item.color}`} />{item.title}</li> })}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="text-[17px] font-bold text-gray-800 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {KEY_FEATURES.map((f, i) => { const Icon = f.icon; return (
                  <div key={i} className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 ${f.color} flex-shrink-0 mt-0.5`} />
                    <div><div className="text-[14px] font-bold text-gray-800">{f.title}</div><div className="text-[12px] text-gray-500">{f.description}</div></div>
                  </div>
                )})}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="text-[17px] font-bold text-gray-800 mb-3">Perfect For</h3>
              <div className="grid grid-cols-2 gap-3">
                {PERFECT_FOR.map((item, i) => { const Icon = item.icon; return (
                  <div key={i} className={`flex flex-col items-center gap-1 p-2 ${item.bg} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${item.color}`} /><span className="text-[13px] font-bold text-gray-700">{item.title}</span>
                  </div>
                )})}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex min-w-max">
                {['Description', 'Specifications', 'Additional Details', 'Shipping & Delivery', 'Return & Refund'].map((tab, i) => (
                  <button key={i} onClick={() => setActiveTab(i)} className={`px-5 py-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition ${activeTab === i ? 'border-[#D32F2F] text-[#D32F2F]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
                ))}
              </div>
            </div>
            <div className="p-5">
              {activeTab === 0 && <div className="prose max-w-none text-[14px]" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description || 'Product description coming soon...' }} />}
              {activeTab === 1 && (
                <div className="space-y-2">
                  {product.productType && <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[14px] text-gray-600 w-1/3">Product Type</span><span className="text-[14px] text-gray-800">{product.productType}</span></div>}
                  {product.vendor && <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[14px] text-gray-600 w-1/3">Brand</span><span className="text-[14px] text-gray-800">{product.vendor}</span></div>}
                  {product.tags?.length > 0 && <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[14px] text-gray-600 w-1/3">Tags</span><span className="text-[14px] text-gray-800">{product.tags.join(', ')}</span></div>}
                  <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[14px] text-gray-600 w-1/3">Availability</span><span className={`text-[14px] ${product.availableForSale ? 'text-green-600' : 'text-red-500'}`}>{product.availableForSale ? 'In Stock' : 'Out of Stock'}</span></div>
                </div>
              )}
              {activeTab === 2 && (
                <div className="space-y-2">
                  {variant?.quantityAvailable !== undefined && <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[14px] text-gray-600 w-1/3">Stock Quantity</span><span className="text-[14px] text-gray-800">{variant.quantityAvailable}</span></div>}
                  <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[14px] text-gray-600 w-1/3">Currency</span><span className="text-[14px] text-gray-800">{product.priceRange.minVariantPrice.currencyCode}</span></div>
                  <div className="flex gap-4 py-2 border-b border-gray-50"><span className="font-semibold text-[14px] text-gray-600 w-1/3">Variant</span><span className="text-[14px] text-gray-800">{variant?.title || 'Default'}</span></div>
                </div>
              )}
              {activeTab === 3 && (
                <div className="space-y-3 text-[14px] text-gray-700">
                  <h4 className="font-bold text-gray-800 text-[16px]">Shipping & Delivery Policy</h4>
                  <p>• <strong>Free Delivery:</strong> Available on all orders above ₹499 across India.</p>
                  <p>• <strong>Dispatch Time:</strong> Orders are processed and dispatched within 24-48 business hours.</p>
                  <p>• <strong>Delivery Time:</strong> Standard delivery takes 3-5 business days depending on location.</p>
                  <p>• <strong>Tracking:</strong> Live tracking link provided via SMS and Email once dispatched.</p>
                </div>
              )}
              {activeTab === 4 && (
                <div className="space-y-3 text-[14px] text-gray-700">
                  <h4 className="font-bold text-gray-800 text-[16px]">Return & Refund Policy</h4>
                  <p>• <strong>5 Days Return Window:</strong> Easy returns accepted within 5 days of delivery.</p>
                  <p>• <strong>Condition:</strong> Item must be unused, in original packaging with all tags attached.</p>
                  <p>• <strong>Unboxing Video Mandatory:</strong> A complete unboxing video is required for return claims.</p>
                  <p>• <strong>Refund Process:</strong> Refunds are initiated within 48 hours after item inspection upon return.</p>
                </div>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold font-comic text-[#D32F2F] mb-4">You May Also Like</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {relatedProducts.map((rel) => {
                  const rv = rel.variants?.edges?.[0]?.node
                  const rp = rv?.price?.amount || rel.priceRange.minVariantPrice.amount
                  const rc = rv?.compareAtPrice?.amount || null
                  const rd = rc ? Math.round(((parseFloat(rc) - parseFloat(rp)) / parseFloat(rc)) * 100) : 0
                  const ri = rel.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
                  return (
                    <Link href={`/products/${rel.handle}`} key={rel.id}>
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group">
                        <div className="relative overflow-hidden h-32 md:h-40">
                          <img src={ri} alt={rel.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          {rd > 0 && <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">{rd}% OFF</span>}
                        </div>
                        <div className="p-2">
                          <h4 className="font-semibold text-[13px] line-clamp-1">{rel.title}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[14px] font-bold text-[#D32F2F]">₹{parseFloat(rp).toFixed(2)}</span>
                            {rc && <span className="text-gray-400 line-through text-[12px]">₹{parseFloat(rc).toFixed(2)}</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
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
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
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
      `}</style>
    </div>
  )
}