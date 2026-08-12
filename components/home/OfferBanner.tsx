'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Rocket, Gift, Star } from 'lucide-react'

export default function OfferBanner() {
  return (
    <section className="py-8 md:py-12 bg-[#F6C445]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* Left - RC Cars Card with Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl min-h-[220px] md:min-h-[350px] group"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&h=500&fit=crop&q=80"
                alt="RC Cars"
                fill
                className="object-cover group-hover:scale-110 transition duration-700"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center p-4 md:p-8">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#FFD700]/20 backdrop-blur flex items-center justify-center">
                  <Rocket className="w-4 h-4 md:w-6 md:h-6 text-[#FFD700]" />
                </div>
                <span className="bg-[#FFD700]/20 backdrop-blur px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold text-[#FFD700]">
                  ⚡ Trending
                </span>
              </div>
              
              <h3 className="text-xl md:text-3xl font-bold text-white font-comic">
                RC Cars
              </h3>

              <div className="mt-3 md:mt-4">
                <Link
                  href="/shop-by-category?category=rc-cars"
                  className="inline-flex items-center gap-1.5 md:gap-2 bg-[#FFD700] hover:bg-[#FFC107] text-black px-3 md:px-5 py-1.5 md:py-2.5 rounded-full font-semibold transition shadow-lg hover:shadow-xl text-[11px] md:text-sm"
                >
                  Explore Collection →
                </Link>
              </div>

              <div className="mt-2 md:mt-3 text-[10px] md:text-xs text-white/50">
                🔥 Limited Stock Available
              </div>
            </div>
          </motion.div>

          {/* Right - RC Flying Toys Card with Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl min-h-[220px] md:min-h-[350px] group"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/rc-flying1.png"
                alt="RC Flying Toys"
                fill
                className="object-cover group-hover:scale-110 transition duration-700"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center p-4 md:p-8">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#FFD700]/20 backdrop-blur flex items-center justify-center">
                  <Gift className="w-4 h-4 md:w-6 md:h-6 text-[#FFD700]" />
                </div>
                <span className="bg-[#FFD700]/20 backdrop-blur px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold text-[#FFD700]">
                  🚀 New Arrival
                </span>
              </div>
              
              <h3 className="text-xl md:text-3xl font-bold text-white font-comic">
                RC Flying Toys
              </h3>

              <div className="mt-3 md:mt-4">
                <Link
                  href="/shop-by-category?category=rc-flying-toys"
                  className="inline-flex items-center gap-1.5 md:gap-2 bg-[#FFD700] hover:bg-[#FFC107] text-black px-3 md:px-5 py-1.5 md:py-2.5 rounded-full font-semibold transition shadow-lg hover:shadow-xl text-[11px] md:text-sm"
                >
                  Explore Collection →
                </Link>
              </div>

              <div className="mt-2 md:mt-3 text-[10px] md:text-xs text-white/50">
                🎯 Perfect for outdoor fun
              </div>
            </div>
          </motion.div>
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