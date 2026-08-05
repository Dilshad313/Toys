import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
    const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-07'

    // Check if credentials exist
    if (!domain || !token) {
      return NextResponse.json({
        success: false,
        error: 'Missing Storefront credentials',
        details: {
          hasDomain: !!domain,
          hasToken: !!token,
          domain: domain || 'not set',
          tokenPreview: token ? `${token.substring(0, 10)}...` : 'not set',
        }
      }, { status: 400 })
    }

    // Test query to fetch products
    const query = `
      query {
        shop {
          name
          primaryDomain {
            url
          }
        }
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              availableForSale
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
            }
          }
        }
      }
    `

    console.log('Testing Shopify connection...')
    console.log('Domain:', domain)
    console.log('Version:', version)

    const response = await fetch(
      `https://${domain}/api/${version}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({ query }),
      }
    )

    const responseText = await response.text()
    let data

    try {
      data = JSON.parse(responseText)
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON response',
        rawResponse: responseText.substring(0, 500),
        status: response.status,
        statusText: response.statusText,
      }, { status: response.status })
    }

    if (data.errors) {
      return NextResponse.json({
        success: false,
        error: 'GraphQL Errors',
        errors: data.errors,
        query: query,
      }, { status: 400 })
    }

    const productCount = data.data?.products?.edges?.length || 0

    return NextResponse.json({
      success: true,
      shop: data.data?.shop,
      productCount: productCount,
      products: data.data?.products?.edges?.map((e: any) => ({
        id: e.node.id,
        title: e.node.title,
        handle: e.node.handle,
        available: e.node.availableForSale,
        price: e.node.priceRange.minVariantPrice.amount,
        image: e.node.images.edges[0]?.node.url || null,
      })),
      message: productCount > 0 
        ? `✅ Found ${productCount} products!` 
        : '⚠️ No products found. Make sure products are published to Online Store.',
      credentials: {
        domain,
        version,
        tokenExists: !!token,
      }
    })
  } catch (error: any) {
    console.error('Test API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 })
  }
}