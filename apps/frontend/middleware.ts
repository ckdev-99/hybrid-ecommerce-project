import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Route Protection
 *
 * This middleware protects admin routes by checking for authentication tokens
 * in both localStorage (via a cookie set by the auth store) and cookies.
 *
 * Protected Routes:
 * - All routes under /admin/* require authentication
 *
 * Public Routes:
 * - /login - Login page
 * - / - Public home page
 * - Any other public routes
 */

// Define protected and public routes
const protectedRoutes = ['/admin'];
const publicRoutes = ['/login'];

// Role-based protected routes (SuperAdmin only)
const superAdminRoutes = ['/admin/users'];

export async function middleware(request: NextRequest) {
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

  // Parse token to check user roles if needed
  // Note: For production, you should validate the token properly
  let userRoles: string[] = [];
  let isAuthenticated = false;

  if (authToken) {
    isAuthenticated = true;

    // In a real app, you would decode the JWT or validate the token
    // For now, we'll check for a user info cookie if available
    const userInfo = request.cookies.get('user-info')?.value;
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        userRoles = user.roles?.map((r: any) => r.name) || [];
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
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

    if (!isSuperAdmin) {
      // Redirect non-super admins to dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
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
