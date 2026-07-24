import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy for Route Protection
 *
 * In Next.js 16, proxy.ts replaces middleware.ts for route protection.
 * This proxy protects admin routes by checking for authentication tokens.
 *
 * Protected Routes:
 * - All routes under /admin/* require authentication
 *
 * Role-Based Protected Routes:
 * - /admin/users - SuperAdmin only
 *
 * Public Routes:
 * - /login - Login page
 * - / - Public home page
 */

// Define protected and public routes
const protectedRoutes = ['/admin', '/profile'];
const publicRoutes = ['/login', '/register', '/products', '/categories', '/search', '/cart'];

// Role-based protected routes (SuperAdmin only)
const superAdminRoutes = ['/admin/users'];

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route
  );

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
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users trying to access login page
  if (isPublicRoute && isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
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
