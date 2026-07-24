'use client';

import { useState } from 'react';
import { Mail, Lock, User, AlertCircle, Store, Shirt, Laptop, Home as HomeIcon, Car, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      toast.success('Account created successfully! Redirecting...');

      // Check if user is admin, redirect accordingly
      // Admin levels: SuperAdmin=1, Admin=2, Customer=100
      const isAdmin = response.user.roles?.some((r: any) => r.level <= 2 && r.level !== 100);
      if (isAdmin) {
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1000);
      } else {
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-[90dvh] flex flex-col lg:flex-row">
      {/* Left Side - Register Form */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#2F354F' }}>
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">Store</span>
                <p className="text-sm text-slate-500 hidden sm:block">E-commerce Platform</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">Create Account</h1>
              <p className="text-slate-600">Join us to start shopping</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="pl-12 h-12 border-slate-300 focus:border-slate-400 focus:ring-slate-200"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="pl-12 h-12 border-slate-300 focus:border-slate-400 focus:ring-slate-200"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-12 h-12 border-slate-300 focus:border-slate-400 focus:ring-slate-200"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation" className="text-slate-700 font-medium text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-12 h-12 border-slate-300 focus:border-slate-400 focus:ring-slate-200"
                    required
                    disabled={loading}
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
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-slate-200 space-y-4">
              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <a href="/login" className="font-semibold hover:underline" style={{ color: '#2F354F' }}>
                  Sign in
                </a>
              </p>
              <p className="text-center text-sm text-slate-500">
                Secured by enterprise-grade encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Brand/Product Showcase */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden" style={{ backgroundColor: '#22273A' }}>
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
              <span className="text-white/70 text-sm font-medium">Customer Portal v1.0</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Shop from Our
              <span className="block text-indigo-300">
                Multi-Category Store
              </span>
            </h2>
            <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
              Discover amazing products across electronics, fashion, home goods, automotive & more. Join thousands of satisfied customers.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              <div className="group p-5 bg-white/5 backdrop-blur rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-blue-400/10 rounded-xl">
                    <Laptop className="w-6 h-6 text-blue-300" />
                  </div>
                  <span className="text-white font-semibold">Electronics</span>
                </div>
                <p className="text-white/50 text-sm">Latest gadgets</p>
              </div>

              <div className="group p-5 bg-white/5 backdrop-blur rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-pink-400/10 rounded-xl">
                    <Shirt className="w-6 h-6 text-pink-300" />
                  </div>
                  <span className="text-white font-semibold">Fashion</span>
                </div>
                <p className="text-white/50 text-sm">Trending styles</p>
              </div>

              <div className="group p-5 bg-white/5 backdrop-blur rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-emerald-400/10 rounded-xl">
                    <HomeIcon className="w-6 h-6 text-emerald-300" />
                  </div>
                  <span className="text-white font-semibold">Home & Living</span>
                </div>
                <p className="text-white/50 text-sm">Comfort & decor</p>
              </div>

              <div className="group p-5 bg-white/5 backdrop-blur rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-orange-400/10 rounded-xl">
                    <Car className="w-6 h-6 text-orange-300" />
                  </div>
                  <span className="text-white font-semibold">Automotive</span>
                </div>
                <p className="text-white/50 text-sm">Parts & accessories</p>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-8 justify-center">
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="w-full max-w-[1400px] px-8">
              <p className="text-white/30 text-sm text-center">
                © 2026 Store. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
