import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and other Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname.startsWith('/icon-') ||
    pathname.startsWith('/.well-known/')
  ) {
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/transactions', '/admin'];
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/signin', '/signup', '/about', '/contact', '/terms', '/privacy'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || (route !== '/' && pathname.startsWith(route))
  );

  // Check for authentication in multiple cookie formats (for better compatibility)
  const authCookies = {
    firebaseAuth: request.cookies.get('firebase-auth-token')?.value,
    authToken: request.cookies.get('auth-token')?.value,
    session: request.cookies.get('__session')?.value,
  };
  
  // Determine if user is authenticated based on any valid token
  const isAuthenticated = !!(authCookies.firebaseAuth || authCookies.authToken || authCookies.session);
  
  // Enhanced debugging with emojis for easy reading
  const debugInfo = {
    path: pathname,
    protected: isProtectedRoute,
    public: isPublicRoute,
    auth: isAuthenticated,
    cookies: {
      firebase: !!authCookies.firebaseAuth,
      auth: !!authCookies.authToken,
      session: !!authCookies.session,
    }
  };
  
  console.log(`🚨 Middleware: Path=${pathname}, Protected=${isProtectedRoute}, Auth=${isAuthenticated}`);
  console.log(`🍪 Cookies: Firebase=${debugInfo.cookies.firebase}, Auth=${debugInfo.cookies.auth}, Session=${debugInfo.cookies.session}`);
  
  // If accessing a protected route without authentication, redirect to signin
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`🚫 Middleware: Redirecting unauthenticated user from ${pathname} to signin`);
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If accessing signin page while authenticated, redirect to dashboard
  if (pathname === '/signin' && isAuthenticated) {
    console.log('✅ Middleware: Redirecting authenticated user from signin to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing root path while authenticated, redirect to dashboard
  if (pathname === '/' && isAuthenticated) {
    console.log('🏠 Middleware: Redirecting authenticated user from home to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle unknown routes (not in protected or public lists)
  if (!isProtectedRoute && !isPublicRoute && pathname !== '/') {
    console.log(`❓ Middleware: Unknown route ${pathname}, treating as protected`);
    if (!isAuthenticated) {
      console.log(`🚫 Middleware: Redirecting from unknown route ${pathname} to signin`);
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Create response with enhanced security headers
  const response = NextResponse.next();
  
  // Security headers for all responses
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-DNS-Prefetch-Control': 'off',
    // Add HSTS for HTTPS in production
    ...(request.nextUrl.protocol === 'https:' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    })
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Rate limiting headers (implement actual rate limiting logic as needed)
  response.headers.set('X-RateLimit-Limit', '1000');
  response.headers.set('X-RateLimit-Remaining', '999');
  response.headers.set('X-RateLimit-Reset', String(Math.floor(Date.now() / 1000) + 3600));

  // Add authentication status header for debugging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('X-Debug-Auth-Status', isAuthenticated ? 'authenticated' : 'unauthenticated');
    response.headers.set('X-Debug-Route-Type', isProtectedRoute ? 'protected' : isPublicRoute ? 'public' : 'unknown');
  }

  console.log(`✅ Middleware: Allowing access to ${pathname} for ${isAuthenticated ? 'authenticated' : 'unauthenticated'} user`);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)  
     * - _next/image (image optimization files)
     * - favicon.ico, manifest.json, icons (static assets)
     * - .well-known (for security.txt, robots.txt, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|.*\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|\\.well-known).*)',
  ],
};