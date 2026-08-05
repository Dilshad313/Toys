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
    try {
      const response = await cartService.getCart(id)
      if (response.cart) {
        const cartItems = response.cart.lines.edges.map((edge) => ({
          id: edge.node.id,
          variantId: edge.node.merchandise.id,
          title: edge.node.merchandise.product.title,
          quantity: edge.node.quantity,
          price: edge.node.merchandise.price.amount,
          currencyCode: edge.node.merchandise.price.currencyCode,
          image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
          handle: edge.node.merchandise.product.handle,
        }))
        setItems(cartItems)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const addToCart = async (variantId: string, quantity = 1) => {
    setIsLoading(true)
    try {
      let currentCartId = cartId

      // Create new cart if none exists
      if (!currentCartId) {
        const newCart = await cartService.createCart()
        currentCartId = newCart.cartCreate.cart.id
        setCartId(currentCartId)
        localStorage.setItem('cartId', currentCartId)
      }

      // Add item to cart
      const result = await cartService.addToCart({
        cartId: currentCartId,
        variantId,
        quantity,
      })

      // Update items
      const cartItems = result.cartLinesAdd.cart.lines.edges.map((edge) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        title: edge.node.merchandise.product.title,
        quantity: edge.node.quantity,
        price: edge.node.merchandise.price.amount,
        currencyCode: edge.node.merchandise.price.currencyCode,
        image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
        handle: edge.node.merchandise.product.handle,
      }))
      setItems(cartItems)
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (lineId: string) => {
    if (!cartId) return

    setIsLoading(true)
    try {
      const result = await cartService.removeFromCart({
        cartId,
        lineIds: [lineId],
      })

      const cartItems = result.cartLinesRemove.cart.lines.edges.map((edge) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        title: edge.node.merchandise.product.title,
        quantity: edge.node.quantity,
        price: edge.node.merchandise.price.amount,
        currencyCode: edge.node.merchandise.price.currencyCode,
        image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
        handle: edge.node.merchandise.product.handle,
      }))
      setItems(cartItems)
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cartId) return

    setIsLoading(true)
    try {
      const result = await cartService.updateCart({
        cartId,
        lines: [{ id: lineId, quantity }],
      })

      const cartItems = result.cartLinesUpdate.cart.lines.edges.map((edge) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        title: edge.node.merchandise.product.title,
        quantity: edge.node.quantity,
        price: edge.node.merchandise.price.amount,
        currencyCode: edge.node.merchandise.price.currencyCode,
        image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
        handle: edge.node.merchandise.product.handle,
      }))
      setItems(cartItems)
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

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