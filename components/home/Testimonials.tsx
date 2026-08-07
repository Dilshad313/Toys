'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

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

export default function TestimonialsSection() {
  return (
    <section className="bg-[#C0392B] py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-center text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 font-comic">
          Trusted by Thousands of Happy Customers
        </h2>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Review Image */}
              <div className="relative w-full h-48 md:h-56 lg:h-64">
                <Image
                  src={review.image}
                  alt={`Review by ${review.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Review Content */}
              <div className="p-4 md:p-5">
                {/* Star Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#F1C40F] text-[#F1C40F]"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3">
                  {review.text}
                </p>

                {/* Reviewer Name */}
                <p className="text-gray-900 font-semibold text-sm md:text-base">
                  - {review.name}
                </p>
              </div>
            </div>
          ))}
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