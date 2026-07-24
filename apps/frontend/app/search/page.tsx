import { ProductGrid } from '@/components/customer/ProductCard';
import { productsApi } from '@/lib/api';

interface SearchPageProps {
  searchParams: {
    q?: string;
    category_id?: string;
    min_price?: string;
    max_price?: string;
    sort_by?: string;
    sort_order?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  const params = {
    search: query,
    category_id: searchParams.category_id ? Number(searchParams.category_id) : undefined,
    min_price: searchParams.min_price ? Number(searchParams.min_price) : undefined,
    max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
    sort_by: searchParams.sort_by || 'created_at',
    sort_order: searchParams.sort_order || 'desc',
    is_active: true,
  };

  const productsData = await productsApi.getAll(params).catch(() => ({ products: [] }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {query ? `Search results for "${query}"` : 'All Products'}
        </h1>
        <p className="text-muted-foreground">
          {productsData.products.length} {productsData.products.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {/* No Results */}
      {productsData.products.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-4">
            {query
              ? `We couldn't find any products matching "${query}"`
              : 'Try adjusting your filters'
            }
          </p>
          <p className="text-sm text-muted-foreground">
            Suggestions:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Check your spelling</li>
            <li>• Try more general keywords</li>
            <li>• Try different keywords</li>
            <li>• Clear filters and try again</li>
          </ul>
        </div>
      )}

      {/* Results */}
      <ProductGrid products={productsData.products} />
    </div>
  );
}
