import { productService } from '@/lib/services/productService'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import AddToCartButton from '../../../components/product/AddToCartButton'

interface ProductPageProps {
  params: {
    handle: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const { productByHandle } = await productService.getProductByHandle(handle)

  if (!productByHandle) {
    notFound()
  }

  const product = productByHandle
  const firstVariant = product.variants.edges[0]?.node
  const price = firstVariant?.price.amount || '0'
  const compareAtPrice = firstVariant?.compareAtPrice?.amount || null
  const image = product.images.edges[0]?.node.url || '/placeholder.jpg'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <img
            src={image}
            alt={product.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-[#FF6B35]">₹{price}</span>
            {compareAtPrice && (
              <span className="text-gray-400 line-through text-xl">₹{compareAtPrice}</span>
            )}
          </div>

          <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '' }} />

          {/* Variants */}
          {product.variants.edges.length > 1 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Options</h3>
              <div className="flex gap-2">
                {product.variants.edges.map(({ node }) => (
                  <button
                    key={node.id}
                    className="px-4 py-2 border rounded-lg hover:border-[#FF6B35] transition"
                  >
                    {node.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton variantId={firstVariant?.id || ''} />
        </div>
      </div>
    </div>
  )
}