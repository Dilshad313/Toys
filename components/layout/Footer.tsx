'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Mail, 
  Send,
  MapPin,
  Phone,
  Clock,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
  ShoppingBag
} from 'lucide-react'
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube
} from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center text-center lg:text-left">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white font-comic">
                Get <span className="text-[#FFD700]">₹100 OFF</span> on your first order!
              </h3>
              <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
                Join our newsletter and get exclusive offers.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/collections"
                className="bg-[#FFD700] hover:bg-[#FFC107] text-[#1a1a2e] px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold transition flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 md:mb-4">
              <Image 
                src="/logo1.png" 
                alt="Athvi Toys" 
                width={140} 
                height={50}
                className="h-12 md:h-14 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4 max-w-xs">
              Premium toys for happy learning and endless fun!
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-2 md:gap-3">
              <a href="#" className="bg-white/10 hover:bg-[#FFD700] text-gray-400 hover:text-[#1a1a2e] p-1.5 md:p-2 rounded-full transition w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <FaFacebook className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FFD700] text-gray-400 hover:text-[#1a1a2e] p-1.5 md:p-2 rounded-full transition w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <FaInstagram className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FFD700] text-gray-400 hover:text-[#1a1a2e] p-1.5 md:p-2 rounded-full transition w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <FaTwitter className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FFD700] text-gray-400 hover:text-[#1a1a2e] p-1.5 md:p-2 rounded-full transition w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <FaYoutube className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
            </div>

            <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">Follow Us</p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 font-comic">Shop</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li><Link href="/collections" className="hover:text-[#FFD700] transition">All Toys</Link></li>
              <li><Link href="/category-cards" className="hover:text-[#FFD700] transition">New Arrivals</Link></li>
              <li><Link href="/best-sellers" className="hover:text-[#FFD700] transition">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 font-comic">Customer Service</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li><Link href="/contact" className="hover:text-[#FFD700] transition">Contact Us</Link></li>
              <li><Link href="/track-order" className="hover:text-[#FFD700] transition">Track Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#FFD700] transition">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-[#FFD700] transition">Returns & Refunds</Link></li>
              <li><Link href="/faqs" className="hover:text-[#FFD700] transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 font-comic">Information</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li><Link href="/privacy" className="hover:text-[#FFD700] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#FFD700] transition">Terms & Conditions</Link></li>
              <li><Link href="/blog" className="hover:text-[#FFD700] transition">Blog</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 font-comic">Help & Support</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li><Link href="/wishlist" className="hover:text-[#FFD700] transition">Wishlist</Link></li>
              <li><Link href="/order-history" className="hover:text-[#FFD700] transition">Order History</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods & Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <span className="text-xs md:text-sm text-gray-400">Payment Methods:</span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                <span className="bg-[#FFD700]/10 text-[#FFD700] px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold border border-[#FFD700]/20">VISA</span>
                <span className="bg-[#FFD700]/10 text-[#FFD700] px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold border border-[#FFD700]/20">RuPay</span>
                <span className="bg-[#FFD700]/10 text-[#FFD700] px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold border border-[#FFD700]/20">UPI</span>
                <span className="bg-[#FFD700]/10 text-[#FFD700] px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold border border-[#FFD700]/20">COD</span>
              </div>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[10px] md:text-xs">
              <Link href="/privacy" className="text-gray-500 hover:text-[#FFD700] transition">Privacy Policy</Link>
              <span className="text-gray-700">|</span>
              <Link href="/terms" className="text-gray-500 hover:text-[#FFD700] transition">Terms</Link>
              <span className="text-gray-700">|</span>
              <Link href="/sitemap" className="text-gray-500 hover:text-[#FFD700] transition">Sitemap</Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-3 md:mt-4">
            <p className="text-[10px] md:text-sm text-gray-500">
              © 2025 Athvi Toys. All Rights Reserved.
            </p>
          </div>
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