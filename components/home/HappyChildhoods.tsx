'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'

export default function HappyChildhoods() {
  // Timer State
  const [timeLeft, setTimeLeft] = useState({
    hours: 3563,
    minutes: 42,
    seconds: 13
  })

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        
        seconds -= 1
        if (seconds < 0) {
          seconds = 59
          minutes -= 1
        }
        if (minutes < 0) {
          minutes = 59
          hours -= 1
        }
        if (hours < 0) {
          hours = 0
          minutes = 0
          seconds = 0
          clearInterval(timer)
        }
        
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Features list - Mobile version (shorter)
  const features = isMobile ? [
    { text: 'Premium quality toys for all ages' },
    { text: 'Safe and certified materials' },
    { text: 'Fast and reliable shipping' },
  ] : [
    { text: 'Premium quality toys for all ages' },
    { text: 'Safe and certified materials' },
    { text: 'Educational and fun designs' },
    { text: 'Fast and reliable shipping' },
    { text: 'Gift-ready packaging available' },
  ]

  return (
    <section className="py-16 relative overflow-hidden min-h-[500px] flex items-center">
      {/* Background Image - Desktop: baby.png, Mobile: baby-mobile.png */}
      <div className="absolute inset-0">
        <Image
          src={isMobile ? '/baby-mobile.png' : '/baby.png'}
          alt="Happy Childhood"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-5xl">
          
          {/* Left Side - Content - Left Aligned */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-[#FFD700]/30">
              <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
              <span className="text-blue-500">Premium Quality</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-comic leading-tight">
              <span className='text-[#D32F2F]'>Crafting Happy</span>
              <br />
              <span className="text-[#FFD700]">Childhoods</span>
            </h2>

            {/* Features List - Mobile: 3 items, Desktop: 5 items */}
            <div className="mt-6 space-y-2 max-w-lg">
              {features.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-black text-sm md:text-base"
                >
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Flash Sale - Full Width - Larger Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-10 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-2xl p-6 md:p-8 border border-white/20 w-full shadow-2xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Flash Sale Badge - Larger */}
              <div className="flex-shrink-0">
                <div className="inline-block bg-white text-[#D32F2F] px-5 py-2 rounded-full font-bold text-sm md:text-base whitespace-nowrap">
                  ⚡ FLASH SALE: 50% OFF ALL TOYS!
                </div>
              </div>

              {/* Timer - Larger */}
              <div className="flex items-center gap-4 text-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-comic">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-white/70 text-xs md:text-sm font-semibold">H</span>
                </div>
                <span className="text-white text-2xl md:text-3xl font-bold">:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-comic">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-white/70 text-xs md:text-sm font-semibold">M</span>
                </div>
                <span className="text-white text-2xl md:text-3xl font-bold">:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-comic">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-white/70 text-xs md:text-sm font-semibold">S</span>
                </div>
              </div>

              {/* Shop Now Button - Navigates to All Products */}
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#D32F2F] px-6 py-2.5 rounded-full font-bold transition shadow-lg hover:shadow-xl text-sm md:text-base flex-shrink-0"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <span className="text-xl md:text-2xl">→</span>
              </Link>

              {/* Limited Stock Notice - Larger */}
              <div className="text-white/80 text-xs md:text-sm font-medium flex-shrink-0">
                ⏰ Hurry! Limited stock
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