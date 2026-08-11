'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: 'Under ₹699',
    subtitle: 'Budget Friendly Toys',
    image: 'https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?w=200&h=200&fit=crop&q=80',
    bgColor: 'bg-[#FFF3E0]',
    textColor: 'text-[#E65100]',
    href: '#'
  },
  {
    id: 2,
    name: 'Under ₹1,299',
    subtitle: 'Best Value Toys',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200&h=200&fit=crop&q=80',
    bgColor: 'bg-[#E3F2FD]',
    textColor: 'text-[#1565C0]',
    href: '#'
  },
  {
    id: 3,
    name: 'Under ₹1,599',
    subtitle: 'Premium Picks',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop&q=80',
    bgColor: 'bg-[#F3E5F5]',
    textColor: 'text-[#7B1FA2]',
    href: '#'
  },
]

export default function PromoBanner() {
  return (
    <section className="py-8 md:py-12 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* Left - Promotional Banner */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-[#E53935] min-h-[280px] md:min-h-[340px] flex items-center"
          >
            {/* Confetti decorations */}
            <div className="absolute top-4 right-20 w-2 h-2 bg-yellow-400 rounded-full opacity-80" />
            <div className="absolute top-8 right-32 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-60" />
            <div className="absolute top-12 right-16 w-2 h-2 bg-yellow-500 rounded-full opacity-70" />
            <div className="absolute top-6 right-40 w-1 h-1 bg-yellow-400 rounded-full opacity-50" />
            <div className="absolute top-16 right-28 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-80" />
            <div className="absolute top-3 right-48 w-1 h-1 bg-yellow-500 rounded-full opacity-60" />
            <div className="absolute top-10 right-8 w-2 h-2 bg-yellow-400 rounded-full opacity-50" />

            {/* Content */}
            <div className="relative z-10 pl-6 md:pl-8 pr-4 py-6 flex flex-col justify-center h-full max-w-[55%]">
              {/* Badge */}
              <div className="bg-[#FFCA28] text-[#B71C1C] text-xs md:text-sm font-bold px-4 py-1.5 rounded-full w-fit mb-3 uppercase tracking-wide">
                Shop by Price
              </div>

              <h2 className="text-white text-3xl md:text-4xl font-extrabold leading-tight mb-1">
                Find Toys
              </h2>
              <h2 className="text-[#FFCA28] text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                Within Your Budget!
              </h2>

              <p className="text-white/90 text-sm md:text-base font-medium mb-5">
                Little Joys for Every Price Range
              </p>

              {/* Shop Now Button */}
              <Link href="/collections">
                <button className="bg-[#FFCA28] hover:bg-[#FFB300] text-[#B71C1C] font-bold text-sm md:text-base px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                  Shop Now
                </button>
              </Link>
            </div>

            {/* Gift Box Image - Right Side */}
            <div className="absolute right-0 bottom-0 w-[50%] h-full">
              <div className="relative w-full h-full">
                <Image
                  src="/giftbox.png"
                  alt="Gift Box"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </motion.div>

          {/* Right - Category Cards Stack */}
          <div className="flex flex-col gap-3 md:gap-4">
            {categories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href={category.href} className="group block">
                  <div className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${category.bgColor} flex items-center h-[85px] md:h-[100px]`}>
                    {/* Image - Left Side */}
                    <div className="relative w-28 md:w-32 h-full flex-shrink-0 overflow-hidden rounded-l-xl">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>

                    {/* Content - Right Side */}
                    <div className="flex-1 px-4 md:px-5 py-3 flex items-center justify-between">
                      <div>
                        <h3 className={`text-xl md:text-2xl font-extrabold ${category.textColor} leading-tight`}>
                          {category.name}
                        </h3>
                        <p className="text-gray-500 text-xs md:text-sm font-medium mt-0.5">
                          {category.subtitle}
                        </p>
                      </div>

                      {/* Arrow Button */}
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${category.textColor.replace('text-', 'bg-').replace('900', '100').replace('700', '100').replace('600', '100')} flex items-center justify-center flex-shrink-0 ml-2 group-hover:scale-110 transition`}>
                        <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 ${category.textColor}`} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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