/**
 * Appeal Workflow Management System
 * Handles institution appeals for verification rejections
 */

// Types
export type AppealStatus = 
  | 'pending'           // Initial submission
  | 'under_review'      // Assigned to reviewer
  | 'additional_info'   // Requested more information
  | 'approved'          // Appeal granted
  | 'rejected';         // Appeal denied

export type AppealType = 
  | 'documentation'     // Document-related issues
  | 'eligibility'       // Student count or eligibility
  | 'status'            // Verification status appeal
  | 'tier'              // Tier classification appeal
  | 'general';          // General inquiry

export interface AppealSubmission {
  tenantId: string;
  originalRejectionReason: string;
  appealType: AppealType;
  justification: string;
  supportingDocuments?: string[];
  contactEmail: string;
  preferredCallbackTime?: string;
}

export interface AppealRecord {
  id: string;
  tenantId: string;
  originalVerificationId: string;
  status: AppealStatus;
  type: AppealType;
  justification: string;
  supportingDocuments: string[];
  originalRejectionReason: string;
  reviewerId?: string;
  reviewerNotes?: string;
  decision?: 'approved' | 'rejected';
  decisionReason?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  extendedGracePeriod?: Date;
}

export interface AppealStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgReviewTimeHours: number;
  byType: Record<AppealType, number>;
}

export interface AppealReviewDecision {
  decision: 'approved' | 'rejected';
  reason: string;
  updateVerificationStatus?: boolean;
  newStatus?: string;
  extendGracePeriod?: boolean;
  extensionDays?: number;
  notifyInstitution?: boolean;
}

// In-memory store for demo (replace with database in production)
const appealStore: Map<string, AppealRecord[]> = new Map();

/**
 * Create a new appeal submission
 */
export async function createAppeal(data: AppealSubmission): Promise<{
  success: boolean;
  appeal?: AppealRecord;
  error?: string;
}> {
  try {
    // Validate submission
    if (!data.justification || data.justification.length < 50) {
      return {
        success: false,
        error: 'Justification must be at least 50 characters',
      };
    }
    
    if (!data.contactEmail || !data.contactEmail.includes('@')) {
      return {
        success: false,
        error: 'Valid contact email is required',
      };
    }
    
    const appeal: AppealRecord = {
      id: generateAppealId(),
      tenantId: data.tenantId,
      originalVerificationId: generateVerificationId(),
      status: 'pending',
      type: data.appealType,
      justification: data.justification,
      supportingDocuments: data.supportingDocuments || [],
      originalRejectionReason: data.originalRejectionReason,
      contactEmail: data.contactEmail,
      preferredCallbackTime: data.preferredCallbackTime,
      submittedAt: new Date(),
    };
    
    // Store appeal
    const tenantAppeals = appealStore.get(data.tenantId) || [];
    tenantAppeals.push(appeal);
    appealStore.set(data.tenantId, tenantAppeals);
    
    return { success: true, appeal };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create appeal',
    };
  }
}

/**
 * Get all appeals for a tenant
 */
export async function getTenantAppeals(tenantId: string): Promise<AppealRecord[]> {
  return appealStore.get(tenantId) || [];
}

/**
 * Get single appeal by ID
 */
export async function getAppealById(appealId: string): Promise<AppealRecord | null> {
  for (const appeals of appealStore.values()) {
    const found = appeals.find(a => a.id === appealId);
    if (found) return found;
  }
  return null;
}

/**
 * Get all pending appeals (for admin dashboard)
 */
export async function getPendingAppeals(): Promise<AppealRecord[]> {
  const allAppeals: AppealRecord[] = [];
  for (const appeals of appealStore.values()) {
    allAppeals.push(...appeals.filter(a => a.status === 'pending' || a.status === 'under_review'));
  }
  return allAppeals.sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime());
}

/**
 * Get all appeals for admin review
 */
export async function getAllAppeals(filters?: {
  status?: AppealStatus;
  type?: AppealType;
  dateFrom?: Date;
  dateTo?: Date;
}): Promise<AppealRecord[]> {
  let allAppeals: AppealRecord[] = [];
  
  for (const appeals of appealStore.values()) {
    allAppeals.push(...appeals);
  }
  
  // Apply filters
  if (filters?.status) {
    allAppeals = allAppeals.filter(a => a.status === filters.status);
  }
  
  if (filters?.type) {
    allAppeals = allAppeals.filter(a => a.type === filters.type);
  }
  
  if (filters?.dateFrom) {
    allAppeals = allAppeals.filter(a => a.submittedAt >= filters.dateFrom!);
  }
  
  if (filters?.dateTo) {
    allAppeals = allAppeals.filter(a => a.submittedAt <= filters.dateTo!);
  }
  
  return allAppeals.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
}

/**
 * Update appeal status
 */
export async function updateAppealStatus(
  appealId: string,
  status: AppealStatus,
  reviewerId?: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const appeal = await getAppealById(appealId);
  
  if (!appeal) {
    return { success: false, error: 'Appeal not found' };
  }
  
  appeal.status = status;
  
  if (reviewerId) {
    appeal.reviewerId = reviewerId;
  }
  
  if (notes) {
    appeal.reviewerNotes = notes;
  }
  
  if (status === 'under_review') {
    // Find and update in store
    const tenantAppeals = appealStore.get(appeal.tenantId) || [];
    const index = tenantAppeals.findIndex(a => a.id === appealId);
    if (index !== -1) {
      tenantAppeals[index] = appeal;
      appealStore.set(appeal.tenantId, tenantAppeals);
    }
  }
  
  return { success: true };
}

/**
 * Process appeal review decision
 */
export async function reviewAppeal(
  appealId: string,
  decision: AppealReviewDecision,
  reviewerId: string
): Promise<{ success: boolean; error?: string }> {
  const appeal = await getAppealById(appealId);
  
  if (!appeal) {
    return { success: false, error: 'Appeal not found' };
  }
  
  // Update appeal with decision
  appeal.status = decision.decision === 'approved' ? 'approved' : 'rejected';
  appeal.reviewerId = reviewerId;
  appeal.decision = decision.decision;
  appeal.decisionReason = decision.reason;
  appeal.reviewedAt = new Date();
  
  if (decision.extendGracePeriod) {
    const extensionDays = decision.extensionDays || 15;
    const extendedDate = new Date();
    extendedDate.setDate(extendedDate.getDate() + extensionDays);
    appeal.extendedGracePeriod = extendedDate;
  }
  
  // Update in store
  const tenantAppeals = appealStore.get(appeal.tenantId) || [];
  const index = tenantAppeals.findIndex(a => a.id === appealId);
  if (index !== -1) {
    tenantAppeals[index] = appeal;
    appealStore.set(appeal.tenantId, tenantAppeals);
  }
  
  // TODO: Send notification to institution
  // TODO: Update verification status if applicable
  
  return { success: true };
}

/**
 * Request additional information for appeal
 */
export async function requestAdditionalInfo(
  appealId: string,
  requiredDocuments: string[],
  message: string
): Promise<{ success: boolean; error?: string }> {
  const appeal = await getAppealById(appealId);
  
  if (!appeal) {
    return { success: false, error: 'Appeal not found' };
  }
  
  appeal.status = 'additional_info';
  appeal.reviewerNotes = message;
  
  // Update in store
  const tenantAppeals = appealStore.get(appeal.tenantId) || [];
  const index = tenantAppeals.findIndex(a => a.id === appealId);
  if (index !== -1) {
    tenantAppeals[index] = appeal;
    appealStore.set(appeal.tenantId, tenantAppeals);
  }
  
  // TODO: Send notification to institution
  
  return { success: true };
}

/**
 * Get appeal statistics
 */
export async function getAppealStatistics(): Promise<AppealStatistics> {
  let allAppeals: AppealRecord[] = [];
  
  for (const appeals of appealStore.values()) {
    allAppeals.push(...appeals);
  }
  
  const byType: Record<AppealType, number> = {
    documentation: 0,
    eligibility: 0,
    status: 0,
    tier: 0,
    general: 0,
  };
  
  let totalReviewTime = 0;
  let reviewedCount = 0;
  
  for (const appeal of allAppeals) {
    if (appeal.status === 'approved' || appeal.status === 'rejected') {
      reviewedCount++;
      if (appeal.reviewedAt) {
        const reviewTime = appeal.reviewedAt.getTime() - appeal.submittedAt.getTime();
        totalReviewTime += reviewTime / (1000 * 60 * 60); // Convert to hours
      }
    }
    
    byType[appeal.type]++;
  }
  
  return {
    total: allAppeals.length,
    pending: allAppeals.filter(a => a.status === 'pending' || a.status === 'under_review').length,
    approved: allAppeals.filter(a => a.status === 'approved').length,
    rejected: allAppeals.filter(a => a.status === 'rejected').length,
    avgReviewTimeHours: reviewedCount > 0 ? totalReviewTime / reviewedCount : 0,
    byType,
  };
}

/**
 * Calculate appeal outcome prediction
 */
export function predictAppealOutcome(appeal: AppealRecord): {
  likelihood: 'high' | 'medium' | 'low';
  factors: string[];
} {
  const factors: string[] = [];
  let score = 0;
  
  // Factor: Justification length
  if (appeal.justification.length > 500) {
    score += 2;
    factors.push('Detailed justification provided');
  } else if (appeal.justification.length > 200) {
    score += 1;
    factors.push('Adequate justification');
  } else {
    factors.push('Justification may be insufficient');
  }
  
  // Factor: Supporting documents
  if (appeal.supportingDocuments && appeal.supportingDocuments.length >= 2) {
    score += 2;
    factors.push('Strong supporting documentation');
  } else if (appeal.supportingDocuments && appeal.supportingDocuments.length === 1) {
    score += 1;
    factors.push('Some supporting documentation');
  } else {
    factors.push('No supporting documentation');
  }
  
  // Factor: Appeal type
  if (appeal.type === 'documentation') {
    score += 1;
    factors.push('Document issues often resolvable');
  } else if (appeal.type === 'status') {
    score -= 1;
    factors.push('Status appeals require careful review');
  }
  
  // Determine likelihood
  let likelihood: 'high' | 'medium' | 'low';
  if (score >= 4) {
    likelihood = 'high';
  } else if (score >= 2) {
    likelihood = 'medium';
  } else {
    likelihood = 'low';
  }
  
  return { likelihood, factors };
}

/**
 * Format appeal status for display
 */
export function formatAppealStatus(status: AppealStatus): {
  label: string;
  color: string;
  description: string;
} {
  const statusConfig: Record<AppealStatus, { label: string; color: string; description: string }> = {
    pending: { 
      label: 'Pending', 
      color: 'yellow', 
      description: 'Awaiting review assignment' 
    },
    under_review: { 
      label: 'Under Review', 
      color: 'blue', 
      description: 'Being evaluated by reviewer' 
    },
    additional_info: { 
      label: 'Additional Info Required', 
      color: 'orange', 
      description: 'Waiting for institution response' 
    },
    approved: { 
      label: 'Approved', 
      color: 'green', 
      description: 'Appeal granted successfully' 
    },
    rejected: { 
      label: 'Rejected', 
      color: 'red', 
      description: 'Appeal denied' 
    },
  };
  
  return statusConfig[status];
}

// Helper functions
function generateAppealId(): string {
  return `APL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateVerificationId(): string {
  return `VER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
