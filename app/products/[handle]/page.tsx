'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, 
  ShoppingCart, 
  Check, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw, 
  Award,
  Minus,
  Plus,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Product {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
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
        width: number
        height: number
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        price: { amount: string }
        compareAtPrice?: { amount: string }
        availableForSale: boolean
        quantityAvailable: number
        selectedOptions: Array<{
          name: string
          value: string
        }>
      }
    }>
  }
  options: Array<{
    name: string
    values: string[]
  }>
  tags: string[]
  productType: string
  vendor: string
  availableForSale: boolean
}

// Related products function to fetch from Shopify
async function fetchRelatedProducts(currentProductId: string) {
  try {
    const response = await fetch(`/api/products?first=6`)
    const result = await response.json()
    
    if (result.success && result.data?.products?.edges) {
      // Filter out current product
      const allProducts = result.data.products.edges.map((edge: any) => edge.node)
      return allProducts.filter((p: any) => p.id !== currentProductId).slice(0, 6)
    }
    return []
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const handle = params?.handle as string
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlist, setIsWishlist] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/products/${handle}`)
        const result = await response.json()
        
        if (result.success && result.data?.productByHandle) {
          const productData = result.data.productByHandle
          setProduct(productData)
          
          if (productData.variants?.edges?.length > 0) {
            setSelectedVariant(productData.variants.edges[0].node.id)
          }

          // Fetch related products (excluding current)
          const related = await fetchRelatedProducts(productData.id)
          setRelatedProducts(related)
        } else {
          setError('Product not found')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [handle])

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    
    setAddingToCart(true)
    try {
      await addToCart(selectedVariant, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  // Buy Now - Redirect to Shopify Checkout
  const handleBuyNow = () => {
    if (!selectedVariant) return
    
    const storeDomain = "athvi-toys.myshopify.com"
    const numericVariantId = selectedVariant.split("/").pop()
    const checkoutUrl = `https://${storeDomain}/cart/${numericVariantId}:${quantity}`
    window.location.href = checkoutUrl
  }

  // Share Product
  const handleShare = async () => {
    const shareData = {
      title: product?.title || 'Athvi Toys',
      text: `Check out this amazing toy! ${product?.title}\nPrice: ₹${parseFloat(product?.priceRange?.minVariantPrice?.amount || '0').toFixed(2)}\n\n${product?.description || ''}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback - copy to clipboard
      const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`
      await navigator.clipboard.writeText(text)
      alert('Product link copied to clipboard!')
    }
  }

  // Get specifications from product data
  const getSpecifications = () => {
    const specs = []
    if (product?.productType) {
      specs.push({ label: 'Product Type', value: product.productType })
    }
    if (product?.vendor) {
      specs.push({ label: 'Brand', value: product.vendor })
    }
    if (product?.tags?.length) {
      specs.push({ label: 'Tags', value: product.tags.join(', ') })
    }
    if (product?.availableForSale !== undefined) {
      specs.push({ label: 'Availability', value: product.availableForSale ? 'In Stock' : 'Out of Stock' })
    }
    return specs
  }

  // Get additional details
  const getAdditionalDetails = () => {
    const details = []
    if (product?.variants?.edges?.length) {
      const variant = product.variants.edges[0].node
      if (variant.quantityAvailable !== undefined) {
        details.push({ label: 'Stock Quantity', value: variant.quantityAvailable.toString() })
      }
    }
    if (product?.priceRange?.minVariantPrice?.currencyCode) {
      details.push({ label: 'Currency', value: product.priceRange.minVariantPrice.currencyCode })
    }
    return details
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 w-3/4 animate-pulse rounded" />
              <div className="bg-gray-200 h-6 w-1/2 animate-pulse rounded" />
              <div className="bg-gray-200 h-12 w-1/3 animate-pulse rounded" />
              <div className="bg-gray-200 h-24 animate-pulse rounded" />
              <div className="bg-gray-200 h-12 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="bg-[#D32F2F] text-white px-6 py-3 rounded-full hover:bg-[#B71C1C] transition">
          Back to Home
        </Link>
      </div>
    )
  }

  const variant = product.variants?.edges?.find((e: any) => e.node.id === selectedVariant)?.node
  const price = variant?.price?.amount || product.priceRange.minVariantPrice.amount
  const compareAtPrice = variant?.compareAtPrice?.amount || null
  const images = product.images?.edges?.map((e: any) => e.node) || []
  const discount = compareAtPrice ? Math.round(((parseFloat(compareAtPrice) - parseFloat(price)) / parseFloat(compareAtPrice)) * 100) : 0

  const features = [
    { title: '360° Rotating Lights', description: 'Colourful LED lights that attract & engage kids.' },
    { title: 'Cheerful Music', description: 'Fun music keeps kids entertained for hours.' },
    { title: 'Floating Ball', description: 'Ball floats with air flow – magical fun!' },
    { title: 'Smooth Wheels', description: 'Easy to move & play anywhere.' },
  ]

  const perfectFor = ['Birthday Gifts', 'Learning & Play', 'Return Gifts', 'Toddler Playtime']

  const trustBadges = [
    { icon: Shield, label: '100% Non-Toxic' },
    { icon: Award, label: 'BIS Certified' },
    { icon: Star, label: 'Premium Quality' },
    { icon: Truck, label: 'Made in India' },
  ]

  const whatsInBox = [
    '1 x Elephant Drummer Toy',
    '1 x Floating Ball',
    '1 x Drum Sticks (Built-in)',
    '1 x User Manual',
  ]

  const specifications = getSpecifications()
  const additionalDetails = getAdditionalDetails()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb - No click navigation */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <span className="hover:text-[#D32F2F] cursor-default">Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-[#D32F2F] cursor-default">Toys</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-[#D32F2F] cursor-default">Musical Toys</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium truncate cursor-default">{product.title}</span>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div>
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-md aspect-square">
                <img
                  src={images[selectedImage]?.url || '/placeholder.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {discount}% OFF
                  </span>
                )}
                <button
                  onClick={() => setIsWishlist(!isWishlist)}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:shadow-xl transition"
                >
                  <Heart className={`w-5 h-5 ${isWishlist ? 'fill-[#D32F2F] text-[#D32F2F]' : 'text-gray-400'}`} />
                </button>
              </div>

              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                      selectedImage === index ? 'border-[#D32F2F]' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 mt-6">
                {trustBadges.map((badge, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                    <badge.icon className="w-5 h-5 text-[#D32F2F] mx-auto mb-1" />
                    <span className="text-[10px] font-medium text-gray-600">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div>
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-comic">
                  {product.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                    Age 1-5 Years
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">4.9</span>
                    <span className="text-gray-400 text-sm">(320 Reviews)</span>
                  </div>
                  <span className="bg-[#D32F2F] text-white text-xs px-3 py-1 rounded-full font-medium">
                    #1 Best Seller
                  </span>
                  <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">
                    in Musical Toys
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-[#D32F2F] font-comic">
                    ₹{parseFloat(price).toFixed(2)}
                  </span>
                  {compareAtPrice && (
                    <span className="text-gray-400 line-through text-lg">
                      ₹{parseFloat(compareAtPrice).toFixed(2)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-blue-700 text-sm mb-2">Why Kids Love This?</h3>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex items-center gap-2">✨ Fun lights & cheerful music</li>
                  <li className="flex items-center gap-2">🧠 Improves motor skills & coordination</li>
                  <li className="flex items-center gap-2">👀 Enhances visual tracking</li>
                  <li className="flex items-center gap-2">🛡️ Safe, durable & non-toxic material</li>
                </ul>
              </div>

              {product.options && product.options.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-sm mb-2">Choose Your Option</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants?.edges?.map((e: any) => {
                      const v = e.node
                      const isSelected = selectedVariant === v.id
                      const vPrice = v.price.amount
                      const vCompare = v.compareAtPrice?.amount || null
                      const vDiscount = vCompare ? Math.round(((parseFloat(vCompare) - parseFloat(vPrice)) / parseFloat(vCompare)) * 100) : 0

                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v.id)}
                          className={`p-3 rounded-xl border-2 transition text-left ${
                            isSelected ? 'border-[#D32F2F] bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-medium">{v.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[#D32F2F] font-bold">₹{parseFloat(vPrice).toFixed(2)}</span>
                            {vCompare && (
                              <span className="text-gray-400 line-through text-xs">₹{parseFloat(vCompare).toFixed(2)}</span>
                            )}
                            {vDiscount > 0 && (
                              <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {vDiscount}% OFF
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">Quantity</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {variant?.quantityAvailable || 0} in stock
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-3 px-6 rounded-full font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {addingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart ✅
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3 px-6 rounded-full font-bold transition flex items-center justify-center gap-2"
                >
                  Buy Now
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="text-gray-500 text-sm flex items-center gap-2 hover:text-[#D32F2F] transition"
              >
                <Share2 className="w-4 h-4" />
                Share this product
              </button>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12 bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {['Description', 'Specifications', 'Additional Details'].map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                      activeTab === i ? 'border-[#D32F2F] text-[#D32F2F]' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6">
              {activeTab === 0 && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description || 'Product description coming soon...' }} />
                </div>
              )}
              {activeTab === 1 && (
                <div className="space-y-3">
                  {specifications.length > 0 ? (
                    specifications.map((spec, i) => (
                      <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50">
                        <span className="font-semibold text-sm text-gray-600 w-1/3">{spec.label}</span>
                        <span className="text-sm text-gray-800">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No specifications available</p>
                  )}
                </div>
              )}
              {activeTab === 2 && (
                <div className="space-y-3">
                  {additionalDetails.length > 0 ? (
                    additionalDetails.map((detail, i) => (
                      <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50">
                        <span className="font-semibold text-sm text-gray-600 w-1/3">{detail.label}</span>
                        <span className="text-sm text-gray-800">{detail.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No additional details available</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold font-comic text-[#D32F2F] mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <Sparkles className="w-5 h-5 text-[#D32F2F] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's in the Box */}
          <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold font-comic text-[#D32F2F] mb-4">What's in the Box?</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {whatsInBox.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                  <div className="w-1.5 h-1.5 bg-[#D32F2F] rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Perfect For */}
          <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold font-comic text-[#D32F2F] mb-4">Perfect For</h3>
            <div className="flex flex-wrap gap-3">
              {perfectFor.map((item, i) => (
                <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* You May Also Like */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold font-comic text-[#D32F2F] mb-6">You May Also Like</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {relatedProducts.map((relProduct) => {
                  const relVariant = relProduct.variants?.edges?.[0]?.node
                  const relPrice = relVariant?.price?.amount || relProduct.priceRange.minVariantPrice.amount
                  const relCompare = relVariant?.compareAtPrice?.amount || null
                  const relDiscount = relCompare ? Math.round(((parseFloat(relCompare) - parseFloat(relPrice)) / parseFloat(relCompare)) * 100) : 0
                  const relImage = relProduct.images?.edges?.[0]?.node?.url || '/placeholder.jpg'

                  return (
                    <Link href={`/products/${relProduct.handle}`} key={relProduct.id}>
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group">
                        <div className="relative overflow-hidden h-40">
                          <img src={relImage} alt={relProduct.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          {relDiscount > 0 && (
                            <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {relDiscount}% OFF
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="font-semibold text-xs line-clamp-1">{relProduct.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-[#D32F2F]">₹{parseFloat(relPrice).toFixed(2)}</span>
                            {relCompare && (
                              <span className="text-gray-400 line-through text-[10px]">₹{parseFloat(relCompare).toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Trust Stats */}
          <div className="mt-12 bg-[#D32F2F] text-white rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold font-comic">25,000+</div>
                <div className="text-sm opacity-80">Happy Families Trust Us</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-comic">500+</div>
                <div className="text-sm opacity-80">Premium Quality Toys</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-comic">1M+</div>
                <div className="text-sm opacity-80">Orders Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-comic">4.9 ★</div>
                <div className="text-sm opacity-80">Average Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
        .prose {
          color: #374151;
        }
        .prose p {
          margin-bottom: 1rem;
        }
        .prose ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  )
}