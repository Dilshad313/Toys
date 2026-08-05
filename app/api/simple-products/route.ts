import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('✅ Simple Products API called')
  
  try {
    const { searchParams } = new URL(request.url)
    const first = Number(searchParams.get('first')) || 8

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
    
    console.log('📦 Domain:', domain)
    console.log('🔑 Token exists:', !!token)

    if (!domain || !token) {
      return NextResponse.json({
        success: false,
        error: 'Missing Shopify credentials',
        domain: !!domain,
        token: !!token,
      }, { status: 400 })
    }

    // Test query
    const query = `
      query {
        products(first: ${first}) {
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price {
                      amount
                    }
                    compareAtPrice {
                      amount
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    `

    const url = `https://${domain}/api/2024-07/graphql.json`
    
    console.log('🔄 Fetching from:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    })

    const text = await response.text()
    console.log('📥 Response status:', response.status)
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${text.substring(0, 100)}`,
        status: response.status,
      }, { status: response.status })
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON response',
        raw: text.substring(0, 200),
      }, { status: 500 })
    }

    if (data.errors) {
      return NextResponse.json({
        success: false,
        error: 'GraphQL Error',
        errors: data.errors,
      }, { status: 400 })
    }

    const productCount = data.data?.products?.edges?.length || 0
    console.log(`✅ Found ${productCount} products`)

    return NextResponse.json({
      success: true,
      data: data.data,
      productCount,
    })
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 })
  }
}