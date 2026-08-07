import { NextResponse, NextRequest } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'

const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first) {
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
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> | { handle: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const { handle } = resolvedParams
    
    const { searchParams } = new URL(request.url)
    const first = Number(searchParams.get('first')) || 50

    console.log(`📦 Fetching collection "${handle}" with ${first} products...`)

    const data = await shopifyFetch<any>({
      query: GET_COLLECTION_BY_HANDLE,
      variables: { handle, first },
    })

    if (!data.collectionByHandle) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Collection not found',
          handle,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data,
    })
  } catch (error: any) {
    console.error('Collection API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch collection',
      },
      { status: 500 }
    )
  }
}
