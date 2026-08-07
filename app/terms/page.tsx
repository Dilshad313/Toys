'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Shield, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  Users, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Package
} from 'lucide-react'

export default function TermsPage() {
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
            📄 Terms & Conditions
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our website
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
          <p className="text-sm text-gray-400 mt-4">Last Updated: August 2026</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Key Terms Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-4 text-center hover:shadow-xl transition"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <ShoppingCart className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Orders</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white rounded-2xl shadow-lg p-4 text-center hover:shadow-xl transition"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Payments</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-4 text-center hover:shadow-xl transition"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Shipping</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bg-white rounded-2xl shadow-lg p-4 text-center hover:shadow-xl transition"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <RotateCcw className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Returns</p>
            </motion.div>
          </div>

          {/* Terms Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold font-comic text-gray-800 mb-6">
                📋 Terms & Conditions
              </h2>

              <div className="space-y-6">
                {/* Acceptance of Terms */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">1. Acceptance of Terms</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      By using the Athvi Toys website, you agree to comply with and be bound by these terms and conditions. 
                      If you do not agree with any part of these terms, please do not use our website.
                    </p>
                  </div>
                </div>

                {/* Orders */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShoppingCart className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">2. Orders</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• All orders are subject to product availability</li>
                      <li>• We reserve the right to cancel or refuse any order</li>
                      <li>• Orders can be cancelled within 12 hours of placement</li>
                      <li>• You will receive order confirmation via email</li>
                    </ul>
                  </div>
                </div>

                {/* Pricing & Payments */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CreditCard className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">3. Pricing &amp; Payments</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• All prices are in Indian Rupees (₹) and inclusive of taxes</li>
                      <li>• Payment methods: Visa, RuPay, UPI, Net Banking, COD</li>
                      <li>• Prices are subject to change without prior notice</li>
                      <li>• Secure payment processing through trusted gateways</li>
                    </ul>
                  </div>
                </div>

                {/* Shipping & Delivery */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">4. Shipping &amp; Delivery</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Free shipping on orders above ₹499</li>
                      <li>• Standard delivery: 3-5 business days</li>
                      <li>• Express delivery: 1-2 business days (₹99 extra)</li>
                      <li>• We deliver across India</li>
                    </ul>
                  </div>
                </div>

                {/* Returns & Refunds */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <RotateCcw className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">5. Returns &amp; Refunds</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Returns accepted within 7 days of delivery</li>
                      <li>• Unboxing video required for all returns</li>
                      <li>• Full refund on damaged or defective items</li>
                      <li>• Refund processed within 3-5 business days</li>
                    </ul>
                  </div>
                </div>

                {/* User Accounts */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-5 h-5 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">6. User Accounts</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Create an account for faster checkout and order tracking</li>
                      <li>• You are responsible for maintaining account confidentiality</li>
                      <li>• Notify us immediately of any unauthorized use</li>
                    </ul>
                  </div>
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">7. Privacy Policy</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• We respect your privacy and protect your data</li>
                      <li>• Your information is never shared with third parties</li>
                      <li>• Read our full <a href="/privacy" className="text-[#D32F2F] hover:underline">Privacy Policy</a></li>
                    </ul>
                  </div>
                </div>

                {/* Product Information */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">8. Product Information</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• We strive for accurate product descriptions and images</li>
                      <li>• Actual colors may vary slightly due to screen settings</li>
                      <li>• All products are BIS certified and child-safe</li>
                    </ul>
                  </div>
                </div>

                {/* Intellectual Property */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">9. Intellectual Property</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• All content on this site is the property of Athvi Toys</li>
                      <li>• Unauthorized use of images or content is prohibited</li>
                      <li>• Athvi Toys is a registered trademark</li>
                    </ul>
                  </div>
                </div>

                {/* Limitation of Liability */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">10. Limitation of Liability</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Athvi Toys is not liable for any indirect or consequential damages</li>
                      <li>• Our total liability is limited to the purchase price of products</li>
                      <li>• We are not responsible for delays caused by unforeseen circumstances</li>
                    </ul>
                  </div>
                </div>

                {/* Governing Law */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">11. Governing Law</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• These terms are governed by the laws of India</li>
                      <li>• Any disputes shall be subject to the exclusive jurisdiction of courts in Nagercoil, Tamil Nadu</li>
                    </ul>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">12. Contact Us</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Email: <a href="mailto:support@athvitoys.com" className="text-[#D32F2F] hover:underline">support@athvitoys.com</a></li>
                      <li>• Phone: <a href="tel:+919876543210" className="text-[#D32F2F] hover:underline">+91 98765 43210</a></li>
                      <li>• Address: #123, Main Road, Nagercoil - 629001, Tamil Nadu</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Agreement Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-[#D32F2F]"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#D32F2F] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-800">By using our website, you agree to these Terms &amp; Conditions</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: August 2026. We reserve the right to update these terms at any time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h3 className="text-lg font-bold font-comic text-gray-800 mb-4 text-center">
              📚 Quick Links
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/privacy" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <Lock className="w-6 h-6 text-[#D32F2F]" />
                <span className="text-xs font-medium text-gray-600">Privacy Policy</span>
              </a>
              <a href="/shipping-policy" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <Truck className="w-6 h-6 text-[#D32F2F]" />
                <span className="text-xs font-medium text-gray-600">Shipping Policy</span>
              </a>
              <a href="/returns" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <RotateCcw className="w-6 h-6 text-[#D32F2F]" />
                <span className="text-xs font-medium text-gray-600">Returns</span>
              </a>
              <a href="/contact" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <Mail className="w-6 h-6 text-[#D32F2F]" />
                <span className="text-xs font-medium text-gray-600">Contact Us</span>
              </a>
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