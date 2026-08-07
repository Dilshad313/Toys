import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const first = Number(searchParams.get('first')) || 50

    console.log('📦 Fetching collections from Shopify...')

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
            }
          }
        }
      }
    `

    const data = await shopifyFetch<any>({
      query: GET_COLLECTIONS,
      variables: { first },
    })

    console.log('📦 Shopify Response:', JSON.stringify(data, null, 2))

    if (!data.collections) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Collections not found',
          data: data 
        },
        { status: 404 }
      )
    }

    const edges = data.collections.edges || []
    console.log(`✅ Found ${edges.length} collections`)

    return NextResponse.json({
      success: true,
      data: {
        collections: edges
      }
    })
  } catch (error: any) {
    console.error('❌ Collections API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch collections',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}