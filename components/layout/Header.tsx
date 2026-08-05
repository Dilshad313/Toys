'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X, Heart, ChevronDown } from 'lucide-react'
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
  const { totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 70)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Marquee with Free Shipping & Support */}
      {!isScrolled && (
        <div className="bg-[#7B2FBE] text-white overflow-hidden" style={{ height: '70px' }}>
          <div className="h-full flex items-center">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                🚚 Free Shipping on Orders above ₹499
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                🇮🇳 Shipping Across India
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                💬 24/7 WhatsApp Support
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                🚚 Free Shipping on Orders above ₹499
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                🇮🇳 Shipping Across India
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                💬 24/7 WhatsApp Support
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                🚚 Free Shipping on Orders above ₹499
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                🇮🇳 Shipping Across India
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                💬 24/7 WhatsApp Support
              </span>
            </div>
          </div>
        </div>
      )}

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
                  src="/logo.png" 
                  alt="Athvi Toys" 
                  width={200} 
                  height={70}
                  className="h-16 w-auto object-contain"
                  priority
                />
                <span className="text-[#7B2FBE] text-sm font-medium tracking-wider mt-0.5">
                  Little Joys. Big Smiles.
                </span>
              </Link>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-2xl mx-6">
                <SearchBar />
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-6">
                <Link href="/wishlist" className="flex items-center gap-2 text-[#7B2FBE] hover:text-[#6A1FB3] transition group">
                  <Heart className="w-6 h-6" />
                  <span className="text-base font-medium hidden lg:inline">Wishlist</span>
                </Link>

                <Link href="/account" className="flex items-center gap-2 text-[#7B2FBE] hover:text-[#6A1FB3] transition group">
                  <User className="w-6 h-6" />
                  <span className="text-base font-medium hidden lg:inline">Account</span>
                </Link>

                <Link href="/cart" className="flex items-center gap-2 text-[#7B2FBE] hover:text-[#6A1FB3] transition group relative">
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

                <button
                  className="md:hidden"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen)
                  }}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden pb-3">
              <SearchBar />
            </div>

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
                {/* Shop by Category - Mobile */}
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

                {/* Home Link */}
                <Link 
                  href="/" 
                  className="block py-3 transition px-4 text-[#FF6B35] font-semibold border-b border-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Other Nav Items */}
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
    </header>
  )
}