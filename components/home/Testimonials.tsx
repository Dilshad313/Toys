'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Review {
  id: number
  name: string
  text: string
  image: string
  rating: number
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Dipak Munjariya',
    text: 'Wow!! Jawahill! This shop is very huge and my kids enjoying this',
    image: '/review1.png',
    rating: 5,
  },
  {
    id: 2,
    name: 'Samir Bhadani',
    text: 'Great shopping experience and very good variety for everyone',
    image: '/review2.png',
    rating: 5,
  },
  {
    id: 3,
    name: 'Pratika Kalathiya',
    text: 'Great place for kids\' toys- good quality and lovely atmosphere',
    image: '/review3.png',
    rating: 5,
  },
]

export default function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  return (
    <section className="bg-[#C0392B] py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 font-comic">
          Trusted by Thousands of Happy Customers
        </h2>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="md:hidden absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={scrollRight}
            className="md:hidden absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth pb-4 md:pb-0 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-[280px] md:w-auto snap-start bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full h-48 md:h-56 lg:h-64">
                  <Image
                    src={review.image}
                    alt={`Review by ${review.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F1C40F] text-[#F1C40F]" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3 line-clamp-3">
                    {review.text}
                  </p>
                  <p className="text-gray-900 font-semibold text-sm md:text-base">
                    - {review.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {reviews.map((_, index) => (
            <div key={index} className="w-2 h-2 rounded-full bg-white/40" />
          ))}
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