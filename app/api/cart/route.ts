import { NextResponse } from 'next/server'
import { cartService } from '@/lib/services/cartService'

// Get cart
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')

    if (!cartId) {
      return NextResponse.json(
        { success: false, error: 'Cart ID required' },
        { status: 400 }
      )
    }

    const data = await cartService.getCart(cartId)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// Create cart or add to cart
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, cartId, variantId, quantity, lineIds, lines } = body

    let data

    switch (action) {
      case 'create':
        data = await cartService.createCart()
        break

      case 'add':
        if (!cartId || !variantId) {
          return NextResponse.json(
            { success: false, error: 'Cart ID and Variant ID required' },
            { status: 400 }
          )
        }
        data = await cartService.addToCart({ cartId, variantId, quantity })
        break

      case 'remove':
        if (!cartId || !lineIds) {
          return NextResponse.json(
            { success: false, error: 'Cart ID and Line IDs required' },
            { status: 400 }
          )
        }
        data = await cartService.removeFromCart({ cartId, lineIds })
        break

      case 'update':
        if (!cartId || !lines) {
          return NextResponse.json(
            { success: false, error: 'Cart ID and Lines required' },
            { status: 400 }
          )
        }
        data = await cartService.updateCart({ cartId, lines })
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process cart' },
      { status: 500 }
    )
  }
}