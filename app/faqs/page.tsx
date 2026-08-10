'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, MessageCircle, Phone, Mail, Package, Truck, CreditCard, RotateCcw, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    id: 1,
    category: 'Orders',
    question: 'How do I place an order?',
    answer: 'Browse our collection, select your favorite toys, add them to cart, and proceed to checkout. Follow the simple steps to complete your purchase.'
  },
  {
    id: 2,
    category: 'Orders',
    question: 'Can I cancel or modify my order?',
    answer: 'Yes, you can cancel or modify your order within 12 hours of placing it. Contact our support team immediately for assistance.'
  },
  {
    id: 3,
    category: 'Payment',
    question: 'What are the payment methods available?',
    answer: 'We accept Visa, RuPay, UPI, Net Banking, and Cash on Delivery (COD). All payments are 100% secure.'
  },
  {
    id: 4,
    category: 'Payment',
    question: 'Is it safe to use my credit/debit card?',
    answer: 'Yes, we use secure payment gateways with 256-bit encryption. Your card details are completely safe and never stored with us.'
  },
  {
    id: 5,
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer: 'Delivery usually takes 3-5 business days for metro cities and 5-7 business days for remote areas. You will receive a tracking link once shipped.'
  },
  {
    id: 6,
    category: 'Shipping',
    question: 'Do you offer free shipping?',
    answer: 'Yes, we offer free shipping on all orders above ₹499. A shipping fee of ₹50 applies for orders below ₹499.'
  },
  {
    id: 7,
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We offer easy returns within 7 days of delivery. An unboxing video is required for all returns. Full refund on damaged or defective items.'
  },
  {
    id: 8,
    category: 'Returns',
    question: 'How do I initiate a return?',
    answer: 'Contact our support team via WhatsApp or Email with your order ID and unboxing video. We\'ll guide you through the return process.'
  },
  {
    id: 9,
    category: 'Products',
    question: 'Are your toys safe for kids?',
    answer: 'Yes, all our toys are made from non-toxic, child-safe materials and are BIS certified. We prioritize safety and quality above everything.'
  },
  {
    id: 10,
    category: 'Products',
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, we offer gift-ready packaging with a personalized message. Select the gift option at checkout.'
  },
  {
    id: 11,
    category: 'Account',
    question: 'How do I track my order?',
    answer: 'You can track your order using the tracking link sent via SMS and email after shipment. You can also visit the "Track Order" page on our website.'
  },
  {
    id: 12,
    category: 'Account',
    question: 'How do I create an account?',
    answer: 'Click on the Account icon on the top right, select "Sign Up", and fill in your details. It\'s quick and easy!'
  }
]

const categories = ['All', 'Orders', 'Payment', 'Shipping', 'Returns', 'Products', 'Account']

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            ❓ Frequently Asked Questions
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            Find answers to the most common questions about our products and services
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 transition bg-white text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === category
                  ? 'bg-[#D32F2F] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQs List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto space-y-3"
        >
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search term or category</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-800 text-sm md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                      openFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-lg font-bold font-comic text-gray-800 mb-4 text-center">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/track-order" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <Truck className="w-6 h-6 text-[#D32F2F]" />
                <span className="text-xs font-medium text-gray-600">Track Order</span>
              </Link>
              <Link href="/returns" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <RotateCcw className="w-6 h-6 text-[#D32F2F]" />
                <span className="text-xs font-medium text-gray-600">Returns</span>
              </Link>
              <Link href="/contact" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <MessageCircle className="w-6 h-6 text-[#D32F2F]" />
                <span className="text-xs font-medium text-gray-600">Contact</span>
              </Link>
              <Link href="/shipping-policy" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <Package className="w-6 h-6 text-[#D32F2F]" />
                <span className="text-xs font-medium text-gray-600">Shipping</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Still Need Help - Fixed Contact Us Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] rounded-2xl shadow-lg p-6 md:p-8 text-white text-center">
            <h3 className="text-2xl font-bold font-comic mb-3">
              Still have questions?
            </h3>
            <p className="text-white/90 mb-6">
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact"
                className="bg-white text-[#D32F2F] hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}