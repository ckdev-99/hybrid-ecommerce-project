import Link from 'next/link';
import Image from 'next/image';
import { categoriesApi } from '@/lib/api';
import type { Category } from '@/lib/api/categories';

export default async function CategoriesPage() {
  const categories = await categoriesApi.index({ is_active: true }).catch(() => []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Categories</h1>
        <p className="text-muted-foreground">
          Explore our wide range of categories
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No categories available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <span className="text-4xl font-bold text-primary/50">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-white/80 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  {category.products_count !== undefined && (
                    <p className="text-sm text-white/60 mt-2">
                      {category.products_count} {category.products_count === 1 ? 'product' : 'products'}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
