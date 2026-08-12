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
    <>
      {/* Hero Section */}
      <section 
        className="relative min-h-[75vh] md:min-h-[90vh] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${isMobile ? '/mobile.png' : '/header.png'}')`,
          backgroundSize: 'cover',
          backgroundPosition: isMobile ? 'center 40%' : 'center',
        }}
      >
        {/* Content Container */}
        <div className="container mx-auto px-4 relative z-10 pt-2 md:pt-12 pb-4 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Main Heading & Text - Mobile: moved down */}
            <div className="text-left md:mt-0">
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold leading-tight mb-1 md:mb-3">
                {/* Mobile: Single line, Desktop: Two lines */}
                <span className="text-blue-600 block md:inline">
                  <b>Learn. Play.</b><br className="md:hidden" />
                </span>
                <span className="text-[#D32F2F] block md:inline md:ml-2">
                  <b>Imagine</b>
                </span>
              </h1>
              
              <p className="text-sm md:text-xl text-blue-900 mb-1 md:mb-6 font-medium">
                <b>Every Toy Creates a New Adventure.</b>
              </p>
              <p className="text-xs md:text-xl text-blue-900 mb-3 md:mb-6 font-small">
                Opening Doors to big Imagination and Fun playtime for <br className="hidden md:block" /> Children Everywhere.
              </p>
            </div>

            {/* Stats Section & Button */}
            <div className="pt-36 md:pt-0 transform translate-y-4 md:translate-y-0">
              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-2 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 bg-white/80 backdrop-blur-sm rounded-2xl p-2 md:p-6 shadow-lg border border-gray-100 max-w-2xl"
              >
                <div className="text-left">
                  <div className="text-base md:text-3xl font-bold text-[#D32F2F]">25K+</div>
                  <div className="text-[8px] md:text-sm text-gray-600 font-medium">Happy Families</div>
                </div>
                <div className="text-left">
                  <div className="text-base md:text-3xl font-bold text-[#D32F2F]">500+</div>
                  <div className="text-[8px] md:text-sm text-gray-600 font-medium">Premium Toys</div>
                </div>
                <div className="text-left">
                  <div className="text-base md:text-3xl font-bold text-[#D32F2F]">4.9 <span className='text-[#FFD700]'>★</span></div>
                  <div className="text-[8px] md:text-sm text-gray-600 font-medium">Avg Rating</div>
                </div>
                <div className="text-left">
                  <div className="text-base md:text-3xl font-bold text-[#D32F2F]">1M+</div>
                  <div className="text-[8px] md:text-sm text-gray-600 font-medium">Orders</div>
                </div>
              </motion.div>

              {/* Shop Collections Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-4 md:mt-8 pb-4 md:pb-0"
              >
                <Link href="/collections">
                  <button className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-4 py-2 md:px-10 md:py-4 rounded-full font-bold text-xs md:text-lg shadow-xl hover:shadow-2xl transition flex items-center gap-1.5 md:gap-3">
                    <ShoppingBag className="w-3.5 h-3.5 md:w-5 md:h-5" />
                    Shop Collections
                    <span className="text-base md:text-xl">→</span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Bar - Below Hero Section */}
      <div className="bg-[#D32F2F] text-[#F6C445] overflow-hidden" style={{ height: '52px' }}>
        <div className="h-full flex items-center">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
            <span className="inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="text-sm">🇮🇳</span> Shipping Across India
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="text-sm">🇮🇳</span> Shipping Across India
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="text-sm">🇮🇳</span> Shipping Across India
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          display: inline-flex;
          width: fit-content;
        }
      `}</style>
    </>
  )
}