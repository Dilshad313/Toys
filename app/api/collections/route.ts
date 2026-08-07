import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'

const GET_COLLECTIONS = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 20) {
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
                      quantityAvailable
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
    const first = Number(searchParams.get('first')) || 50
    const handle = searchParams.get('handle')

    console.log(`📦 Fetching collections from Shopify...`)

    // If handle is provided, fetch specific collection with products
    if (handle) {
      const GET_COLLECTION_BY_HANDLE = `
        query GetCollectionByHandle($handle: String!) {
          collectionByHandle(handle: $handle) {
            id
            title
            handle
            description
            image {
              url
              altText
            }
            products(first: 20) {
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
                        quantityAvailable
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

      console.log(`🔍 Fetching collection with handle: ${handle}`)

      const data = await shopifyFetch<any>({
        query: GET_COLLECTION_BY_HANDLE,
        variables: { handle },
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
      const productCount = collection.products?.edges?.length || 0

      console.log(`✅ Found collection "${collection.title}" with ${productCount} products`)

      return NextResponse.json({ 
        success: true,
        data: {
          collection,
          products: collection.products?.edges || [],
        },
        productCount,
      })
    }

    // Fetch all collections (without products)
    console.log(`📦 Fetching ${first} collections...`)

    const data = await shopifyFetch<any>({
      query: GET_COLLECTIONS,
      variables: { first },
    })

    if (!data.collections) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Collections not found',
        },
        { status: 404 }
      )
    }

    const collections = data.collections.edges || []
    
    console.log(`✅ Found ${collections.length} collections`)

    return NextResponse.json({ 
      success: true,
      data: {
        collections
      },
      collectionCount: collections.length,
      hasNextPage: data.collections.pageInfo?.hasNextPage || false,
      endCursor: data.collections.pageInfo?.endCursor || null,
    })
  } catch (error: any) {
    console.error('❌ Collections API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch collections',
      },
      { status: 500 }
    )
  }
}