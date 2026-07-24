import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ProductGrid } from '@/components/customer/ProductCard';
import { categoriesApi, productsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

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
function findCategoryBySlug(categories: any[], slug: string): any {
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
  // Fetch all categories as tree to find by slug
  const categoryTree = await categoriesApi.tree().catch(() => []);
  const category = findCategoryBySlug(categoryTree, params.slug);

  if (!category || !category.is_active) {
    notFound();
  }

  // Fetch products in this category
  const productsData = await productsApi
    .getAll({
      category_id: category.id,
      is_active: true,
      sort_by: searchParams.sort_by || 'created_at',
      sort_order: searchParams.sort_order || 'desc',
    })
    .catch(() => ({ products: [] }));

  // Fetch subcategories if any
  const subcategories = category.children?.filter((c: any) => c.is_active) || [];

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
      {subcategories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subcategories.map((subcategory: any) => (
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
        </section>
      )}

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {productsData.products.length} {productsData.products.length === 1 ? 'Product' : 'Products'}
          </h2>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/categories/${category.slug}?sort_by=price&sort_order=asc`}>
                Price: Low to High
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/categories/${category.slug}?sort_by=price&sort_order=desc`}>
                Price: High to Low
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/categories/${category.slug}?sort_by=created_at&sort_order=desc`}>
                Newest
              </Link>
            </Button>
          </div>
        </div>

        <ProductGrid products={productsData.products} />
      </section>
    </div>
  );
}
