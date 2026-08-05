'use client'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section 
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${isMobile ? '/mobile.png' : '/header.png'}')`,
      }}
    >
      {/* Content - Left Aligned */}
      <div className="container mx-auto px-4 relative z-10 pt-8 md:pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          {/* Main Heading - Left Aligned */}
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2 md:mb-3">
              {/* Mobile: Single line, Desktop: Two lines */}
              <span className="text-blue-600 block md:inline">
                <b>Learn. Play.</b><br />
              </span>
              <span className="text-[#D32F2F] block md:inline md:ml-2">
                <b>Imagine</b>
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-blue-900 mb-2 md:mb-6 font-medium">
              <b>Every Toy Creates a New Adventure.</b>
            </p>
            <p className="text-sm md:text-xl text-blue-900 mb-4 md:mb-6 font-small">
              Opening Doors to big Imagination and Fun playtime for <br /> Children Everywhere.
            </p>
          </div>

          {/* Stats Section - Left Aligned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 bg-white/80 backdrop-blur-sm rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 max-w-2xl"
          >
            <div className="text-left">
              <div className="text-xl md:text-3xl font-bold text-[#D32F2F]">25,000+</div>
              <div className="text-[10px] md:text-sm text-gray-600 font-medium">Happy Families</div>
            </div>
            <div className="text-left">
              <div className="text-xl md:text-3xl font-bold text-[#D32F2F]">500+</div>
              <div className="text-[10px] md:text-sm text-gray-600 font-medium">Premium Toys</div>
            </div>
            <div className="text-left">
              <div className="text-xl md:text-3xl font-bold text-[#D32F2F]">4.9 <span className='text-[#FFD700]'>★</span></div>
              <div className="text-[10px] md:text-sm text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="text-left">
              <div className="text-xl md:text-3xl font-bold text-[#D32F2F]">1M+</div>
              <div className="text-[10px] md:text-sm text-gray-600 font-medium">Orders Delivered</div>
            </div>
          </motion.div>

          {/* Shop Collections Button - Redirects to All Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 md:mt-8"
          >
            <Link href="/collections">
              <button className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-2.5 md:px-10 md:py-4 rounded-full font-bold text-sm md:text-lg shadow-xl hover:shadow-2xl transition flex items-center gap-2 md:gap-3">
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                Shop Collections
                <span className="text-lg md:text-xl">→</span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}