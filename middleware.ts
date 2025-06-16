import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/transactions'];
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/signin', '/about', '/contact'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Get auth token from cookies (you might need to adjust this based on your auth implementation)
  const authToken = request.cookies.get('auth-token')?.value;

  // If accessing a protected route without auth token, redirect to signin
  if (isProtectedRoute && !authToken) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If accessing signin page while authenticated, redirect to dashboard
  if (pathname === '/signin' && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  
  // CSRF Protection
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Rate limiting headers (you can implement actual rate limiting logic here)
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', '99');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};