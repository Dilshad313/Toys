'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight, ShoppingCart, X, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

interface VideoProduct {
  id: string
  title: string
  handle: string
  videoUrl: string
  category: string
  variantId: string
  isEmbed: boolean
  previewImage?: string
  price?: string
}

interface ShopifyProduct {
  id: string
  title: string
  handle: string
  productType?: string
  vendor?: string
  priceRange?: {
    minVariantPrice?: {
      amount: string
      currencyCode: string
    }
  }
  images?: {
    edges?: Array<{
      node: {
        url: string
      }
    }>
  }
  videoUrl?: {
    value: string
  } | null
  variants?: {
    edges?: Array<{
      node: {
        id: string
        availableForSale: boolean
        price?: {
          amount: string
        }
      }
    }>
  }
  media?: {
    edges?: Array<{
      node: {
        mediaContentType: string
        alt?: string
        previewImage?: {
          url: string
        }
        sources?: Array<{
          url: string
          mimeType?: string
          format?: string
        }>
        embedUrl?: string
      }
    }>
  }
}

const getMetafieldVideoUrl = (value?: string) => {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    if (typeof parsed === 'string') return parsed
    if (parsed && typeof parsed === 'object' && 'url' in parsed) {
      return String(parsed.url)
    }
  } catch {
    return value
  }
  return value
}

const getYouTubeEmbedUrl = (url: string) => {
  if (url.includes('youtube.com/embed/')) return url
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1`
  }
  return url
}

const getProductVideoDetails = (product: ShopifyProduct) => {
  const mediaEdges = product.media?.edges || []
  for (const edge of mediaEdges) {
    const media = edge.node
    if (media.mediaContentType === 'VIDEO' && media.sources?.length) {
      const mp4Source = media.sources.find(
        (source) => source.mimeType?.includes('mp4') || source.format?.toLowerCase() === 'mp4'
      ) || media.sources[0]
      if (mp4Source?.url) {
        return {
          videoUrl: mp4Source.url,
          isEmbed: false,
          previewImage: media.previewImage?.url || product.images?.edges?.[0]?.node?.url,
        }
      }
    } else if (media.mediaContentType === 'EXTERNAL_VIDEO') {
      if (media.embedUrl) {
        return {
          videoUrl: getYouTubeEmbedUrl(media.embedUrl),
          isEmbed: true,
          previewImage: media.previewImage?.url || product.images?.edges?.[0]?.node?.url,
        }
      }
    }
  }

  const mfUrl = getMetafieldVideoUrl(product.videoUrl?.value)
  if (mfUrl) {
    const isEmbed = mfUrl.includes('youtube') || mfUrl.includes('youtu.be') || mfUrl.includes('vimeo')
    return {
      videoUrl: isEmbed ? getYouTubeEmbedUrl(mfUrl) : mfUrl,
      isEmbed,
      previewImage: product.images?.edges?.[0]?.node?.url,
    }
  }

  return null
}

const mapProductToVideoProduct = (product: ShopifyProduct): VideoProduct | null => {
  const videoDetails = getProductVideoDetails(product)
  const variant = product.variants?.edges
    ?.map((edge) => edge.node)
    .find((node) => node.availableForSale) || product.variants?.edges?.[0]?.node

  if (!videoDetails || !variant?.id) return null

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    videoUrl: videoDetails.videoUrl,
    category: product.productType || product.vendor || 'Featured Toy',
    variantId: variant.id,
    isEmbed: videoDetails.isEmbed,
    previewImage: videoDetails.previewImage,
    price: variant.price?.amount || product.priceRange?.minVariantPrice?.amount,
  }
}

// Toast Message Component
const ToastMessage = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'warning'; onClose: () => void }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer) }, [onClose])
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
  const icon = type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />
  return (
    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 max-w-md w-full`}>
      {icon}<span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto hover:opacity-80"><X className="w-4 h-4" /></button>
    </motion.div>
  )
}

export default function WatchAndBuy() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [videoProducts, setVideoProducts] = useState<VideoProduct[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [addingProductId, setAddingProductId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({})
  const [duration, setDuration] = useState<Record<string, number>>({})
  const [showPoster, setShowPoster] = useState<Record<string, boolean>>({})
  const [showPopup, setShowPopup] = useState(false)
  const [popupProduct, setPopupProduct] = useState<VideoProduct | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  useEffect(() => {
    const fetchVideoProducts = async () => {
      try {
        setIsLoadingProducts(true)
        const response = await fetch('/api/products?first=50')
        const result = await response.json()

        if (result.success && result.data?.products?.edges) {
          const products = result.data.products.edges
            .map((edge: { node: ShopifyProduct }) => mapProductToVideoProduct(edge.node))
            .filter((product: VideoProduct | null): product is VideoProduct => Boolean(product))

          setVideoProducts(products)
        }
      } catch (error) {
        console.error('Error loading Watch & Buy products:', error)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchVideoProducts()
  }, [])

  useEffect(() => {
    videoProducts.forEach((product) => {
      setIsMuted((prev) => ({ ...prev, [product.id]: false }))
      setProgress((prev) => ({ ...prev, [product.id]: 0 }))
      setCurrentTime((prev) => ({ ...prev, [product.id]: 0 }))
      setDuration((prev) => ({ ...prev, [product.id]: 0 }))
      setShowPoster((prev) => ({ ...prev, [product.id]: true }))
    })
    window.requestAnimationFrame(checkScroll)
  }, [videoProducts, checkScroll])

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 320, behavior: 'smooth' })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) scrollRight()
    if (touchStartX - touchEndX < -50) scrollLeft()
    setTouchStartX(0)
    setTouchEndX(0)
  }

  const handleLoadedMetadata = useCallback((videoId: string) => {
    const video = videoRefs.current[videoId]
    if (video) {
      setDuration((prev) => ({ ...prev, [videoId]: video.duration }))
      video.currentTime = 0.1
    }
  }, [])

  const handleCanPlay = useCallback((videoId: string) => {
    const video = videoRefs.current[videoId]
    if (video && showPoster[videoId]) {
      video.currentTime = 0
    }
  }, [showPoster])

  const resetEndedVideo = (videoId: string) => {
    setIsPlaying(null)
    setShowPoster((prev) => ({ ...prev, [videoId]: true }))
    if (videoRefs.current[videoId]) {
      videoRefs.current[videoId]!.currentTime = 0
    }
  }

  const togglePlay = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    if (isPlaying === videoId) {
      video.pause()
      setIsPlaying(null)
      return
    }

    Object.keys(videoRefs.current).forEach((id) => {
      if (id !== videoId) videoRefs.current[id]?.pause()
    })

    setShowPoster((prev) => ({ ...prev, [videoId]: false }))
    video.play()
      .then(() => setIsPlaying(videoId))
      .catch((err) => console.error('Play error:', err))
  }

  const toggleMute = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    const newMuted = !isMuted[videoId]
    video.muted = newMuted
    setIsMuted((prev) => ({ ...prev, [videoId]: newMuted }))
  }

  const handleTimeUpdate = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    const current = video.currentTime
    const dur = video.duration || 1
    setCurrentTime((prev) => ({ ...prev, [videoId]: current }))
    setProgress((prev) => ({ ...prev, [videoId]: (current / dur) * 100 }))
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>, videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration
  }

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAddToCart = async (product: VideoProduct) => {
    try {
      setAddingProductId(product.id)
      await addToCart(product.variantId, 1)
      setPopupProduct(product)
      setShowPopup(true)
      setToast({ message: `Added ${product.title} to cart! 🎉`, type: 'success' })
      setTimeout(() => {
        setShowPopup(false)
        setPopupProduct(null)
      }, 3000)
      setTimeout(() => setAddingProductId(null), 1000)
    } catch (error) {
      console.error('Error adding Watch & Buy product to cart:', error)
      setToast({ message: 'Failed to add to cart. Please try again.', type: 'error' })
      setAddingProductId(null)
    }
  }

  const renderVideoCard = (product: VideoProduct) => {
    const isPlayingVideo = isPlaying === product.id
    const videoProgress = progress[product.id] || 0
    const videoDuration = duration[product.id] || 0
    const videoCurrentTime = currentTime[product.id] || 0
    const showPosterVideo = showPoster[product.id] !== false
    const isMutedVideo = isMuted[product.id] || false
    const isAdding = addingProductId === product.id

    return (
      <div key={product.id} className="flex-shrink-0 w-[calc(50vw-12px)] sm:w-[calc(50vw-12px)] md:w-[calc(25vw-18px)] lg:w-[calc(25vw-24px)] snap-start">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100 h-full flex flex-col">
          {/* Video Container - Fixed 16:9 Aspect Ratio with max-height */}
          <div className="relative bg-black w-full aspect-video max-h-[250px] md:max-h-[280px] flex-shrink-0">
            {product.isEmbed ? (
              isPlayingVideo ? (
                <iframe
                  src={product.videoUrl}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={product.previewImage || '/placeholder.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <button
                    onClick={() => setIsPlaying(product.id)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center hover:bg-white/50 transition-all border border-white/40 z-20"
                  >
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" />
                  </button>
                </div>
              )
            ) : (
              <>
                {showPosterVideo && (
                  <div className="absolute inset-0 z-10">
                    <img
                      src={product.previewImage || '/placeholder.jpg'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                )}

                <video
                  ref={(el) => {
                    if (el) videoRefs.current[product.id] = el
                  }}
                  className="w-full h-full object-cover"
                  onLoadedMetadata={() => handleLoadedMetadata(product.id)}
                  onCanPlay={() => handleCanPlay(product.id)}
                  onTimeUpdate={() => handleTimeUpdate(product.id)}
                  onEnded={() => resetEndedVideo(product.id)}
                  playsInline
                  preload="auto"
                  muted={isMutedVideo}
                  poster={product.previewImage || undefined}
                >
                  <source src={product.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

                <button
                  onClick={() => togglePlay(product.id)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all duration-300 hover:scale-110 border border-white/30 z-20"
                >
                  {isPlayingVideo ? (
                    <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  ) : (
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" />
                  )}
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent z-20">
                  <div
                    className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-1.5"
                    onClick={(e) => handleProgressClick(e, product.id)}
                  >
                    <div
                      className="h-full bg-[#D32F2F] rounded-full transition-all"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => togglePlay(product.id)} className="text-white hover:text-[#D32F2F] transition p-0.5">
                        {isPlayingVideo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => toggleMute(product.id)} className="text-white hover:text-[#D32F2F] transition p-0.5">
                        {isMutedVideo ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-white text-[10px] font-medium">
                        {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const video = videoRefs.current[product.id]
                        if (video) {
                          if (document.fullscreenElement) {
                            document.exitFullscreen()
                          } else {
                            video.requestFullscreen()
                          }
                        }
                      }}
                      className="text-white hover:text-[#D32F2F] transition p-0.5"
                    >
                      <Maximize className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs font-medium">{product.category}</span>
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-semibold text-sm text-gray-800 line-clamp-1 font-comic">
              {product.title}
            </h3>
            {product.price && (
              <p className="text-[#D32F2F] font-bold text-sm mt-0.5">₹{parseFloat(product.price).toFixed(2)}</p>
            )}

            <button
              onClick={() => handleAddToCart(product)}
              disabled={isAdding}
              className="w-full mt-2 py-2.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
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
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Toast Messages */}
      <AnimatePresence>
        {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

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
                      src={popupProduct.previewImage || '/placeholder.jpg'}
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

      <section className="py-16 bg-[#F6C445]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-comic text-black">
              Watch & Buy
            </h2>
            <p className="text-black mt-2 font-medium font-comic text-base md:text-lg">
              See the toys in action and shop your favorites!
            </p>
            <div className="w-20 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="relative">
            <button
              onClick={scrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#D32F2F] w-10 h-10 rounded-full flex items-center justify-center transition ${
                canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } -ml-4 hidden md:flex`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={scrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#D32F2F] w-10 h-10 rounded-full flex items-center justify-center transition ${
                canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } -mr-4 hidden md:flex`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={checkScroll}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isLoadingProducts ? (
                [1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex-shrink-0 w-[calc(50vw-12px)] sm:w-[calc(50vw-12px)] md:w-[calc(25vw-18px)] lg:w-[calc(25vw-24px)] snap-start">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                      <div className="bg-black/10 w-full aspect-video max-h-[250px] md:max-h-[280px] animate-pulse" />
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                        <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))
              ) : videoProducts.length === 0 ? (
                <div className="w-full text-center bg-white rounded-xl p-6 text-gray-700 font-comic">
                  No product videos found yet.
                </div>
              ) : (
                videoProducts.map(renderVideoCard)
              )}
            </div>
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
    </>
  )
}