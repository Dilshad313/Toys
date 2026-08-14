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
          media(first: 5) {
            edges {
              node {
                mediaContentType
                alt
                previewImage {
                  url
                  altText
                }
                ... on Video {
                  sources {
                    url
                    mimeType
                    format
                    height
                    width
                  }
                }
                ... on ExternalVideo {
                  embedUrl
                  originUrl
                  host
                }
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
          ageGroup: metafield(namespace: "custom", key: "age_group") {
            value
            type
          }
          recommendedAgeGroup: metafield(namespace: "custom", key: "recommended_age_group") {
            value
            type
          }
          recommendedAge: metafield(namespace: "custom", key: "recommended_age") {
            value
            type
          }
          ageRange: metafield(namespace: "custom", key: "age_range") {
            value
            type
          }
          age: metafield(namespace: "custom", key: "age") {
            value
            type
          }
          shopByAge: metafield(namespace: "custom", key: "shop_by_age") {
            value
            type
          }
          videoUrl: metafield(namespace: "custom", key: "video_url") {
            value
            type
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
interface ProductsResponse {
  products?: {
    edges?: unknown[]
  }
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Failed to fetch products'

const getErrorStack = (error: unknown) =>
  error instanceof Error ? error.stack : undefined

export async function GET(request: Request) {
  console.log('📦 Products API called')
  
  try {
    const { searchParams } = new URL(request.url)
    const first = Number(searchParams.get('first')) || 20
    const category = searchParams.get('category')

    console.log(`📦 Fetching ${first} products, category: ${category || 'all'}`)

    const data = await shopifyFetch<ProductsResponse>({
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
  } catch (error: unknown) {
    console.error('❌ Products API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: getErrorMessage(error),
        stack: process.env.NODE_ENV === 'development' ? getErrorStack(error) : undefined,
      },
      { status: 500 }
    )
  }
}
