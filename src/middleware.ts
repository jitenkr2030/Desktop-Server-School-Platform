import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/courses/*/learn',
  '/certificates',
  '/learning-ledger',
]

// Routes that require admin role
const adminRoutes = [
  '/admin',
  '/instructor',
]

// Routes that should be accessible only to unauthenticated users
const authRoutes = [
  '/auth/login',
  '/auth/register',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Security Headers - Apply to all responses
  const response = NextResponse.next()
  
  // Strict Transport Security (HSTS) - Force HTTPS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  
  // Content Security Policy - Prevent XSS attacks
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.shrtco.de;"
  )
  
  // X-Frame-Options - Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // X-Content-Type-Options - Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Referrer Policy - Control referrer information
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  )
  
  // Permissions Policy - Restrict browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )
  
  // 2. Get the session using new v5 auth function
  const session = await auth(request)
  const token = session?.user
  const isAuthenticated = !!token
  const userRole = (token as any)?.role as string | undefined
  
  // 3. Check protected routes
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.endsWith('/*')) {
      // Wildcard route matching
      const baseRoute = route.slice(0, -2)
      return pathname.startsWith(baseRoute)
    }
    return pathname === route
  })
  
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // 4. Protected route access control
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login with return URL
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // 5. Admin route role-based access control
  if (isAdminRoute) {
    if (!isAuthenticated) {
      // Not logged in - redirect to login
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Check if user has admin role
    const adminRoles = ['ADMIN', 'SUPER_ADMIN']
    if (!adminRoles.includes(userRole || '')) {
      // User doesn't have permission - redirect to home or dashboard
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }
  
  // 6. Auth routes (login/register) - redirect if already authenticated
  if (isAuthRoute && isAuthenticated) {
    // User is already logged in, redirect to dashboard
    const dashboardUrl = new URL('/dashboard', request.url)
    dashboardUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(dashboardUrl)
  }
  
  // 6b. Also check for session cookie to catch edge cases
  // If there's a session cookie but session() didn't return valid auth, still redirect
  if (isAuthRoute) {
    const hasSessionCookie = request.cookies.get('next-auth.session-token') || 
                             request.cookies.get('__Secure-next-auth.session-token')
    if (hasSessionCookie && !isAuthenticated) {
      // Session cookie exists but session not loaded yet - still redirect to dashboard
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }
  
  return response
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need authentication
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth/logout).*)',
  ],
}
