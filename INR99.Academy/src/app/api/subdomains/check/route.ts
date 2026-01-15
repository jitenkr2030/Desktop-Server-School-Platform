import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const subdomain = searchParams.get('name')

  if (!subdomain) {
    return NextResponse.json(
      { error: 'Subdomain name is required' },
      { status: 400 }
    )
  }

  // Validate subdomain format
  const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/
  if (!subdomainRegex.test(subdomain)) {
    return NextResponse.json(
      {
        available: false,
        error: 'Subdomain can only contain lowercase letters, numbers, and hyphens. It must start and end with a letter or number.',
      },
      { status: 400 }
    )
  }

  // Check minimum and maximum length
  if (subdomain.length < 3 || subdomain.length > 63) {
    return NextResponse.json(
      {
        available: false,
        error: 'Subdomain must be between 3 and 63 characters.',
      },
      { status: 400 }
    )
  }

  // Check for reserved subdomains
  const reservedSubdomains = [
    'www', 'mail', 'admin', 'api', 'app', 'dashboard',
    'inr99', 'support', 'help', 'blog', 'docs',
    'pricing', 'about', 'contact', 'auth', 'login',
    'register', 'instructor', 'student', 'cdn', 'static',
    'assets', 'images', 'files', 'localhost'
  ]

  if (reservedSubdomains.includes(subdomain.toLowerCase())) {
    return NextResponse.json(
      {
        available: false,
        error: 'This subdomain is reserved and cannot be used.',
      },
      { status: 400 }
    )
  }

  const db = createClient()

  // Check if subdomain exists
  const existingTenant = await db.tenant.findUnique({
    where: { slug: subdomain.toLowerCase() },
    select: { id: true, name: true },
  })

  // Also check tenant domains
  const existingDomain = await db.tenantDomain.findUnique({
    where: { domain: `${subdomain.toLowerCase()}.inr99.academy` },
    select: { id: true },
  })

  if (existingTenant || existingDomain) {
    return NextResponse.json({
      available: false,
      error: 'This subdomain is already taken.',
    })
  }

  return NextResponse.json({
    available: true,
    subdomain: subdomain.toLowerCase(),
    fullDomain: `${subdomain.toLowerCase()}.inr99.academy`,
  })
}
