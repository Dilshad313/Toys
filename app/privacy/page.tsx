'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
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
            🔒 Privacy Policy
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            We value your privacy. Your data is safe and secure with us.
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
          <p className="text-sm text-gray-400 mt-4">Last Updated: August 2026</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Privacy Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Data Security</h3>
              <p className="text-gray-500 text-sm">256-bit encrypted</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Privacy First</h3>
              <p className="text-gray-500 text-sm">Your data is never shared</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Transparency</h3>
              <p className="text-gray-500 text-sm">Clear & honest policies</p>
            </motion.div>
          </div>

          {/* Privacy Policy Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold font-comic text-gray-800 mb-6">
                📋 Privacy Policy
              </h2>

              <div className="space-y-6">
                {/* Information We Collect */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Database className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Information We Collect</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Name, email address, phone number</li>
                      <li>• Shipping and billing address</li>
                      <li>• Order history and preferences</li>
                      <li>• Payment information (securely processed)</li>
                    </ul>
                  </div>
                </div>

                {/* How We Use Your Information */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">How We Use Your Information</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Process and fulfill your orders</li>
                      <li>• Send order updates and tracking information</li>
                      <li>• Improve our products and services</li>
                      <li>• Send promotional offers (with your consent)</li>
                    </ul>
                  </div>
                </div>

                {/* Data Security */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Data Security</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• 256-bit SSL encryption for all transactions</li>
                      <li>• Secure payment gateways</li>
                      <li>• Regular security audits</li>
                      <li>• Your data is never sold to third parties</li>
                    </ul>
                  </div>
                </div>

                {/* Information Sharing */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Information Sharing</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• We do not sell your personal information</li>
                      <li>• Share only with delivery partners for order fulfillment</li>
                      <li>• Required by law enforcement when legally mandated</li>
                    </ul>
                  </div>
                </div>

                {/* Your Rights */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Your Rights</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Access your personal data anytime</li>
                      <li>• Update or correct your information</li>
                      <li>• Request deletion of your data</li>
                      <li>• Opt-out of promotional communications</li>
                    </ul>
                  </div>
                </div>

                {/* Cookies */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Database className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Cookies</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• We use cookies to improve your browsing experience</li>
                      <li>• Store your preferences and cart items</li>
                      <li>• You can disable cookies in your browser settings</li>
                    </ul>
                  </div>
                </div>

                {/* Contact for Privacy - Updated Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Privacy Questions</h3>
                    <ul className="text-gray-600 text-sm space-y-1 mt-1">
                      <li>• Email: <a href="mailto:hello@athvitoys.com" className="text-[#D32F2F] hover:underline">hello@athvitoys.com</a></li>
                      <li>• Phone: <a href="tel:+917550122100" className="text-[#D32F2F] hover:underline">+91 75001 22100</a></li>
                      <li>• We respond within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GDPR Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-[#D32F2F]"
          >
            <h3 className="text-lg font-bold font-comic text-gray-800 mb-2">
              🇪🇺 GDPR Compliance
            </h3>
            <p className="text-sm text-gray-600">
              We are committed to protecting your privacy in accordance with the General Data Protection Regulation (GDPR). 
              You have the right to access, modify, or delete your personal data at any time.
            </p>
          </motion.div>

          {/* Contact Section - Fixed Working Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] rounded-2xl shadow-lg p-6 md:p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold font-comic mb-3">
              Have Privacy Questions?
            </h3>
            <p className="text-white/90 mb-6">
              We're here to address any concerns about your privacy
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact"
                className="bg-white text-[#D32F2F] hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </Link>
              <a 
                href="mailto:hello@athvitoys.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition flex items-center gap-2 border border-white/30 hover:border-white/50"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
            </div>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-400">
              © 2026 Athvi Toys. All Rights Reserved. | Privacy Policy v2.0
            </p>
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