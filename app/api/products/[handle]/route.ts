import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify/client'

const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      media(first: 10) {
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
      variants(first: 25) {
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
            image {
              url
              altText
            }
          }
        }
      }
      options {
        name
        values
      }
      tags
      productType
      vendor
      availableForSale
    }
  }
`

// ✅ FIX: Use NextRequest and proper params type
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> | { handle: string } }
) {
  try {
    // Handle both sync and async params
    const resolvedParams = await Promise.resolve(params)
    const { handle } = resolvedParams
    
    console.log('Fetching product by handle:', handle)

    const data = await shopifyFetch<any>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
    })

    if (!data.productByHandle) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found',
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
    console.error('Product API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch product',
      },
      { status: 500 }
    )
  }
}