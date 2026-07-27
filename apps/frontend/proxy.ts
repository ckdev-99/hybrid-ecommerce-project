import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy for Route Protection
 *
 * In Next.js 16, proxy.ts replaces middleware.ts for route protection.
 * This proxy protects admin routes by checking for authentication tokens.
 *
 * Login Flow:
 * - /login - Customer login (redirects to home after)
 * - /register - Customer registration
 * - /admin/login - Admin login (redirects to admin dashboard after)
 *
 * Protected Routes:
 * - /admin/* (except /admin/login) - Require authentication
 * - /profile/* - Require authentication
 *
 * Role-Based Protected Routes:
 * - /admin/users - SuperAdmin only
 *
 * Public Routes:
 * - / - Public home page
 * - /products, /categories, /search, /cart - Customer pages
 */

// Define protected and public routes
const protectedRoutes = ['/admin', '/profile'];
const publicRoutes = ['/login', '/register', '/admin/login', '/products', '/categories', '/search', '/cart'];

// Special login routes that should redirect authenticated users
const loginRoutes = ['/login', '/admin/login'];

// Role-based protected routes (SuperAdmin only)
const superAdminRoutes = ['/admin/users'];

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  // /admin/login is NOT protected (public access for admins to login)
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route) && pathname !== '/admin/login'
  );

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route =>
    route === pathname || pathname.startsWith(route)
  );

  // Check if current path is a login route
  const isLoginRoute = loginRoutes.includes(pathname);

  // Get the auth token from cookies (set by Zustand store)
  const authToken = request.cookies.get('auth-token')?.value;
  const userInfoCookie = request.cookies.get('user-info')?.value;

  // Parse token to check user roles if needed
  let userRoles: string[] = [];
  let isAuthenticated = false;

  if (authToken) {
    isAuthenticated = true;

    // Try to get user roles from user-info cookie
    if (userInfoCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userInfoCookie));
        userRoles = user.roles?.map((r: { name: string }) => r.name) || [];
      } catch (e) {
        console.error('[Proxy] Failed to parse user info cookie:', e);
      }
    } else {
      console.log('[Proxy] No user-info cookie found, but auth-token exists');
    }
  }

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    // If trying to access admin pages, redirect to admin login
    if (pathname.startsWith('/admin')) {
      const redirectUrl = new URL('/admin/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    // Otherwise redirect to customer login
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users trying to access login pages
  if (isAuthenticated && isLoginRoute) {
    if (pathname === '/admin/login') {
      // Admin login → redirect to admin dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (pathname === '/login') {
      // Customer login → redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Check SuperAdmin routes
  const isSuperAdminRoute = superAdminRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isSuperAdminRoute && isAuthenticated) {
    // Check if user has SuperAdmin role
    const isSuperAdmin = userRoles.includes('SuperAdmin');
    console.log('[Proxy] SuperAdmin route check:', { pathname, userRoles, isSuperAdmin });

    if (!isSuperAdmin) {
      // Redirect non-super admins to dashboard
      console.log('[Proxy] Redirecting non-super admin to dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
};

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
