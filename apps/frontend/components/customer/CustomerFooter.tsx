import Link from 'next/link';
import { CommerceBridgeLogo } from '@/components/CommerceBridgeLogo';
import { Mail, Phone, MapPin } from 'lucide-react';

export function CustomerFooter() {
  return (
    <footer className="border-t border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <CommerceBridgeLogo size={32} variant="horizontal" />
            <p className="text-sm text-white/60">
              Your favorite online store for amazing products across electronics, fashion, home & more.
            </p>

            {/* Contact */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4" />
                <span>support@commercebridge.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-white/60 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-white/60 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-white/60 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-white/60 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="text-white/60 hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/profile/orders" className="text-white/60 hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/profile/addresses" className="text-white/60 hover:text-white transition-colors">
                  Addresses
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/60 hover:text-white transition-colors">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-white/60 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/60 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} CommerceBridge. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Designed with ❤️ for modern commerce</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
