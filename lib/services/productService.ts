import { shopifyFetch } from '../shopify/client'
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_BEST_SELLERS,
  GET_NEW_ARRIVALS,
  GET_PRODUCTS_BY_COLLECTION,
  SEARCH_PRODUCTS,
} from '../shopify/queries'

export interface Product {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml?: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string | null
        width?: number
        height?: number
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        price: {
          amount: string
          currencyCode: string
        }
        compareAtPrice?: {
          amount: string
          currencyCode: string
        }
        availableForSale: boolean
        quantityAvailable: number
        selectedOptions: Array<{
          name: string
          value: string
        }>
      }
    }>
  }
  options: Array<{
    name: string
    values: string[]
  }>
  tags: string[]
  productType: string
  vendor: string
  rating?: { value: string }
  reviewsCount?: { value: string }
}

export interface ProductsResponse {
  products: {
    edges: Array<{
      node: Product
    }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string
    }
  }
}

export const productService = {
  // Get all products with pagination
  async getProducts({
    first = 20,
    after = null,
    query = '',
  }: {
    first?: number
    after?: string | null
    query?: string
  }): Promise<ProductsResponse> {
    const data = await shopifyFetch<ProductsResponse>({
      query: GET_PRODUCTS,
      variables: { first, after, query },
    })
    return data
  },

  // Get single product by handle
  async getProductByHandle(handle: string): Promise<{ productByHandle: Product | null }> {
    const data = await shopifyFetch<{ productByHandle: Product | null }>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
    })
    return data
  },

  // Get best sellers
  async getBestSellers({ first = 20 }: { first?: number }): Promise<ProductsResponse> {
    const data = await shopifyFetch<ProductsResponse>({
      query: GET_BEST_SELLERS,
      variables: { first },
      cache: 'reload',
    })
    return data
  },

  // Get new arrivals
  async getNewArrivals({ first = 20 }: { first?: number }): Promise<ProductsResponse> {
    const data = await shopifyFetch<ProductsResponse>({
      query: GET_NEW_ARRIVALS,
      variables: { first },
      cache: 'reload',
    })
    return data
  },

  // Get products by collection
  async getProductsByCollection({
    collectionHandle,
    first = 20,
  }: {
    collectionHandle: string
    first?: number
  }): Promise<{ collectionByHandle: { id: string; title: string; products: ProductsResponse['products'] } }> {
    const data = await shopifyFetch<{
      collectionByHandle: {
        id: string
        title: string
        products: ProductsResponse['products']
      }
    }>({
      query: GET_PRODUCTS_BY_COLLECTION,
      variables: { collectionHandle, first },
    })
    return data
  },

  // Search products
  async searchProducts({
    query,
    first = 20,
  }: {
    query: string
    first?: number
  }): Promise<ProductsResponse> {
    const data = await shopifyFetch<ProductsResponse>({
      query: SEARCH_PRODUCTS,
      variables: { query: `title:*${query}* OR tag:*${query}* OR product_type:*${query}*`, first },
    })
    return data
  },
}