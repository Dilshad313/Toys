import { shopifyFetch } from '../shopify/client'
import {
  CREATE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART,
  GET_CART,
} from '../shopify/cart'

export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: {
      amount: string
      currencyCode: string
    }
    product: {
      title: string
      handle: string
      images: {
        edges: Array<{
          node: {
            url: string
            altText: string | null
          }
        }>
      }
    }
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{
      node: CartLine
    }>
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalTaxAmount?: {
      amount: string
      currencyCode: string
    }
  }
}

export const cartService = {
  // Create new cart
  async createCart(): Promise<{ cartCreate: { cart: Cart } }> {
    const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
      query: CREATE_CART,
      variables: { input: {} },
    })
    return data
  },

  // Add item to cart
  async addToCart({
    cartId,
    variantId,
    quantity = 1,
  }: {
    cartId: string
    variantId: string
    quantity?: number
  }): Promise<{ cartLinesAdd: { cart: Cart } }> {
    const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({
      query: ADD_TO_CART,
      variables: {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      },
    })
    return data
  },

  // Remove item from cart
  async removeFromCart({
    cartId,
    lineIds,
  }: {
    cartId: string
    lineIds: string[]
  }): Promise<{ cartLinesRemove: { cart: Cart } }> {
    const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
      query: REMOVE_FROM_CART,
      variables: { cartId, lineIds },
    })
    return data
  },

  // Update cart item quantity
  async updateCart({
    cartId,
    lines,
  }: {
    cartId: string
    lines: Array<{ id: string; quantity: number }>
  }): Promise<{ cartLinesUpdate: { cart: Cart } }> {
    const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
      query: UPDATE_CART,
      variables: { cartId, lines },
    })
    return data
  },

  // Get cart details
  async getCart(cartId: string): Promise<{ cart: Cart | null }> {
    const data = await shopifyFetch<{ cart: Cart | null }>({
      query: GET_CART,
      variables: { cartId },
    })
    return data
  },
}