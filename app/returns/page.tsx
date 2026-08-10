'use client'

import { motion } from 'framer-motion'
import { 
  RotateCcw, 
  Shield, 
  CreditCard, 
  Clock, 
  Video, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react'
import Link from 'next/link'

export default function ReturnsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            🔄 Returns & Refunds
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Key Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <RotateCcw className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Easy Returns</h3>
              <p className="text-gray-500 text-sm">Within 7 days of delivery</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Full Refund</h3>
              <p className="text-gray-500 text-sm">On damaged or defective items</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Unboxing Video</h3>
              <p className="text-gray-500 text-sm">Required for returns</p>
            </motion.div>
          </div>

          {/* Return Policy Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold font-comic text-gray-800 mb-6">
                📋 Return Policy
              </h2>

              <div className="space-y-6">
                {/* Return Window */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Return Window</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Returns accepted within <span className="font-semibold">7 days</span> of delivery</li>
                      <li>• Items must be in original condition with packaging</li>
                      <li>• Unboxing video required for all returns</li>
                    </ul>
                  </div>
                </div>

                {/* Refund Process */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Refund Process</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Refunds processed within <span className="font-semibold">3-5 business days</span></li>
                      <li>• Full refund on damaged or defective items</li>
                      <li>• Refund issued to original payment method</li>
                    </ul>
                  </div>
                </div>

                {/* Unboxing Video */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Video className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">📹 Unboxing Video Required</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Record a complete unboxing video</li>
                      <li>• Show the package and product clearly</li>
                      <li>• Video must be <span className="font-semibold">continuous and uncut</span></li>
                      <li>• Share the video via WhatsApp or Email</li>
                    </ul>
                  </div>
                </div>

                {/* Return Shipping */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Return Shipping</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Free return shipping on defective/damaged items</li>
                      <li>• Return shipping fee may apply for other reasons</li>
                      <li>• We'll arrange pickup from your address</li>
                    </ul>
                  </div>
                </div>

                {/* Conditions */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Return Conditions</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Items must be unused and in original packaging</li>
                      <li>• Return window: <span className="font-semibold">7 days</span> from delivery</li>
                      <li>• Unboxing video is <span className="font-semibold text-red-500">mandatory</span></li>
                      <li>• No returns on clearance or sale items</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Return Process Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-xl font-bold font-comic text-gray-800 mb-6">
              📝 How to Return an Item
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="w-8 h-8 bg-[#D32F2F] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Contact Us</h4>
                  <p className="text-sm text-gray-500">Reach out via WhatsApp or Email with your order ID</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="w-8 h-8 bg-[#D32F2F] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Share Unboxing Video</h4>
                  <p className="text-sm text-gray-500">Send the unboxing video for verification</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="w-8 h-8 bg-[#D32F2F] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Get Approval</h4>
                  <p className="text-sm text-gray-500">We'll confirm if your return is approved</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="w-8 h-8 bg-[#D32F2F] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Return & Refund</h4>
                  <p className="text-sm text-gray-500">Ship the item back or wait for pickup, get your refund</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Non-Returnable Items */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-xl font-bold font-comic text-gray-800 mb-4">
              ❌ Non-Returnable Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">Clearance items</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">Sale / Discounted items</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">Used or damaged items (without video)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">Items without original packaging</span>
              </div>
            </div>
          </motion.div>

          {/* Contact for Returns - Fixed Working Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] rounded-2xl shadow-lg p-6 md:p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold font-comic mb-3">
              Need Help with Returns?
            </h2>
            <p className="text-white/90 mb-6">
              Our team is here to assist you with any return or refund queries
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact"
                className="bg-white text-[#D32F2F] hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}