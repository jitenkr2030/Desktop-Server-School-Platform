import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Your platform domain - update when you purchase inr99.academy
const PLATFORM_DOMAIN = 'inr99.academy'
const MAIN_HOSTNAMES = ['inr99.academy', 'www.inr99.academy', 'localhost']

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Skip internal paths and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // Extract hostname (remove port if present)
  const currentHostname = hostname.split(':')[0].toLowerCase()

  // Check if this is the main platform (no subdomain)
  const isMainPlatform = MAIN_HOSTNAMES.some(
    domain => currentHostname === domain
  )

  // If it's the main platform, continue normally
  if (isMainPlatform) {
    return NextResponse.next()
  }

  // Check if this is a tenant subdomain (e.g., school.inr99.academy)
  const isSubdomain = currentHostname.endsWith(`.${PLATFORM_DOMAIN}`) ||
                      currentHostname.includes('localhost')

  if (isSubdomain) {
    // Extract subdomain (e.g., "school" from "school.inr99.academy")
    const subdomain = currentHostname.split('.')[0]

    // Skip if subdomain is "www" or "api"
    if (subdomain === 'www' || subdomain === 'api') {
      return NextResponse.next()
    }

    // For tenant subdomains, rewrite URL to use tenant route group
    // This allows us to have a completely separate UI for tenants
    const url = request.nextUrl.clone()
    url.pathname = `/(tenant)${pathname}`
    url.search = request.nextUrl.search

    // Add tenant info as header for downstream use
    const response = NextResponse.rewrite(url)
    response.headers.set('x-tenant-slug', subdomain)
    response.headers.set('x-tenant-hostname', currentHostname)

    return response
  }

  // Default: continue normally
  return NextResponse.next()
}

// Run middleware on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
