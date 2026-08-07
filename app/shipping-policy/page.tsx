'use client'

import { motion } from 'framer-motion'
import { Truck, Clock, MapPin, Shield, Package, CreditCard, RotateCcw, Headphones, CheckCircle } from 'lucide-react'

export default function ShippingPolicyPage() {
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
            🚚 Shipping Policy
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            We deliver happiness right to your doorstep
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Shipping Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Free Shipping</h3>
              <p className="text-gray-500 text-sm">On orders above ₹499</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Fast Delivery</h3>
              <p className="text-gray-500 text-sm">3-5 business days</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Pan India</h3>
              <p className="text-gray-500 text-sm">Delivery across India</p>
            </motion.div>
          </div>

          {/* Detailed Shipping Policy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold font-comic text-gray-800 mb-6">
                Shipping Information
              </h2>

              <div className="space-y-6">
                {/* Shipping Charges */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Shipping Charges</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Free shipping on all orders above ₹499</li>
                      <li>• ₹50 shipping fee for orders below ₹499</li>
                      <li>• No hidden charges or additional fees</li>
                    </ul>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Delivery Time</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Metro cities: 2-3 business days</li>
                      <li>• Tier 2 &amp; 3 cities: 3-5 business days</li>
                      <li>• Remote areas: 5-7 business days</li>
                    </ul>
                  </div>
                </div>

                {/* Tracking */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Order Tracking</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Track your order anytime with the tracking link</li>
                      <li>• SMS and email updates on order status</li>
                      <li>• Real-time tracking available</li>
                    </ul>
                  </div>
                </div>

                {/* International Shipping */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">International Shipping</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Currently shipping only within India</li>
                      <li>• International shipping coming soon</li>
                    </ul>
                  </div>
                </div>

                {/* Returns */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <RotateCcw className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Returns &amp; Refunds</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Easy returns within 7 days of delivery</li>
                      <li>• Unboxing video required for returns</li>
                      <li>• Full refund on damaged or defective items</li>
                    </ul>
                  </div>
                </div>

                {/* Support */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Headphones className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Support</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• 24/7 WhatsApp support</li>
                      <li>• Email: support@athvitoys.com</li>
                      <li>• Phone: +91 98765 43210</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-xl font-bold font-comic text-gray-800 mb-4">
              📦 Shipping Methods
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Truck className="w-6 h-6 text-[#D32F2F] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800">Standard Delivery</h4>
                  <p className="text-sm text-gray-500">3-5 business days • Free above ₹499</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Package className="w-6 h-6 text-[#D32F2F] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800">Express Delivery</h4>
                  <p className="text-sm text-gray-500">1-2 business days • ₹99 extra</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-xl font-bold font-comic text-gray-800 mb-4">
              ❓ Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800">How can I track my order?</h4>
                <p className="text-sm text-gray-500 mt-1">You will receive a tracking link via SMS and email after your order is shipped.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">What if I receive a damaged product?</h4>
                <p className="text-sm text-gray-500 mt-1">Please contact us within 24 hours of delivery with an unboxing video for a full refund or replacement.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Can I change my shipping address?</h4>
                <p className="text-sm text-gray-500 mt-1">Yes, you can change your shipping address within 12 hours of placing the order.</p>
              </div>
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

// Globe icon component (since it's not in lucide-react by default)
function Globe(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}