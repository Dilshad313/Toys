'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const categories = [
  { name: '0-2 Years', image: '/age1.png' },
  { name: '2-4 Years', image: '/age2.png' },
  { name: '4-6 Years', image: '/age3.png' },
  { name: '6-8 Years', image: '/age4.png' },
  { name: '8+ Years', image: '/age5.png' },
]

const shopCategories = [
  { name: 'RC Cars', image: '/cat1.png' },
  { name: 'Educational Toys', image: '/cat2.png' },
  { name: 'Building Kits', image: '/cat3.png' },
  { name: 'Animal Toys', image: '/cat4.png' },
  { name: 'STEM Toys', image: '/cat5.png' },
]

export default function Categories() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Shop by Category - First */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-3 text-[#D32F2F] font-comic">
            🧸 Special Products
          </h2>
          <p className="text-center text-gray-600 mb-12 text-base md:text-lg font-medium font-comic">
            Explore our wide range of premium toys ✨
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-20">
          {shopCategories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-default"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition bg-white border-2 border-transparent hover:border-[#D32F2F]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm md:text-base font-comic">
                    {cat.name}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-[#D32F2F]/20 opacity-0 group-hover:opacity-100 transition duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shop by Age - Second */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-3 text-[#FF6B35] font-comic">
            🎈 Shop by Age
          </h2>
          <p className="text-center text-gray-600 mb-12 text-base md:text-lg font-medium font-comic">
            Find the perfect toy for every stage 🌟
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="hover:scale-105 transition duration-300 cursor-default"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-white border-2 border-[#FF6B35]/20 hover:border-[#FF6B35]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-[#FF6B35] text-white text-xs font-bold px-2 py-1 rounded-full font-comic">
                  {cat.name}
                </div>
              </div>
              <div className="text-center mt-3 font-semibold text-gray-700 text-sm font-comic">
                {cat.name}
              </div>
            </motion.div>
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