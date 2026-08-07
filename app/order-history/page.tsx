'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Eye, 
  ChevronDown,
  ShoppingBag,
  Calendar,
  CreditCard,
  RotateCcw,
  MapPin,
  Search,
  AlertCircle
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  totalPrice: {
    amount: string
    currencyCode: string
  }
  fulfillmentStatus: string
  financialStatus: string
  lineItems: {
    edges: Array<{
      node: {
        title: string
        quantity: number
        variant: {
          price: {
            amount: string
          }
        }
      }
    }>
  }
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    city: string
    province: string
    country: string
    zip: string
  }
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch orders from Shopify
        const response = await fetch('/api/orders')
        const result = await response.json()
        
        if (result.success && result.data?.orders?.edges) {
          setOrders(result.data.orders.edges.map((edge: any) => edge.node))
        } else {
          setOrders([])
          setError(result.error || 'No orders found')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'fulfilled':
        return 'bg-green-100 text-green-700'
      case 'shipped':
        return 'bg-blue-100 text-blue-700'
      case 'processing':
      case 'partial':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'fulfilled':
        return <CheckCircle className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'processing':
      case 'partial':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <RotateCcw className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return 'Delivered'
      case 'shipped':
        return 'Shipped'
      case 'processing':
        return 'Processing'
      case 'partial':
        return 'Partial'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-comic text-[#D32F2F]">📦 Order History</h1>
            <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-6 bg-gray-200 rounded-full" />
                    <div className="w-32 h-5 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-5 bg-gray-200 rounded" />
                    <div className="w-16 h-5 bg-gray-200 rounded" />
                    <div className="w-20 h-6 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-comic text-[#D32F2F]">📦 Order History</h1>
            <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Unable to load orders</h3>
              <p className="text-gray-500 text-sm mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-2 rounded-full font-semibold transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            📦 Order History
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            Track and manage all your orders in one place
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Stats */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-[#D32F2F]">{orders.length}</div>
              <div className="text-xs text-gray-500">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {orders.filter(o => o.fulfillmentStatus?.toLowerCase() === 'fulfilled').length}
              </div>
              <div className="text-xs text-gray-500">Delivered</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {orders.filter(o => o.fulfillmentStatus?.toLowerCase() === 'shipped' || o.fulfillmentStatus?.toLowerCase() === 'partial').length}
              </div>
              <div className="text-xs text-gray-500">In Transit</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-red-500">
                {orders.filter(o => o.fulfillmentStatus?.toLowerCase() === 'cancelled').length}
              </div>
              <div className="text-xs text-gray-500">Cancelled</div>
            </div>
          </motion.div>
        )}

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
              <p className="text-gray-500 text-sm mb-6">
                Your order history will appear here after you make a purchase.
              </p>
              <Link 
                href="/collections" 
                className="inline-block bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-3 rounded-full font-semibold transition"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const status = order.fulfillmentStatus || 'unfulfilled'
                const totalItems = order.lineItems?.edges?.reduce((sum, edge) => sum + edge.node.quantity, 0) || 0

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
                  >
                    {/* Order Header */}
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className="w-full px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-gray-50 transition text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          {getStatusLabel(status)}
                        </div>
                        <span className="font-semibold text-sm text-gray-700">
                          {order.orderNumber || order.id.substring(0, 10)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <ShoppingBag className="w-4 h-4" />
                          {totalItems} items
                        </div>
                        <span className="font-bold text-[#D32F2F]">
                          ₹{parseFloat(order.totalPrice.amount).toFixed(2)}
                        </span>
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                            expandedOrder === order.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Order Details (Expandable) */}
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Payment Status</p>
                              <p className="font-medium text-gray-800 capitalize">
                                {order.financialStatus || 'Pending'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Order Date</p>
                              <p className="font-medium text-gray-800">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                  day: '2-digit', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total Amount</p>
                              <p className="font-medium text-[#D32F2F]">
                                ₹{parseFloat(order.totalPrice.amount).toFixed(2)}
                              </p>
                            </div>
                            {order.shippingAddress && (
                              <div>
                                <p className="text-gray-500">Shipping Address</p>
                                <p className="font-medium text-gray-800 text-sm">
                                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                                  {order.shippingAddress.address1}<br />
                                  {order.shippingAddress.city}, {order.shippingAddress.province}<br />
                                  {order.shippingAddress.country} - {order.shippingAddress.zip}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Order Items */}
                          {order.lineItems?.edges && order.lineItems.edges.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Items</p>
                              <div className="space-y-1.5">
                                {order.lineItems.edges.map((edge, idx) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      {edge.node.title} × {edge.node.quantity}
                                    </span>
                                    <span className="font-medium text-gray-800">
                                      ₹{parseFloat(edge.node.variant?.price?.amount || '0').toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                            {status.toLowerCase() === 'shipped' && (
                              <Link 
                                href="/track-order"
                                className="inline-flex items-center gap-1.5 text-sm text-[#D32F2F] font-semibold hover:underline"
                              >
                                <Search className="w-4 h-4" />
                                Track Order
                              </Link>
                            )}
                            {status.toLowerCase() === 'fulfilled' && (
                              <Link 
                                href="/returns"
                                className="inline-flex items-center gap-1.5 text-sm text-orange-500 font-semibold hover:underline"
                              >
                                <RotateCcw className="w-4 h-4" />
                                Return Item
                              </Link>
                            )}
                            <Link 
                              href="/shop-by-category"
                              className="inline-flex items-center gap-1.5 text-sm text-gray-500 font-semibold hover:text-[#D32F2F] transition"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              Shop Again
                            </Link>
                            <Link 
                              href="#"
                              className="inline-flex items-center gap-1.5 text-sm text-gray-500 font-semibold hover:text-[#D32F2F] transition"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Help Section */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <h3 className="font-bold text-gray-800 mb-2">Need help with your order?</h3>
              <p className="text-gray-500 text-sm mb-4">
                Our support team is here to assist you
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-[#D32F2F] font-semibold hover:underline text-sm"
                >
                  Contact Support
                </a>
                <span className="text-gray-300">|</span>
                <Link 
                  href="/faqs" 
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-[#D32F2F] transition text-sm"
                >
                  View FAQs
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}