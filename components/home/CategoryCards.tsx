'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 1,
    name: 'Educational Toys',
    title: 'Educational Toys',
    subtitle: 'Starting from ₹499',
    image: 'https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=educational'
  },
  {
    id: 2,
    name: 'RC Cars',
    title: 'RC Cars',
    subtitle: 'Starting from ₹899',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=rc-cars',
  },
  {
    id: 3,
    name: 'Soft Toys',
    title: 'Soft Toys',
    subtitle: 'Starting from ₹299',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=soft-toys'
  },
  {
    id: 4,
    name: 'Combo Offer',
    title: 'Combo Offer',
    subtitle: 'Starting from ₹699',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&q=80',
    href: '/shop-by-category?category=offers'
  },
]

export default function CategoryCards() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header - Removed */}
        {/* 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            🛍️ Shop by Category
          </h2>
          <p className="text-gray-600 mt-2 font-medium font-comic text-base md:text-lg">
            Find the perfect toy for every occasion
          </p>
        </motion.div>
        */}

        {/* Category Cards Grid - 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group cursor-default"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                {/* Image */}
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                {/* Content Overlay - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white font-comic">
                    {category.title}
                  </h3>

                  {/* Subtitle/Price */}
                  <p className="text-white/90 text-sm font-medium">
                    {category.subtitle}
                  </p>
                </div>

                {/* ❌ Corner Badge - Removed */}
                {/* <div className="absolute top-4 right-4 bg-[#D32F2F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                  New
                </div> */}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/shop-by-category"
            className="inline-block bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-10 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl"
          >
            View All Categories →
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </section>
  )
}