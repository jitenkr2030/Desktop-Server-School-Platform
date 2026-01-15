/**
 * Access Control System
 * Implements role-based and feature-based access control for the verification platform
 */

import { TierLevel, Permission, ResourceType, AccessContext } from './tier-types';
import { TIER_FEATURES, isFeatureAvailable, FEATURE_INFO } from './feature-flags';

// Permission to feature flag mapping
const PERMISSION_FEATURE_MAP: Record<Permission, string> = {
  // Document permissions
  'document:upload': 'document_upload',
  'document:view': 'document_upload',
  'document:delete': 'document_upload',
  'document:download': 'document_upload',

  // Verification permissions
  'verification:submit': 'basic_verification',
  'verification:view': 'basic_verification',
  'verification:cancel': 'basic_verification',
  'verification:retry': 'basic_verification',
  'verification:bulk': 'bulk_verification',
  'verification:automated': 'automated_verification',
  'verification:priority': 'priority_verification',
  'verification:dedicated': 'dedicated_verification',

  // Analytics permissions
  'analytics:view': 'basic_analytics',
  'analytics:advanced': 'advanced_analytics',
  'analytics:predictive': 'predictive_analytics',
  'analytics:reports': 'custom_reports',
  'analytics:export': 'data_export',

  // API permissions
  'api:basic': 'api_access_limited',
  'api:standard': 'api_access_standard',
  'api:extended': 'api_access_extended',
  'api:unlimited': 'api_access_unlimited',

  // Branding permissions
  'branding:logo': 'custom_branding_limited',
  'branding:full': 'custom_branding',
  'branding:white_label': 'white_label',
  'branding:domain': 'custom_domain',

  // Integration permissions
  'integration:basic': 'integration_basic',
  'integration:advanced': 'integration_advanced',
  'integration:enterprise': 'integration_enterprise',

  // Support permissions
  'support:ticket': 'support_ticket',
  'support:priority': 'priority_support',
  'support:account_manager': 'dedicated_account_manager',
  'support:24_7': '24_7_support',

  // Admin permissions (not tier-gated)
  'admin:dashboard': 'admin_access',
  'admin:users': 'admin_access',
  'admin:settings': 'admin_access',
  'admin:reports': 'admin_access',
  'admin:audit': 'audit_logs',

  // Storage permissions
  'storage:view': 'storage_1gb',
  'storage:upload': 'storage_1gb',

  // Notification permissions
  'notification:email': 'email_notifications',
  'notification:sms': 'sms_notifications',
  'notification:webhook': 'webhook_notifications',
  'notification:push': 'push_notifications',

  // Compliance permissions
  'compliance:view': 'basic_verification',
  'compliance:reports': 'compliance_reports',
  'compliance:audit': 'audit_logs'
};

// Role-based permission definitions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  viewer: [
    'document:view',
    'verification:view',
    'analytics:view',
    'notification:email',
    'storage:view'
  ],
  submitter: [
    'document:upload',
    'document:view',
    'verification:submit',
    'verification:view',
    'verification:cancel',
    'analytics:view',
    'notification:email',
    'notification:sms',
    'storage:view',
    'storage:upload',
    'support:ticket'
  ],
  manager: [
    'document:upload',
    'document:view',
    'document:delete',
    'document:download',
    'verification:submit',
    'verification:view',
    'verification:cancel',
    'verification:retry',
    'verification:bulk',
    'analytics:view',
    'analytics:advanced',
    'analytics:export',
    'notification:email',
    'notification:sms',
    'notification:webhook',
    'storage:view',
    'storage:upload',
    'support:ticket',
    'support:priority'
  ],
  admin: [
    'document:upload',
    'document:view',
    'document:delete',
    'document:download',
    'verification:submit',
    'verification:view',
    'verification:cancel',
    'verification:retry',
    'verification:bulk',
    'analytics:view',
    'analytics:advanced',
    'analytics:predictive',
    'analytics:reports',
    'analytics:export',
    'notification:email',
    'notification:sms',
    'notification:webhook',
    'notification:push',
    'storage:view',
    'storage:upload',
    'support:ticket',
    'support:priority',
    'support:account_manager',
    'compliance:view',
    'compliance:reports',
    'compliance:audit'
  ],
  super_admin: [
    'document:upload',
    'document:view',
    'document:delete',
    'document:download',
    'verification:submit',
    'verification:view',
    'verification:cancel',
    'verification:retry',
    'verification:bulk',
    'verification:automated',
    'verification:priority',
    'verification:dedicated',
    'analytics:view',
    'analytics:advanced',
    'analytics:predictive',
    'analytics:reports',
    'analytics:export',
    'api:basic',
    'api:standard',
    'api:extended',
    'api:unlimited',
    'branding:logo',
    'branding:full',
    'branding:white_label',
    'branding:domain',
    'integration:basic',
    'integration:advanced',
    'integration:enterprise',
    'notification:email',
    'notification:sms',
    'notification:webhook',
    'notification:push',
    'storage:view',
    'storage:upload',
    'support:ticket',
    'support:priority',
    'support:account_manager',
    'support:24_7',
    'admin:dashboard',
    'admin:users',
    'admin:settings',
    'admin:reports',
    'admin:audit',
    'compliance:view',
    'compliance:reports',
    'compliance:audit'
  ]
};

/**
 * Check if a user has a specific permission based on their tier and role
 */
export function hasPermission(
  tier: TierLevel,
  role: string,
  permission: Permission,
  context?: AccessContext
): boolean {
  // Get permissions for the role
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  
  // Check if the role has the permission
  if (!rolePermissions.includes(permission)) {
    return false;
  }

  // Get the required feature flag for this permission
  const requiredFeature = PERMISSION_FEATURE_MAP[permission];
  
  if (!requiredFeature) {
    // Permission doesn't require a specific feature
    return true;
  }

  // Check if the tier has the required feature
  const hasFeature = isFeatureAvailable(requiredFeature as any, tier);
  
  if (!hasFeature) {
    return false;
  }

  // Apply context-specific checks
  if (context) {
    return checkContextualAccess(tier, permission, context);
  }

  return true;
}

/**
 * Check context-specific access rules
 */
function checkContextualAccess(
  tier: TierLevel,
  permission: Permission,
  context: AccessContext
): boolean {
  // Check rate limits
  if (context.rateLimit) {
    const maxRequests = getRateLimitForTier(tier, permission);
    if (context.currentRequests >= maxRequests) {
      return false;
    }
  }

  // Check storage limits
  if (context.storageUsed !== undefined) {
    const maxStorage = getStorageLimitForTier(tier);
    if (context.storageUsed >= maxStorage) {
      return false;
    }
  }

  // Check verification limits
  if (context.pendingVerifications !== undefined) {
    const maxPending = getPendingLimitForTier(tier);
    if (context.pendingVerifications >= maxPending) {
      return false;
    }
  }

  // Check custom workflow access
  if (context.workflowId && !canAccessWorkflow(tier, context.workflowId)) {
    return false;
  }

  return true;
}

/**
 * Get rate limit for a specific permission based on tier
 */
function getRateLimitForTier(tier: TierLevel, permission: Permission): number {
  const baseLimits: Record<TierLevel, Record<string, number>> = {
    starter: {
      'document:upload': 10,
      'verification:submit': 5,
      'verification:bulk': 0,
      'analytics:export': 1,
      'api:basic': 1000,
      'api:standard': 0,
      'api:extended': 0,
      'api:unlimited': 0
    },
    growth: {
      'document:upload': 50,
      'verification:submit': 25,
      'verification:bulk': 100,
      'analytics:export': 10,
      'api:basic': 0,
      'api:standard': 10000,
      'api:extended': 0,
      'api:unlimited': 0
    },
    scale: {
      'document:upload': 200,
      'verification:submit': 100,
      'verification:bulk': 500,
      'analytics:export': 50,
      'api:basic': 0,
      'api:standard': 0,
      'api:extended': 100000,
      'api:unlimited': 0
    },
    enterprise: {
      'document:upload': -1, // Unlimited
      'verification:submit': -1,
      'verification:bulk': -1,
      'analytics:export': -1,
      'api:basic': 0,
      'api:standard': 0,
      'api:extended': 0,
      'api:unlimited': -1
    }
  };

  return baseLimits[tier][permission] ?? 10;
}

/**
 * Get storage limit in bytes for a tier
 */
function getStorageLimitForTier(tier: TierLevel): number {
  const limits: Record<TierLevel, number> = {
    starter: 1024 * 1024 * 1024, // 1 GB
    growth: 10 * 1024 * 1024 * 1024, // 10 GB
    scale: 50 * 1024 * 1024 * 1024, // 50 GB
    enterprise: -1 // Unlimited
  };

  return limits[tier];
}

/**
 * Get maximum pending verifications for a tier
 */
function getPendingLimitForTier(tier: TierLevel): number {
  const limits: Record<TierLevel, number> = {
    starter: 10,
    growth: 50,
    scale: 200,
    enterprise: -1
  };

  return limits[tier];
}

/**
 * Check if a tier can access a specific workflow
 */
function canAccessWorkflow(tier: TierLevel, workflowId: string): boolean {
  // Custom workflows are only available in scale and above
  if (workflowId.startsWith('custom_')) {
    return tier === 'scale' || tier === 'enterprise';
  }

  return true;
}

/**
 * Get all available permissions for a user based on tier and role
 */
export function getAvailablePermissions(tier: TierLevel, role: string): Permission[] {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  
  return rolePermissions.filter(permission => {
    const requiredFeature = PERMISSION_FEATURE_MAP[permission];
    
    if (!requiredFeature) {
      return true;
    }

    return isFeatureAvailable(requiredFeature as any, tier);
  });
}

/**
 * Check if a user can access a specific resource
 */
export function canAccessResource(
  tier: TierLevel,
  role: string,
  resourceType: ResourceType,
  resourceId?: string
): boolean {
  // Define resource access rules by tier
  const resourceAccess: Record<ResourceType, TierLevel[]> = {
    verification: ['starter', 'growth', 'scale', 'enterprise'],
    document: ['starter', 'growth', 'scale', 'enterprise'],
    analytics: ['starter', 'growth', 'scale', 'enterprise'],
    report: ['growth', 'scale', 'enterprise'],
    api: ['starter', 'growth', 'scale', 'enterprise'],
    integration: ['growth', 'scale', 'enterprise'],
    branding: ['starter', 'growth', 'scale', 'enterprise'],
    custom_workflow: ['scale', 'enterprise'],
    audit_log: ['scale', 'enterprise'],
    compliance: ['scale', 'enterprise'],
    admin: ['admin', 'super_admin']
  };

  const allowedTiers = resourceAccess[resourceType] || [];
  
  if (!allowedTiers.includes(tier)) {
    return false;
  }

  // Additional role check for admin resources
  if (resourceType === 'admin' && !['admin', 'super_admin'].includes(role)) {
    return false;
  }

  // Check if user has required role for the resource
  const requiredRoles = getRequiredRolesForResource(resourceType);
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return false;
  }

  return true;
}

/**
 * Get required roles for accessing a resource type
 */
function getRequiredRolesForResource(resourceType: ResourceType): string[] {
  const requirements: Record<ResourceType, string[]> = {
    verification: [],
    document: [],
    analytics: [],
    report: ['manager', 'admin', 'super_admin'],
    api: [],
    integration: ['manager', 'admin', 'super_admin'],
    branding: ['manager', 'admin', 'super_admin'],
    custom_workflow: ['manager', 'admin', 'super_admin'],
    audit_log: ['admin', 'super_admin'],
    compliance: ['admin', 'super_admin'],
    admin: ['admin', 'super_admin']
  };

  return requirements[resourceType] || [];
}

/**
 * Check if a feature upgrade is required for a permission
 */
export function getUpgradeRequirement(
  tier: TierLevel,
  permission: Permission
): { requiredTier: TierLevel; currentTier: TierLevel; available: boolean } | null {
  const requiredFeature = PERMISSION_FEATURE_MAP[permission];
  
  if (!requiredFeature) {
    return null;
  }

  // Find the minimum tier that has this feature
  const tierOrder: TierLevel[] = ['starter', 'growth', 'scale', 'enterprise'];
  let requiredTier: TierLevel | null = null;

  for (const t of tierOrder) {
    if (isFeatureAvailable(requiredFeature as any, t)) {
      requiredTier = t;
      break;
    }
  }

  if (!requiredTier) {
    return null;
  }

  const currentTierIndex = tierOrder.indexOf(tier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);

  return {
    requiredTier,
    currentTier: tier,
    available: currentTierIndex >= requiredTierIndex
  };
}

/**
 * Create an access denial response with upgrade information
 */
export function createAccessDeniedResponse(
  tier: TierLevel,
  permission: Permission
): { error: string; upgradeRequired: boolean; upgradeTo?: TierLevel; featureInfo?: any } {
  const upgradeRequirement = getUpgradeRequirement(tier, permission);
  const featureKey = PERMISSION_FEATURE_MAP[permission];

  const featureInfo = featureKey ? FEATURE_INFO[featureKey as keyof typeof FEATURE_INFO] : null;

  if (upgradeRequirement && !upgradeRequirement.available) {
    return {
      error: `This feature requires ${upgradeRequirement.requiredTier} tier or higher`,
      upgradeRequired: true,
      upgradeTo: upgradeRequirement.requiredTier,
      featureInfo
    };
  }

  return {
    error: 'You do not have permission to perform this action',
    upgradeRequired: false,
    featureInfo
  };
}

/**
 * Middleware helper for protecting API routes
 */
export function createPermissionCheck(
  requiredPermission: Permission,
  allowedRoles?: string[]
) {
  return async function(
    tier: TierLevel,
    role: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return { allowed: false, reason: 'Role not authorized for this action' };
    }

    // Check permission
    if (!hasPermission(tier, role, requiredPermission)) {
      const denial = createAccessDeniedResponse(tier, requiredPermission);
      return { allowed: false, reason: denial.error };
    }

    return { allowed: true };
  };
}

/**
 * Validate that a user can perform an action based on their context
 */
export function validateAccess(
  tier: TierLevel,
  role: string,
  permission: Permission,
  context?: AccessContext
): { valid: boolean; error?: string } {
  if (!hasPermission(tier, role, permission, context)) {
    const denial = createAccessDeniedResponse(tier, permission);
    return { valid: false, error: denial.error };
  }

  return { valid: true };
}

/**
 * Get usage statistics for a tier
 */
export function getUsageStats(
  tier: TierLevel,
  currentUsage: {
    apiCalls: number;
    storageUsed: number;
    pendingVerifications: number;
  }
): {
  api: { used: number; limit: number; percentage: number };
  storage: { used: number; limit: number; percentage: number };
  pending: { used: number; limit: number; percentage: number };
} {
  const apiLimit = getRateLimitForTier(tier, 'api:basic');
  const storageLimit = getStorageLimitForTier(tier);
  const pendingLimit = getPendingLimitForTier(tier);

  const apiPercentage = apiLimit > 0 ? (currentUsage.apiCalls / apiLimit) * 100 : 0;
  const storagePercentage = storageLimit > 0 ? (currentUsage.storageUsed / storageLimit) * 100 : 0;
  const pendingPercentage = pendingLimit > 0 ? (currentUsage.pendingVerifications / pendingLimit) * 100 : 0;

  return {
    api: {
      used: currentUsage.apiCalls,
      limit: apiLimit,
      percentage: Math.min(apiPercentage, 100)
    },
    storage: {
      used: currentUsage.storageUsed,
      limit: storageLimit,
      percentage: Math.min(storagePercentage, 100)
    },
    pending: {
      used: currentUsage.pendingVerifications,
      limit: pendingLimit,
      percentage: Math.min(pendingPercentage, 100)
    }
  };
}
