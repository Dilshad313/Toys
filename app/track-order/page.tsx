'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, Clock, MapPin, Search, AlertCircle } from 'lucide-react'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [trackingResult, setTrackingResult] = useState<{
    status: string
    orderId: string
    date: string
    items: number
    total: string
    steps: { label: string; completed: boolean; date?: string }[]
  } | null>(null)
  const [error, setError] = useState('')

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orderId.trim()) {
      setError('Please enter your order ID')
      return
    }

    setError('')
    setIsTracking(true)

    // Simulate API call
    setTimeout(() => {
      // Sample tracking data
      setTrackingResult({
        status: 'In Transit',
        orderId: orderId.trim(),
        date: '2026-08-05',
        items: 3,
        total: '₹2,497.00',
        steps: [
          { label: 'Order Placed', completed: true, date: 'Aug 05, 2026, 10:30 AM' },
          { label: 'Order Confirmed', completed: true, date: 'Aug 05, 2026, 11:00 AM' },
          { label: 'Shipped', completed: true, date: 'Aug 06, 2026, 02:15 PM' },
          { label: 'Out for Delivery', completed: false, date: 'Estimated: Aug 07, 2026' },
          { label: 'Delivered', completed: false, date: 'Estimated: Aug 08, 2026' },
        ]
      })
      setIsTracking(false)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-500'
      case 'In Transit':
        return 'text-blue-500'
      case 'Processing':
        return 'text-yellow-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'In Transit':
        return <Truck className="w-6 h-6 text-blue-500" />
      case 'Processing':
        return <Clock className="w-6 h-6 text-yellow-500" />
      default:
        return <Package className="w-6 h-6 text-gray-500" />
    }
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
            📦 Track Your Order
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            Enter your order ID to track your shipment status
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your order ID (e.g., #ATHVI-12345)"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 transition text-gray-700 placeholder:text-gray-400"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isTracking}
                className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isTracking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Tracking Result */}
        {trackingResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Order Summary */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-xl font-bold text-gray-800">{trackingResult.orderId}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-semibold flex items-center gap-1.5 ${getStatusColor(trackingResult.status)}`}>
                        {getStatusIcon(trackingResult.status)}
                        {trackingResult.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-semibold text-gray-800">{trackingResult.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="font-semibold text-gray-800">{trackingResult.items} items</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-[#D32F2F]">{trackingResult.total}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-6">Tracking Timeline</h3>
                <div className="space-y-4">
                  {trackingResult.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      {/* Timeline Line */}
                      <div className="relative flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                          step.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'bg-gray-200 border-gray-300'
                        }`}>
                          {step.completed && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        {index < trackingResult.steps.length - 1 && (
                          <div className={`w-0.5 h-full min-h-10 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <p className={`font-semibold ${
                            step.completed ? 'text-gray-800' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          {step.date && (
                            <p className={`text-sm ${
                              step.completed ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {step.date}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-2">Need help?</h3>
            <p className="text-gray-500 text-sm mb-4">
              If you can't find your order, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 text-[#D32F2F] font-semibold hover:underline"
              >
                Contact Support
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a 
                href="/" 
                className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-[#D32F2F] transition"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}