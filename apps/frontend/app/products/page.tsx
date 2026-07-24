import { Suspense } from 'react';
import { ProductGrid } from '@/components/customer/ProductCard';
import { productsApi, categoriesApi } from '@/lib/api';
import type { Category } from '@/lib/api/categories';
import { ProductsFilter } from '@/components/customer/ProductsFilter';

interface ProductsPageProps {
  searchParams: {
    category_id?: string;
    search?: string;
    min_price?: string;
    max_price?: string;
    sort_by?: string;
    sort_order?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = {
    category_id: searchParams.category_id ? Number(searchParams.category_id) : undefined,
    search: searchParams.search,
    min_price: searchParams.min_price ? Number(searchParams.min_price) : undefined,
    max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
    sort_by: searchParams.sort_by || 'created_at',
    sort_order: searchParams.sort_order || 'desc',
    is_active: true,
  };

  const [products, categories] = await Promise.all([
    productsApi.getAll(params).catch(() => ({ products: [] })),
    categoriesApi.index({ is_active: true }).catch(() => []),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">
          {products.products.length} {products.products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductsFilter categories={categories} currentParams={searchParams} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <Suspense fallback={<ProductGrid products={[]} loading />}>
            <ProductGrid products={products.products} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
