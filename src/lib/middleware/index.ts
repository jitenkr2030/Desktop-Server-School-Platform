// ============================================
// MIDDLEWARE EXPORTS
// Unified export for all middleware utilities
// ============================================

// Data Isolation Middleware
export {
  withDataIsolation,
  extractTenantContext,
  validateTenant,
  validateTenantAccess,
  buildIsolatedQuery,
  checkContentAccess,
  getAccessibleContentIds,
  type TenantContext,
  type IsolatedQuery,
} from './tenant-isolation';

// RBAC Middleware
export {
  withRBAC,
  hasPermission,
  hasHigherOrEqualRole,
  getEffectivePermissions,
  createPermissionChecker,
  PermissionChecker,
  ROLE_HIERARCHY,
  DEFAULT_ROLE_PERMISSIONS,
  type Role,
  type Action,
  type Resource,
} from './rbac';

// Custom Domain Middleware
export {
  withCustomDomain,
  resolveDomain,
  extractDomain,
  parseSubdomain,
  isCustomDomain,
  verifyCustomDomain,
  completeDomainVerification,
  getTenantDomains,
  addCustomDomain,
  removeCustomDomain,
  generateDNSInstructions,
  type DomainType,
  type DomainStatus,
  type ResolvedTenant,
} from './custom-domain';

// ============================================
// COMPOSED MIDDLEWARE
// Combines multiple middleware functions
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { extractTenantContext, type TenantContext } from './tenant-isolation';
import { type Role, type Resource, type Action, getEffectivePermissions, type PermissionChecker } from './rbac';
import { type ResolvedTenant, resolveDomain } from './custom-domain';

// Combined middleware for full tenant + RBAC + domain support
export async function withFullAccessControl(
  request: NextRequest,
  options: {
    requireTenant?: boolean;
    requireAuth?: boolean;
    allowedRoles?: Role[];
    requiredPermissions?: { resource: Resource; action: Action }[];
  } = {}
): Promise<NextResponse | null> {
  const { requireTenant = true, requireAuth = true, allowedRoles, requiredPermissions } = options;

  // Step 1: Resolve domain and get tenant context
  const domainResolution = await resolveDomain(request);
  
  if (!domainResolution.success) {
    if (requireTenant) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }
  }

  // Step 2: Extract tenant context from request
  const tenantContext = extractTenantContext(request);
  
  // Merge resolved tenant with context
  if (domainResolution.tenant) {
    tenantContext.tenantId = domainResolution.tenant.tenantId;
    tenantContext.tenantSlug = domainResolution.tenant.tenantSlug;
  }

  // Step 3: Check authentication
  if (requireAuth && !tenantContext.isAuthenticated) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Step 4: Check tenant requirement
  if (requireTenant && !tenantContext.tenantId) {
    return NextResponse.json(
      { error: 'Tenant context required' },
      { status: 400 }
    );
  }

  // Step 5: Check role-based access
  if (allowedRoles && allowedRoles.length > 0 && tenantContext.userRole) {
    const hasRoleAccess = allowedRoles.some((role) => {
      // Import hierarchy check from rbac
      const ROLE_HIERARCHY: Record<Role, number> = {
        SUPER_ADMIN: 100, OWNER: 90, ADMIN: 80,
        INSTRUCTOR: 60, TEACHER: 50, STUDENT: 30,
        PARENT: 20, GUEST: 10,
      };
      return ROLE_HIERARCHY[tenantContext.userRole as Role] >= ROLE_HIERARCHY[role];
    });
    
    if (!hasRoleAccess) {
      return NextResponse.json(
        { error: 'Insufficient role permissions' },
        { status: 403 }
      );
    }
  }

  // Step 6: Check specific permissions
  if (requiredPermissions && requiredPermissions.length > 0 && tenantContext.userId) {
    const permissions = await getEffectivePermissions(
      tenantContext.userId,
      tenantContext.tenantId || undefined
    );
    
    const hasAllPermissions = requiredPermissions.every(({ resource, action }) => {
      const resourcePermissions = permissions[resource] || [];
      return resourcePermissions.includes(action) || resourcePermissions.includes('MANAGE');
    });
    
    if (!hasAllPermissions) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }
  }

  // Step 7: Create response with headers
  const response = NextResponse.next();
  
  if (tenantContext.tenantId) {
    response.headers.set('x-tenant-id', tenantContext.tenantId);
  }
  if (tenantContext.tenantSlug) {
    response.headers.set('x-tenant-slug', tenantContext.tenantSlug);
  }
  if (tenantContext.userId) {
    response.headers.set('x-user-id', tenantContext.userId);
  }
  if (tenantContext.userRole) {
    response.headers.set('x-user-role', tenantContext.userRole);
  }
  
  return response;
}

// ============================================
// HELPER TYPES
// ============================================

export interface MiddlewareContext {
  tenant: ResolvedTenant | null;
  user: {
    id: string | null;
    role: string | null;
    permissions: PermissionChecker | null;
  };
  request: NextRequest;
}

export function createMiddlewareContext(
  request: NextRequest,
  tenant: ResolvedTenant | null,
  userId: string | null,
  userRole: string | null
): MiddlewareContext {
  return {
    tenant,
    user: {
      id: userId,
      role: userRole,
      permissions: null, // Will be populated if needed
    },
    request,
  };
}
