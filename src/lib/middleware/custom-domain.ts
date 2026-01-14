import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ============================================
// CUSTOM DOMAIN SUPPORT MIDDLEWARE
// Handles:
// 1. Domain resolution to tenant
// 2. Subdomain parsing
// 3. Custom domain verification
// 4. Domain-based tenant routing
// ============================================

export type DomainType = 'SUBDOMAIN' | 'CUSTOM' | 'DEFAULT';
export type DomainStatus = 'PENDING' | 'VERIFIED' | 'ACTIVE' | 'FAILED' | 'DISABLED';

export interface ResolvedTenant {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  domain: string;
  domainType: DomainType;
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
}

// Extract domain from request
export function extractDomain(request: NextRequest): string {
  // Get hostname from request
  const hostname = request.headers.get('x-forwarded-host') || 
                   request.headers.get('host') || 
                   request.nextUrl.hostname;
  
  // Remove port if present
  const [domain] = hostname.split(':');
  
  return domain.toLowerCase();
}

// Parse subdomain from domain
export function parseSubdomain(domain: string): string | null {
  const parts = domain.split('.');
  
  // Check if it's a valid subdomain format (subdomain.domain.tld)
  if (parts.length < 3) {
    return null;
  }
  
  // Remove TLD and second-level domain
  const subdomain = parts.slice(0, -2).join('.');
  
  // Check for common excluded patterns
  const excluded = ['www', 'api', 'admin', 'app', 'portal', 'dashboard'];
  if (excluded.includes(subdomain)) {
    return null;
  }
  
  return subdomain;
}

// Check if domain is a valid custom domain
export function isCustomDomain(domain: string): boolean {
  // Custom domains have fewer parts than subdomains
  // e.g., academy.example.com vs example.academy.com
  const parts = domain.split('.');
  
  // If domain has 2 parts (domain.tld), it's likely a custom domain
  // If it has more than 3 parts, it's likely a subdomain
  if (parts.length === 2) return true;
  if (parts.length > 3) return false;
  
  // Check for common public suffixes that indicate custom domains
  const publicSuffixes = ['com', 'org', 'net', 'edu', 'ac', 'gov', 'co'];
  const tld = parts[parts.length - 1];
  
  // If TLD is a public suffix and domain doesn't match our app pattern, it's custom
  if (publicSuffixes.includes(tld)) {
    const sld = parts[parts.length - 2]; // Second-level domain
    const appDomains = ['inr99', 'academy', 'learn', 'edu'];
    
    // If second-level domain is not our app domain, it's a custom domain
    return !appDomains.includes(sld);
  }
  
  return false;
}

// Resolve domain to tenant
export async function resolveDomain(request: NextRequest): Promise<{
  success: boolean;
  tenant?: ResolvedTenant;
  error?: string;
}> {
  const domain = extractDomain(request);
  
  // Check for default/custom domain mapping
  const subdomain = parseSubdomain(domain);
  const isCustom = isCustomDomain(domain);
  
  try {
    let tenantData;
    
    if (isCustom) {
      // Look up custom domain
      tenantData = await prisma.tenantDomain.findFirst({
        where: {
          domain,
          status: 'ACTIVE',
        },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true,
              allowCustomDomain: true,
              branding: true,
            },
          },
        },
      });
    } else if (subdomain) {
      // Look up by subdomain
      tenantData = await prisma.tenant.findFirst({
        where: {
          slug: subdomain,
          status: 'ACTIVE',
        },
        include: {
          branding: true,
          domains: {
            where: {
              type: 'SUBDOMAIN',
              status: 'ACTIVE',
            },
          },
        },
      });
    } else {
      // Default domain - check for primary/custom domains
      tenantData = await prisma.tenantDomain.findFirst({
        where: {
          domain,
          status: 'ACTIVE',
          type: 'CUSTOM',
        },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true,
              allowCustomDomain: true,
              branding: true,
            },
          },
        },
      });
    }
    
    if (!tenantData) {
      return { success: false, error: 'Tenant not found for domain' };
    }
    
    const tenant = 'tenant' in tenantData ? tenantData.tenant : tenantData;
    
    // Verify tenant allows custom domain if this is a custom domain
    if (isCustom && !tenant.allowCustomDomain) {
      return { success: false, error: 'Custom domains not allowed for this tenant' };
    }
    
    return {
      success: true,
      tenant: {
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        tenantName: tenant.name,
        domain,
        domainType: isCustom ? 'CUSTOM' : 'SUBDOMAIN',
        branding: tenant.branding ? {
          primaryColor: tenant.branding.primaryColor,
          secondaryColor: tenant.branding.secondaryColor,
          logoUrl: tenant.branding.logoLightUrl || tenant.branding.logoDarkUrl,
          faviconUrl: tenant.branding.faviconUrl,
        } : undefined,
      },
    };
  } catch (error) {
    console.error('Domain resolution error:', error);
    return { success: false, error: 'Failed to resolve domain' };
  }
}

// Verify custom domain (DNS check)
export async function verifyCustomDomain(
  tenantId: string,
  domain: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if domain is already verified for another tenant
    const existingDomain = await prisma.tenantDomain.findFirst({
      where: {
        domain,
        tenantId: { not: tenantId },
        status: { in: ['VERIFIED', 'ACTIVE'] },
      },
    });
    
    if (existingDomain) {
      return { success: false, error: 'Domain is already verified by another tenant' };
    }
    
    // Create or update domain record
    const tenantDomain = await prisma.tenantDomain.upsert({
      where: {
        domain,
      },
      create: {
        tenantId,
        domain,
        type: 'CUSTOM',
        status: 'PENDING',
      },
      update: {
        tenantId,
        status: 'PENDING',
      },
    });
    
    // In production, perform actual DNS verification here
    // For now, we'll mark it as verified after a delay
    // This would typically involve:
    // 1. Checking DNS TXT record for verification token
    // 2. Checking CNAME record points to correct destination
    // 3. Checking SSL certificate
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Domain verification error:', error);
    return { success: false, error: 'Failed to verify domain' };
  }
}

// Complete domain verification
export async function completeDomainVerification(
  domain: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.tenantDomain.update({
      where: { domain },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Complete verification error:', error);
    return { success: false, error: 'Failed to complete verification' };
  }
}

// Get all domains for a tenant
export async function getTenantDomains(tenantId: string) {
  try {
    const domains = await prisma.tenantDomain.findMany({
      where: { tenantId },
      orderBy: [
        { type: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    
    return domains;
  } catch (error) {
    console.error('Get tenant domains error:', error);
    return [];
  }
}

// Add custom domain to tenant
export async function addCustomDomain(
  tenantId: string,
  domain: string
): Promise<{ success: boolean; domain?: unknown; error?: string }> {
  // Validate domain format
  const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;
  if (!domainRegex.test(domain)) {
    return { success: false, error: 'Invalid domain format' };
  }
  
  // Check if domain already exists
  const existingDomain = await prisma.tenantDomain.findUnique({
    where: { domain },
  });
  
  if (existingDomain) {
    return { success: false, error: 'Domain is already registered' };
  }
  
  // Check tenant's domain limit based on subscription tier
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      subscriptionTier: true,
      allowCustomDomain: true,
    },
  });
  
  if (!tenant || !tenant.allowCustomDomain) {
    return { success: false, error: 'Custom domains not allowed for your subscription' };
  }
  
  // Check domain limits based on tier
  const domainLimits: Record<string, number> = {
    FREE: 0,
    STARTER: 1,
    PROFESSIONAL: 3,
    ENTERPRISE: -1, // Unlimited
  };
  
  const limit = domainLimits[tenant.subscriptionTier];
  if (limit > 0) {
    const currentDomains = await prisma.tenantDomain.count({
      where: {
        tenantId,
        type: 'CUSTOM',
      },
    });
    
    if (currentDomains >= limit) {
      return { 
        success: false, 
        error: `Maximum custom domains (${limit}) reached for your subscription` 
      };
    }
  }
  
  // Create domain record
  try {
    const tenantDomain = await prisma.tenantDomain.create({
      data: {
        tenantId,
        domain,
        type: 'CUSTOM',
        status: 'PENDING',
      },
    });
    
    return { success: true, domain: tenantDomain };
  } catch (error) {
    console.error('Add custom domain error:', error);
    return { success: false, error: 'Failed to add domain' };
  }
}

// Remove custom domain from tenant
export async function removeCustomDomain(
  tenantId: string,
  domain: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const tenantDomain = await prisma.tenantDomain.findFirst({
      where: {
        domain,
        tenantId,
        type: 'CUSTOM',
      },
    });
    
    if (!tenantDomain) {
      return { success: false, error: 'Domain not found' };
    }
    
    await prisma.tenantDomain.delete({
      where: { id: tenantDomain.id },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Remove custom domain error:', error);
    return { success: false, error: 'Failed to remove domain' };
  }
}

// Middleware to resolve tenant from domain and inject headers
export async function withCustomDomain(
  request: NextRequest,
  options: {
    requireTenant?: boolean;
    skipPaths?: string[];
  } = {}
): Promise<NextResponse | null> {
  const { requireTenant = false, skipPaths = [] } = options;
  
  // Skip for certain paths (e.g., static assets, API health checks)
  const pathname = request.nextUrl.pathname;
  if (skipPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }
  
  // Resolve domain to tenant
  const resolution = await resolveDomain(request);
  
  if (!resolution.success) {
    if (requireTenant) {
      return NextResponse.json(
        { error: resolution.error || 'Tenant not found' },
        { status: 404 }
      );
    }
    return null;
  }
  
  const { tenant } = resolution;
  
  // Inject tenant context into request headers
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenant.tenantId);
  response.headers.set('x-tenant-slug', tenant.tenantSlug);
  response.headers.set('x-tenant-domain', tenant.domain);
  response.headers.set('x-tenant-domain-type', tenant.domainType);
  
  // Inject branding if available
  if (tenant.branding) {
    response.headers.set('x-tenant-primary-color', tenant.branding.primaryColor);
    response.headers.set('x-tenant-secondary-color', tenant.branding.secondaryColor);
  }
  
  return response;
}

// Generate DNS configuration instructions for custom domain
export function generateDNSInstructions(domain: string, tenantSlug: string): {
  type: string;
  name: string;
  value: string;
  priority?: number;
}[] {
  const subdomain = tenantSlug; // e.g., "inr99"
  const targetDomain = `${tenantSlug}.inr99.academy`; // Default subdomain
  
  return [
    {
      type: 'CNAME',
      name: domain === subdomain ? '*' : domain,
      value: targetDomain,
    },
    {
      type: 'TXT',
      name: `_verification.${domain}`,
      value: `inr99-verify=${Date.now()}`,
    },
  ];
}

export type { DomainType, DomainStatus, ResolvedTenant };
