import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'

const SEARCH_PRODUCTS = `
  query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
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
          images(first: 3) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 5) {
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
          productType
          vendor
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const first = Number(searchParams.get('first')) || 10

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Search query must be at least 2 characters'
      }, { status: 400 })
    }

    console.log('🔍 Searching for:', q)

    // Build search query for Shopify
    const searchQuery = `title:*${q}* OR tag:*${q}* OR product_type:*${q}* OR vendor:*${q}*`

    const data = await shopifyFetch<any>({
      query: SEARCH_PRODUCTS,
      variables: {
        query: searchQuery,
        first
      }
    })

    const productCount = data.products?.edges?.length || 0
    console.log(`✅ Found ${productCount} products for "${q}"`)

    return NextResponse.json({
      success: true,
      data,
      productCount,
      searchTerm: q
    })
  } catch (error: any) {
    console.error('❌ Search API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to search products'
      },
      { status: 500 }
    )
  }
}