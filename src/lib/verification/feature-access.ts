import { createClient } from '@/lib/db'

// Feature restrictions by eligibility status
export const FEATURE_RESTRICTIONS: Record<string, string[]> = {
  // All features available for ELIGIBLE
  ELIGIBLE: [
    'custom_domain',
    'branding',
    'course_creation',
    'student_management',
    'live_sessions',
    'assessments',
    'certificates',
    'analytics',
    'api_access',
  ],
  // Limited features for PENDING and UNDER_REVIEW (during grace period)
  PENDING: [
    'course_creation',
    'student_management',
    'analytics',
  ],
  UNDER_REVIEW: [
    'course_creation',
    'student_management',
    'analytics',
  ],
  // Restricted for REJECTED and EXPIRED
  REJECTED: [
    'analytics',
  ],
  EXPIRED: [
    'analytics',
  ],
}

// Check if a feature is available for a given eligibility status
export function isFeatureAllowed(feature: string, eligibilityStatus: string): boolean {
  const allowedFeatures = FEATURE_RESTRICTIONS[eligibilityStatus] || FEATURE_RESTRICTIONS.EXPIRED
  return allowedFeatures.includes(feature)
}

// Get all allowed features for a status
export function getAllowedFeatures(eligibilityStatus: string): string[] {
  return FEATURE_RESTRICTIONS[eligibilityStatus] || FEATURE_RESTRICTIONS.EXPIRED
}

// Get restricted features for a status
export function getRestrictedFeatures(eligibilityStatus: string): string[] {
  const allowed = FEATURE_RESTRICTIONS[eligibilityStatus] || FEATURE_RESTRICTIONS.EXPIRED
  const allFeatures = FEATURE_RESTRICTIONS.ELIGIBLE
  return allFeatures.filter(f => !allowed.includes(f))
}

// Grace period status levels
export type GraceLevel = 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'EXPIRED'

export function getGraceLevel(
  eligibilityStatus: string,
  eligibilityDeadline: Date | null
): GraceLevel {
  if (eligibilityStatus === 'ELIGIBLE') return 'ACTIVE'
  if (eligibilityStatus !== 'PENDING' && eligibilityStatus !== 'UNDER_REVIEW') return 'EXPIRED'
  if (!eligibilityDeadline) return 'CRITICAL'

  const now = new Date()
  const deadline = new Date(eligibilityDeadline)
  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysRemaining <= 0) return 'EXPIRED'
  if (daysRemaining <= 3) return 'CRITICAL'
  if (daysRemaining <= 7) return 'WARNING'
  return 'ACTIVE'
}

// Grace period warning messages
export const GRACE_MESSAGES: Record<GraceLevel, string> = {
  ACTIVE: 'Your verification is in progress. Please complete verification within your deadline.',
  WARNING: 'Your verification deadline is approaching. Please submit your documents soon.',
  CRITICAL: 'Your verification deadline is very close. Submit your documents immediately to avoid feature restrictions.',
  EXPIRED: 'Your verification deadline has passed. Please contact support to restore your account.',
}

// Check and update expired institutions
export async function checkExpiredInstitutions(): Promise<{ updated: number; errors: string[] }> {
  const db = createClient()
  const errors: string[] = []
  let updated = 0

  try {
    const now = new Date()
    
    // Find institutions that have passed their deadline and are still pending/review
    const expiredTenants = await db.tenant.findMany({
      where: {
        eligibilityStatus: {
          in: ['PENDING', 'UNDER_REVIEW'],
        },
        eligibilityDeadline: {
          lt: now,
        },
      },
      select: {
        id: true,
        name: true,
        eligibilityStatus: true,
      },
    })

    for (const tenant of expiredTenants) {
      try {
        // Determine final status based on documents
        const docs = await db.verificationDocument.findMany({
          where: {
            tenantId: tenant.id,
            status: { in: ['PENDING', 'REQUIRES_MORE_INFO'] },
          },
        })

        // If no documents submitted, mark as EXPIRED
        // If documents exist but pending review, keep as UNDER_REVIEW but expired deadline
        const newStatus = docs.length === 0 ? 'EXPIRED' : tenant.eligibilityStatus

        await db.tenant.update({
          where: { id: tenant.id },
          data: {
            eligibilityStatus: newStatus,
          },
        })

        updated++
        console.log(`[GRACE_PERIOD] Updated ${tenant.name} (${tenant.id}) to status: ${newStatus}`)
      } catch (err) {
        const errorDetail = err instanceof Error ? err.message : 'Unknown error'
        const errorMsg = `Failed to update tenant ${tenant.id}: ${errorDetail}`
        errors.push(errorMsg)
        console.error('[GRACE_PERIOD]', errorMsg)
      }
    }

    return { updated, errors }
  } catch (err) {
    const errorDetail = err instanceof Error ? err.message : 'Unknown error'
    const errorMsg = `Failed to check expired institutions: ${errorDetail}`
    errors.push(errorMsg)
    console.error('[GRACE_PERIOD]', errorMsg)
    return { updated, errors }
  }
}

// Feature access check result
export interface FeatureCheckResult {
  allowed: boolean
  feature: string
  status: string
  restrictedFeatures?: string[]
  graceLevel?: GraceLevel
  message?: string
}

// Check if institution can access a specific feature
export async function checkFeatureAccess(
  tenantId: string,
  feature: string
): Promise<FeatureCheckResult> {
  const db = createClient()

  try {
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
      select: {
        eligibilityStatus: true,
        eligibilityDeadline: true,
      },
    })

    if (!tenant) {
      return {
        allowed: false,
        feature,
        status: 'NOT_FOUND',
        message: 'Institution not found',
      }
    }

    const graceLevel = getGraceLevel(tenant.eligibilityStatus, tenant.eligibilityDeadline)
    const allowed = isFeatureAllowed(feature, tenant.eligibilityStatus)

    if (allowed) {
      return {
        allowed: true,
        feature,
        status: tenant.eligibilityStatus,
        graceLevel,
        message: GRACE_MESSAGES[graceLevel],
      }
    }

    const restricted = getRestrictedFeatures(tenant.eligibilityStatus)

    return {
      allowed: false,
      feature,
      status: tenant.eligibilityStatus,
      restrictedFeatures: restricted,
      graceLevel,
      message: `This feature is restricted for ${tenant.eligibilityStatus.replace(/_/g, ' ').toLowerCase()} institutions. ${GRACE_MESSAGES[graceLevel]}`,
    }
  } catch (err) {
    return {
      allowed: false,
      feature,
      status: 'ERROR',
      message: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// Validate feature access for API routes
export async function validateFeatureAccess(
  tenantId: string,
  requiredFeatures: string[]
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = []

  for (const feature of requiredFeatures) {
    const result = await checkFeatureAccess(tenantId, feature)
    if (!result.allowed && result.message) {
      errors.push(result.message)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
