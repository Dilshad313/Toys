'use client'

import { motion } from 'framer-motion'
import { Heart, ShieldCheck, Sparkles, Award } from 'lucide-react'

export default function AboutPage() {
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
          <span className="text-[#D32F2F] text-sm md:text-base font-bold uppercase tracking-wider font-comic">
            Welcome to Athvi Toys
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-comic text-[#D32F2F] mt-2">
            ✨ About Us
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            Bringing joy, learning, and safe playtime to your child's developmental years with premium toys!
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Brand Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-comic text-gray-800">
              Our Vision & Mission 🌟
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              At <strong>Athvi Toys</strong>, we believe that playtime is not just about keeping children occupied—it's a critical gateway to cognitive development, coordination, and creative thinking. Every child deserves to explore the world around them through play that is active, safe, and engaging.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Our mission is to curate and manufacture premium quality toys that encourage screen-free discovery, deep focus, and absolute safety. We combine physical skill-building with imaginative concepts to create memorable experiences for both parents and kids.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-tr from-[#7B2FBE]/10 to-[#FF6B35]/10 rounded-2xl p-8 border border-gray-100 flex flex-col justify-center min-h-[250px]"
          >
            <blockquote className="text-lg italic font-medium text-gray-700 font-comic relative">
              "Play is the highest form of research. We make sure every toy we provide inspires curiosity and holds safety as its absolute foundation."
            </blockquote>
            <p className="text-right text-[#D32F2F] font-bold font-comic mt-4">
              - Team Athvi Toys
            </p>
          </motion.div>
        </div>

        {/* Our Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold font-comic text-gray-800">
            Why Choose Athvi Toys? 🧸
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-2">
            The core principles behind every toy we offer
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {/* Safety First */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D32F2F]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2 font-comic">Safety First</h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              Non-toxic, premium-grade materials crafted with smooth edges, fully safety certified.
            </p>
          </motion.div>

          {/* Child Development */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#7B2FBE]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2 font-comic">Skill-Building</h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              Designed to stimulate memory, motor skills, fine-tune logical thinking, and cognitive growth.
            </p>
          </motion.div>

          {/* Crafted with Love */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2 font-comic">Crafted with Love</h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              Tested by parents and kids alike to ensure long-lasting fun, durability, and true engagement.
            </p>
          </motion.div>

          {/* Uncompromising Quality */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF6B35]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2 font-comic">Premium Quality</h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              We focus on premium designs, sturdy construction, and quality parts to create heirloom-grade toys.
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