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

  // Check for authentication in multiple places
  // 1. Check Firebase auth cookie if present
  const firebaseAuthCookie = request.cookies.get('firebase-auth-token')?.value;
  // 2. Check our custom auth cookie
  const authToken = request.cookies.get('auth-token')?.value;
  // 3. Check for session cookie
  const sessionCookie = request.cookies.get('__session')?.value;
  
  // Determine if user is authenticated based on any valid token
  const isAuthenticated = !!(firebaseAuthCookie || authToken || sessionCookie);
  
  // For debugging
  console.log(`Middleware: Path=${pathname}, Protected=${isProtectedRoute}, Auth=${isAuthenticated}`);
  
  // If accessing a protected route without authentication, redirect to signin
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`Redirecting unauthenticated user from ${pathname} to signin`);
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If accessing signin page while authenticated, redirect to dashboard
  if (pathname === '/signin' && isAuthenticated) {
    console.log('Redirecting authenticated user from signin to dashboard');
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