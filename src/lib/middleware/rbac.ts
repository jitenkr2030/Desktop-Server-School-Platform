import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// ============================================
// RBAC (ROLE-BASED ACCESS CONTROL) MIDDLEWARE
// Provides granular permission checking for:
// 1. Route access control
// 2. Resource-level permissions
// 3. Action-based authorization
// ============================================

export type Role = 
  | 'SUPER_ADMIN'
  | 'OWNER'
  | 'ADMIN'
  | 'INSTRUCTOR'
  | 'TEACHER'
  | 'STUDENT'
  | 'PARENT'
  | 'GUEST';

export type Action =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'PUBLISH'
  | 'ARCHIVE'
  | 'MANAGE'
  | 'VIEW'
  | 'EDIT'
  | 'SHARE'
  | 'DOWNLOAD'
  | 'ASSIGN'
  | 'REVIEW'
  | 'APPROVE'
  | 'REJECT';

export type Resource =
  | 'USERS'
  | 'COURSES'
  | 'LESSONS'
  | 'ASSESSMENTS'
  | 'CLASSES'
  | 'TEACHERS'
  | 'STUDENTS'
  | 'CONTENT'
  | 'SETTINGS'
  | 'BILLING'
  | 'ANALYTICS'
  | 'ANNOUNCEMENTS'
  | 'DISCUSSIONS'
  | 'LIVE_SESSIONS'
  | 'APPROVALS';

// Role hierarchy - higher roles inherit permissions from lower roles
export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 100,
  OWNER: 90,
  ADMIN: 80,
  INSTRUCTOR: 60,
  TEACHER: 50,
  STUDENT: 30,
  PARENT: 20,
  GUEST: 10,
};

// Default permissions for each role (can be overridden by database)
export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Record<Resource, Action[]>> = {
  SUPER_ADMIN: {
    USERS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    COURSES: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'MANAGE'],
    LESSONS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'MANAGE'],
    ASSESSMENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'MANAGE'],
    CLASSES: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    TEACHERS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    STUDENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    CONTENT: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'ARCHIVE', 'MANAGE'],
    SETTINGS: ['READ', 'UPDATE', 'MANAGE'],
    BILLING: ['READ', 'UPDATE', 'MANAGE'],
    ANALYTICS: ['READ', 'MANAGE'],
    ANNOUNCEMENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    DISCUSSIONS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    LIVE_SESSIONS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    APPROVALS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'MANAGE'],
  },
  OWNER: {
    USERS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    COURSES: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'MANAGE'],
    LESSONS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'MANAGE'],
    ASSESSMENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'MANAGE'],
    CLASSES: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    TEACHERS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    STUDENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    CONTENT: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'ARCHIVE', 'MANAGE'],
    SETTINGS: ['READ', 'UPDATE', 'MANAGE'],
    BILLING: ['READ', 'UPDATE', 'MANAGE'],
    ANALYTICS: ['READ', 'MANAGE'],
    ANNOUNCEMENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    DISCUSSIONS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    LIVE_SESSIONS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    APPROVALS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'MANAGE'],
  },
  ADMIN: {
    USERS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    COURSES: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'MANAGE'],
    LESSONS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'MANAGE'],
    ASSESSMENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'MANAGE'],
    CLASSES: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    TEACHERS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    STUDENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    CONTENT: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH', 'ARCHIVE', 'MANAGE'],
    SETTINGS: ['READ', 'UPDATE'],
    BILLING: ['READ'],
    ANALYTICS: ['READ', 'MANAGE'],
    ANNOUNCEMENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    DISCUSSIONS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    LIVE_SESSIONS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    APPROVALS: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'MANAGE'],
  },
  INSTRUCTOR: {
    USERS: ['READ'],
    COURSES: ['CREATE', 'READ', 'UPDATE', 'PUBLISH'],
    LESSONS: ['CREATE', 'READ', 'UPDATE', 'PUBLISH'],
    ASSESSMENTS: ['CREATE', 'READ', 'UPDATE', 'PUBLISH'],
    CLASSES: ['READ'],
    TEACHERS: ['READ'],
    STUDENTS: ['READ'],
    CONTENT: ['CREATE', 'READ', 'UPDATE', 'PUBLISH'],
    SETTINGS: ['READ'],
    BILLING: [],
    ANALYTICS: ['READ'],
    ANNOUNCEMENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    DISCUSSIONS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    LIVE_SESSIONS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    APPROVALS: ['CREATE', 'READ', 'UPDATE'],
  },
  TEACHER: {
    USERS: ['READ'],
    COURSES: ['READ'],
    LESSONS: ['CREATE', 'READ', 'UPDATE'],
    ASSESSMENTS: ['CREATE', 'READ', 'UPDATE'],
    CLASSES: ['READ'],
    TEACHERS: ['READ'],
    STUDENTS: ['READ'],
    CONTENT: ['CREATE', 'READ', 'UPDATE'],
    SETTINGS: [],
    BILLING: [],
    ANALYTICS: ['READ'],
    ANNOUNCEMENTS: ['CREATE', 'READ', 'UPDATE'],
    DISCUSSIONS: ['CREATE', 'READ', 'UPDATE'],
    LIVE_SESSIONS: ['CREATE', 'READ', 'UPDATE'],
    APPROVALS: ['CREATE', 'READ'],
  },
  STUDENT: {
    USERS: ['READ'],
    COURSES: ['READ'],
    LESSONS: ['READ'],
    ASSESSMENTS: ['READ', 'CREATE', 'UPDATE'],
    CLASSES: ['READ'],
    TEACHERS: ['READ'],
    STUDENTS: ['READ'],
    CONTENT: ['READ', 'DOWNLOAD'],
    SETTINGS: [],
    BILLING: [],
    ANALYTICS: [],
    ANNOUNCEMENTS: ['READ'],
    DISCUSSIONS: ['CREATE', 'READ'],
    LIVE_SESSIONS: ['READ'],
    APPROVALS: [],
  },
  PARENT: {
    USERS: ['READ'],
    COURSES: ['READ'],
    LESSONS: ['READ'],
    ASSESSMENTS: ['READ'],
    CLASSES: ['READ'],
    TEACHERS: ['READ'],
    STUDENTS: ['READ'],
    CONTENT: ['READ', 'DOWNLOAD'],
    SETTINGS: [],
    BILLING: [],
    ANALYTICS: ['READ'],
    ANNOUNCEMENTS: ['READ'],
    DISCUSSIONS: ['READ'],
    LIVE_SESSIONS: ['READ'],
    APPROVALS: [],
  },
  GUEST: {
    USERS: [],
    COURSES: ['READ'],
    LESSONS: ['READ'],
    ASSESSMENTS: ['READ'],
    CLASSES: ['READ'],
    TEACHERS: ['READ'],
    STUDENTS: [],
    CONTENT: ['READ'],
    SETTINGS: [],
    BILLING: [],
    ANALYTICS: [],
    ANNOUNCEMENTS: ['READ'],
    DISCUSSIONS: ['READ'],
    LIVE_SESSIONS: ['READ'],
    APPROVALS: [],
  },
};

// Check if role has permission for action on resource
export function hasPermission(
  role: Role,
  resource: Resource,
  action: Action
): boolean {
  const permissions = DEFAULT_ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  
  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) return false;
  
  return resourcePermissions.includes(action) || resourcePermissions.includes('MANAGE');
}

// Check if role A has higher or equal privileges than role B
export function hasHigherOrEqualRole(roleA: Role, roleB: Role): boolean {
  return ROLE_HIERARCHY[roleA] >= ROLE_HIERARCHY[roleB];
}

// Get effective permissions for a user (combines role + custom permissions)
export async function getEffectivePermissions(
  userId: string,
  tenantId?: string
): Promise<Record<Resource, Action[]>> {
  try {
    // Get user's role from tenant
    let userRole: Role = 'GUEST';
    
    if (tenantId) {
      const tenantUser = await prisma.tenantUser.findFirst({
        where: {
          userId,
          tenantId,
          status: 'ACTIVE',
        },
        select: { role: true },
      });
      
      if (tenantUser) {
        userRole = tenantUser.role as Role;
      }
    }

    // Start with default permissions for role
    const permissions = { ...DEFAULT_ROLE_PERMISSIONS[userRole] };

    // Get custom role permissions from database
    const customPermissions = await prisma.rolePermission.findMany({
      where: {
        role: userRole,
      },
    });

    // Apply custom permissions
    for (const perm of customPermissions) {
      const resource = perm.resourceType as Resource;
      if (resource) {
        const permAction = perm.permission as Action;
        
        if (perm.isAllowed) {
          if (!permissions[resource].includes(permAction)) {
            permissions[resource].push(permAction);
          }
        } else {
          permissions[resource] = permissions[resource].filter(
            (action) => action !== permAction
          );
        }
      }
    }

    return permissions;
  } catch (error) {
    console.error('Get effective permissions error:', error);
    return DEFAULT_ROLE_PERMISSIONS.GUEST;
  }
}

// Middleware wrapper for route protection
export async function withRBAC(
  request: NextRequest,
  options: {
    resource: Resource;
    action: Action;
    requireAll?: boolean; // If true, user must have all specified permissions
    roles?: Role[];
    fallbackRole?: Role;
  }
): Promise<NextResponse | null> {
  const { resource, action, requireAll = false, roles, fallbackRole } = options;

  // Extract user info from headers (in production, decode from JWT)
  const userId = request.headers.get('x-user-id');
  const userRole = (request.headers.get('x-user-role') || 'GUEST') as Role;
  const tenantId = request.headers.get('x-tenant-id') || undefined;

  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Check role-based access
  if (roles && roles.length > 0) {
    const hasRoleAccess = roles.some((role) => 
      hasHigherOrEqualRole(userRole, role)
    );
    
    if (!hasRoleAccess) {
      return NextResponse.json(
        { error: 'Insufficient role permissions' },
        { status: 403 }
      );
    }
  }

  // Get effective permissions
  const permissions = await getEffectivePermissions(userId, tenantId);
  const resourcePermissions = permissions[resource];

  // Check action permission
  const hasActionPermission = resourcePermissions.includes(action) || 
                              resourcePermissions.includes('MANAGE');

  if (!hasActionPermission) {
    return NextResponse.json(
      { 
        error: 'Permission denied',
        required: { resource, action },
        granted: resourcePermissions,
      },
      { status: 403 }
    );
  }

  return null; // Allow request to proceed
}

// Utility class for permission checks
export class PermissionChecker {
  private permissions: Record<Resource, Action[]>;

  constructor(permissions: Record<Resource, Action[]>) {
    this.permissions = permissions;
  }

  can(action: Action, resource: Resource): boolean {
    return this.permissions[resource]?.includes(action) || 
           this.permissions[resource]?.includes('MANAGE') ||
           false;
  }

  canAny(actions: Action[], resource: Resource): boolean {
    return actions.some((action) => this.can(action, resource));
  }

  canAll(actions: Action[], resource: Resource): boolean {
    return actions.every((action) => this.can(action, resource));
  }

  getAllowedActions(resource: Resource): Action[] {
    return this.permissions[resource] || [];
  }
}

// Create permission checker from request
export async function createPermissionChecker(
  request: NextRequest
): Promise<PermissionChecker | null> {
  const userId = request.headers.get('x-user-id');
  const tenantId = request.headers.get('x-tenant-id') || undefined;

  if (!userId) {
    return null;
  }

  const permissions = await getEffectivePermissions(userId, tenantId);
  return new PermissionChecker(permissions);
}

export type { Role, Action, Resource };
