'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

interface Review {
  id: number
  name: string
  location: string
  text: string
  image: string
  rating: number
  date: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    text: 'Absolutely love the quality of toys! My son is obsessed with the RC car. The delivery was super fast and the packaging was beautiful. Highly recommend Athvi Toys!',
    image: '/review1.png',
    rating: 5,
    date: '2 days ago'
  },
  {
    id: 2,
    name: 'Amit Patel',
    location: 'Delhi, India',
    text: 'Best place to buy toys online. The educational toys are amazing and my daughter has learned so much. Customer service is excellent and very responsive.',
    image: '/review2.png',
    rating: 5,
    date: '5 days ago'
  },
  {
    id: 3,
    name: 'Sneha Reddy',
    location: 'Bangalore, India',
    text: 'Great variety of toys at affordable prices. The soft toys are so cute and cuddly. My niece absolutely loved the teddy bear I gifted her. Will definitely order again!',
    image: '/review3.png',
    rating: 5,
    date: '1 week ago'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Chennai, India',
    text: 'Excellent quality products and fast shipping. The wooden toys are beautifully crafted and safe for kids. Very happy with my purchase!',
    image: '/review1.png',
    rating: 5,
    date: '2 weeks ago'
  },
  {
    id: 5,
    name: 'Ananya Iyer',
    location: 'Hyderabad, India',
    text: 'I love shopping at Athvi Toys! The collection is amazing and the prices are reasonable. My kids love every toy I buy from here.',
    image: '/review2.png',
    rating: 5,
    date: '3 weeks ago'
  }
]

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // ✅ Fix: Use useEffect with typeof window check
  useEffect(() => {
    const getItemsPerPage = () => {
      if (typeof window === 'undefined') return 3
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      return 3
    }

    const handleResize = () => {
      setVisibleCount(getItemsPerPage())
    }

    handleResize()
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const totalPages = Math.ceil(reviews.length / visibleCount)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // ✅ Touch/Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left - go to next
      if (currentIndex < totalPages - 1) {
        nextSlide()
      }
    }

    if (touchStartX - touchEndX < -50) {
      // Swipe right - go to previous
      if (currentIndex > 0) {
        prevSlide()
      }
    }

    // Reset touch values
    setTouchStartX(0)
    setTouchEndX(0)
  }

  const visibleReviews = reviews.slice(
    currentIndex * visibleCount,
    currentIndex * visibleCount + visibleCount
  )

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#D32F2F]/10 text-[#D32F2F] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Customer Reviews
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-comic text-[#D32F2F]">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 mt-2 font-comic">
            Real reviews from real customers
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Reviews Carousel */}
        <div 
          className="relative max-w-6xl mx-auto"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Buttons */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#D32F2F] w-10 h-10 rounded-full flex items-center justify-center transition -ml-5 hidden md:flex"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#D32F2F] w-10 h-10 rounded-full flex items-center justify-center transition -mr-5 hidden md:flex"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile Swipe Indicator */}
          <div className="md:hidden text-center text-xs text-gray-400 mb-4">
            👈 Swipe to see more reviews 👉
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-[#D32F2F]/10">
                  <Quote className="w-12 h-12" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F1C40F] text-[#F1C40F]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                  {review.text}
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {review.location} • {review.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'w-8 h-2.5 bg-[#D32F2F]'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="text-center bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#D32F2F] font-comic">4.9 ★</div>
            <div className="text-xs text-gray-500">Average Rating</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#D32F2F] font-comic">10K+</div>
            <div className="text-xs text-gray-500">Happy Customers</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#D32F2F] font-comic">500+</div>
            <div className="text-xs text-gray-500">Verified Reviews</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#D32F2F] font-comic">98%</div>
            <div className="text-xs text-gray-500">Satisfaction Rate</div>
          </div>
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