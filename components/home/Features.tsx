'use client'

import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Safe & Non-Toxic',
    description: 'Premium quality, child safe materials',
    color: 'text-[#FF6B35]',
    bg: 'bg-[#FFF5F0]',
  },
  {
    icon: Truck,
    title: 'Quality Checked',
    description: 'Every toy is tested for quality',
    color: 'text-[#004E89]',
    bg: 'bg-[#F0F7FF]',
  },
  {
    icon: RotateCcw,
    title: 'Fast Delivery',
    description: 'Swift delivery across India',
    color: 'text-[#FFD700]',
    bg: 'bg-[#FFFDF0]',
  },
  {
    icon: Headphones,
    title: 'Easy Returns',
    description: 'Hassle free return policy',
    color: 'text-[#FF6B35]',
    bg: 'bg-[#FFF5F0]',
  },
]

export default function Features() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full ${feature.bg} flex items-center justify-center mb-3`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}