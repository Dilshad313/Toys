'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Map category names to their IDs for shop-by-category page
const categoryMap: Record<string, string> = {
  'Educational Toys': 'educational',
  'RC & Remote Control': 'rc-cars',
  'Ride-on Toys': 'ride-on',
  'Musical Toys': 'musical',
  'Soft Toys': 'soft-toys',
  'Wooden Toys': 'wooden',
  'Activity Toys': 'activity',
  'Outdoor Toys': 'outdoor',
}

const allCategories = [
  {
    name: 'Educational Toys',
    image:
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=educational',
  },
  {
    name: 'RC & Remote Control',
    image:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=rc-cars',
  },
  {
    name: 'Ride-on Toys',
    image:
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=ride-on',
  },
  {
    name: 'Musical Toys',
    image:
      'https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=musical',
  },
  {
    name: 'Soft Toys',
    image:
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=soft-toys',
  },
  {
    name: 'Wooden Toys',
    image:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=wooden',
  },
  {
    name: 'Activity Toys',
    image:
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=activity',
  },
  {
    name: 'Outdoor Toys',
    image:
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=outdoor',
  },
]

export default function CategoryBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(3) // Mobile: 3 items per page
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(4) // Tablet: 4 items per page
      } else {
        setItemsPerPage(6) // Desktop: 6 items per page
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalPages = Math.ceil(allCategories.length / itemsPerPage)

  const startIndex = currentIndex * itemsPerPage
  const visibleCategories = allCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <section className="py-4 md:py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-2 md:px-4">
        <div className="relative flex items-center">
          {/* Left Arrow - Hide on mobile when on first page */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 z-10 bg-white shadow-lg rounded-full p-2 md:p-3 border border-gray-200 hover:shadow-xl transition hover:scale-105 -ml-2 md:-ml-4"
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
            {visibleCategories.map((category, i) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-center"
              >
                <Link
                  href={category.href}
                  className="flex flex-col items-center group w-full"
                >
                  <div className={`relative rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 border-2 border-gray-100 group-hover:border-[#FF6B35] ${
                    itemsPerPage === 3 ? 'w-24 h-24 md:w-28 md:h-28' :
                    itemsPerPage === 4 ? 'w-28 h-28 md:w-32 md:h-32' :
                    'w-32 h-32 md:w-40 md:h-40'
                  }`}>
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className={`mt-2 md:mt-3 text-center font-semibold text-gray-700 group-hover:text-[#FF6B35] transition ${
                    itemsPerPage === 3 ? 'text-xs md:text-sm' :
                    itemsPerPage === 4 ? 'text-sm md:text-base' :
                    'text-sm md:text-base'
                  }`}>
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow - Hide on mobile when on last page */}
          {currentIndex < totalPages - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-0 z-10 bg-white shadow-lg rounded-full p-2 md:p-3 border border-gray-200 hover:shadow-xl transition hover:scale-105 -mr-2 md:-mr-4"
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

        {/* Dots - Show only if more than 1 page */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 md:mt-6 gap-1.5 md:gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all ${
                  currentIndex === index
                    ? 'w-6 md:w-8 h-1.5 md:h-2 bg-[#FF6B35]'
                    : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}