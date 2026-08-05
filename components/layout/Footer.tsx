'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Mail, 
  Send,
  MapPin,
  Phone,
  Clock,
  CreditCard,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react'
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube 
} from 'react-icons/fa'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email subscribed:', email)
    setEmail('')
    alert('Thank you for subscribing! 🎉')
  }

  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-comic">
                Get <span className="text-[#FFD700]">₹100 OFF</span> on your first order!
              </h3>
              <p className="text-gray-400 mt-2">
                Join our newsletter and get exclusive offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700] transition"
              />
              <button
                onClick={handleSubscribe}
                className="bg-[#FFD700] hover:bg-[#FFC107] text-[#1a1a2e] px-6 py-3 rounded-full font-bold transition flex items-center justify-center gap-2"
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-[#FF6B35]">ATHVI</span>
              <span className="text-xl font-light text-white">Toys</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Premium toys for happy learning and endless fun!
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="bg-white/10 hover:bg-[#FFD700] text-gray-400 hover:text-[#1a1a2e] p-2 rounded-full transition w-10 h-10 flex items-center justify-center">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FFD700] text-gray-400 hover:text-[#1a1a2e] p-2 rounded-full transition w-10 h-10 flex items-center justify-center">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FFD700] text-gray-400 hover:text-[#1a1a2e] p-2 rounded-full transition w-10 h-10 flex items-center justify-center">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FFD700] text-gray-400 hover:text-[#1a1a2e] p-2 rounded-full transition w-10 h-10 flex items-center justify-center">
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>

            <p className="text-sm text-gray-500 mt-4">Follow Us</p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 font-comic">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-[#FFD700] transition">All Toys</Link></li>
              <li><Link href="/products?category=new-arrivals" className="hover:text-[#FFD700] transition">New Arrivals</Link></li>
              <li><Link href="/products?category=best-sellers" className="hover:text-[#FFD700] transition">Best Sellers</Link></li>
              <li><Link href="/products?category=trending" className="hover:text-[#FFD700] transition">Trending Toys</Link></li>
              <li><Link href="/products?category=back-in-stock" className="hover:text-[#FFD700] transition">Back in Stock</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 font-comic">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-[#FFD700] transition">Contact Us</Link></li>
              <li><Link href="/track-order" className="hover:text-[#FFD700] transition">Track Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#FFD700] transition">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-[#FFD700] transition">Returns & Refunds</Link></li>
              <li><Link href="/faqs" className="hover:text-[#FFD700] transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 font-comic">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#FFD700] transition">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-[#FFD700] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#FFD700] transition">Terms & Conditions</Link></li>
              <li><Link href="/blog" className="hover:text-[#FFD700] transition">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-[#FFD700] transition">Careers</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 font-comic">Help & Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:text-[#FFD700] transition">My Account</Link></li>
              <li><Link href="/wishlist" className="hover:text-[#FFD700] transition">Wishlist</Link></li>
              <li><Link href="/orders" className="hover:text-[#FFD700] transition">Order History</Link></li>
              <li><Link href="/payment-methods" className="hover:text-[#FFD700] transition">Payment Methods</Link></li>
              <li><Link href="/size-guide" className="hover:text-[#FFD700] transition">Size Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods & Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Payment Methods:</span>
              <div className="flex gap-2">
                <span className="bg-white/10 px-3 py-1 rounded text-xs font-semibold text-gray-300">VISA</span>
                <span className="bg-white/10 px-3 py-1 rounded text-xs font-semibold text-gray-300">RuPay</span>
                <span className="bg-white/10 px-3 py-1 rounded text-xs font-semibold text-gray-300">UPI</span>
                <span className="bg-white/10 px-3 py-1 rounded text-xs font-semibold text-gray-300">COD</span>
              </div>
            </div>

            {/* Footer Links */}
            <div className="flex items-center gap-4 text-xs">
              <Link href="/privacy" className="text-gray-500 hover:text-[#FFD700] transition">Privacy Policy</Link>
              <span className="text-gray-700">|</span>
              <Link href="/terms" className="text-gray-500 hover:text-[#FFD700] transition">Terms</Link>
              <span className="text-gray-700">|</span>
              <Link href="/sitemap" className="text-gray-500 hover:text-[#FFD700] transition">Sitemap</Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
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