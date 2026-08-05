'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Dipak Munjariya',
    rating: 5,
    text: 'Wahhhh wahhh!!! This shop is very huge and my kids enjoying this',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    location: 'Happy Parent'
  },
  {
    id: 2,
    name: 'Samir Bhadani',
    rating: 5,
    text: 'Great shopping experience and very good variety for everyone',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
    location: 'Satisfied Customer'
  },
  {
    id: 3,
    name: 'Pratika Kalathiya',
    rating: 5,
    text: 'Great place for kids\' toys - good quality and lovely atmosphere',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
    location: 'Happy Mom'
  },
]

export default function Testimonials() {
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
            🌟 Trusted by Thousands of Happy Customers
          </h2>
          <p className="text-gray-600 mt-2 font-medium font-comic text-base md:text-lg">
            What our customers say about us
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-[#D32F2F] group"
            >
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-5 h-5 fill-[#FFD700] text-[#FFD700]"
                  />
                ))}
                <span className="text-gray-400 text-sm ml-2">★★★★★</span>
              </div>

              {/* Quote Icon */}
              <div className="mb-3">
                <Quote className="w-8 h-8 text-[#D32F2F]/20 group-hover:text-[#D32F2F]/40 transition" />
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed mb-4">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D32F2F]/20 group-hover:border-[#D32F2F] transition">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm md:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-xs md:text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          <div className="text-center bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-[#D32F2F] font-comic">4.9 ★</div>
            <div className="text-xs text-gray-500">Average Rating</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-[#D32F2F] font-comic">10K+</div>
            <div className="text-xs text-gray-500">Happy Customers</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-[#D32F2F] font-comic">500+</div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-[#D32F2F] font-comic">98%</div>
            <div className="text-xs text-gray-500">Satisfaction</div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </section>
  )
}