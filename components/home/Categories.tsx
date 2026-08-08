'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Collection {
  id: string
  title: string
  handle: string
  image?: {
    url: string
    altText: string | null
  }
}

// ✅ Fallback categories if no collections from Shopify
const fallbackCategories = [
  { name: 'RC Cars', image: '/cat1.png' },
  { name: 'Educational Toys', image: '/cat2.png' },
  { name: 'Building Kits', image: '/cat3.png' },
  { name: 'Animal Toys', image: '/cat4.png' },
  { name: 'STEM Toys', image: '/cat5.png' },
]

const ageCategories = [
  { name: '0-2 Years', image: '/age1.png' },
  { name: '2-4 Years', image: '/age2.png' },
  { name: '4-6 Years', image: '/age3.png' },
  { name: '6-8 Years', image: '/age4.png' },
  { name: '8+ Years', image: '/age5.png' },
]

export default function Categories() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch collections from Shopify
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔄 Fetching collections for Special Products...')
        
        const response = await fetch('/api/collections?first=10')
        const result = await response.json()
        console.log('📦 Full API Response:', result)

        if (result.success) {
          let collectionsList: Collection[] = []
          
          // ✅ Check all possible response formats
          if (result.data?.collections?.edges) {
            collectionsList = result.data.collections.edges.map((edge: any) => ({
              id: edge.node.id,
              title: edge.node.title,
              handle: edge.node.handle,
              image: edge.node.image,
            }))
          } else if (result.data?.collections && Array.isArray(result.data.collections)) {
            collectionsList = result.data.collections.map((node: any) => ({
              id: node.id || node.node?.id,
              title: node.title || node.node?.title,
              handle: node.handle || node.node?.handle,
              image: node.image || node.node?.image,
            }))
          } else if (result.collections && Array.isArray(result.collections)) {
            collectionsList = result.collections.map((node: any) => ({
              id: node.id,
              title: node.title,
              handle: node.handle,
              image: node.image,
            }))
          }
          
          console.log('✅ Collections found:', collectionsList.length)
          console.log('📋 Collections list:', collectionsList)
          
          setCollections(collectionsList)
          
          if (collectionsList.length === 0) {
            setError('No collections found in your Shopify store')
          }
        } else {
          console.error('❌ API Error:', result.error)
          setError(result.error || 'Failed to fetch collections')
        }
      } catch (error) {
        console.error('❌ Error fetching collections:', error)
        setError('Failed to load collections')
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  // Show first 5 collections or all
  const displayCollections = collections.length > 0 ? collections.slice(0, 5) : fallbackCategories

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-3 text-[#D32F2F] font-comic">
              🧸 Special Products
            </h2>
            <p className="text-center text-gray-600 mb-12 text-base md:text-lg font-medium font-comic">
              Loading collections...
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ✅ Use displayCategories which is either collections or fallback
  const displayCategories = collections.length > 0 ? collections : fallbackCategories

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Shop by Category - First */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-3 text-[#D32F2F] font-comic">
            🧸 Special Products
          </h2>
          <p className="text-center text-gray-600 mb-12 text-base md:text-lg font-medium font-comic">
            Explore our wide range of premium toys ✨
          </p>
        </motion.div>

        {/* Shopify Collections Grid - Use displayCategories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-20">
          {displayCategories.map((category: any, i) => {
            // Check if it's a collection from Shopify or fallback
            const isCollection = category.id && category.handle
            const imageUrl = category.image?.url || category.image || '/placeholder.jpg'
            const title = category.title || category.name
            const href = isCollection ? `/shop-by-category?category=${category.handle}` : '#'

            return (
              <motion.div
                key={isCollection ? category.id : i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group cursor-pointer"
              >
                {isCollection ? (
                  <Link href={href}>
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition bg-white border-2 border-transparent hover:border-[#D32F2F]">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.jpg'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-bold text-sm md:text-base font-comic">
                          {title}
                        </h3>
                      </div>
                      <div className="absolute inset-0 bg-[#D32F2F]/20 opacity-0 group-hover:opacity-100 transition duration-300" />
                    </div>
                  </Link>
                ) : (
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition bg-white border-2 border-transparent hover:border-[#D32F2F]">
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-sm md:text-base font-comic">
                        {title}
                      </h3>
                    </div>
                    <div className="absolute inset-0 bg-[#D32F2F]/20 opacity-0 group-hover:opacity-100 transition duration-300" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Shop by Age - Second */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-3 text-[#FF6B35] font-comic">
            🎈 Shop by Age
          </h2>
          <p className="text-center text-gray-600 mb-12 text-base md:text-lg font-medium font-comic">
            Find the perfect toy for every stage 🌟
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
          {ageCategories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="hover:scale-105 transition duration-300 cursor-default"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-white border-2 border-[#FF6B35]/20 hover:border-[#FF6B35]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-[#FF6B35] text-white text-xs font-bold px-2 py-1 rounded-full font-comic">
                  {cat.name}
                </div>
              </div>
              <div className="text-center mt-3 font-semibold text-gray-700 text-sm font-comic">
                {cat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </section>
  )
}