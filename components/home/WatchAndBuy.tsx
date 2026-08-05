'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, ShoppingCart, Star } from 'lucide-react'
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
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { addToCart } = useCart()

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime
      const duration = videoRef.current.duration
      setProgress((currentTime / duration) * 100)
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

  // Get product details
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
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold font-comic text-[#D32F2F]">🎬 Watch & Buy</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <div className="bg-gray-200 rounded-xl aspect-video animate-pulse" />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-40 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-comic text-[#D32F2F]">
            🎬 Watch & Buy
          </h2>
          <p className="text-gray-600 mt-1 font-medium font-comic text-sm md:text-base">
            See the toys in action and shop your favorites!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Video Section - Left Side (3 columns) - Smaller */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="relative bg-black rounded-xl overflow-hidden shadow-xl aspect-video max-h-[320px]">
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="/video-poster.jpg"
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                playsInline
                preload="metadata"
              >
                <source 
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                {/* Center Play Button */}
                <button
                  onClick={togglePlay}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/30 backdrop-blur flex items-center justify-center hover:bg-white/50 transition"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-white" />
                  ) : (
                    <Play className="w-7 h-7 text-white ml-1" />
                  )}
                </button>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-2"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full bg-[#D32F2F] rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={togglePlay} className="text-white hover:text-gray-300 transition">
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button onClick={toggleMute} className="text-white hover:text-gray-300 transition">
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-white text-[10px]">
                        {videoRef.current ? formatTime(videoRef.current.currentTime) : '0:00'}
                      </span>
                    </div>
                    <button className="text-white hover:text-gray-300 transition">
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Play Badge - Always visible */}
              <div className="absolute top-3 left-3 bg-[#D32F2F] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <Play className="w-3 h-3" />
                Watch Now
              </div>
            </div>
          </motion.div>

          {/* Products Section - Right Side (2 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-3 h-full">
              {products.slice(0, 4).map((product, i) => {
                const { price, compareAt, imageUrl, variantId, discount } = getProductDetails(product)
                const isAdding = addingToCart === product.id

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100 hover:border-[#D32F2F]"
                  >
                    <Link href={`/products/${product.handle}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-32 object-cover group-hover:scale-110 transition duration-500"
                        />
                        {discount > 0 && (
                          <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm line-clamp-1 font-comic">
                          {product.title}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-gray-700 text-xs ml-1">4.8</span>
                          </div>
                          <span className="text-gray-400 text-xs">(245)</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base font-bold text-[#D32F2F] font-comic">
                            ₹{parseFloat(price).toFixed(2)}
                          </span>
                          {compareAt && (
                            <span className="text-gray-400 line-through text-[10px]">
                              ₹{parseFloat(compareAt).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleAddToCart(variantId, product.id)}
                      disabled={!variantId || isAdding}
                      className="w-full mx-auto mb-3 py-1.5 px-3 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-semibold transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3" />
                          Add to Cart
                        </>
                      )}
                    </button>
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
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}