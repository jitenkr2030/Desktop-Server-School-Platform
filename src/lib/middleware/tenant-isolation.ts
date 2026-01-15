import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// ============================================
// DATA ISOLATION MIDDLEWARE
// Ensures multi-tenant data isolation by:
// 1. Extracting tenant context from request
// 2. Validating tenant access
// 3. Injecting tenant filters into queries
// ============================================

export interface TenantContext {
  tenantId: string | null;
  tenantSlug: string | null;
  userId: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
}

export interface IsolatedQuery {
  where: Record<string, unknown>;
  include?: Record<string, boolean>;
  select?: Record<string, boolean>;
}

// Extract tenant context from request headers and session
export function extractTenantContext(request: NextRequest): TenantContext {
  // Try to get tenant from header (for API calls with tenant context)
  const tenantId = request.headers.get('x-tenant-id');
  const tenantSlug = request.headers.get('x-tenant-slug');
  
  // Try to get user info from header (in production, decode from JWT/session)
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');
  const authToken = request.headers.get('authorization');

  return {
    tenantId: tenantId || null,
    tenantSlug: tenantSlug || null,
    userId: userId || null,
    userRole: userRole || null,
    isAuthenticated: !!authToken || !!userId,
  };
}

// Validate tenant exists and is active
export async function validateTenant(tenantId: string): Promise<{ valid: boolean; tenant?: unknown; error?: string }> {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        status: true,
        subscriptionTier: true,
        maxUsers: true,
        currentUsers: true,
      },
    });

    if (!tenant) {
      return { valid: false, error: 'Tenant not found' };
    }

    if (tenant.status !== 'ACTIVE') {
      return { valid: false, error: `Tenant is ${tenant.status.toLowerCase()}` };
    }

    return { valid: true, tenant };
  } catch (error) {
    console.error('Tenant validation error:', error);
    return { valid: false, error: 'Failed to validate tenant' };
  }
}

// Check if user has access to tenant
export async function validateTenantAccess(
  tenantId: string,
  userId: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const tenantUser = await prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
      select: {
        id: true,
        status: true,
        role: true,
      },
    });

    if (!tenantUser) {
      return { valid: false, error: 'User not associated with tenant' };
    }

    if (tenantUser.status !== 'ACTIVE') {
      return { valid: false, error: `Tenant access is ${tenantUser.status.toLowerCase()}` };
    }

    return { valid: true };
  } catch (error) {
    console.error('Tenant access validation error:', error);
    return { valid: false, error: 'Failed to validate tenant access' };
  }
}

// Build tenant-isolated query for a model
export function buildIsolatedQuery(
  context: TenantContext,
  model: string,
  baseQuery: IsolatedQuery
): IsolatedQuery {
  // If no tenant context, return base query (public content)
  if (!context.tenantId) {
    return baseQuery;
  }

  // Add tenant isolation to where clause based on model type
  const tenantWhere = getTenantWhereClause(model, context.tenantId);

  return {
    where: {
      ...baseQuery.where,
      ...tenantWhere,
    },
    include: baseQuery.include,
    select: baseQuery.select,
  };
}

// Get tenant-specific where clause for different models
function getTenantWhereClause(model: string, tenantId: string): Record<string, unknown> {
  // Map of models to their tenant relationship fields
  const modelTenantFields: Record<string, string> = {
    course: 'class.schoolClass.tenantId',
    lesson: 'course.class.schoolClass.tenantId',
    assessment: 'course.class.schoolClass.tenantId',
    module: 'course.class.schoolClass.tenantId',
    liveSession: 'course.class.schoolClass.tenantId',
    discussion: 'course.class.schoolClass.tenantId',
    announcement: 'class.schoolClass.tenantId',
    user: 'tenantUsers.tenantId',
    studentProfile: 'class.schoolClass.tenantId',
    contentApprovalRequest: 'tenantId',
    courseClassAssignment: 'class.schoolClass.tenantId',
  };

  const tenantField = modelTenantFields[model.toLowerCase()];
  
  if (tenantField) {
    return { [tenantField]: tenantId };
  }

  // Fallback: check if model has direct tenantId field
  return { tenantId };
}

// Middleware function for Next.js API routes
export async function withDataIsolation(
  request: NextRequest,
  options: {
    requireTenant?: boolean;
    requireAuth?: boolean;
    allowedRoles?: string[];
    models?: string[];
  } = {}
): Promise<NextResponse | null> {
  const { requireTenant = true, requireAuth = false, allowedRoles = [], models = [] } = options;

  // Extract tenant context
  const context = extractTenantContext(request);

  // Check authentication requirement
  if (requireAuth && !context.isAuthenticated) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Check tenant requirement
  if (requireTenant && !context.tenantId) {
    return NextResponse.json(
      { error: 'Tenant context required' },
      { status: 400 }
    );
  }

  // Validate tenant if provided
  if (context.tenantId) {
    const tenantValidation = await validateTenant(context.tenantId);
    if (!tenantValidation.valid) {
      return NextResponse.json(
        { error: tenantValidation.error },
        { status: 403 }
      );
    }

    // Validate user access to tenant if user is authenticated
    if (context.userId) {
      const accessValidation = await validateTenantAccess(context.tenantId, context.userId);
      if (!accessValidation.valid) {
        return NextResponse.json(
          { error: accessValidation.error },
          { status: 403 }
        );
      }
    }
  }

  // Check role-based access
  if (allowedRoles.length > 0 && context.userRole) {
    if (!allowedRoles.includes(context.userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
  }

  // Attach context to request headers for downstream use
  const response = NextResponse.next();
  
  if (context.tenantId) {
    response.headers.set('x-tenant-id', context.tenantId);
  }
  if (context.userId) {
    response.headers.set('x-user-id', context.userId);
  }
  if (context.userRole) {
    response.headers.set('x-user-role', context.userRole);
  }

  return response;
}

// Utility to check content access permissions
export async function checkContentAccess(
  userId: string,
  contentType: string,
  contentId: string,
  requiredPermission: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // Check role permissions first
    const rolePermission = await prisma.rolePermission.findFirst({
      where: {
        permission: requiredPermission,
        resourceType: contentType.toUpperCase(),
        OR: [
          { resourceId: contentId },
          { resourceId: null },
        ],
      },
      orderBy: { priority: 'desc' },
    });

    if (rolePermission && !rolePermission.isAllowed) {
      return { allowed: false, reason: `Permission denied for ${requiredPermission}` };
    }

    // Check content-specific permissions
    const contentPermission = await prisma.contentPermission.findFirst({
      where: {
        contentType: contentType.toUpperCase() as any,
        contentId,
        permission: requiredPermission.toUpperCase() as any,
      },
      orderBy: { priority: 'desc' },
    });

    if (contentPermission && !contentPermission.isActive) {
      return { allowed: false, reason: 'Content permission is inactive' };
    }

    // Log access attempt
    await prisma.contentAccessLog.create({
      data: {
        contentType,
        contentId,
        userId,
        action: 'ATTEMPTED',
      },
    });

    return { allowed: true };
  } catch (error) {
    console.error('Content access check error:', error);
    return { allowed: false, reason: 'Failed to check permissions' };
  }
}

// Utility to get user's accessible content IDs
export async function getAccessibleContentIds(
  userId: string,
  userRole: string,
  contentType: string,
  permission: string
): Promise<string[]> {
  try {
    // Get content where user has explicit permission
    const explicitPermissions = await prisma.contentPermission.findMany({
      where: {
        contentType: contentType.toUpperCase() as any,
        permission: permission.toUpperCase() as any,
        role: userRole.toUpperCase() as any,
        isActive: true,
      },
      select: { contentId: true },
    });

    return explicitPermissions.map((p) => p.contentId);
  } catch (error) {
    console.error('Get accessible content IDs error:', error);
    return [];
  }
}

export type { TenantContext, IsolatedQuery };
