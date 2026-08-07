'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, ShoppingCart, Star, Heart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

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
      }
    }>
  }
}

export default function WatchAndBuy() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [showPoster, setShowPoster] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { addToCart } = useCart()

  // Load wishlist from localStorage
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

  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    } else {
      localStorage.removeItem('wishlist')
    }
  }, [wishlist])

  // Fetch products from Shopify
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/simple-products?first=4')
        const result = await response.json()
        
        if (response.ok && result.success && result.data?.products?.edges) {
          const productsList = result.data.products.edges.map((edge: any) => edge.node)
          setProducts(productsList)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Extract first frame as poster when video loads
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      videoRef.current.currentTime = 0.1
    }
  }, [])

  const handleCanPlay = useCallback(() => {
    if (videoRef.current && showPoster) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth || 720
      canvas.height = videoRef.current.videoHeight || 1280
      const ctx = canvas.getContext('2d')
      if (ctx && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const posterUrl = canvas.toDataURL('image/jpeg')
        if (videoRef.current) {
          videoRef.current.poster = posterUrl
        }
      }
      videoRef.current.currentTime = 0
    }
  }, [showPoster])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        setShowPoster(false)
        videoRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((err) => {
          console.error('Play error:', err)
        })
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted
      videoRef.current.muted = newMuted
      setIsMuted(newMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const dur = videoRef.current.duration || 1
      setCurrentTime(current)
      setProgress((current / dur) * 100)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const width = rect.width
      const percentage = x / width
      videoRef.current.currentTime = percentage * videoRef.current.duration
    }
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

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">🎬 Watch & Buy</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-gray-200 rounded-2xl aspect-video animate-pulse" />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-44 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            🎬 Watch & Buy
          </h2>
          <p className="text-gray-600 mt-2 font-medium font-comic text-base md:text-lg">
            See the toys in action and shop your favorites!
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* ✅ Video Section - Left Side (3 columns) - Wider */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video max-h-[450px] mx-auto lg:mx-0 group">
              {/* Poster Image Overlay (shown before play) */}
              {showPoster && (
                <div className="absolute inset-0 z-20">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onLoadedMetadata={handleLoadedMetadata}
                    onCanPlay={handleCanPlay}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                      setIsPlaying(false)
                      setShowPoster(true)
                      if (videoRef.current) videoRef.current.currentTime = 0
                    }}
                    playsInline
                    preload="auto"
                    muted={isMuted}
                  >
                    <source src="/videos/toys.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Dark overlay on poster */}
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              )}

              {/* Actual playing video (hidden when poster shown) */}
              {!showPoster && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => {
                    setIsPlaying(false)
                    setShowPoster(true)
                    if (videoRef.current) videoRef.current.currentTime = 0
                  }}
                  playsInline
                  preload="auto"
                  muted={isMuted}
                >
                  <source src="/videos/toys.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

              {/* Center Play Button */}
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all duration-300 hover:scale-110 border border-white/30 z-30"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" />
                ) : (
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
                )}
              </button>

              {/* Play Badge */}
              <div className="absolute top-4 left-4 bg-[#D32F2F] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg z-30">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <Play className="w-3 h-3" />
                Watch Now
              </div>

              {/* Duration Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium z-30">
                {formatTime(duration)}
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-30">
                <div 
                  className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-3 hover:h-2 transition-all"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-[#D32F2F] rounded-full transition-all relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#D32F2F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="text-white hover:text-[#D32F2F] transition p-1">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button onClick={toggleMute} className="text-white hover:text-[#D32F2F] transition p-1">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-white text-xs font-medium">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      if (videoRef.current) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen()
                        } else {
                          videoRef.current.requestFullscreen()
                        }
                      }
                    }}
                    className="text-white hover:text-[#D32F2F] transition p-1"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ✅ Products Section - Right Side (2 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-3 h-full">
              {products.slice(0, 4).map((product, i) => {
                const { price, compareAt, imageUrl, variantId, discount } = getProductDetails(product)
                const isAdding = addingToCart === product.id
                const inWishlist = isInWishlist(product.id)

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-[#D32F2F] relative flex flex-col h-full"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
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

                    <Link href={`/products/${product.handle}`} className="flex-1">
                      <div className="relative overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-32 object-cover group-hover:scale-110 transition duration-500"
                        />
                        {discount > 0 && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="p-2.5">
                        <h4 className="font-semibold text-xs line-clamp-2 font-comic group-hover:text-[#D32F2F] transition leading-tight min-h-[32px]">
                          {product.title}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span className="text-gray-700 text-[10px] ml-0.5">4.8</span>
                          </div>
                          <span className="text-gray-400 text-[9px]">(245)</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-sm font-bold text-[#D32F2F] font-comic">
                            ₹{parseFloat(price).toFixed(2)}
                          </span>
                          {compareAt && (
                            <span className="text-gray-400 line-through text-[9px]">
                              ₹{parseFloat(compareAt).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Two Buttons */}
                    <div className="p-2.5 pt-0 grid grid-cols-2 gap-1.5 mt-auto">
                      <button
                        onClick={() => handleAddToCart(variantId, product.id)}
                        disabled={!variantId || isAdding}
                        className="py-1.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-[10px] font-semibold transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAdding ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            Add
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleBuyNow(variantId)}
                        disabled={!variantId}
                        className="py-1.5 rounded-lg bg-[#FF6B35] hover:bg-[#e55a2b] text-white text-[10px] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Buy Now
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </section>
  )
}

// Helper function to format time
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}