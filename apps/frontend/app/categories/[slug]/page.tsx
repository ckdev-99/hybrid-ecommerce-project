import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ProductGrid } from '@/components/customer/ProductCard';
import { categoriesApi, productsApi } from '@/lib/api';
import type { Category } from '@/lib/api/categories';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sort_by?: string;
    sort_order?: string;
  };
}

// Find category by slug across all categories
function findCategoryBySlug(categories: Category[], slug: string): Category | null {
  for (const category of categories) {
    if (category.slug === slug) {
      return category;
    }
    if (category.children) {
      const found = findCategoryBySlug(category.children, slug);
      if (found) return found;
    }
  }
  return null;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Next.js 16: params is a Promise and must be awaited
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Fetch all categories as tree to find by slug
  let categoryTree: Category[];
  try {
    categoryTree = await categoriesApi.tree();
  } catch (error) {
    console.error('[CategoryPage] Failed to fetch category tree:', error);
    // Return a proper error page instead of silent 404
    throw new Error('Failed to load categories. Please try again later.');
  }

  const category = findCategoryBySlug(categoryTree, slug);

  if (!category) {
    console.log(`[CategoryPage] Category not found: ${slug}`);
    console.log('[CategoryPage] Available slugs:', categoryTree.flatMap(c => [c.slug, ...(c.children?.map(ch => ch.slug) || [])]));
    notFound();
  }

  if (!category.is_active) {
    console.log(`[CategoryPage] Category is inactive: ${slug}`);
    notFound();
  }

  // Fetch products in this category
  let productsData;
  try {
    productsData = await productsApi.getAll({
      category_id: category.id,
      is_active: true,
      sort_by: resolvedSearchParams.sort_by || 'created_at',
      sort_order: resolvedSearchParams.sort_order || 'desc',
    });
  } catch (error) {
    console.error('[CategoryPage] Failed to fetch products:', error);
    // Continue with empty products if fetch fails
    productsData = { products: [] };
  }

  // Fetch subcategories if any
  const subcategories = category.children?.filter((c: Category) => c.is_active) || [];

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
            <Link href="/categories" className="hover:text-foreground">
              Categories
            </Link>
          </li>
          {category.parent && (
            <>
              <li>/</li>
              <li>
                <Link href={`/categories/${category.parent.slug}`} className="hover:text-foreground">
                  {category.parent.name}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-foreground">{category.name}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        {category.image_url && (
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
            </div>
          </div>
        )}
        {!category.image_url && (
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
        )}
        {category.description && (
          <p className="text-muted-foreground text-lg">{category.description}</p>
        )}
      </div>

      {/* Subcategories */}
      <section className="mb-12">
        {/* Debug: Show count always */}
        <h2 className="text-xl font-semibold mb-4">{subcategories.length} Subcategories</h2>
        {subcategories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subcategories.map((subcategory: Category) => (
              <Link
                key={subcategory.id}
                href={`/categories/${subcategory.slug}`}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  {subcategory.image_url ? (
                    <Image
                      src={subcategory.image_url}
                      alt={subcategory.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 100px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <span className="text-2xl font-bold text-primary/50">
                        {subcategory.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-medium text-white">
                      {subcategory.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {productsData.products.length} {productsData.products.length === 1 ? 'Product' : 'Products'}
          </h2>
          <div className="flex gap-2">
            <Link
              href={`/categories/${category.slug}?sort_by=price&sort_order=asc`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              Price: Low to High
            </Link>
            <Link
              href={`/categories/${category.slug}?sort_by=price&sort_order=desc`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              Price: High to Low
            </Link>
            <Link
              href={`/categories/${category.slug}?sort_by=created_at&sort_order=desc`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              Newest
            </Link>
          </div>
        </div>

        <ProductGrid products={productsData.products} />
      </section>
    </div>
  );
}
