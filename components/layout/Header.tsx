'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X, Heart, ChevronDown, Home, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import SearchBar from './SearchBar'

const navItems = [
  { name: 'Shop by Age', href: '/categories' },
  { name: 'New Arrivals', href: '/category-cards' },
  { name: 'Best Sellers', href: '/best-sellers' },
  { name: 'Offers', href: '/offers-page' },
  { name: 'Gifts', href: '/happy-childhoods' },
  { name: 'Brands', href: '/brands' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 70)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar - Marquee with Free Shipping & Support - REDUCED HEIGHT */}
      <div className="bg-[#7B2FBE] text-white overflow-hidden" style={{ height: '36px' }}>
        <div className="h-full flex items-center">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-sm">🇮🇳</span> Shipping Across India
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-sm">🇮🇳</span> Shipping Across India
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-sm">🇮🇳</span> Shipping Across India
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50">
        {/* Main Header */}
        <div 
          className="bg-cover bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundImage: `url('/header.png')`,
          }}
        >
          <div className={`transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
          }`}>
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-3">
                {/* Logo */}
                <Link href="/" className="flex flex-col items-start flex-shrink-0">
                  <Image 
                    src="/logo1.png" 
                    alt="Athvi Toys" 
                    width={200} 
                    height={70}
                    className="h-14 md:h-16 w-auto object-contain"
                    priority
                  />
                  <span className="text-[#7B2FBE] text-xs md:text-sm font-medium tracking-wider mt-0.5">
                    Little Joys. Big Smiles.
                  </span>
                </Link>

                {/* Desktop Search Bar */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-6">
                  <SearchBar />
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-4 md:gap-6">
                  {/* Mobile Search Icon - Opens search bar */}
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="md:hidden p-2 text-gray-700 hover:text-[#7B2FBE] transition"
                  >
                    <Search className="w-6 h-6" />
                  </button>

                  {/* Wishlist - Hidden on mobile */}
                  <Link 
                    href="/wishlist" 
                    className="hidden lg:flex items-center gap-2 text-[#7B2FBE] hover:text-[#6A1FB3] transition group"
                  >
                    <Heart className="w-6 h-6" />
                    <span className="text-base font-medium hidden lg:inline">Wishlist</span>
                  </Link>

                  {/* Cart - Hidden on mobile */}
                  <Link 
                    href="/cart" 
                    className="hidden lg:flex items-center gap-2 text-[#7B2FBE] hover:text-[#6A1FB3] transition group relative"
                  >
                    <div className="relative">
                      <ShoppingCart className="w-6 h-6" />
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-3 bg-[#FF6B35] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </div>
                    <span className="text-base font-medium hidden lg:inline">Cart</span>
                  </Link>

                  {/* Mobile Menu Toggle */}
                  <button
                    className="md:hidden p-2"
                    onClick={() => {
                      setIsMenuOpen(!isMenuOpen)
                      setIsSearchOpen(false)
                    }}
                  >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Mobile Search Bar - Appears on click */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden overflow-hidden"
                  >
                    <div className="pb-3">
                      <SearchBar />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation - Desktop */}
              <nav className="hidden md:flex items-center justify-between gap-6 py-3 bg-[#7B2FBE] rounded-lg px-6 w-full">
                {/* Shop by Category */}
                <div className="flex-shrink-0">
                  <Link href="/shop-by-category">
                    <button className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-6 py-3 rounded-full text-base font-semibold transition flex items-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap">
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      Shop by Category
                    </button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 flex-1 justify-center">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-white hover:text-[#FFD700] transition text-[15px] font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Mobile Menu */}
              {isMenuOpen && (
                <div className="md:hidden py-4 border-t border-gray-100 bg-white">
                  <Link 
                    href="/shop-by-category"
                    className="block w-full text-left py-3 px-4 bg-[#FF6B35] text-white font-semibold rounded-lg mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      Shop by Category
                    </span>
                  </Link>

                  <Link 
                    href="/" 
                    className="block py-3 transition px-4 text-[#FF6B35] font-semibold border-b border-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>

                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-3 transition px-4 text-gray-700 hover:text-[#FF6B35]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition group">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link href="/shop-by-category" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition group">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[10px] font-medium">Shop</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition group relative">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </Link>

          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition group">
            <Heart className="w-6 h-6" />
            <span className="text-[10px] font-medium">Wishlist</span>
          </Link>
        </div>
      </div>
    </>
  )
}

// Global styles
const globalStyles = `
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 25s linear infinite;
    display: inline-flex;
    width: fit-content;
  }
  @media (max-width: 767px) {
    body {
      padding-bottom: 70px;
    }
  }
`

if (typeof window !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = globalStyles
  document.head.appendChild(style)
}