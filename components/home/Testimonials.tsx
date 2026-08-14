'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  author: string
  date: string
  category: string
  content?: string
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
    content: 'Educational toys are essential for child development. From STEM kits to puzzles, these toys help children learn while having fun. Studies show that children who play with educational toys develop better problem-solving skills and creativity. Some top picks include building blocks, coding robots, and science experiment kits that make learning an adventure.'
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Toy for Your Child',
    excerpt: 'A complete guide to selecting age-appropriate toys that help in your child\'s overall development and growth.',
    image: '/review2.png',
    author: 'Team Athvi',
    date: 'Aug 05, 2025',
    category: 'Guide',
    content: 'Choosing the right toy for your child can be overwhelming. Consider your child\'s age, interests, and developmental stage. Toys should challenge without frustrating, and encourage creativity and exploration. Always check for safety certifications and age recommendations. The best toys are those that grow with your child and offer multiple ways to play.'
  },
  {
    id: 3,
    title: 'Benefits of Outdoor Play for Children',
    excerpt: 'Learn why outdoor play is essential for physical health, social skills, and mental well-being of your little ones.',
    image: '/review3.png',
    author: 'Admin',
    date: 'Jul 28, 2025',
    category: 'Health',
    content: 'Outdoor play is crucial for children\'s development. It improves physical fitness, reduces stress, and enhances social skills. Children who play outdoors regularly show better concentration and creativity. Activities like running, climbing, and group games help develop motor skills and teamwork. Make outdoor play a daily routine for your child\'s overall well-being.'
  },
]

export default function BlogSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

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

  const toggleReadMore = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="bg-[#F6C445] py-8 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Section Header - Reduced spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-10"
        >
          <span className="text-black text-xs md:text-sm font-semibold uppercase tracking-wider">
            Our Blog
          </span>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-black mt-1.5 md:mt-2">
            Latest Articles & Tips
          </h2>
          <p className="text-black text-xs md:text-sm mt-1.5 md:mt-2 max-w-xl mx-auto">
            Explore parenting tips, toy guides, and expert advice for your child's development.
          </p>
        </motion.div>

        <div className="relative">
          {/* Mobile Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-700 p-1.5 rounded-full shadow-lg backdrop-blur transition -ml-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={scrollRight}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-700 p-1.5 rounded-full shadow-lg backdrop-blur transition -mr-1.5"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Blog Cards Container - Reduced mobile card width */}
          <div
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth pb-3 md:pb-0 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {blogPosts.map((post) => {
              const isExpanded = expandedId === post.id
              
              return (
                <div
                  key={post.id}
                  className="flex-shrink-0 w-[260px] md:w-auto snap-start bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                >
                  {/* Image - Reduced height on mobile */}
                  <div className="relative w-full h-40 md:h-52 lg:h-56 overflow-hidden flex-shrink-0">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 bg-[#D32F2F] text-white text-[10px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                      {post.category}
                    </div>
                  </div>

                  {/* Content - Reduced padding on mobile */}
                  <div className="p-3 md:p-5 flex-1 flex flex-col">
                    {/* Meta */}
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 text-gray-400 text-[10px] md:text-xs">
                      <div className="flex items-center gap-0.5 md:gap-1">
                        <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 md:gap-1">
                        <User className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        <span>{post.author}</span>
                      </div>
                    </div>

                    {/* Title - Smaller on mobile */}
                    <h3 className="text-gray-900 font-bold text-sm md:text-lg leading-snug mb-1.5 md:mb-2 group-hover:text-[#D32F2F] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt - Hidden on mobile, shown on desktop */}
                    <p className={`text-gray-500 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'} transition-all duration-300`}>
                      {isExpanded ? post.content : post.excerpt}
                    </p>

                    {/* Read More / Read Less Button */}
                    <div className="mt-3 md:mt-4 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleReadMore(post.id)
                        }}
                        className="flex items-center gap-1 text-[#D32F2F] font-semibold text-[11px] md:text-sm hover:gap-2 transition-all"
                      >
                        <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile Dots - Smaller */}
        <div className="flex justify-center gap-1.5 mt-3 md:hidden">
          {blogPosts.map((_, index) => (
            <div key={index} className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/40'}`} />
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