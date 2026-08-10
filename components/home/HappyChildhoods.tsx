'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function HappyChildhoods() {
  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 26,
    seconds: 48
  })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        seconds -= 1
        if (seconds < 0) { seconds = 59; minutes -= 1 }
        if (minutes < 0) { minutes = 59; hours -= 1 }
        if (hours < 0) { hours = 23; days -= 1 }
        if (days < 0) { days = 2; hours = 14; minutes = 26; seconds = 48 }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const features = [
    { text: 'Creativity', color: '#000000', bg: '#E8EAF6' },
    { text: 'Motor Skills', color: '#000000', bg: '#E8EAF6' },
    { text: 'Logical Thinking', color: '#000000', bg: '#E3F2FD' },
    { text: 'Hand-Eye Coordination', color: '#000000', bg: '#FFF3E0' },
    { text: 'Problem Solving', color: '#000000', bg: '#FFF8E1' },
  ]

  const timerBoxes = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ]

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[800px]">

      {/* ========== FULL BACKGROUND IMAGE - REDUCED SIZE ========== */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[90%] md:max-w-[80%] mx-auto">
          <Image
            src={isMobile ? '/baby-mobile.png' : '/baby.png'}
            alt="Happy Childhood Background"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      </div>

      {/* ========== DECORATIVE SHAPES ========== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="absolute top-5 left-[20%] w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-300/70" />
        <div className="absolute top-12 left-[28%] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-green-400/70 md:border-l-[14px] md:border-r-[14px] md:border-b-[24px]" />
        <div className="absolute top-4 right-[24%] w-10 h-7 md:w-12 md:h-8 bg-sky-300/50 rounded-full" />
        <div className="absolute top-14 right-[14%] text-2xl md:text-3xl opacity-60">🧩</div>
        <div className="absolute bottom-20 right-[18%] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-yellow-400/70" />
        <div className="absolute top-6 left-[36%] text-3xl md:text-4xl opacity-40">💡</div>
        <div className="absolute top-10 left-[32%] w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-yellow-400/50" />
        <div className="absolute bottom-16 left-[42%] w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-blue-400/60" />
      </div>

      {/* ========== CONTENT OVERLAY ========== */}
      <div className="relative z-20 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">

          {/* LEFT: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full md:w-[45%] text-left order-2 md:order-1"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 leading-[1.05] mb-4 md:mb-6 drop-shadow-lg">
              Every Toy<br />Develops
            </h2>

            <div className="space-y-2 md:space-y-2.5">
              {features.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2.5"
                >
                  <div 
                    className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.bg }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: item.color }}>
                      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-black font-medium text-xs md:text-sm drop-shadow-sm">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Empty space */}
          <div className="w-full md:w-[55%] order-1 md:order-2" />
        </div>
      </div>

      {/* ========== BOTTOM RED OFFER BAR - Moved Down by 100px ========== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative z-30 px-3 md:px-4 pb-4 mt-[100px] md:mt-[120px]"
      >
        <div className="bg-gradient-to-r from-[#E53935] via-[#EF5350] to-[#E53935] rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-6">

            {/* LEFT: Offer Text + Shop Now */}
            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-5 w-full sm:w-auto">
              <div className="text-center sm:text-left">
                <p className="text-[#FFCDD2] text-[10px] md:text-xs font-semibold tracking-wider uppercase mb-0.5 flex items-center justify-center sm:justify-start gap-1">
                  <span className="text-yellow-300">✦</span> LIMITED TIME OFFER
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <span className="text-white/90 text-[10px] md:text-xs font-medium">Up to</span>
                  <span className="text-[#FFEB3B] text-2xl md:text-5xl font-black leading-none">50% OFF</span>
                </div>
                <div className="w-[100px] md:w-[130px] h-[3px] bg-white/30 rounded-full mt-1 mx-auto sm:mx-0 relative">
                  <div className="w-[40%] h-full bg-white rounded-full" />
                  <div className="absolute left-[40%] -top-[3px] w-2 h-2 bg-white rounded-full border-2 border-[#E53935]" />
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start gap-1.5 md:gap-2">
                <span className="text-white/95 text-xs md:text-sm font-medium whitespace-nowrap">
                  On Best Selling Toys
                </span>
                <Link href="/collections">
                  <button className="bg-[#FFCA28] hover:bg-[#FFB300] text-[#B71C1C] px-5 md:px-7 py-1.5 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition shadow-md hover:shadow-lg whitespace-nowrap">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>

            {/* CENTER: Countdown Timer */}
            <div className="flex items-center gap-1 md:gap-2">
              {timerBoxes.map((box, i) => (
                <div key={box.label} className="flex items-center gap-1 md:gap-2">
                  <div className="text-center">
                    <div className="bg-white rounded-lg md:rounded-xl px-2 py-1 md:px-4 md:py-2 min-w-[38px] md:min-w-[60px]">
                      <span className="text-base md:text-2xl lg:text-3xl font-extrabold text-gray-800 tabular-nums">
                        {String(box.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-white/70 text-[7px] md:text-[10px] font-medium mt-0.5 uppercase tracking-wide block">
                      {box.label}
                    </span>
                  </div>
                  {i < timerBoxes.length - 1 && (
                    <span className="text-white text-base md:text-2xl font-bold mb-3 md:mb-4">:</span>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT: Elephant Image */}
            <div className="relative w-20 h-16 md:w-28 md:h-24 lg:w-32 lg:h-28 flex-shrink-0 hidden sm:block">
              <Image
                src="/bottom1.png"
                alt="Elephant toy"
                fill
                className="object-contain object-bottom drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}