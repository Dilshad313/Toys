// Storefront API Client (Frontend)
export const shopifyFetch = async <T = any>({
  query,
  variables = {},
  cache = 'no-store',
}: {
  query: string
  variables?: Record<string, any>
  cache?: RequestCache
}): Promise<T> => {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
  const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-07'

  if (!domain || !token) {
    throw new Error('Shopify Storefront credentials missing. Check .env.local')
  }

  const url = `https://${domain}/api/${version}/graphql.json`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('❌ Shopify API Error:', text)
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.errors) {
      console.error('❌ GraphQL Errors:', data.errors)
      throw new Error(data.errors[0]?.message || 'Shopify GraphQL error')
    }

    return data.data
  } catch (error: any) {
    console.error('❌ Shopify fetch error:', error)
    throw error
  }
}

// ✅ Admin API Client (Backend Only)
export const shopifyAdminFetch = async <T = any>({
  query,
  variables = {},
}: {
  query: string
  variables?: Record<string, any>
}): Promise<T> => {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN
  const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-07'

  if (!domain || !token) {
    console.warn('⚠️ Shopify Admin API credentials missing. Using demo data.')
    // Return empty data for demo
    return { orders: { edges: [] } } as T
  }

  const url = `https://${domain}/admin/api/${version}/graphql.json`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('❌ Admin API Error:', text)
      throw new Error(`Admin API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.errors) {
      console.error('❌ Admin GraphQL Errors:', data.errors)
      throw new Error(data.errors[0]?.message || 'Admin GraphQL error')
    }

    return data.data
  } catch (error: any) {
    console.error('❌ Admin fetch error:', error)
    throw error
  }
}