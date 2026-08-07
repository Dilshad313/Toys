import { NextResponse } from 'next/server'
import { shopifyAdminFetch } from '@/lib/shopify/client'

const GET_ORDERS = `
  query GetOrders($first: Int!) {
    orders(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          orderNumber
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          fulfillmentStatus
          financialStatus
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  price
                }
              }
            }
          }
          shippingAddress {
            firstName
            lastName
            address1
            city
            province
            country
            zip
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

export async function GET() {
  try {
    console.log('📦 Fetching orders from Shopify Admin API...')

    const data = await shopifyAdminFetch<any>({
      query: GET_ORDERS,
      variables: { first: 20 }
    })

    const orderCount = data.orders?.edges?.length || 0
    console.log(`✅ Found ${orderCount} orders`)

    return NextResponse.json({
      success: true,
      data,
      orderCount,
    })
  } catch (error: any) {
    console.error('❌ Orders API error:', error)
    
    // Return empty orders if error
    return NextResponse.json({
      success: true,
      data: {
        orders: {
          edges: []
        }
      },
      orderCount: 0,
      message: error.message || 'No orders found',
    })
  }
}