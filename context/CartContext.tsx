'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { cartService } from '@/lib/services/cartService'

interface CartItem {
  id: string
  variantId: string
  title: string
  quantity: number
  price: string
  currencyCode: string
  image: string
  handle: string
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: string
  isLoading: boolean
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem('cartId')
    if (savedCartId) {
      setCartId(savedCartId)
      fetchCart(savedCartId)
    }
  }, [])

  const fetchCart = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await cartService.getCart(id)
      if (response.cart) {
        const cartItems = response.cart.lines.edges.map((edge: any) => {
          const product = edge.node.merchandise.product
          const imageUrl = product?.images?.edges?.[0]?.node?.url || 
                          product?.featuredImage?.url || 
                          '/placeholder.jpg'
          
          return {
            id: edge.node.id,
            variantId: edge.node.merchandise.id,
            title: product?.title || 'Product',
            quantity: edge.node.quantity,
            price: edge.node.merchandise.price.amount,
            currencyCode: edge.node.merchandise.price.currencyCode,
            image: imageUrl,
            handle: product?.handle || '',
          }
        })
        setItems(cartItems)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (variantId: string, quantity = 1) => {
    setIsLoading(true)
    try {
      let currentCartId = cartId

      if (!currentCartId) {
        const newCart = await cartService.createCart()
        currentCartId = newCart.cartCreate.cart.id
        setCartId(currentCartId)
        localStorage.setItem('cartId', currentCartId)
      }

      const result = await cartService.addToCart({
        cartId: currentCartId,
        variantId,
        quantity,
      })

      // Preserve existing items and update without refresh
      const updatedItems = result.cartLinesAdd?.cart?.lines?.edges?.map((edge: any) => {
        const product = edge.node.merchandise.product
        const imageUrl = product?.images?.edges?.[0]?.node?.url || 
                        product?.featuredImage?.url || 
                        '/placeholder.jpg'
        
        return {
          id: edge.node.id,
          variantId: edge.node.merchandise.id,
          title: product?.title || 'Product',
          quantity: edge.node.quantity,
          price: edge.node.merchandise.price.amount,
          currencyCode: edge.node.merchandise.price.currencyCode,
          image: imageUrl,
          handle: product?.handle || '',
        }
      }) || []
      
      setItems(updatedItems)
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (lineId: string) => {
    if (!cartId) return

    // ❌ Don't set global isLoading — prevents full-page skeleton
    try {
      const result = await cartService.removeFromCart({
        cartId,
        lineIds: [lineId],
      })

      const updatedLines = result.cartLinesRemove?.cart?.lines?.edges || []

      // ✅ Merge: keep existing items, only remove the deleted one
      setItems((prevItems) => {
        const remainingIds = new Set(updatedLines.map((edge: any) => edge.node.id))
        return prevItems.filter((item) => remainingIds.has(item.id))
      })
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cartId) return

    // ❌ Don't set global isLoading — prevents full-page skeleton refresh feel
    try {
      const result = await cartService.updateCart({
        cartId,
        lines: [{ id: lineId, quantity }],
      })

      const updatedLines = result.cartLinesUpdate?.cart?.lines?.edges || []

      // ✅ Merge with existing items: preserve images and all data, only update quantity/price
      setItems((prevItems) => {
        // Create a map of updated items from API response
        const updatedMap = new Map()
        updatedLines.forEach((edge: any) => {
          const node = edge.node
          const product = node.merchandise.product
          updatedMap.set(node.id, {
            id: node.id,
            variantId: node.merchandise.id,
            title: product?.title || 'Product',
            quantity: node.quantity,
            price: node.merchandise.price.amount,
            currencyCode: node.merchandise.price.currencyCode,
            // Try to get image from API, but we'll prefer existing if null
            image: product?.images?.edges?.[0]?.node?.url ||
                   product?.featuredImage?.url ||
                   null,
            handle: product?.handle || '',
          })
        })

        // Merge: keep existing item data (especially image), update only changed fields
        return prevItems.map((prevItem) => {
          const updated = updatedMap.get(prevItem.id)
          if (updated) {
            return {
              ...prevItem,                    // ✅ Keep ALL existing data (image, title, etc.)
              quantity: updated.quantity,     // Update quantity
              price: updated.price,             // Update price if changed
              title: updated.title || prevItem.title,  // Update title if available
            }
          }
          return prevItem
        }).filter((item) => {
          // Remove items that no longer exist in the cart
          return updatedMap.has(item.id)
        })
      })
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    }
  }

  // Clear Cart - Remove all items
  const clearCart = () => {
    setItems([])
    setCartId(null)
    localStorage.removeItem('cartId')
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items
    .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}