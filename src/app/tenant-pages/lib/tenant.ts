import { createClient } from '@/lib/db'
import { headers } from 'next/headers'

export async function getCurrentTenant() {
  const headersList = await headers()
  const tenantSlug = headersList.get('x-tenant-slug')
  const hostname = headersList.get('x-tenant-hostname')

  if (!tenantSlug) {
    return null
  }

  const db = createClient()

  const tenant = await db.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      branding: true,
      settings: true,
    },
  })

  return tenant
}

export async function getTenantBySlug(slug: string) {
  const db = createClient()

  const tenant = await db.tenant.findUnique({
    where: { slug },
    include: {
      branding: true,
      settings: true,
      domains: true,
    },
  })

  return tenant
}
