'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CommerceBridgeLogo } from '@/components/CommerceBridgeLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });

      // For admin login, redirect to dashboard regardless of role
      // (Admin users can access dashboard, customers will be redirected by middleware if not authorized)
      window.location.href = '/admin/dashboard';
    } catch {
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-[90dvh] flex flex-col lg:flex-row bg-slate-50">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10">
            <CommerceBridgeLogo size={60} variant="full" />
          </div>

          {/* Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">Admin Login</h1>
              <p className="text-slate-600">Sign in to access your admin dashboard</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@commercebridge.com"
                    className="pl-12 h-12 border-slate-300 focus:border-slate-400 focus:ring-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                    Password
                  </Label>
                  <a href="#" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#2F354F' }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-12 h-12 border-slate-300 focus:border-slate-400 focus:ring-slate-200"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-white font-medium shadow-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#2F354F' }}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in to Admin Dashboard'
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-slate-200 space-y-4">
              <p className="text-center text-sm text-slate-600">
                Not an admin?{' '}
                <a href="/login" className="font-semibold hover:underline" style={{ color: '#2F354F' }}>
                  Customer Login
                </a>
              </p>
              <p className="text-center text-sm text-slate-500">
                Secured by enterprise-grade encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Admin/Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden" style={{ backgroundColor: '#2F354F' }}>
        {/* Top section gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2F354F] via-[#282D43] to-[#22273A]"></div>

        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full p-8 xl:p-16">
          <div className="w-full max-w-[1400px] text-center px-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur rounded-full border border-white/10 mb-8">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white/70 text-sm font-medium">Admin Portal v1.0</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              CommerceBridge
              <span className="block text-indigo-300">
                Admin Dashboard
              </span>
            </h2>
            <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
              Complete control over your e-commerce platform. Manage products, categories, users, and orders from one powerful admin interface.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              <div className="p-5 bg-white/5 backdrop-blur rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-white/50 text-sm">Products</div>
              </div>

              <div className="p-5 bg-white/5 backdrop-blur rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-white/50 text-sm">Categories</div>
              </div>

              <div className="p-5 bg-white/5 backdrop-blur rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-white/50 text-sm">Users</div>
              </div>

              <div className="p-5 bg-white/5 backdrop-blur rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-white/50 text-sm">Support</div>
              </div>
            </div>

            {/* Admin Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur rounded-lg border border-white/10">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm font-medium">Analytics Dashboard</span>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur rounded-lg border border-white/10">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm font-medium">Secure Platform</span>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur rounded-lg border border-white/10">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm font-medium">Lightning Fast</span>
              </div>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="w-full max-w-[1400px] px-8">
              <p className="text-white/30 text-sm text-center">
                © 2026 CommerceBridge. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
