'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categoriesApi, Category, CategoryFormData } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  ChevronRight,
} from 'lucide-react';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parent_id: undefined,
    position: 0,
    is_active: true,
    is_featured: false,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoriesApi.index();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error(error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const parentCategoriesData = await categoriesApi.parents();
      setParentCategories(parentCategoriesData);
    } catch (error) {
      console.error('Failed to load parent categories:', error);
      setParentCategories([]);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    fetchParentCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: undefined,
      position: 0,
      is_active: true,
      is_featured: false,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await categoriesApi.create(formData);
      toast.success('Category created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchCategories();
      fetchParentCategories();
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create category')
        : 'Failed to create category';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setSubmitting(true);

    try {
      await categoriesApi.update(selectedCategory.id, formData);
      toast.success('Category updated successfully');
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      resetForm();
      fetchCategories();
      fetchParentCategories();
    } catch (error: unknown) {
      toast.error(error.response?.data?.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setSubmitting(true);

    try {
      await categoriesApi.delete(selectedCategory.id);
      toast.success('Category deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      fetchCategories();
      fetchParentCategories();
    } catch (error: unknown) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id,
      position: category.position,
      is_active: category.is_active,
      is_featured: category.is_featured,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <FolderTree className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
            <p className="text-sm text-slate-600">Manage your product categories</p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your products
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Category Name *</Label>
                  <Input
                    id="create-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Electronics"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-slug">Slug</Label>
                  <Input
                    id="create-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., electronics"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Input
                    id="create-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Category description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-parent">Parent Category</Label>
                  <Select
                    value={formData.parent_id?.toString() || ''}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        parent_id: value ? parseInt(value) : undefined,
                      })
                    }
                  >
                    <SelectTrigger id="create-parent">
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No parent (Root category)</SelectItem>
                      {parentCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-position">Position</Label>
                    <Input
                      id="create-position"
                      type="number"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: parseInt(e.target.value) || 0 })
                      }
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-featured">Featured</Label>
                    <Select
                      value={formData.is_featured ? 'true' : 'false'}
                      onValueChange={(value) =>
                        setFormData({ ...formData, is_featured: value === 'true' })
                      }
                    >
                      <SelectTrigger id="create-featured">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-active">Status</Label>
                  <Select
                    value={formData.is_active ? 'true' : 'false'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, is_active: value === 'true' })
                    }
                  >
                    <SelectTrigger id="create-active">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Category'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">
                {searchTerm ? 'No categories found matching your search.' : 'No categories yet.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Category
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {category.children && category.children.length > 0 && (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                          <span>{category.name}</span>
                          {category.is_featured && (
                            <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{category.slug}</TableCell>
                      <TableCell>
                        {category.parent ? (
                          <span className="text-slate-600">{category.parent.name}</span>
                        ) : (
                          <span className="text-slate-400">Root</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{category.products_count || 0}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            category.is_active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">{category.position}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditDialog(category)}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openDeleteDialog(category)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Electronics"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., electronics"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-parent">Parent Category</Label>
                <Select
                  value={formData.parent_id?.toString() || ''}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      parent_id: value ? parseInt(value) : undefined,
                    })
                  }
                >
                  <SelectTrigger id="edit-parent">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No parent (Root category)</SelectItem>
                    {parentCategories
                      .filter((cat) => cat.id !== selectedCategory?.id)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Input
                    id="edit-position"
                    type="number"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-featured">Featured</Label>
                  <Select
                    value={formData.is_featured ? 'true' : 'false'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, is_featured: value === 'true' })
                    }
                  >
                    <SelectTrigger id="edit-featured">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-active">Status</Label>
                <Select
                  value={formData.is_active ? 'true' : 'false'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, is_active: value === 'true' })
                  }
                >
                  <SelectTrigger id="edit-active">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedCategory(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Category'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCategory(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Category'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
