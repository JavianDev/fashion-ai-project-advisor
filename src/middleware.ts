import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
  '/admin(.*)',
  '/api/admin(.*)',
  '/api/user(.*)',
  '/ca/dashboard(.*)',      // Canada-specific dashboards
  '/us/dashboard(.*)',      // US-specific dashboards
  '/uae/dashboard(.*)',     // UAE-specific dashboards
  '/ca/admin(.*)',          // Canada admin routes
  '/us/admin(.*)',          // US admin routes
  '/uae/admin(.*)',         // UAE admin routes
  '/ca/product(.*)',        // Canada product role routes
  '/us/product(.*)',        // US product role routes
  '/uae/product(.*)',       // UAE product role routes
  '/ca/operator(.*)',       // Canada operator role routes
  '/us/operator(.*)',       // US operator role routes
  '/uae/operator(.*)',      // UAE operator role routes
  '/ca/service-provider(.*)', // Canada service provider routes
  '/us/service-provider(.*)', // US service provider routes
  '/uae/service-provider(.*)' // UAE service provider routes
]);

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/ca(.*)',
  '/us(.*)',
  '/uae(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/enums(.*)',
  '/api/placeholder(.*)',
  '/api/geo(.*)',
  '/api/waiting-list(.*)',
  '/api/contact-concierge(.*)',
  '/region-tester(.*)',    // Development region testing
  '/unsupported-region(.*)', // Unsupported region page
  '/test-api(.*)',         // API testing page
]);

// Check if launch mode is enabled
function isLaunchMode(): boolean {
  return process.env.NEXT_PUBLIC_LAUNCH_MODE === 'true';
}

export default clerkMiddleware(async (auth, req) => {
  try {
    const url = req.nextUrl;
    const pathname = url.pathname;

    // Skip middleware logic in launch mode (handled by layout)
    if (isLaunchMode()) {
      return;
    }

    // Allow public routes to pass through without authentication
    if (isPublicRoute(req)) {
      return;
    }

    // Enhanced region validation for country-specific routes
    if (pathname.startsWith('/ca/') || pathname.startsWith('/us/') || pathname.startsWith('/uae/')) {
      const country = pathname.split('/')[1].toUpperCase();
      const supportedCountries = ['CA', 'US', 'UAE'];

      if (!supportedCountries.includes(country)) {
        return Response.redirect(new URL(`/unsupported-region?country=${country}`, req.url));
      }
    }

    // Protect authenticated routes
    if (isProtectedRoute(req)) {
      try {
        const authResult = await auth();
        if (!authResult?.userId) {
          // Redirect to sign-in if not authenticated
          const signInUrl = new URL('/sign-in', req.url);
          signInUrl.searchParams.set('redirect_url', pathname);
          return Response.redirect(signInUrl);
        }
      } catch (authError) {
        console.error('Auth error in middleware:', authError);
        // On auth error, redirect to sign-in for protected routes
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('error', 'auth_failed');
        return Response.redirect(signInUrl);
      }
    }

    // Allow request to continue
    return;
  } catch (error) {
    console.error('Middleware error:', error);
    // On critical error, allow request to continue to prevent site breakage
    return;
  }
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};