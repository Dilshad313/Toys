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
        }
      }
    }
  }
`

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const first = Number(searchParams.get('first')) || 50

    console.log(`📦 Fetching ${first} collections from Shopify...`)

    const data = await shopifyFetch<any>({
      query: GET_COLLECTIONS,
      variables: { first },
    })

    const collectionCount = data.collections?.edges?.length || 0
    console.log(`✅ Found ${collectionCount} collections`)

    return NextResponse.json({
      success: true,
      data,
      collectionCount
    })
  } catch (error: any) {
    console.error('❌ Collections API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch collections'
      },
      { status: 500 }
    )
  }
}
