import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'

// Simple query to get all products
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

// ✅ IMPORTANT: This MUST be named GET and exported
export async function GET(request: Request) {
  console.log('📦 Best Sellers API called')
  
  try {
    const { searchParams } = new URL(request.url)
    const first = Number(searchParams.get('first')) || 8

    console.log(`📦 Fetching ${first} products...`)

    const data = await shopifyFetch<any>({
      query: GET_PRODUCTS,
      variables: { first },
    })

    const products = data.products?.edges || []
    const productCount = products.length
    
    console.log(`✅ Found ${productCount} products`)

    // Log product titles for debugging
    products.forEach((edge: any, index: number) => {
      console.log(`  ${index + 1}. ${edge.node.title}`)
    })

    return NextResponse.json({ 
      success: true, 
      data,
      productCount,
    })
  } catch (error: any) {
    console.error('❌ Best Sellers API error:', error)
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