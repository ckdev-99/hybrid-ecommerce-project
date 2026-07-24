'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/auth';
import { CommerceBridgeLogo } from '@/components/CommerceBridgeLogo';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/products', label: 'Products', icon: Package },
    ...(user?.roles?.some(r => r.name === 'SuperAdmin')
      ? [{ href: '/admin/users', label: 'Users', icon: Users }]
      : []),
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Using brand colors */}
      <header
        className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ backgroundColor: '#2F354F' }}
      >
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-white/80 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <div className="flex items-center gap-3">
                <CommerceBridgeLogo size={40} className="text-white" variant="horizontal" />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-white/80 hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/20">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-medium border border-white/30">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-white/70">{user?.roles?.[0]?.name}</p>
                </div>
              </div>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-white hover:text-white/80 hover:bg-white/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>

              {/* Mobile Logout */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="sm:hidden text-white hover:text-white/80 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Using brand colors for active state */}
        <aside
          className={`
            fixed lg:sticky inset-y-0 left-0 z-40
            w-64 bg-white border-r border-border/50
            transform transition-transform duration-200 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            top-[73px] lg:top-[73px] h-[calc(100vh-73px)]
          `}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${active
                      ? 'font-medium text-white'
                      : 'text-muted-foreground hover:bg-muted'
                    }
                  `}
                  style={active ? {
                    backgroundColor: '#2F354F',
                  } : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                </a>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground text-center">
              <p>Version 1.0.0</p>
              <p className="mt-1">© 2026 CommerceBridge. All rights reserved.</p>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-73px)] bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
