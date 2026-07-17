'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { usersApi, User, UserFormData } from '@/lib/api';
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
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Shield,
  Mail,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    is_active: undefined,
    roles: [],
  });

  // Check if user is SuperAdmin
  const isSuperAdmin = user?.roles?.some((r) => r.name === 'SuperAdmin');

  // Fetch users on mount
  useEffect(() => {
    if (!isSuperAdmin) {
      router.push('/admin/dashboard');
      return;
    }
    fetchUsers();
  }, [isSuperAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll();
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      is_active: undefined,
      roles: [],
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await usersApi.create(formData);
      toast.success('User created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create user')
        : 'Failed to create user';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubmitting(true);

    try {
      await usersApi.update(selectedUser.id, formData);
      toast.success('User updated successfully');
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      resetForm();
      fetchUsers();
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update user')
        : 'Failed to update user';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setSubmitting(true);

    try {
      await usersApi.delete(selectedUser.id);
      toast.success('User deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete user')
        : 'Failed to delete user';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await usersApi.toggleActive(user.id, !user.is_active);
      toast.success(`User ${!user.is_active ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update user status')
        : 'Failed to update user status';
      toast.error(message);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      is_active: user.is_active,
      roles: user.roles?.map((r) => r.id) || [],
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      roles: user.roles?.map((r) => r.id) || [],
    }));
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRoles = async () => {
    if (!selectedUser) return;

    setSubmitting(true);

    try {
      await usersApi.updateRoles(selectedUser.id, formData.roles || []);
      toast.success('User roles updated successfully');
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update user roles')
        : 'Failed to update user roles';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Get user's primary role
  const getPrimaryRole = (user: User) => {
    if (!user.roles || user.roles.length === 0) return 'No Role';
    // Sort by level (highest first) and return the top one
    const sortedRoles = [...user.roles].sort((a, b) => b.level - a.level);
    return sortedRoles[0].name;
  };

  // Get role badge color
  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'SuperAdmin':
        return 'bg-purple-100 text-purple-700';
      case 'Admin':
        return 'bg-blue-100 text-blue-700';
      case 'Customer':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  // Get role icon
  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'SuperAdmin':
        return <ShieldCheck className="w-4 h-4" />;
      case 'Admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <ShieldAlert className="w-4 h-4" />;
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isSuperAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
            <p className="text-sm text-slate-600">Manage user accounts and permissions</p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the system</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Full Name *</Label>
                  <Input
                    id="create-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="create-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., john@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-password">Password *</Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-phone">Phone</Label>
                  <Input
                    id="create-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-active">Status</Label>
                  <Select
                    value={formData.is_active === true ? 'true' : formData.is_active === false ? 'false' : undefined}
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
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
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
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">
                {searchTerm ? 'No users found matching your search.' : 'No users yet.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4 gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First User
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((userItem) => (
                    <TableRow key={userItem.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                            {userItem.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{userItem.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{userItem.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(
                            getPrimaryRole(userItem)
                          )}`}
                        >
                          {getRoleIcon(getPrimaryRole(userItem))}
                          {getPrimaryRole(userItem)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            userItem.is_active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {userItem.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {new Date(userItem.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditDialog(userItem)}
                            className="text-slate-600 hover:text-slate-900"
                            title="Edit user"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openRoleDialog(userItem)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Manage roles"
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleToggleActive(userItem)}
                            className={
                              userItem.is_active
                                ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }
                            title={userItem.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {userItem.is_active ? (
                              <ShieldAlert className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openDeleteDialog(userItem)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete user"
                            disabled={userItem.id === user?.id}
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
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedUser(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Role Management Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
              Assign roles to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Select Roles</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="role-admin"
                    checked={formData.roles?.includes(1)}
                    onChange={(e) => {
                      const roles = formData.roles || [];
                      if (e.target.checked) {
                        setFormData({ ...formData, roles: [...roles, 1] });
                      } else {
                        setFormData({ ...formData, roles: roles.filter((r) => r !== 1) });
                      }
                    }}
                  />
                  <label htmlFor="role-admin" className="text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="role-superadmin"
                    checked={formData.roles?.includes(2)}
                    onChange={(e) => {
                      const roles = formData.roles || [];
                      if (e.target.checked) {
                        setFormData({ ...formData, roles: [...roles, 2] });
                      } else {
                        setFormData({ ...formData, roles: roles.filter((r) => r !== 2) });
                      }
                    }}
                  />
                  <label htmlFor="role-superadmin" className="text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                      <ShieldCheck className="w-3 h-3" />
                      SuperAdmin
                    </span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="role-customer"
                    checked={formData.roles?.includes(3)}
                    onChange={(e) => {
                      const roles = formData.roles || [];
                      if (e.target.checked) {
                        setFormData({ ...formData, roles: [...roles, 3] });
                      } else {
                        setFormData({ ...formData, roles: roles.filter((r) => r !== 3) });
                      }
                    }}
                  />
                  <label htmlFor="role-customer" className="text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                      <ShieldAlert className="w-3 h-3" />
                      Customer
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Users can have multiple roles. The highest level role determines primary permissions.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsRoleDialogOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRoles}
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Roles'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedUser?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting || selectedUser?.id === user?.id}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
