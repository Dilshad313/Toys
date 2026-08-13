'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

interface Collection {
  id: string
  title: string
  handle: string
  image?: {
    url: string
    altText: string | null
  }
}

export default function CategoryBar() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Touch states
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  
  // Mouse drag states
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragEndX, setDragEndX] = useState(0)

  // Fetch collections from Shopify
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/collections?first=20')
        const result = await response.json()
        console.log('📦 CategoryBar API Response:', result)

        let collectionsList: Collection[] = []
        
        // ✅ FIX: Your API returns { success: true, data: { collections: [ { node: {...} }, ... ] } }
        // The collections array already contains edges with node property
        if (result.success && result.data?.collections) {
          collectionsList = result.data.collections.map((edge: any) => ({
            id: edge.node?.id || edge.id || String(Math.random()),
            title: edge.node?.title || edge.title || 'Untitled',
            handle: edge.node?.handle || edge.handle || '',
            image: edge.node?.image || edge.image || null,
          }))
        }
        
        console.log('✅ Collections parsed:', collectionsList.length)
        console.log('📋 Collections:', collectionsList.map(c => ({ 
          title: c.title, 
          handle: c.handle,
          hasImage: !!c.image?.url,
          imageUrl: c.image?.url
        })))
        
        setCollections(collectionsList)
      } catch (error) {
        console.error('❌ Error fetching collections:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(3)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(4)
      } else {
        setItemsPerPage(6)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset current index when itemsPerPage changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [itemsPerPage])

  const totalPages = Math.max(1, Math.ceil(collections.length / itemsPerPage))

  const startIndex = currentIndex * itemsPerPage
  const visibleCategories = collections.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
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
      if (currentIndex < totalPages - 1) {
        nextSlide()
      }
    }

    if (touchStartX - touchEndX < -50) {
      if (currentIndex > 0) {
        prevSlide()
      }
    }

    setTouchStartX(0)
    setTouchEndX(0)
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragEndX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setDragEndX(e.clientX)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    
    const dragDistance = dragStartX - dragEndX
    
    if (dragDistance > 50) {
      if (currentIndex < totalPages - 1) {
        nextSlide()
      }
    }

    if (dragDistance < -50) {
      if (currentIndex > 0) {
        prevSlide()
      }
    }

    setIsDragging(false)
    setDragStartX(0)
    setDragEndX(0)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp()
    }
  }

  if (loading) {
    return (
      <section className="py-4 md:py-8 bg-[#F6C445] border-b border-[#F6C445]">
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm">Loading categories...</span>
          </div>
        </div>
      </section>
    )
  }

  // No collections found
  if (collections.length === 0) {
    return (
      <section className="py-4 md:py-8 bg-[#F6C445] border-b border-[#F6C445]">
        <div className="container mx-auto px-2 md:px-4">
          <div className="text-center py-6">
            <p className="text-white text-sm">No collections found. Add collections in Shopify Admin.</p>
            <p className="text-white/70 text-xs mt-1">Go to Shopify → Products → Collections</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4 md:py-8 bg-[#F6C445] border-b border-[#F6C445]">
      <div className="container mx-auto px-2 md:px-4">

        <div 
          ref={containerRef}
          className="relative flex items-center touch-pan-y select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Left Arrow */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 z-10 bg-white shadow-lg rounded-full p-2 md:p-3 border border-gray-200 hover:shadow-xl transition hover:scale-105"
              aria-label="Previous"
            >
              <svg
                className="w-4 h-4 md:w-6 md:h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Categories */}
          <div className={`grid w-full gap-2 md:gap-4 px-2 md:px-14 ${
            itemsPerPage === 3 ? 'grid-cols-3' : 
            itemsPerPage === 4 ? 'grid-cols-4' : 
            'grid-cols-6'
          }`}>
            {visibleCategories.map((category, i) => {
              const imageUrl = category.image?.url || ''

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-center"
                >
                  <Link
                    href={`/shop-by-category?category=${category.handle}`}
                    className="flex flex-col items-center group w-full"
                  >
                    <div className={`relative rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 border-2 border-white/30 group-hover:border-[#FFD700] ${
                      itemsPerPage === 3 ? 'w-24 h-24 md:w-28 md:h-28' :
                      itemsPerPage === 4 ? 'w-28 h-28 md:w-32 md:h-32' :
                      'w-32 h-32 md:w-40 md:h-40'
                    }`}>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={category.title}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-500"
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          priority={i < 3}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                          <span className="text-3xl">🧸</span>
                        </div>
                      )}
                    </div>
                    <span className={`mt-2 md:mt-3 text-center font-semibold text-black group-hover:text-blue-600 transition line-clamp-1 ${
                      itemsPerPage === 3 ? 'text-xs md:text-sm' :
                      itemsPerPage === 4 ? 'text-sm md:text-base' :
                      'text-sm md:text-base'
                    }`}>
                      {category.title}
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Right Arrow */}
          {currentIndex < totalPages - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-0 z-10 bg-white shadow-lg rounded-full p-2 md:p-3 border border-gray-200 hover:shadow-xl transition hover:scale-105"
              aria-label="Next"
            >
              <svg
                className="w-4 h-4 md:w-6 md:h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 md:mt-6 gap-1.5 md:gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all ${
                  currentIndex === index
                    ? 'w-6 md:w-8 h-1.5 md:h-2 bg-[#FFD700]'
                    : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </section>
  )
}