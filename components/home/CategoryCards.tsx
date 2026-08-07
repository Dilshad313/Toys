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
    bgColor: 'bg-[#F5E6D3]', // warm beige
    href: '/shop-by-category?category=educational'
  },
  {
    id: 2,
    name: 'RC Cars',
    title: 'RC Cars',
    subtitle: 'Starting from ₹899',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop&q=80',
    bgColor: 'bg-[#D4DDE8]', // light blue-gray
    href: '/shop-by-category?category=rc-cars',
  },
  {
    id: 3,
    name: 'Soft Toys',
    title: 'Soft Toys',
    subtitle: 'Starting from ₹299',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&q=80',
    bgColor: 'bg-[#E8F0F0]', // light mint
    href: '/shop-by-category?category=soft-toys'
  },
  {
    id: 4,
    name: 'Combo Offer',
    title: 'Combo Offer',
    subtitle: 'Starting from ₹699',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&q=80',
    bgColor: 'bg-[#E0D8D0]', // warm gray
    href: '/shop-by-category?category=offers'
  },
]

export default function CategoryCards() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Category Cards Grid - 2x2 Horizontal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href={category.href} className="group block">
                <div className={`relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 ${category.bgColor} flex items-center h-32 sm:h-36 md:h-40`}>
                  {/* Image - Left Side */}
                  <div className="relative w-28 sm:w-32 md:w-40 h-full flex-shrink-0 overflow-hidden rounded-l-2xl">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-700"
                    />
                  </div>

                  {/* Content - Right Side */}
                  <div className="flex-1 px-4 md:px-6 py-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2C3E50] font-comic group-hover:text-[#D32F2F] transition">
                      {category.title}
                    </h3>
                    <p className="text-[#5D6D7E] text-sm md:text-base font-medium mt-1">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-10"
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