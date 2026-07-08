'use client';

import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  FolderTree,
  Users,
  TrendingUp,
  Clock,
  Activity,
  ArrowRight,
  Store,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // TODO: Fetch actual counts from API
  const stats = [
    {
      title: 'Total Products',
      value: '0',
      change: '+0%',
      icon: Package,
      color: 'blue',
      href: '/admin/products',
    },
    {
      title: 'Categories',
      value: '0',
      change: '+0%',
      icon: FolderTree,
      color: 'emerald',
      href: '/admin/categories',
    },
    {
      title: 'Total Users',
      value: '0',
      change: '+0%',
      icon: Users,
      color: 'violet',
      href: '/admin/users',
      superAdminOnly: true,
    },
  ];

  const recentActivity = [
    { action: 'System initialized', time: 'Just now', type: 'info' },
    { action: 'Admin panel setup completed', time: 'Just now', type: 'success' },
  ];

  const quickActions = [
    { title: 'Add Product', href: '/admin/products/new', icon: Package, color: 'blue' },
    { title: 'Add Category', href: '/admin/categories/new', icon: FolderTree, color: 'emerald' },
    { title: 'Manage Users', href: '/admin/users', icon: Users, color: 'violet' },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      border: 'border-indigo-200',
      hoverBg: 'hover:bg-indigo-50',
      hoverBorder: 'hover:border-indigo-300',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      border: 'border-emerald-200',
      hoverBg: 'hover:bg-emerald-50',
      hoverBorder: 'hover:border-emerald-300',
    },
    violet: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100',
      border: 'border-purple-200',
      hoverBg: 'hover:bg-purple-50',
      hoverBorder: 'hover:border-purple-300',
    },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Store className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-600 text-sm">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats
          .filter(stat => !stat.superAdminOnly || user?.roles?.some(r => r.name === 'SuperAdmin'))
          .map((stat) => {
            const Icon = stat.icon;
            const colors = colorClasses[stat.color as keyof typeof colorClasses];

            return (
              <a
                key={stat.title}
                href={stat.href}
                className="group"
              >
                <Card className={`transition-all duration-200 hover:shadow-lg ${colors.hoverBorder}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`text-sm font-medium ${colors.text}`}>
                            {stat.change}
                          </span>
                          <span className="text-xs text-slate-500">from last month</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${colors.iconBg} ${colors.border} border`}>
                        <Icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 mt-4 text-sm ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <span>View details</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions
              .filter(action => action.title !== 'Manage Users' || user?.roles?.some(r => r.name === 'SuperAdmin'))
              .map((action) => {
                const Icon = action.icon;
                const colors = colorClasses[action.color as keyof typeof colorClasses];

                return (
                  <a
                    key={action.title}
                    href={action.href}
                    className={`flex items-center gap-4 p-4 rounded-lg border border-slate-200 ${colors.hoverBorder} ${colors.hoverBg} transition-colors group`}
                  >
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 font-medium text-slate-700">{action.title}</div>
                    <ArrowRight className={`h-5 w-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </a>
                );
              })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Card */}
      <Card className="border-0 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #2F354F 0%, #282D43 50%, #22273A 100%)' }}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
              <p className="text-white/70 mb-4 max-w-2xl">
                Welcome to your admin panel! Start by creating categories to organize your products,
                then add your products to begin selling.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/admin/categories"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#22273A] rounded-lg font-medium hover:bg-white/90 transition-colors"
                >
                  <FolderTree className="h-4 w-4" />
                  Create Categories
                </a>
                <a
                  href="/admin/products"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Add Products
                </a>
              </div>
            </div>
            <TrendingUp className="h-16 w-16 text-white/20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
