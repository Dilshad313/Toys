'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 1,
    name: 'Educational Toys',
    subtitle: 'Starting from ₹499',
    image: 'https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?w=200&h=200&fit=crop&q=80',
    bgColor: 'bg-[#F5E6D3]',
    href: '#'
  },
  {
    id: 2,
    name: 'RC Cars',
    subtitle: 'Starting from ₹899',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200&h=200&fit=crop&q=80',
    bgColor: 'bg-[#D4DDE8]',
    href: '#'
  },
  {
    id: 3,
    name: 'Soft Toys',
    subtitle: 'Starting from ₹299',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop&q=80',
    bgColor: 'bg-[#E8F0F0]',
    href: '#'
  },
]

export default function PromoBanner() {
  return (
    <section className="py-8 md:py-12 bg-white">
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
              <p className="text-white text-lg md:text-xl font-medium mb-0">Flat</p>
              <h2 className="text-yellow-400 text-4xl md:text-5xl font-extrabold mb-1">20% OFF</h2>
              <p className="text-white text-sm md:text-base font-medium mb-4">On Your First Order</p>

              {/* Dashed border code box */}
              <div className="border-2 border-dashed border-white/60 rounded-xl px-4 py-2 mb-5 inline-block w-fit">
                <span className="text-white text-sm md:text-base font-medium">Use Code: </span>
                <span className="text-white text-sm md:text-base font-bold">ATHVI20</span>
              </div>

              {/* Shop Now Button - Navigates to /collections */}
              <Link href="/collections">
                <button className="bg-yellow-400 hover:bg-yellow-300 text-[#E53935] font-bold text-sm md:text-base px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                  Shop Now
                </button>
              </Link>
            </div>

            {/* Gift Box Image - Right Side with Red Background */}
            <div className="absolute right-0 bottom-0 w-[50%] h-full bg-[#E53935]">
              <div className="relative w-full h-full">
                <Image
                  src="/giftbox.png"
                  alt="Gift Box"
                  fill
                  className="object-contain object-center p-4"
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
                <div className="group block cursor-default">
                  <div className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${category.bgColor} flex items-center h-[85px] md:h-[100px]`}>
                    {/* Image - Left Side */}
                    <div className="relative w-24 md:w-28 h-full flex-shrink-0 overflow-hidden rounded-l-xl">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>

                    {/* Content - Right Side */}
                    <div className="flex-1 px-4 md:px-5 py-3">
                      <h3 className="text-base md:text-lg font-bold text-[#2C3E50] group-hover:text-[#D32F2F] transition">
                        {category.name}
                      </h3>
                      <p className="text-[#5D6D7E] text-xs md:text-sm font-medium mt-0.5">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}