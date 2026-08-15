'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Heart, ChevronDown, Home, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import SearchBar from './SearchBar'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'All Products', href: '/collections' },
  { name: 'Shop by Category', href: '/shop-by-category', hasDropdown: true },
  { name: 'Shop By Age', href: '/categories' },
  { name: 'Offers', href: '/category-cards' },
  { name: 'New Arrivals', href: '/new-arrivals' },
  { name: 'Best Sellers', href: '/best-sellers' },
  { name: 'Trending', href: '/trending' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact Us', href: '/contact' },
]

interface CollectionItem {
  id: string
  title: string
  handle: string
}

interface CollectionEdge {
  node: CollectionItem
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [categoryItems, setCategoryItems] = useState<CollectionItem[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 70)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoadingCategories(true)
        console.log('Fetching collections...')
        
        const response = await fetch('/api/collections?first=50')
        const result = await response.json()
        
        console.log('API Response:', result)
        
        if (result.success && result.data?.collections) {
          const collections = (result.data.collections as CollectionEdge[])
            .map((edge) => edge.node)
            .filter((collection) => collection?.id && collection?.title && collection?.handle)

          console.log('Processed collections:', collections)
          setCategoryItems(collections)
        } else if (result.collections) {
          // Handle case where API returns collections directly
          console.log('Direct collections:', result.collections)
          setCategoryItems(result.collections)
        } else {
          console.error('Unexpected API response structure:', result)
          setCategoryItems([])
        }
      } catch (error) {
        console.error('Error loading header collections:', error)
        setCategoryItems([])
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCollections()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const handleProductSelect = () => {
    setIsSearchOpen(false)
  }

  // ─── Desktop Dropdown Handlers ─────────────────────────────────
  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setIsCategoryDropdownOpen(true)
  }

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsCategoryDropdownOpen(false)
    }, 200)
  }

  const handleDropdownItemClick = () => {
    setIsCategoryDropdownOpen(false)
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
  }

  return (
    <>
      {/* Top Bar - Marquee */}
      <div className="bg-[#F6C445] text-black overflow-hidden" style={{ height: '34px' }}>
        <div className="h-full flex items-center">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
            <span className="inline-flex items-center gap-2 font-medium" style={{ fontSize: '15px' }}>
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <div className="flex items-center justify-center gap-2">
              <img src="/svg/india-flag.svg" alt="India" className="w-6 h-4 object-cover block" />
              <span>Shipping Across India</span>
            </div>
            <span className="inline-flex items-center gap-2 font-medium" style={{ fontSize: '15px' }}>
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
            <span className="inline-flex items-center gap-2 font-medium" style={{ fontSize: '15px' }}>
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <div className="flex items-center justify-center gap-2">
              <img src="/svg/india-flag.svg" alt="India" className="w-6 h-4 object-cover block" />
              <span>Shipping Across India</span>
            </div>
            <span className="inline-flex items-center gap-2 font-medium" style={{ fontSize: '15px' }}>
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
            <span className="inline-flex items-center gap-2 font-medium" style={{ fontSize: '15px' }}>
              <span className="text-sm">🚚</span> Free Shipping on Orders above ₹499
            </span>
            <div className="flex items-center justify-center gap-2">
              <img src="/svg/india-flag.svg" alt="India" className="w-6 h-4 object-cover block" />
              <span>Shipping Across India</span>
            </div>
            <span className="inline-flex items-center gap-2 font-medium" style={{ fontSize: '15px' }}>
              <span className="text-sm">💬</span> 24/7 WhatsApp Support
            </span>
          </div>
        </div>
      </div>

      {/* Main Header - Sticky */}
      <header className="sticky top-0 z-50">
        <div className="bg-cover bg-center bg-no-repeat transition-all duration-300" style={{ backgroundImage: `url('/header.png')` }}>
          <div className={`transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-3 relative lg:static">

                {/* LEFT SIDE */}
                <div className="flex items-center gap-2 lg:gap-4 z-10">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="lg:hidden p-2 transition rounded-full hover:bg-gray-100 text-gray-700"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <Link href="/" className="hidden lg:block flex-shrink-0">
                    <Image src="/logo4.png" alt="Athvi Toys" width={200} height={70} className="h-16 w-auto object-contain" priority />
                  </Link>
                </div>

                {/* CENTER - Logo (Mobile) / Nav (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0 lg:flex-1 lg:flex lg:justify-center">
                  <Link href="/" className="lg:hidden flex-shrink-0">
                    <Image src="/logo4.png" alt="Athvi Toys" width={200} height={70} className="h-14 w-auto object-contain" priority />
                  </Link>

                  {/* Desktop Navigation */}
                  <nav className="hidden lg:flex text-black items-center justify-center gap-3 xl:gap-6 overflow-x-auto max-w-full px-2 scrollbar-hide">
                    {navItems.map((item) => {
                      if (item.hasDropdown) {
                        return (
                          <div
                            key={item.name}
                            ref={dropdownRef}
                            className="relative group"
                            onMouseEnter={handleDropdownMouseEnter}
                            onMouseLeave={handleDropdownMouseLeave}
                          >
                            {/* Nav Link with Dropdown Arrow */}
                            <Link
                              href={item.href}
                              className={`transition text-sm xl:text-base font-bold whitespace-nowrap flex items-center gap-1 py-2 text-gray-700 hover:text-[#D32F2F] group-hover:text-[#D32F2F]`}
                              onClick={handleDropdownItemClick}
                            >
                              {item.name}
                              
                            </Link>

                            {/* Dropdown Menu - Appears on Hover */}
                            <AnimatePresence>
                              {isCategoryDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute left-0 top-full pt-2 w-72 z-50"
                                  onMouseEnter={handleDropdownMouseEnter}
                                  onMouseLeave={handleDropdownMouseLeave}
                                >
                                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden max-h-96 overflow-y-auto">
                                    {/* Header */}
                                    <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 sticky top-0">
                                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[#D32F2F]" />
                                        Collections ({categoryItems.length})
                                      </span>
                                    </div>

                                    {isLoadingCategories ? (
                                      <div className="px-4 py-4 text-sm text-gray-500 flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-[#D32F2F] rounded-full animate-spin" />
                                        Loading collections...
                                      </div>
                                    ) : categoryItems.length > 0 ? (
                                      <div className="py-1">
                                        {categoryItems.map((cat, index) => (
                                          <Link
                                            key={cat.id}
                                            href={`/shop-by-category?category=${cat.handle}`}
                                            className={`block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#D32F2F]/10 hover:text-[#D32F2F] transition-all duration-200 border-l-2 border-transparent hover:border-[#D32F2F]`}
                                            onClick={handleDropdownItemClick}
                                          >
                                            <div className="flex items-center justify-between">
                                              <span>{cat.title}</span>
                                              <span className="text-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                            </div>
                                          </Link>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="px-4 py-4 text-sm text-gray-500 text-center">
                                        No collections found
                                      </div>
                                    )}

                                    {/* View All Link */}
                                    <div className="border-t border-gray-100 mt-1 pt-1 bg-gray-50/50 sticky bottom-0">
                                      <Link
                                        href="/shop-by-category"
                                        className="block px-4 py-2.5 text-sm font-semibold text-[#D32F2F] hover:bg-[#D32F2F]/10 transition-colors flex items-center justify-between"
                                        onClick={handleDropdownItemClick}
                                      >
                                        <span>View All Categories</span>
                                        <span>→</span>
                                      </Link>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      }
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="transition text-sm xl:text-base font-bold whitespace-nowrap py-2 text-gray-700 hover:text-[#D32F2F]"
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </nav>
                </div>

                {/* RIGHT SIDE - Icons */}
                <div className="flex items-center gap-1 md:gap-2 z-10">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="hidden lg:block p-2 transition rounded-full hover:bg-gray-100 text-gray-700"
                  >
                    <Search className="w-7 h-7" />
                  </button>
                  <Link href="/wishlist" className="hidden lg:block p-2 transition rounded-full hover:bg-gray-100 text-gray-700">
                    <Heart className="w-7 h-7" />
                  </Link>
                  <Link href="/cart" className="hidden lg:flex p-2 transition rounded-full hover:bg-gray-100 relative text-gray-700">
                    <div className="relative">
                      <ShoppingCart className="w-7 h-7" />
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-3 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </div>
                  </Link>
                  <button
                    className="lg:hidden p-2 transition text-gray-700 hover:text-[#7B2FBE]"
                    onClick={() => { setIsMenuOpen(!isMenuOpen); setIsSearchOpen(false) }}
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════
                  MOBILE MENU
                  ═══════════════════════════════════════════════════ */}
              {isMenuOpen && (
                <div className="lg:hidden py-4 border-t border-gray-100 bg-white max-h-[70vh] overflow-y-auto">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block py-3 px-4 transition ${
                        index === 0 ? 'text-[#FF6B35] font-semibold border-b border-gray-50' : 'text-gray-700 hover:text-[#FF6B35]'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        {item.hasDropdown && <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
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
          <Link href="/" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/shop-by-category" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[10px] font-medium">Shop</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition relative">
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
          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-[#7B2FBE] hover:text-[#6A1FB3] transition">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Wishlist</span>
          </Link>
        </div>
      </div>

      {/* Search Popup */}
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
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 font-comic">Search Products</h3>
                <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                <SearchBar onProductSelect={handleProductSelect} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
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
    body { padding-bottom: 70px; }
  }
`

if (typeof window !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = globalStyles
  document.head.appendChild(style)
}