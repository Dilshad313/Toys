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

  // Try both URLs
  const urls = [
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL,
    `https://${domain}/api/${version}/graphql.json`,
    `https://${domain}/cdn/shopifycloud/headless/v1/graphql`,
  ].filter(Boolean)

  if (!domain || !token) {
    console.error('❌ Missing credentials:', { hasDomain: !!domain, hasToken: !!token })
    throw new Error('Shopify credentials missing. Check .env.local')
  }

  // Prevent users from accidentally using an Admin API Token (starts with shpat_) 
  // for the Headless Storefront API.
  if (token.startsWith('shpat_')) {
    const errorMsg = '❌ Invalid Token: You provided a Shopify Admin API token (shpat_) instead of a Storefront Access Token. Please generate a Storefront API token via the Headless channel in your Shopify admin.'
    console.error(errorMsg)
    throw new Error(errorMsg)
  }

  console.log('🔗 Trying URLs:', urls)

  let lastError: Error | null = null

  for (const url of urls) {
    try {
      console.log(`🔄 Trying: ${url}`)

      const response = await fetch(url as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({ query, variables }),
        cache,
      })

      const responseText = await response.text()
      
      if (!response.ok) {
        console.error(`❌ HTTP ${response.status}:`, responseText.substring(0, 200))
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ Parse error:', parseError)
        throw new Error('Invalid JSON response from Shopify')
      }

      if (data.errors) {
        console.error('❌ GraphQL Errors:', data.errors)
        throw new Error(data.errors[0]?.message || 'GraphQL error')
      }

      console.log(`✅ Success with URL: ${url}`)
      return data.data
    } catch (error: any) {
      console.warn(`❌ Failed with ${url}:`, error.message)
      lastError = error
    }
  }

  throw lastError || new Error('All Shopify endpoints failed')
}