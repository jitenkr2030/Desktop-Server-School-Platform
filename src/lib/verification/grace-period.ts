/**
 * Grace Period Management System
 * Handles verification deadline tracking and feature restriction logic
 */

// Types
export type GraceStatus = 
  | 'active'           // Within 30-day window
  | 'warning'          // 7 days remaining
  | 'critical'         // 3 days remaining
  | 'expired'          // Past deadline, restricted
  | 'suspended';       // Past 90 days, full suspension

export interface GracePeriodDetails {
  status: GraceStatus;
  daysRemaining: number;
  deadlineDate: Date;
  restrictions: string[];
}

export interface GracePeriodConfig {
  initialDays: number;           // 30 days standard
  warningThreshold: number;      // 7 days
  criticalThreshold: number;     // 3 days
  restrictionStartDay: number;   // Day 31
  suspensionStartDay: number;    // Day 90
}

// Default configuration
const DEFAULT_CONFIG: GracePeriodConfig = {
  initialDays: 30,
  warningThreshold: 7,
  criticalThreshold: 3,
  restrictionStartDay: 31,
  suspensionStartDay: 90,
};

/**
 * Calculate the grace period deadline date
 */
export function calculateDeadline(
  startDate: Date | string,
  config: GracePeriodConfig = DEFAULT_CONFIG
): Date {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const deadline = new Date(start);
  deadline.setDate(deadline.getDate() + config.initialDays);
  return deadline;
}

/**
 * Calculate days remaining until deadline
 */
export function getDaysRemaining(
  deadline: Date | string,
  config: GracePeriodConfig = DEFAULT_CONFIG
): number {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Determine current grace status
 */
export function getGraceStatus(
  deadline: Date | string,
  config: GracePeriodConfig = DEFAULT_CONFIG
): GraceStatus {
  const daysRemaining = getDaysRemaining(deadline, config);
  
  if (daysRemaining <= 0) {
    const daysPast = Math.abs(daysRemaining);
    if (daysPast >= config.suspensionStartDay) {
      return 'suspended';
    }
    return 'expired';
  }
  
  if (daysRemaining <= config.criticalThreshold) {
    return 'critical';
  }
  
  if (daysRemaining <= config.warningThreshold) {
    return 'warning';
  }
  
  return 'active';
}

/**
 * Get comprehensive grace period details
 */
export function getGracePeriodDetails(
  deadline: Date | string,
  config: GracePeriodConfig = DEFAULT_CONFIG
): GracePeriodDetails {
  const status = getGraceStatus(deadline, config);
  const daysRemaining = getDaysRemaining(deadline, config);
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  
  const restrictions = getRestrictionsForStatus(status, config);
  
  return {
    status,
    daysRemaining,
    deadlineDate,
    restrictions,
  };
}

/**
 * Get restrictions applicable for a given status
 */
function getRestrictionsForStatus(
  status: GraceStatus,
  config: GracePeriodConfig
): string[] {
  const restrictions: Record<GraceStatus, string[]> = {
    active: [],
    warning: ['Consider completing verification soon'],
    critical: ['Verification required to maintain full access'],
    expired: [
      'New course creation disabled',
      'Student enrollment disabled',
      'Read-only mode enabled',
    ],
    suspended: [
      'Full access suspended',
      'Contact support to restore',
    ],
  };
  
  return restrictions[status];
}

/**
 * Determine if account should be suspended
 */
export function shouldSuspend(
  deadline: Date | string,
  config: GracePeriodConfig = DEFAULT_CONFIG
): boolean {
  const daysRemaining = getDaysRemaining(deadline, config);
  const daysPast = Math.abs(daysRemaining);
  return daysPast >= config.suspensionStartDay;
}

/**
 * Extend grace period for appeals or special circumstances
 */
export function extendGracePeriod(
  currentDeadline: Date | string,
  extensionDays: number,
  maxExtensions: number = 2
): { newDeadline: Date; extensionsUsed: number; canExtend: boolean } {
  const currentDeadlineDate = typeof currentDeadline === 'string' 
    ? new Date(currentDeadline) 
    : currentDeadline;
  
  const newDeadline = new Date(currentDeadlineDate);
  newDeadline.setDate(newDeadline.getDate() + extensionDays);
  
  return {
    newDeadline,
    extensionsUsed: 1, // Would track this in DB in production
    canExtend: maxExtensions > 1,
  };
}

/**
 * Calculate verification progress percentage
 */
export function calculateVerificationProgress(
  submittedDocuments: string[],
  requiredDocuments: string[]
): number {
  if (requiredDocuments.length === 0) return 100;
  
  const uniqueSubmitted = new Set(submittedDocuments);
  const validSubmissions = requiredDocuments.filter(doc => 
    uniqueSubmitted.has(doc)
  );
  
  return Math.round((validSubmissions.length / requiredDocuments.length) * 100);
}

/**
 * Generate notification schedule for grace period
 */
export function getNotificationSchedule(
  deadline: Date | string,
  config: GracePeriodConfig = DEFAULT_CONFIG
): { day: number; message: string }[] {
  const schedule = [
    { day: config.initialDays, message: 'Verification deadline set' },
    { day: config.warningThreshold, message: 'Verification due soon' },
    { day: config.criticalThreshold, message: 'Urgent: Verification required' },
    { day: 1, message: 'Final reminder: Verify today' },
    { day: 0, message: 'Grace period expired' },
  ];
  
  return schedule;
}

/**
 * Format grace status for display
 */
export function formatGraceStatus(status: GraceStatus): {
  label: string;
  color: string;
  icon: string;
} {
  const statusConfig: Record<GraceStatus, { label: string; color: string; icon: string }> = {
    active: { label: 'Active', color: 'green', icon: '✓' },
    warning: { label: 'Warning', color: 'amber', icon: '⚠' },
    critical: { label: 'Critical', color: 'red', icon: '🚨' },
    expired: { label: 'Expired', color: 'red', icon: '✕' },
    suspended: { label: 'Suspended', color: 'gray', icon: '⛔' },
  };
  
  return statusConfig[status];
}

/**
 * Validate student count threshold
 */
export function validateStudentCount(
  count: number,
  minimumThreshold: number = 1500
): { valid: boolean; tier: string; message: string } {
  if (count >= 5000) {
    return {
      valid: true,
      tier: 'Enterprise',
      message: 'Eligible for Enterprise tier features',
    };
  }
  
  if (count >= 1500) {
    return {
      valid: true,
      tier: 'Scale',
      message: 'Eligible for Scale tier (full white-label access)',
    };
  }
  
  if (count >= 500) {
    return {
      valid: true,
      tier: 'Growth',
      message: 'Eligible for Growth tier (standard features)',
    };
  }
  
  return {
    valid: true,
    tier: 'Foundation',
    message: `Foundation tier (minimum ${minimumThreshold} students for Scale)`,
  };
}
