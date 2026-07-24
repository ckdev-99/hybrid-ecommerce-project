'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/lib/api/categories';

interface ProductsFilterProps {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}

export function ProductsFilter({ categories, currentParams }: ProductsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  const hasActiveFilters = Object.values(currentParams).some(
    (v) => v !== undefined && v !== ''
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={currentParams.category_id || 'all'}
          onValueChange={(value) => updateFilter('category_id', value === 'all' ? undefined : value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Min"
              value={currentParams.min_price || ''}
              onChange={(e) => updateFilter('min_price', e.target.value || undefined)}
            />
          </div>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Max"
              value={currentParams.max_price || ''}
              onChange={(e) => updateFilter('max_price', e.target.value || undefined)}
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label htmlFor="sort">Sort by</Label>
        <Select
          value={`${currentParams.sort_by || 'created_at'}-${currentParams.sort_order || 'desc'}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            updateFilter('sort_by', sortBy);
            updateFilter('sort_order', sortOrder);
          }}
        >
          <SelectTrigger id="sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-desc">Newest first</SelectItem>
            <SelectItem value="created_at-asc">Oldest first</SelectItem>
            <SelectItem value="price-asc">Price: Low to high</SelectItem>
            <SelectItem value="price-desc">Price: High to low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* In Stock Filter */}
      <div className="space-y-2">
        <Label htmlFor="stock">Availability</Label>
        <Select
          value={currentParams.in_stock || 'all'}
          onValueChange={(value) => updateFilter('in_stock', value === 'all' ? undefined : value)}
        >
          <SelectTrigger id="stock">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">In Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
