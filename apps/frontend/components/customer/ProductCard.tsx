import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/api/products';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = product.primaryImage?.url || product.images?.[0]?.url || '/placeholder-product.jpg';
  const imageAlt = product.primaryImage?.alt || product.images?.[0]?.alt || product.name || 'Product image';

  const isOutOfStock = product.track_quantity && product.quantity <= 0;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-black px-3 py-1 rounded-md font-medium">
                Out of Stock
              </span>
            </div>
          )}
          {product.compare_price && product.compare_price > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              Save {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.category && (
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {product.category.name}
          </Link>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold">
            ${product.price.toFixed(2)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compare_price.toFixed(2)}
            </span>
          )}
        </div>

        {product.track_quantity && !isOutOfStock && product.quantity <= 10 && (
          <p className="text-sm text-orange-600 mt-1">
            Only {product.quantity} left in stock!
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full"
          disabled={isOutOfStock}
        >
          <Link href={`/products/${product.id}`}>
            {isOutOfStock ? 'Out of Stock' : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
