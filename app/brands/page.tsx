'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const brands = [
  {
    id: 1,
    name: 'LEGO',
    logo: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop&q=80',
    description: 'Premium building blocks for creative minds',
    products: 120,
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Fisher-Price',
    logo: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop&q=80',
    description: 'Trusted toys for early childhood development',
    products: 85,
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Hot Wheels',
    logo: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200&h=200&fit=crop&q=80',
    description: 'High-speed cars for little racers',
    products: 95,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Barbie',
    logo: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop&q=80',
    description: 'Inspiring dreams and adventures',
    products: 110,
    rating: 4.6,
  },
  {
    id: 5,
    name: 'Nerf',
    logo: 'https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?w=200&h=200&fit=crop&q=80',
    description: 'Action-packed foam blasters for kids',
    products: 65,
    rating: 4.8,
  },
  {
    id: 6,
    name: 'Play-Doh',
    logo: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop&q=80',
    description: 'Creative fun with colorful modeling clay',
    products: 75,
    rating: 4.9,
  },
  {
    id: 7,
    name: 'VTech',
    logo: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop&q=80',
    description: 'Educational electronic toys for kids',
    products: 90,
    rating: 4.7,
  },
  {
    id: 8,
    name: 'Melissa & Doug',
    logo: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200&h=200&fit=crop&q=80',
    description: 'Wooden toys and puzzles for kids',
    products: 80,
    rating: 4.8,
  },
]

export default function BrandsPage() {
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    // Add sample product to cart
    await addToCart('sample-variant-id', 1)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
          🏷️ Our Brands
        </h1>
        <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
          Discover premium toys from world-class brands
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden group border border-gray-100 hover:border-[#D32F2F]"
          >
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-xl font-comic">{brand.name}</h3>
              </div>
            </div>

            <div className="p-4">
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {brand.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-gray-700 ml-1 text-sm">{brand.rating}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{brand.products} products</span>
                </div>
                <Link
                  href={`/products?brand=${brand.name.toLowerCase()}`}
                  className="text-[#D32F2F] text-sm font-semibold hover:underline"
                >
                  Explore →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}