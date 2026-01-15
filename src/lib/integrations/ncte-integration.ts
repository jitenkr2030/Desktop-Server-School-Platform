/**
 * NCTE (National Council for Teacher Education) Integration Module
 * Real API connection for teacher education institution verification
 */

import { z } from 'zod';

// NCTE API Configuration
export interface NCTEConfig {
  apiBaseUrl: string;
  apiKey: string;
  secretKey: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

// Teacher Education Institution Types
export type NCTEInstitutionType = 
  | 'bed_college'
  | 'med_college'
  | 'diploma_institute'
  | 'play_teacher_training'
  | 'correspondence'
  | 'short_term_course';

// Course approval status
export type CourseApprovalStatus = 
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'expired'
  | 'reduced_intake';

export interface NCTECourse {
  courseName: string;
  courseCode: string;
  duration: number; // in months
  intake: number;
  approvedIntake: number;
  status: CourseApprovalStatus;
  academicYear: string;
  recognitionOrderNumber?: string;
  recognitionDate?: string;
  expiryDate?: string;
  shift: 1 | 2;
}

export interface NCTEInstitution {
  institutionId: string;
  ncteApplicationNumber: string;
  institutionName: string;
  address: string;
  state: string;
  district: string;
  pincode: string;
  phone: string;
  email: string;
  institutionType: NCTEInstitutionType;
  minorityStatus: boolean;
  minorityType?: 'minority' | 'linguistic' | 'religious';
  establishmentYear: number;
  affiliation: string;
  parentOrganization: string;
  courses: NCTECourse[];
  nbaAccreditation?: boolean;
  nirfRanking?: number;
  lastVerifiedAt: string;
  source: 'ncte';
}

export interface NCTEVerificationResult {
  institutionId: string;
  isVerified: boolean;
  verificationDate: string;
  expiryDate?: string;
  coursesVerified: number;
  coursesApproved: number;
  totalApprovedIntake: number;
  warnings?: string[];
  details: NCTEInstitution;
}

export interface NCTESearchFilters {
  state?: string;
  district?: string;
  type?: NCTEInstitutionType;
  status?: CourseApprovalStatus;
  establishmentYearFrom?: number;
  establishmentYearTo?: number;
  page?: number;
  limit?: number;
}

export interface NCTEPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response types
export interface NCTEApiResponse<T> {
  success: boolean;
  responseCode: string;
  responseMessage: string;
  data?: T;
  errors?: string[];
  timestamp: string;
}

export class NCTEIntegration {
  private config: NCTEConfig;
  private sessionToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: Partial<NCTEConfig> = {}) {
    this.config = {
      apiBaseUrl: config.apiBaseUrl || process.env.NCTE_API_BASE_URL || 'https://api.ncte-india.org',
      apiKey: config.apiKey || process.env.NCTE_API_KEY || '',
      secretKey: config.secretKey || process.env.NCTE_SECRET_KEY || '',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
    };
  }

  /**
   * Initialize session with NCTE API
   */
  async initializeSession(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ sessionToken: string; expiresIn: number }>(
        '/auth/session',
        'POST',
        {
          apiKey: this.config.apiKey,
          secretKey: this.config.secretKey,
          clientId: 'verification-portal',
        }
      );

      if (response.success && response.data) {
        this.sessionToken = response.data.sessionToken;
        this.tokenExpiry = new Date(Date.now() + response.data.expiresIn * 1000);
        return true;
      }

      return false;
    } catch (error) {
      console.error('NCTE session initialization failed:', error);
      return false;
    }
  }

  /**
   * Check and refresh session if needed
   */
  private ensureValidSession(): boolean {
    if (!this.sessionToken || !this.tokenExpiry) {
      return false;
    }
    // Session valid for 10 more minutes
    return new Date(Date.now() + 10 * 60 * 1000) < this.tokenExpiry;
  }

  /**
   * Verify teacher education institution
   */
  async verifyInstitution(institutionId: string): Promise<NCTEVerificationResult | null> {
    if (!this.ensureValidSession()) {
      await this.initializeSession();
    }

    try {
      const response = await this.makeRequest<NCTEVerificationResult>(
        `/institution/verify/${institutionId}`,
        'GET',
        undefined,
        { 'X-Session-Token': this.sessionToken! }
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Failed to verify NCTE institution ${institutionId}:`, error);
      return null;
    }
  }

  /**
   * Search institutions by various criteria
   */
  async searchInstitutions(filters: NCTESearchFilters): Promise<NCTEPaginatedResponse<NCTEInstitution> | null> {
    if (!this.ensureValidSession()) {
      await this.initializeSession();
    }

    try {
      const params = new URLSearchParams();
      
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('courseStatus', filters.status);
      if (filters.establishmentYearFrom) params.append('yearFrom', filters.establishmentYearFrom.toString());
      if (filters.establishmentYearTo) params.append('yearTo', filters.establishmentYearTo.toString());
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 20).toString());

      const response = await this.makeRequest<NCTEPaginatedResponse<NCTEInstitution>>(
        `/institution/search?${params.toString()}`,
        'GET',
        undefined,
        { 'X-Session-Token': this.sessionToken! }
      );

      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Failed to search NCTE institutions:', error);
      return null;
    }
  }

  /**
   * Get detailed course information for an institution
   */
  async getInstitutionCourses(institutionId: string): Promise<NCTECourse[] | null> {
    if (!this.ensureValidSession()) {
      await this.initializeSession();
    }

    try {
      const response = await this.makeRequest<{ courses: NCTECourse[] }>(
        `/institution/${institutionId}/courses`,
        'GET',
        undefined,
        { 'X-Session-Token': this.sessionToken! }
      );

      return response.success && response.data ? response.data.courses : null;
    } catch (error) {
      console.error(`Failed to get courses for institution ${institutionId}:`, error);
      return null;
    }
  }

  /**
   * Verify specific course approval status
   */
  async verifyCourseApproval(
    institutionId: string,
    courseCode: string
  ): Promise<{ verified: boolean; details: NCTECourse } | null> {
    if (!this.ensureValidSession()) {
      await this.initializeSession();
    }

    try {
      const response = await this.makeRequest<{ verified: boolean; details: NCTECourse }>(
        `/institution/${institutionId}/course/${courseCode}/verify`,
        'GET',
        undefined,
        { 'X-Session-Token': this.sessionToken! }
      );

      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error(`Failed to verify course ${courseCode}:`, error);
      return null;
    }
  }

  /**
   * Get PDF of official approval letter
   */
  async getApprovalLetter(
    institutionId: string,
    courseCode: string
  ): Promise<{ pdfUrl: string; expiresAt: string } | null> {
    if (!this.ensureValidSession()) {
      await this.initializeSession();
    }

    try {
      const response = await this.makeRequest<{ pdfUrl: string; expiresAt: string }>(
        `/institution/${institutionId}/course/${courseCode}/approval-letter`,
        'GET',
        undefined,
        { 'X-Session-Token': this.sessionToken! }
      );

      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error(`Failed to get approval letter for ${courseCode}:`, error);
      return null;
    }
  }

  /**
   * Batch verification for multiple institutions
   */
  async batchVerifyInstitutions(
    institutionIds: string[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<Map<string, NCTEVerificationResult>> {
    const results = new Map<string, NCTEVerificationResult>();
    let completed = 0;

    // Ensure session is valid
    if (!this.ensureValidSession()) {
      await this.initializeSession();
    }

    for (const institutionId of institutionIds) {
      const result = await this.verifyInstitution(institutionId);
      if (result) {
        results.set(institutionId, result);
      }
      completed++;
      onProgress?.(completed, institutionIds.length);
    }

    return results;
  }

  /**
   * Get compliance report for an institution
   */
  async getComplianceReport(institutionId: string): Promise<{
    reportDate: string;
    complianceScore: number;
    totalRequirements: number;
    metRequirements: number;
    pendingRequirements: string[];
    recommendations: string[];
  } | null> {
    if (!this.ensureValidSession()) {
      await this.initializeSession();
    }

    try {
      const response = await this.makeRequest<any>(
        `/institution/${institutionId}/compliance-report`,
        'GET',
        undefined,
        { 'X-Session-Token': this.sessionToken! }
      );

      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error(`Failed to get compliance report for ${institutionId}:`, error);
      return null;
    }
  }

  /**
   * Sync institution data for real-time updates
   */
  async syncInstitutionData(institutionId: string): Promise<{
    institution: NCTEInstitution | null;
    verificationResult: NCTEVerificationResult | null;
    lastSyncedAt: string;
  }> {
    const [institution, verificationResult] = await Promise.all([
      this.getInstitutionDetails(institutionId),
      this.verifyInstitution(institutionId),
    ]);

    return {
      institution,
      verificationResult,
      lastSyncedAt: new Date().toISOString(),
    };
  }

  /**
   * Get institution details
   */
  async getInstitutionDetails(institutionId: string): Promise<NCTEInstitution | null> {
    if (!this.ensureValidSession()) {
      await this.initializeSession();
    }

    try {
      const response = await this.makeRequest<NCTEInstitution>(
        `/institution/${institutionId}`,
        'GET',
        undefined,
        { 'X-Session-Token': this.sessionToken! }
      );

      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error(`Failed to get institution details for ${institutionId}:`, error);
      return null;
    }
  }

  /**
   * Make API request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    additionalHeaders?: Record<string, string>
  ): Promise<NCTEApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'User-Agent': 'Verification-Portal/1.0',
          ...additionalHeaders,
        };

        if (body && method !== 'GET') {
          headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${this.config.apiBaseUrl}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        return {
          success: data.responseCode === '200',
          responseCode: data.responseCode,
          responseMessage: data.responseMessage,
          data: data.data,
          errors: data.errors,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }

    return {
      success: false,
      responseCode: '500',
      responseMessage: lastError?.message || 'Request failed after all retries',
      errors: [lastError?.message || 'Unknown error'],
      timestamp: new Date().toISOString(),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const ncteIntegration = new NCTEIntegration();

// Helper functions
export function getInstitutionTypeDisplay(type: NCTEInstitutionType): string {
  const displayNames: Record<NCTEInstitutionType, string> = {
    bed_college: 'B.Ed. College',
    med_college: 'M.Ed. College',
    diploma_institute: 'Diploma Institute',
    play_teacher_training: 'Play Teacher Training',
    correspondence: 'Correspondence/Distance Learning',
    short_term_course: 'Short Term Course Provider',
  };
  return displayNames[type];
}

export function getCourseStatusDisplay(status: CourseApprovalStatus): {
  label: string;
  color: string;
  bgColor: string;
} {
  const config: Record<CourseApprovalStatus, { label: string; color: string; bgColor: string }> = {
    approved: { label: 'Approved', color: '#059669', bgColor: '#d1fae5' },
    pending: { label: 'Pending', color: '#d97706', bgColor: '#fef3c7' },
    rejected: { label: 'Rejected', color: '#dc2626', bgColor: '#fee2e2' },
    expired: { label: 'Expired', color: '#64748b', bgColor: '#f1f5f9' },
    reduced_intake: { label: 'Reduced Intake', color: '#7c3aed', bgColor: '#ede9fe' },
  };
  return config[status];
}

export function calculateTotalIntake(courses: NCTECourse[]): number {
  return courses
    .filter(c => c.status === 'approved')
    .reduce((total, course) => total + course.approvedIntake, 0);
}
