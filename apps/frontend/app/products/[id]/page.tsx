import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { productsApi } from '@/lib/api';
import { ProductCard } from '@/components/customer/ProductCard';
import { Separator } from '@/components/ui/separator';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await productsApi.getById(productId).catch(() => null);

  if (!product || !product.is_active) {
    notFound();
  }

  // Fetch related products from the same category
  const relatedProducts = product.category_id
    ? await productsApi
        .getAll({ category_id: product.category_id, is_active: true, per_page: 4 })
        .then((data) => data.products.filter((p) => p.id !== product.id))
        .catch(() => [])
    : [];

  const imageUrl = product.primaryImage?.url || product.images?.[0]?.url || '/placeholder-product.jpg';
  const imageAlt = product.primaryImage?.alt || product.images?.[0]?.alt || product.name || 'Product image';

  const isOutOfStock = product.track_quantity && product.quantity <= 0;
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
          </li>
          {product.category && (
            <>
              <li>/</li>
              <li>
                <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-black px-4 py-2 rounded-md font-medium text-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Additional Images Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.sku && (
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ${product.compare_price?.toFixed(2)}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          {product.track_quantity && (
            <div className="text-sm">
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Out of stock</span>
              ) : product.quantity <= 10 ? (
                <span className="text-orange-600">
                  Only {product.quantity} left in stock - order soon!
                </span>
              ) : (
                <span className="text-green-600">In stock</span>
              )}
            </div>
          )}

          <Separator />

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {product.description}
              </div>
            </div>
          )}

          {/* Category */}
          {product.category && (
            <div>
              <span className="text-sm text-muted-foreground">Category: </span>
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm font-medium hover:underline"
              >
                {product.category.name}
              </Link>
            </div>
          )}

          {/* Brand */}
          {product.brand && (
            <div>
              <span className="text-sm text-muted-foreground">Brand: </span>
              <Link
                href={`/brands/${product.brand.slug}`}
                className="text-sm font-medium hover:underline"
              >
                {product.brand.name}
              </Link>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button size="lg" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Wishlist
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Free shipping on orders over $50
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              30-day return policy
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Secure checkout
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              24/7 customer support
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
