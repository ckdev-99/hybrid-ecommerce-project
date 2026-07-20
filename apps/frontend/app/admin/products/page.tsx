'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, categoriesApi, Product, ProductFormData } from '@/lib/api';
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
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  DollarSign,
  Box,
} from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    compare_price: 0,
    cost_price: 0,
    sku: '',
    barcode: '',
    track_quantity: undefined,
    quantity: 0,
    weight: 0,
    width: 0,
    height: 0,
    depth: 0,
    is_virtual: undefined,
    is_active: undefined,
    category_id: undefined,
    brand_id: undefined,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll();
      const productsData = Array.isArray(response.products) ? response.products : [];
      setProducts(productsData);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await productsApi.getCategoriesList();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 0,
      compare_price: 0,
      cost_price: 0,
      sku: '',
      barcode: '',
      track_quantity: undefined,
      quantity: 0,
      weight: 0,
      width: 0,
      height: 0,
      depth: 0,
      is_virtual: undefined,
      is_active: undefined,
      category_id: undefined,
      brand_id: undefined,
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name?.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Price is required and must be greater than 0');
      return;
    }
    if (!formData.sku?.trim()) {
      toast.error('SKU is required');
      return;
    }

    setSubmitting(true);

    try {
      await productsApi.create(formData);
      toast.success('Product created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create product')
        : 'Failed to create product';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Validate required fields
    if (!formData.name?.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Price is required and must be greater than 0');
      return;
    }
    if (!formData.sku?.trim()) {
      toast.error('SKU is required');
      return;
    }

    setSubmitting(true);

    try {
      await productsApi.update(selectedProduct.id, formData);
      toast.success('Product updated successfully');
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      fetchProducts();
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update product')
        : 'Failed to update product';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    setSubmitting(true);

    try {
      await productsApi.delete(selectedProduct.id);
      toast.success('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete product')
        : 'Failed to delete product';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      compare_price: product.compare_price || 0,
      cost_price: product.cost_price || 0,
      sku: product.sku,
      barcode: product.barcode || '',
      track_quantity: product.track_quantity,
      quantity: product.quantity,
      weight: product.weight || 0,
      width: product.width || 0,
      height: product.height || 0,
      depth: product.depth || 0,
      is_virtual: product.is_virtual,
      is_active: product.is_active,
      category_id: product.category_id,
      brand_id: product.brand_id,
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      meta_keywords: product.meta_keywords || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <p className="text-sm text-slate-600">Manage your product inventory</p>
          </div>      
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>Add a new product to your inventory</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="grid gap-4 py-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <Label htmlFor="create-name">Product Name *</Label>
                  <Input
                    id="create-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-sku">SKU *</Label>
                    <Input
                      id="create-sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g., WH-001"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-category">Category</Label>
                    <Select
                      value={formData.category_id ? String(formData.category_id) : ''}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category_id: value ? parseInt(value) : undefined })
                      }
                    >
                      <SelectTrigger id="create-category">
                        <SelectValue placeholder="Select category">
                          {formData.category_id
                            ? categories.find((c) => c.id === formData.category_id)?.name || 'Select category'
                            : 'Select category'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No category</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Input
                    id="create-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-price">Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="create-price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-compare">Compare Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="create-compare"
                        type="number"
                        step="0.01"
                        value={formData.compare_price}
                        onChange={(e) =>
                          setFormData({ ...formData, compare_price: parseFloat(e.target.value) || 0 })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-cost">Cost Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="create-cost"
                        type="number"
                        step="0.01"
                        value={formData.cost_price}
                        onChange={(e) =>
                          setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-quantity">Quantity</Label>
                    <div className="relative">
                      <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="create-quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-track">Track Quantity</Label>
                    <Select
                      value={formData.track_quantity === true ? 'true' : formData.track_quantity === false ? 'false' : ''}
                      onValueChange={(value) =>
                        setFormData({ ...formData, track_quantity: value === 'true' ? true : value === 'false' ? false : undefined })
                      }
                    >
                      <SelectTrigger id="create-track">
                        <SelectValue placeholder="Select">
                          {formData.track_quantity === true ? 'Yes' : formData.track_quantity === false ? 'No' : 'Select'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Shipping */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-weight">Weight (kg)</Label>
                    <Input
                      id="create-weight"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-width">Width (cm)</Label>
                    <Input
                      id="create-width"
                      type="number"
                      step="0.01"
                      value={formData.width}
                      onChange={(e) =>
                        setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-height">Height (cm)</Label>
                    <Input
                      id="create-height"
                      type="number"
                      step="0.01"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-virtual">Virtual Product</Label>
                    <Select
                      value={formData.is_virtual === true ? 'true' : formData.is_virtual === false ? 'false' : ''}
                      onValueChange={(value) =>
                        setFormData({ ...formData, is_virtual: value === 'true' ? true : value === 'false' ? false : undefined })
                      }
                    >
                      <SelectTrigger id="create-virtual">
                        <SelectValue placeholder="Select">
                          {formData.is_virtual === true ? 'Yes (Digital)' : formData.is_virtual === false ? 'No (Physical)' : 'Select'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No (Physical)</SelectItem>
                        <SelectItem value="true">Yes (Digital)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-active">Status</Label>
                    <Select
                      value={formData.is_active === true ? 'true' : formData.is_active === false ? 'false' : ''}
                      onValueChange={(value) =>
                        setFormData({ ...formData, is_active: value === 'true' ? true : value === 'false' ? false : undefined })
                      }
                    >
                      <SelectTrigger id="create-active">
                        <SelectValue placeholder="Select">
                          {formData.is_active === true ? 'Active' : formData.is_active === false ? 'Inactive' : 'Select'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Product'
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
              placeholder="Search products by name, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">
                {searchTerm ? 'No products found matching your search.' : 'No products yet.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4 gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.is_virtual && (
                            <span className="text-xs text-slate-500">Virtual</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{product.sku}</TableCell>
                      <TableCell>
                        {product.category ? (
                          <span className="text-slate-600">{product.category.name}</span>
                        ) : (
                          <span className="text-slate-400">No category</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${product.price.toFixed(2)}</span>
                          {product.compare_price && product.compare_price > product.price && (
                            <span className="text-sm text-slate-500 line-through">
                              ${product.compare_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={product.track_quantity && product.quantity <= 5 ? 'text-red-600 font-medium' : 'text-slate-600'}>
                            {product.track_quantity ? product.quantity : '—'}
                          </span>
                          {product.track_quantity && product.quantity <= 5 && (
                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                              Low
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.is_active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditDialog(product)}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openDeleteDialog(product)}
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU *</Label>
                  <Input
                    id="edit-sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category_id?.toString() || ''}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category_id: parseInt(value) || undefined })
                    }
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category">
                        {formData.category_id
                          ? categories.find((c) => c.id === formData.category_id)?.name || 'Select category'
                          : 'Select category'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No category</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-compare">Compare Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="edit-compare"
                      type="number"
                      step="0.01"
                      value={formData.compare_price}
                      onChange={(e) =>
                        setFormData({ ...formData, compare_price: parseFloat(e.target.value) || 0 })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Cost Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="edit-cost"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) =>
                        setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <div className="relative">
                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="edit-quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-track">Track Quantity</Label>
                  <Select
                    value={formData.track_quantity === true ? 'true' : formData.track_quantity === false ? 'false' : undefined}
                    onValueChange={(value) =>
                      setFormData({ ...formData, track_quantity: value === 'true' ? true : value === 'false' ? false : undefined })
                    }
                  >
                    <SelectTrigger id="edit-track">
                      <SelectValue placeholder="Select">
                        {formData.track_quantity === true ? 'Yes' : formData.track_quantity === false ? 'No' : 'Select'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Shipping */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-weight">Weight (kg)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-width">Width (cm)</Label>
                  <Input
                    id="edit-width"
                    type="number"
                    step="0.01"
                    value={formData.width}
                    onChange={(e) =>
                      setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-height">Height (cm)</Label>
                  <Input
                    id="edit-height"
                    type="number"
                    step="0.01"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-virtual">Virtual Product</Label>
                  <Select
                    value={formData.is_virtual === true ? 'true' : formData.is_virtual === false ? 'false' : undefined}
                    onValueChange={(value) =>
                      setFormData({ ...formData, is_virtual: value === 'true' ? true : value === 'false' ? false : undefined })
                    }
                  >
                    <SelectTrigger id="edit-virtual">
                      <SelectValue placeholder="Select">
                        {formData.is_virtual === true ? 'Yes (Digital)' : formData.is_virtual === false ? 'No (Physical)' : 'Select'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No (Physical)</SelectItem>
                      <SelectItem value="true">Yes (Digital)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-active">Status</Label>
                  <Select
                    value={formData.is_active === true ? 'true' : formData.is_active === false ? 'false' : undefined}
                    onValueChange={(value) =>
                      setFormData({ ...formData, is_active: value === 'true' ? true : value === 'false' ? false : undefined })
                    }
                  >
                    <SelectTrigger id="edit-active">
                      <SelectValue placeholder="Select">
                        {formData.is_active === true ? 'Active' : formData.is_active === false ? 'Inactive' : 'Select'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedProduct(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Product'
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
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedProduct(null);
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
                'Delete Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
