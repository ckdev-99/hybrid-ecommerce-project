'use client';

import { usePathname } from 'next/navigation';
import { CustomerHeader } from '@/components/customer/CustomerHeader';
import { CustomerFooter } from '@/components/customer/CustomerFooter';

/**
 * ConditionalLayout component
 *
 * Renders the header and footer only on customer/public pages.
 * Excludes header/footer from:
 * - Login and register pages
 * - Admin pages (which have their own layout)
 */
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that should NOT have customer header/footer
  const noHeaderFooterRoutes = ['/login', '/register', '/admin/login'];

  // Admin routes should not have customer header/footer (they have their own layout)
  const isAdminRoute = pathname?.startsWith('/admin');

  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(pathname || '') && !isAdminRoute;

  if (!shouldShowHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <>
      <CustomerHeader />
      <main className="flex-1">
        {children}
      </main>
      <CustomerFooter />
    </>
  );
}
