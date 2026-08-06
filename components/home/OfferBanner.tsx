'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Rocket, Gift, Star } from 'lucide-react'

export default function OfferBanner() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left - Offer Card with Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl min-h-[350px] group"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/offer-bg.png"
                alt="Offer Background"
                fill
                className="object-cover group-hover:scale-110 transition duration-700"
                priority
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center p-8">
              <span className="inline-block bg-[#FFD700]/20 backdrop-blur px-4 py-1.5 rounded-full text-xs font-semibold text-[#FFD700] mb-4 w-fit">
                🎉 Limited Time Offer
              </span>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white font-comic leading-tight">
                Flat
                <br />
                <span className="text-[#FFD700]">20% OFF</span>
              </h2>
              
              <p className="text-white/90 text-lg mt-2">
                On Your First Order
              </p>
              
              <div className="mt-3 inline-block bg-white/20 backdrop-blur px-5 py-2 rounded-full border border-white/30">
                <span className="text-sm font-semibold text-white">
                  Use Code: <span className="text-[#FFD700] font-bold">ATHV120</span>
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-2.5 rounded-full font-semibold transition shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop Now →
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span>Limited Time</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span>Free Shipping</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - RC Cars Card with Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl min-h-[350px] group"
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
            <div className="relative z-10 h-full flex flex-col justify-center p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 backdrop-blur flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-[#FFD700]" />
                </div>
                <span className="bg-[#FFD700]/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-[#FFD700]">
                  ⚡ Trending
                </span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white font-comic">
                RC Cars
              </h3>
              
              <p className="text-white/90 text-lg">
                Speed. Power.
                <br />
                <span className="text-[#FFD700] font-bold">Endless Fun!</span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                <span className="text-white/70 text-sm ml-2">(4.9 ★)</span>
              </div>

              <div className="mt-4">
                <Link
                  href="/shop-by-category?category=rc-cars"
                  className="inline-flex items-center gap-2 bg-[#FFD700] hover:bg-[#FFC107] text-black px-6 py-2.5 rounded-full font-semibold transition shadow-lg hover:shadow-xl"
                >
                  Explore Collection →
                </Link>
              </div>

              <div className="mt-3 text-xs text-white/50">
                🔥 Limited Stock Available
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