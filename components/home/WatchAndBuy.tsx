'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface VideoProduct {
  id: string
  title: string
  videoUrl: string
  category: string
  categoryHandle: string
  imageUrl?: string
}

export default function WatchAndBuy() {
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({})
  const [duration, setDuration] = useState<Record<string, number>>({})
  const [showPoster, setShowPoster] = useState<Record<string, boolean>>({})
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)

  // Video products data - Custom videos for each collection
  const videoProducts: VideoProduct[] = [
    {
      id: 'video-1',
      title: 'Educational Toys',
      videoUrl: '/videos/toys.mp4',
      category: 'Educational Toys',
      categoryHandle: 'educational-toys',
      imageUrl: '/placeholder.jpg'
    },
    {
      id: 'video-2',
      title: 'Wooden Toys',
      videoUrl: '/videos/toys.mp4',
      category: 'Wooden Toys',
      categoryHandle: 'wooden-toys',
      imageUrl: '/placeholder.jpg'
    },
    {
      id: 'video-3',
      title: 'Soft Toys',
      videoUrl: '/videos/toys.mp4',
      category: 'Soft Toys',
      categoryHandle: 'soft-toys',
      imageUrl: '/placeholder.jpg'
    },
    
  ]

  // Initialize states for each video
  useEffect(() => {
    videoProducts.forEach((product) => {
      setIsMuted(prev => ({ ...prev, [product.id]: false }))
      setProgress(prev => ({ ...prev, [product.id]: 0 }))
      setCurrentTime(prev => ({ ...prev, [product.id]: 0 }))
      setDuration(prev => ({ ...prev, [product.id]: 0 }))
      setShowPoster(prev => ({ ...prev, [product.id]: true }))
    })
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
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
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

  // Video handlers
  const handleLoadedMetadata = useCallback((videoId: string) => {
    const video = videoRefs.current[videoId]
    if (video) {
      setDuration(prev => ({ ...prev, [videoId]: video.duration }))
      video.currentTime = 0.1
    }
  }, [])

  const handleCanPlay = useCallback((videoId: string) => {
    const video = videoRefs.current[videoId]
    if (video && showPoster[videoId]) {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 720
      canvas.height = video.videoHeight || 1280
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const posterUrl = canvas.toDataURL('image/jpeg')
        video.poster = posterUrl
      }
      video.currentTime = 0
    }
  }, [showPoster])

  const togglePlay = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    if (isPlaying === videoId) {
      video.pause()
      setIsPlaying(null)
    } else {
      // Pause all other videos
      Object.keys(videoRefs.current).forEach((id) => {
        if (id !== videoId && videoRefs.current[id]) {
          videoRefs.current[id]?.pause()
        }
      })
      
      setShowPoster(prev => ({ ...prev, [videoId]: false }))
      video.play().then(() => {
        setIsPlaying(videoId)
      }).catch((err) => {
        console.error('Play error:', err)
      })
    }
  }

  const toggleMute = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    const newMuted = !isMuted[videoId]
    video.muted = newMuted
    setIsMuted(prev => ({ ...prev, [videoId]: newMuted }))
  }

  const handleTimeUpdate = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    const current = video.currentTime
    const dur = video.duration || 1
    setCurrentTime(prev => ({ ...prev, [videoId]: current }))
    setProgress(prev => ({ ...prev, [videoId]: (current / dur) * 100 }))
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>, videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const percentage = x / width
    video.currentTime = percentage * video.duration
  }

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            🎬 Watch & Buy
          </h2>
          <p className="text-gray-600 mt-2 font-medium font-comic text-base md:text-lg">
            See the toys in action and shop your favorites!
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Scrollable Video Container */}
        <div className="relative">
          {/* Scroll Buttons */}
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

          {/* Scrollable Videos */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={checkScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {videoProducts.map((product) => {
              const isPlayingVideo = isPlaying === product.id
              const videoProgress = progress[product.id] || 0
              const videoDuration = duration[product.id] || 0
              const videoCurrentTime = currentTime[product.id] || 0
              const showPosterVideo = showPoster[product.id] !== false
              const isMutedVideo = isMuted[product.id] || false

              return (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100">
                    {/* Video Container */}
                    <div className="relative bg-black aspect-video">
                      {/* Poster Image Overlay */}
                      {showPosterVideo && (
                        <div className="absolute inset-0 z-10">
                          <video
                            ref={(el) => {
                              if (el) videoRefs.current[product.id] = el
                            }}
                            className="w-full h-full object-cover"
                            onLoadedMetadata={() => handleLoadedMetadata(product.id)}
                            onCanPlay={() => handleCanPlay(product.id)}
                            onTimeUpdate={() => handleTimeUpdate(product.id)}
                            onEnded={() => {
                              setIsPlaying(null)
                              setShowPoster(prev => ({ ...prev, [product.id]: true }))
                              if (videoRefs.current[product.id]) {
                                videoRefs.current[product.id]!.currentTime = 0
                              }
                            }}
                            playsInline
                            preload="auto"
                            muted={isMutedVideo}
                          >
                            <source src={product.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <div className="absolute inset-0 bg-black/20" />
                        </div>
                      )}

                      {/* Actual playing video */}
                      {!showPosterVideo && (
                        <video
                          ref={(el) => {
                            if (el) videoRefs.current[product.id] = el
                          }}
                          className="w-full h-full object-cover"
                          onTimeUpdate={() => handleTimeUpdate(product.id)}
                          onEnded={() => {
                            setIsPlaying(null)
                            setShowPoster(prev => ({ ...prev, [product.id]: true }))
                            if (videoRefs.current[product.id]) {
                              videoRefs.current[product.id]!.currentTime = 0
                            }
                          }}
                          playsInline
                          preload="auto"
                          muted={isMutedVideo}
                        >
                          <source src={product.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

                      {/* Center Play Button */}
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

                      {/* Video Controls - Bottom */}
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

                      {/* Category Label on Video */}
                      <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-xs font-medium">{product.category}</span>
                      </div>
                    </div>

                    {/* Product Details - Only Buy Now Button */}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-800 line-clamp-1 font-comic">
                        {product.title}
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5">Explore our collection</p>
                      
                      <Link href={`/shop-by-category?category=${product.categoryHandle}`}>
                        <button className="w-full mt-2 py-2 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-semibold transition flex items-center justify-center gap-2">
                          View Collection →
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
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
  )
}