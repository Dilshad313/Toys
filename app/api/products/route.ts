import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'

const GET_PRODUCTS = `
  query GetProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          tags
          availableForSale
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

// ✅ Export GET method
export async function GET(request: Request) {
  console.log('📦 Products API called')
  
  try {
    const { searchParams } = new URL(request.url)
    const first = Number(searchParams.get('first')) || 20
    const category = searchParams.get('category')

    console.log(`📦 Fetching ${first} products, category: ${category || 'all'}`)

    const data = await shopifyFetch<any>({
      query: GET_PRODUCTS,
      variables: { first },
    })

    const productCount = data.products?.edges?.length || 0
    console.log(`✅ Found ${productCount} products`)

    return NextResponse.json({ 
      success: true, 
      data,
      productCount,
    })
  } catch (error: any) {
    console.error('❌ Products API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch products',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}