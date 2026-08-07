'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube 
} from 'react-icons/fa'

export default function ContactPage() {
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
            📞 Contact Us
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition group"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition">
              <Mail className="w-8 h-8 text-[#D32F2F]" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Email</h3>
            <a 
              href="mailto:support@athvitoys.com" 
              className="text-gray-800 font-semibold hover:text-[#D32F2F] transition text-lg"
            >
              support@athvitoys.com
            </a>
          </motion.div>

          {/* Phone Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition">
              <Phone className="w-8 h-8 text-[#D32F2F]" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Phone</h3>
            <a 
              href="tel:+919876543210" 
              className="text-gray-800 font-semibold hover:text-[#D32F2F] transition text-lg"
            >
              +91 98765 43210
            </a>
          </motion.div>

          {/* Address Card - Nagercoil */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition group"
          >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition">
              <MapPin className="w-8 h-8 text-[#D32F2F]" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Address</h3>
            <p className="text-gray-800 font-semibold text-lg leading-relaxed">
              #123, Main Road,<br />
              Nagercoil - 629001<br />
              Tamil Nadu, India
            </p>
          </motion.div>
        </div>

        {/* WhatsApp Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <a 
            href="https://wa.me/919876543210" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold transition shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-6 h-6" />
            Chat with us on WhatsApp
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm font-medium mb-4">Follow Us</p>
          <div className="flex justify-center gap-4">
            <a 
              href="#" 
              className="bg-white hover:bg-[#1877F2] text-gray-600 hover:text-white p-3 rounded-full shadow-md hover:shadow-lg transition w-12 h-12 flex items-center justify-center"
            >
              <FaFacebook className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="bg-white hover:bg-[#E4405F] text-gray-600 hover:text-white p-3 rounded-full shadow-md hover:shadow-lg transition w-12 h-12 flex items-center justify-center"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="bg-white hover:bg-[#1DA1F2] text-gray-600 hover:text-white p-3 rounded-full shadow-md hover:shadow-lg transition w-12 h-12 flex items-center justify-center"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="bg-white hover:bg-[#FF0000] text-gray-600 hover:text-white p-3 rounded-full shadow-md hover:shadow-lg transition w-12 h-12 flex items-center justify-center"
            >
              <FaYoutube className="w-6 h-6" />
            </a>
          </div>
        </motion.div>

        {/* Map Section - Nagercoil */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold font-comic text-gray-800">📍 Find Us in Nagercoil</h3>
            </div>
            <div className="h-64 md:h-80 bg-gray-200 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15787.166961505642!2d77.4204662!3d8.176165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f0b5f2e1a1d1%3A0x6d8c9e7a2f1f1f1!2sNagercoil%2C%20Tamil%20Nadu%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Athvi Toys Location - Nagercoil"
              />
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