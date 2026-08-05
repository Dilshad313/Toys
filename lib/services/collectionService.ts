import { shopifyFetch } from '../shopify/client'
import { GET_COLLECTIONS, GET_COLLECTION_BY_HANDLE } from '../shopify/queries'

export interface Collection {
  id: string
  title: string
  handle: string
  description: string
  image?: {
    url: string
    altText: string | null
  }
  products: {
    edges: Array<{
      node: {
        id: string
        title: string
        handle: string
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
            }
          }>
        }
      }
    }>
  }
}

export const collectionService = {
  // Get all collections
  async getCollections({ first = 20 }: { first?: number }): Promise<{ collections: { edges: Array<{ node: Collection }> } }> {
    const data = await shopifyFetch<{
      collections: {
        edges: Array<{ node: Collection }>
      }
    }>({
      query: GET_COLLECTIONS,
      variables: { first },
    })
    return data
  },

  // Get collection by handle
  async getCollectionByHandle(handle: string): Promise<{ collectionByHandle: Collection | null }> {
    const data = await shopifyFetch<{
      collectionByHandle: Collection | null
    }>({
      query: GET_COLLECTION_BY_HANDLE,
      variables: { handle },
    })
    return data
  },
}