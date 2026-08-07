'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  ShoppingBag
} from 'lucide-react'
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter,
  FaYoutube,
  FaWhatsapp
} from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="text-gray-300">
      {/* Newsletter Section - Yellow Background */}
      <div className="bg-[#FAC310]">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mail Icon */}
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#1a1a2e] font-comic">
                  Get <span className="text-[#E21923]">₹100 OFF</span> on your first order!
                </h3>
                <p className="text-[#1a1a2e]/70 mt-0.5 text-sm md:text-base">
                  Join our newsletter and get exclusive offers.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2.5 md:px-6 md:py-3 rounded-full bg-white border border-white text-[#1a1a2e] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E21923] transition text-sm md:text-base min-w-[250px]"
              />
              <button className="bg-[#E21923] hover:bg-[#c41720] text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold transition text-sm md:text-base whitespace-nowrap">
                Subscribe
              </button>
            </div>

            {/* Follow Us - Right Side */}
            <div className="flex flex-col items-center lg:items-end gap-2">
              <p className="text-[#1a1a2e] font-semibold text-sm">Follow Us</p>
              <div className="flex gap-2">
                <a href="#" className="bg-white hover:bg-[#E21923] text-[#E21923] hover:text-white p-2 rounded-full transition w-9 h-9 flex items-center justify-center">
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a href="#" className="bg-white hover:bg-[#045EE6] text-[#045EE6] hover:text-white p-2 rounded-full transition w-9 h-9 flex items-center justify-center">
                  <FaFacebook className="w-4 h-4" />
                </a>
                <a href="#" className="bg-white hover:bg-[#E21923] text-[#E21923] hover:text-white p-2 rounded-full transition w-9 h-9 flex items-center justify-center">
                  <FaYoutube className="w-4 h-4" />
                </a>
                <a href="#" className="bg-white hover:bg-[#25D366] text-[#25D366] hover:text-white p-2 rounded-full transition w-9 h-9 flex items-center justify-center">
                  <FaWhatsapp className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer - Blue Background */}
      <div className="bg-[#045EE6]">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            
            {/* Brand Column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3 md:mb-4">
                <Image 
                  src="/logo1.png" 
                  alt="Athvi Toys" 
                  width={160} 
                  height={55}
                  className="h-25 md:h-20 w-33 "
                  priority
                />
              </Link>
              <p className="text-xs md:text-sm text-white/80 mb-3 md:mb-4 max-w-xs leading-relaxed">
                Athvi Toys is your one-stop shop for premium quality toys for kids of all ages.
              </p>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 font-comic">Shop</h4>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li><Link href="/collections" className="text-white/80 hover:text-[#FAC310] transition">All Toys</Link></li>
                <li><Link href="/category-cards" className="text-white/80 hover:text-[#FAC310] transition">New Arrivals</Link></li>
                <li><Link href="/best-sellers" className="text-white/80 hover:text-[#FAC310] transition">Best Sellers</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 font-comic">Customer Service</h4>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li><Link href="/contact" className="text-white/80 hover:text-[#FAC310] transition">Contact Us</Link></li>
                <li><Link href="/track-order" className="text-white/80 hover:text-[#FAC310] transition">Track Order</Link></li>
                <li><Link href="/shipping-policy" className="text-white/80 hover:text-[#FAC310] transition">Shipping Policy</Link></li>
                <li><Link href="/returns" className="text-white/80 hover:text-[#FAC310] transition">Returns & Refunds</Link></li>
                <li><Link href="/faqs" className="text-white/80 hover:text-[#FAC310] transition">FAQs</Link></li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 font-comic">Information</h4>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li><Link href="/privacy" className="text-white/80 hover:text-[#FAC310] transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/80 hover:text-[#FAC310] transition">Terms & Conditions</Link></li>
                <li><Link href="/blog" className="text-white/80 hover:text-[#FAC310] transition">Blog</Link></li>
              </ul>
            </div>

            {/* Help & Support */}
            <div>
              <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 font-comic">Help & Support</h4>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li><Link href="/wishlist" className="text-white/80 hover:text-[#FAC310] transition">Wishlist</Link></li>
                <li><Link href="/order-history" className="text-white/80 hover:text-[#FAC310] transition">Order History</Link></li>
              </ul>
            </div>

            {/* Payment Methods Column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 font-comic">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                {/* VISA */}
                <div className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center">
                  <span className="text-[#1A1F71] font-bold text-xs italic tracking-wider">VISA</span>
                </div>
                {/* Mastercard */}
                <div className="bg-white rounded-md px-2 py-1 flex items-center justify-center">
                  <div className="flex">
                    <div className="w-4 h-4 bg-[#EB001B] rounded-full"></div>
                    <div className="w-4 h-4 bg-[#F79E1B] rounded-full -ml-1.5"></div>
                  </div>
                </div>
                {/* RuPay */}
                <div className="bg-white rounded-md px-2 py-1 flex items-center justify-center">
                  <span className="text-[#1A1A2E] font-bold text-[10px]">RuPay</span>
                </div>
                {/* UPI */}
                <div className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center">
                  <span className="text-[#097939] font-bold text-xs">UPI</span>
                </div>
                {/* COD */}
                <div className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center">
                  <span className="text-[#1A1A2E] font-bold text-[10px]">COD Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#045EE6] border-t border-white/10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <p className="text-center text-xs md:text-sm text-white/60">
            © 2025 Athvi Toys. All Rights Reserved.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </footer>
  )
}