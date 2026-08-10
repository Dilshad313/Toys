'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
      }
    }>
  }
}

interface SearchBarProps {
  onProductSelect?: () => void  // Add this prop
}

export default function SearchBar({ onProductSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        const result = await response.json()
        
        if (result.success && result.data?.products?.edges) {
          const products = result.data.products.edges.map((edge: any) => edge.node)
          setResults(products)
        } else {
          setResults([])
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      // Close the popup when searching
      if (onProductSelect) {
        onProductSelect()
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  // Handle product selection - closes the popup
  const handleProductSelect = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    // Call the onProductSelect callback to close the search popup
    if (onProductSelect) {
      onProductSelect()
    }
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for toys, brands, categories..."
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 text-sm transition bg-white pr-12"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white p-2.5 rounded-full transition"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-[#FF6B35] border-t-transparent rounded-full mx-auto" />
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((product) => {
                const imageUrl = product.images?.edges?.[0]?.node?.url || '/placeholder.jpg'
                const price = product.variants?.edges?.[0]?.node?.price?.amount || '0'

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    onClick={handleProductSelect}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition group"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm truncate group-hover:text-[#FF6B35] transition">
                        {product.title}
                      </h4>
                      <p className="text-[#FF6B35] font-bold text-sm">
                        ₹{parseFloat(price).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                )
              })}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={handleProductSelect}
                  className="block text-center text-sm text-[#FF6B35] font-semibold hover:underline py-1"
                >
                  View all results →
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No products found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}