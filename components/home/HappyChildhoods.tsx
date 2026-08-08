'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star, Clock, Zap, Check } from 'lucide-react'

export default function HappyChildhoods() {
  // Timer State
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
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
          hours = 23
          minutes = 59
          seconds = 59
        }
        
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Features list - ONLY for desktop
  const features = [
    { text: 'Premium quality toys for all ages' },
    { text: 'Safe and certified materials' },
    { text: 'Educational and fun designs' },
    { text: 'Fast and reliable shipping' },
    { text: 'Gift-ready packaging available' },
  ]

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px] flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={isMobile ? '/baby-mobile.png' : '/baby.png'}
          alt="Happy Childhood"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-between py-8 md:py-12">
        
        {/* TOP CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-white text-left mt-4 md:mt-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/30">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-blue-600">Premium Quality</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-comic leading-tight">
            <span className="text-[#D32F2F] drop-shadow-lg">Crafting Happy</span>
            <br />
            <span className="text-blue-600 drop-shadow-lg">Childhoods</span>
          </h2>

          {/* Features List - DESKTOP ONLY (hidden on mobile) */}
          <div className="hidden md:block mt-4 space-y-2 max-w-lg">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-black text-sm"
              >
                <Check className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="drop-shadow-md">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Shop Now Button - Desktop only here */}
          <div className="hidden md:block mt-6">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-3 rounded-full font-bold transition shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </Link>
          </div>
        </motion.div>

        {/* BOTTOM - Flash Sale Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-auto mb-4 md:mb-6"
        >
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl">
            {/* Mobile Layout: Stacked */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              
              {/* Flash Sale Badge */}
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span className="bg-white text-[#D32F2F] px-3 py-1 rounded-full font-bold text-xs md:text-sm whitespace-nowrap">
                  FLASH SALE: 50% OFF
                </span>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-comic">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-white/70 text-xs font-semibold">H</span>
                </div>
                <span className="text-white text-xl md:text-2xl font-bold">:</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-comic">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-white/70 text-xs font-semibold">M</span>
                </div>
                <span className="text-white text-xl md:text-2xl font-bold">:</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-comic">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-white/70 text-xs font-semibold">S</span>
                </div>
              </div>

              {/* Shop Now Button - Mobile shows here */}
              <Link
                href="/collections"
                className="md:hidden inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#D32F2F] px-4 py-2 rounded-full font-bold transition shadow-lg text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now
              </Link>

              {/* Limited Stock - Desktop */}
              <div className="hidden md:flex items-center gap-2 text-white/80 text-xs md:text-sm font-medium">
                <Clock className="w-4 h-4" />
                <span>Hurry! Limited stock</span>
              </div>
            </div>

            {/* Mobile: Limited Stock below */}
            <div className="md:hidden flex items-center justify-center gap-2 text-white/80 text-xs font-medium mt-2">
              <Clock className="w-3 h-3" />
              <span>Hurry! Limited stock</span>
            </div>
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