'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'

interface Product {
  id: string
  title: string
  handle: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string | null
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        price: { amount: string }
        compareAtPrice?: { amount: string }
        availableForSale: boolean
      }
    }>
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!q || q.length < 2) {
        setProducts([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&first=20`)
        const result = await response.json()

        if (result.success && result.data?.products?.edges) {
          setProducts(result.data.products.edges.map((edge: any) => edge.node))
        } else {
          setProducts([])
          setError(result.error || 'No products found')
        }
      } catch (error) {
        console.error('Search error:', error)
        setError('Failed to load search results')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [q])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-8">Search Results</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-500 mb-8">
        {products.length} results found for "{q}"
      </p>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center max-w-2xl mx-auto">
          <p className="text-yellow-600 font-medium">{error}</p>
        </div>
      )}

      {products.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No products found</h2>
          <p className="text-gray-500">Try different keywords or browse our categories</p>
          <Link href="/products" className="inline-block mt-4 bg-[#FF6B35] text-white px-6 py-2 rounded-full hover:bg-[#e55a2b] transition">
            Browse All Products
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, i) => {
          const variant = product.variants?.edges?.[0]?.node
          const price = variant?.price?.amount || '0'
          const compareAt = variant?.compareAtPrice?.amount || null
          const imageUrl = product.images?.edges?.[0]?.node?.url || '/placeholder.jpg'

          let discount = 0
          if (compareAt && parseFloat(compareAt) > parseFloat(price)) {
            discount = Math.round(((parseFloat(compareAt) - parseFloat(price)) / parseFloat(compareAt)) * 100)
          }

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100 hover:border-[#FF6B35]"
            >
              <Link href={`/products/${product.handle}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                  />
                  {discount > 0 && (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-gray-700 ml-1 text-sm">4.8</span>
                    </div>
                    <span className="text-gray-400 text-sm">(245 reviews)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#FF6B35]">₹{parseFloat(price).toFixed(2)}</span>
                    {compareAt && (
                      <span className="text-gray-400 line-through text-sm">₹{parseFloat(compareAt).toFixed(2)}</span>
                    )}
                    {discount > 0 && (
                      <span className="text-green-600 text-sm font-semibold">{discount}% OFF</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}