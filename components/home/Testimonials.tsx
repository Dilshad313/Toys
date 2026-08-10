'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  author: string
  date: string
  category: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Top 10 Educational Toys for Kids in 2025',
    excerpt: 'Discover the best educational toys that boost creativity, motor skills, and logical thinking for children of all ages.',
    image: '/review1.png',
    author: 'Admin',
    date: 'Aug 10, 2025',
    category: 'Education',
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Toy for Your Child',
    excerpt: 'A complete guide to selecting age-appropriate toys that help in your child\'s overall development and growth.',
    image: '/review2.png',
    author: 'Team Athvi',
    date: 'Aug 05, 2025',
    category: 'Guide',
  },
  {
    id: 3,
    title: 'Benefits of Outdoor Play for Children',
    excerpt: 'Learn why outdoor play is essential for physical health, social skills, and mental well-being of your little ones.',
    image: '/review3.png',
    author: 'Admin',
    date: 'Jul 28, 2025',
    category: 'Health',
  },
]

export default function BlogSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-blue-600 py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-white/80 text-sm md:text-base font-semibold uppercase tracking-wider">
            Our Blog
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-black mt-2">
            Latest Articles & Tips
          </h2>
          <p className="text-white/70 text-sm md:text-base mt-2 max-w-xl mx-auto">
            Explore parenting tips, toy guides, and expert advice for your child's development.
          </p>
        </motion.div>

        <div className="relative">
          {/* Mobile Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-full shadow-lg backdrop-blur transition -ml-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={scrollRight}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-full shadow-lg backdrop-blur transition -mr-2"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Blog Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth pb-4 md:pb-0 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="flex-shrink-0 w-[300px] md:w-auto snap-start bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full h-48 md:h-52 lg:h-56 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-[#D32F2F] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-3 text-gray-400 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-gray-900 font-bold text-base md:text-lg leading-snug mb-2 group-hover:text-[#D32F2F] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-1 text-[#D32F2F] font-semibold text-sm group-hover:gap-2 transition-all">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Dots */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {blogPosts.map((_, index) => (
            <div key={index} className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>

      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}