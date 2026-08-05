'use client'

import { motion } from 'framer-motion'
import { Shield, Award, CheckCircle, Star, Truck } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    title: '100% Safe Materials',
    description: 'Non-Toxic, Child Safe & BIS Certified',
    color: 'text-green-500',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Swift delivery across India',
    color: 'text-blue-500',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: '30+ Customized Building Kits',
    color: 'text-purple-500',
  },
  {
    icon: Star,
    title: 'Gift Ready',
    description: 'Beautiful & secure packaging',
    color: 'text-yellow-500',
  },
]

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <badge.icon className={`w-12 h-12 mx-auto mb-3 ${badge.color}`} />
              <h3 className="font-bold text-gray-800">{badge.title}</h3>
              <p className="text-sm text-gray-500">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}