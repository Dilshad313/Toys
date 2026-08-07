import { NextResponse, NextRequest } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> | { handle: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const first = Number(searchParams.get('first')) || 50

    const resolvedParams = await Promise.resolve(params)
    const { handle } = resolvedParams

    console.log(`📦 Fetching collection: ${handle}, first: ${first}`)

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
                tags
                productType
                vendor
                availableForSale
              }
            }
          }
        }
      }
    `

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

    const collection = data.collectionByHandle
    const products = collection.products?.edges || []
    const productCount = products.length

    console.log(`✅ Found collection "${collection.title}" with ${productCount} products`)

    return NextResponse.json({ 
      success: true,
      data: {
        collection: {
          id: collection.id,
          title: collection.title,
          handle: collection.handle,
          description: collection.description,
          image: collection.image,
        },
        products: {
          edges: products,
          pageInfo: collection.products?.pageInfo || {
            hasNextPage: false,
            endCursor: null
          }
        }
      },
      productCount,
    })
  } catch (error: any) {
    console.error('❌ Collection API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch collection',
      },
      { status: 500 }
    )
  }
}