'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X, Heart, ChevronDown, Home, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import SearchBar from './SearchBar'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'All Products', href: '/collections' },
  { name: 'Shop by Category', href: '/shop-by-category' },
  { name: 'Shop By Age', href: '/categories' },
  { name: 'Offers', href: '/offers-page' },
  { name: 'New Arrivals', href: '/category-cards' },
  { name: 'Best Sellers', href: '/best-sellers' },
  { name: 'Trending', href: '/trending' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact Us', href: '/contact' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  // Close search on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isSearchOpen])

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSearchOpen])

  // Function to close search popup when product is selected
  const handleProductSelect = () => {
    setIsSearchOpen(false)
  }

  return (
    <>
      {/* Top Bar - Marquee with Free Shipping & Support - REDUCED HEIGHT */}
      <div className="bg-[#7B2FBE] text-white overflow-hidden" style={{ height: '32px' }}>
        <div className="h-full flex items-center">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-medium">
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium">
              <span className="text-sm">🇮🇳</span> Shipping Across India
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium">
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium">
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium">
              <span className="text-sm">🇮🇳</span> Shipping Across India
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium">
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium">
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium">
              <span className="text-sm">🇮🇳</span> Shipping Across India
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium">
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
              {/* Desktop Layout: Logo Left | Nav Center | Icons Right */}
              {/* Mobile Layout: Search Left | Logo Center | Menu Right */}
              <div className="flex items-center justify-between py-3 relative lg:static">
                
                {/* LEFT SIDE */}
                <div className="flex items-center gap-2 lg:gap-4 z-10">
                  {/* Mobile: Search Icon on LEFT */}
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className={`lg:hidden p-2 transition rounded-full hover:bg-gray-100 ${
                      isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  {/* Desktop: Logo on LEFT */}
                  <Link href="/" className="hidden lg:block flex-shrink-0">
                    <Image 
                      src="/logo1.png" 
                      alt="Athvi Toys" 
                      width={200} 
                      height={70}
                      className="h-16 w-auto object-contain"
                      priority
                    />
                  </Link>
                </div>

                {/* CENTER - Logo (Mobile Only) / Nav Links (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0 lg:flex-1 lg:flex lg:justify-center">
                  {/* Mobile: Centered Logo */}
                  <Link href="/" className="lg:hidden flex-shrink-0">
                    <Image 
                      src="/logo1.png" 
                      alt="Athvi Toys" 
                      width={200} 
                      height={70}
                      className="h-14 w-auto object-contain"
                      priority
                    />
                  </Link>

                  {/* Desktop: Navigation Links - CENTER - BOLD */}
                  <nav className="hidden lg:flex flex-wrap items-center justify-center gap-x-3.5 xl:gap-x-5 gap-y-1 max-w-4xl mx-auto px-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`transition text-xs xl:text-sm font-bold whitespace-nowrap ${
                          isScrolled ? 'text-gray-700 hover:text-[#D32F2F]' : 'text-gray-700 hover:text-[#D32F2F]'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* RIGHT SIDE - Icons */}
                <div className="flex items-center gap-1 md:gap-2 z-10">
                  {/* Desktop: Search, Wishlist, Cart */}
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className={`hidden lg:block p-2 transition rounded-full hover:bg-gray-100 ${
                      isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  <Link 
                    href="/wishlist" 
                    className={`hidden lg:block p-2 transition rounded-full hover:bg-gray-100 ${
                      isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </Link>

                  {/* Desktop Cart */}
                  <Link 
                    href="/cart" 
                    className={`hidden lg:flex p-2 transition rounded-full hover:bg-gray-100 relative ${
                      isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      {totalItems > 0 && (
                        <span className={`absolute -top-2 -right-3 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                          isScrolled ? 'bg-[#FF6B35]' : 'bg-[#FF6B35]'
                        }`}>
                          {totalItems}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Mobile: Menu Toggle ONLY (no cart) */}
                  <button
                    className={`lg:hidden p-2 transition ${
                      isScrolled ? 'text-gray-700 hover:text-[#7B2FBE]' : 'text-gray-700 hover:text-[#7B2FBE]'
                    }`}
                    onClick={() => {
                      setIsMenuOpen(!isMenuOpen)
                      setIsSearchOpen(false)
                    }}
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mobile Menu */}
              {isMenuOpen && (
                <div className="lg:hidden py-4 border-t border-gray-100 bg-white">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block py-3 transition px-4 hover:text-[#FF6B35] ${
                        index === 0
                          ? 'text-[#FF6B35] font-semibold border-b border-gray-50'
                          : 'text-gray-700'
                      }`}
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
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link href="/shop-by-category" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition group">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[10px] font-medium">Shop</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition group relative">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </Link>

          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition group">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Wishlist</span>
          </Link>
        </div>
      </div>

      {/* ========== SEARCH POPUP OVERLAY ========== */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 md:pt-28 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 font-comic">Search Products</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4">
                <SearchBar onProductSelect={handleProductSelect} />
              </div>

              {/* Quick Suggestions */}
              <div className="px-4 pb-4">
                <p className="text-xs text-gray-400 font-medium mb-2">Popular Searches:</p>
                <div className="flex flex-wrap gap-2">
                  {['Educational Toys', 'RC Cars', 'Soft Toys', 'Puzzles', 'Building Blocks', 'Musical Toys'].map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 bg-gray-100 hover:bg-[#7B2FBE]/10 text-gray-600 hover:text-[#7B2FBE] text-xs rounded-full transition"
                      onClick={() => {
                        setIsSearchOpen(false)
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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