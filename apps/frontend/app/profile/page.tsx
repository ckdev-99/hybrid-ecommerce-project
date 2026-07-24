'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  ArrowRight,
  ShoppingBag,
  Map,
  LogOut,
} from 'lucide-react';
import { authApi } from '@/lib/api/auth';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = '/login';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.name?.split(' ')[0] || ''}
                    placeholder="Your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  placeholder="your@email.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <Button className="w-full sm:w-auto">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Account Type</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.roles?.map((r: any) => r.name).join(', ') || 'Customer'}
                  </p>
                </div>
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Account Status</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push('/profile/orders')}
              >
                <ShoppingBag className="h-4 w-4 mr-3" />
                My Orders
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push('/profile/addresses')}
              >
                <MapPin className="h-4 w-4 mr-3" />
                Addresses
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              {(user?.roles?.some((r: any) => r.level <= 2 && r.level !== 100) ?? false) && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/admin/dashboard')}
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Admin Dashboard
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="ghost"
                className="w-full text-destructive hover:bg-destructive/10"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
