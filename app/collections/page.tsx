'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Star, Filter, Grid, List } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Product {
  id: string
  title: string
  handle: string
  description: string
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
        id: string
        price: { amount: string }
        compareAtPrice?: { amount: string }
        availableForSale: boolean
      }
    }>
  }
  tags: string[]
  productType: string
  vendor: string
}

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { addToCart } = useCart()

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/products?first=50')
        const result = await response.json()
        
        if (result.success && result.data?.products?.edges) {
          const productList = result.data.products.edges.map((edge: any) => edge.node)
          setProducts(productList)
        } else {
          setError('No products found')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (variantId: string, productId: string) => {
    if (!variantId) return

    try {
      setAddingToCart(productId)
      await addToCart(variantId, 1)
      setTimeout(() => setAddingToCart(null), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setAddingToCart(null)
    }
  }

  // Filter products by search term
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true
    return product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.productType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.variants?.edges?.[0]?.node?.price?.amount || '0')
    const priceB = parseFloat(b.variants?.edges?.[0]?.node?.price?.amount || '0')
    const dateA = new Date(a.id).getTime()
    const dateB = new Date(b.id).getTime()
    const titleA = a.title.toLowerCase()
    const titleB = b.title.toLowerCase()

    switch (sortBy) {
      case 'price-low':
        return priceA - priceB
      case 'price-high':
        return priceB - priceA
      case 'name':
        return titleA.localeCompare(titleB)
      case 'newest':
      default:
        return dateB - dateA
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F] mb-8">
          🛍️ All Collections
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F] mb-8">
          🛍️ All Collections
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-[#FF6B35] hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
          🛍️ All Collections
        </h1>
        <p className="text-gray-600 mt-2 font-comic text-base md:text-lg">
          Explore our complete range of premium toys
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#FF6B35] bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-500 text-sm">
          {sortedProducts.length} products found
        </p>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product, i) => {
            const variant = product.variants?.edges?.[0]?.node
            const price = variant?.price?.amount || '0'
            const compareAt = variant?.compareAtPrice?.amount || null
            const imageUrl = product.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
            const variantId = variant?.id || ''
            const isAdding = addingToCart === product.id

            let discount = 0
            if (compareAt && parseFloat(compareAt) > parseFloat(price)) {
              discount = Math.round(((parseFloat(compareAt) - parseFloat(price)) / parseFloat(compareAt)) * 100)
            }

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 4) * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100 hover:border-[#FF6B35] flex flex-col"
              >
                <Link href={`/products/${product.handle}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                    {product.tags?.includes('best-seller') && (
                      <span className="absolute top-3 left-3 bg-[#D32F2F] text-white text-xs font-bold px-2 py-1 rounded-full">
                        ⭐ Best Seller
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/products/${product.handle}`}>
                    <h3 className="font-semibold text-base line-clamp-2 hover:text-[#FF6B35] transition min-h-[48px]">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-gray-700 text-xs ml-1">4.8</span>
                    </div>
                    <span className="text-gray-400 text-xs">(245)</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-[#D32F2F] font-comic">
                      ₹{parseFloat(price).toFixed(2)}
                    </span>
                    {compareAt && (
                      <span className="text-gray-400 line-through text-xs">
                        ₹{parseFloat(compareAt).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(variantId, product.id)}
                    disabled={!variantId || isAdding}
                    className="w-full mt-3 py-2 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}