/**
 * CBSE (Central Board of Secondary Education) Integration Module
 * Real API connection for CBSE school affiliation and student verification
 */

import { z } from 'zod';
import { 
  School, 
  SchoolVerificationResult, 
  StudentVerification,
  SchoolBoardConfig,
  SchoolSearchFilters,
  PaginatedSchools,
  SchoolBoardType,
  getBoardDisplayName,
  getAffiliationStatusDisplay,
  getVerificationStatusDisplay
} from './school-board-types';

// CBSE API Configuration
export interface CBSEConfig extends SchoolBoardConfig {
  regionalOffice?: string;
}

// CBSE School data
export interface CBSESchool extends Omit<School, 'board'> {
  board: 'cbse';
  affiliationNumber: string; // Format: XXXX-XX-XXXX
  schoolCode?: string;
  region: string;
  regionalOffice: string;
  affiliationType: 'primary' | 'secondary' | 'sr_secondary' | 'composite';
  lastInspectionDate?: string;
  nextInspectionDue?: string;
  nocNumber?: string;
  nocDate?: string;
  disabledFriendly: boolean;
  minorityStatus: boolean;
}

// CBSE Student data (10th/12th)
export interface CBSEStudentResult {
  rollNumber: string;
  enrollmentNumber: string;
  candidateName: string;
  motherName: string;
  fatherName: date;
  dateOfBirth: string;
  gender: string;
  schoolNumber: string;
  schoolName: string;
  subjects: {
    subjectCode: string;
    subjectName: string;
    theoryMarks: number;
    practicalMarks: number;
    totalMarks: number;
    grade: string;
  }[];
  overallResult: {
    cgpa: number;
    percentage: number;
    grade: string;
    resultStatus: 'pass' | 'fail' | ' compartment';
    compartmentSubject?: string;
  };
  resultDeclarationDate: string;
  certificateNumber: string;
  marksheetNumber: string;
}

// API Response types
export interface CBSEApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

// CBSE Region codes
export const CBSE_REGIONS = {
  'delhi': 'Delhi',
  'chandigarh': 'Chandigarh',
  'ajmer': 'Ajmer',
  'allahabad': 'Allahabad',
  'bihar': 'Patna',
  'guwahati': 'Guwahati',
  'hyderabad': 'Hyderabad',
  'jaipur': 'Jaipur',
  'jammu': 'Jammu',
  'kolkata': 'Kolkata',
  'lucknow': 'Lucknow',
  'mumbai': 'Mumbai',
  'nagpur': 'Nagpur',
  'ranchi': 'Ranchi',
  'tvm': 'Thiruvananthapuram',
} as const;

export type CBSERegion = keyof typeof CBSE_REGIONS;

export class CBSEIntegration {
  private config: CBSEConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: Partial<CBSEConfig> = {}) {
    this.config = {
      apiBaseUrl: config.apiBaseUrl || process.env.CBSE_API_BASE_URL || 'https://api.cbse.gov.in',
      apiKey: config.apiKey || process.env.CBSE_API_KEY || '',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      regionalOffice: config.regionalOffice,
    };
  }

  /**
   * Authenticate with CBSE API
   */
  async authenticate(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ access_token: string; expires_in: number }>(
        '/auth/token',
        'POST',
        {
          grant_type: 'client_credentials',
          client_id: this.config.apiKey,
          scope: 'cbse_school cbse_result',
        }
      );

      if (response.success && response.data) {
        this.accessToken = response.data.access_token;
        this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
        return true;
      }

      return false;
    } catch (error) {
      console.error('CBSE authentication failed:', error);
      return false;
    }
  }

  /**
   * Check and refresh token if needed
   */
  private async getValidToken(): Promise<string> {
    if (!this.accessToken || !this.tokenExpiry || new Date() >= this.tokenExpiry) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error('Failed to authenticate with CBSE API');
      }
    }
    return this.accessToken!;
  }

  /**
   * Verify school affiliation with CBSE
   */
  async verifySchoolAffiliation(
    affiliationNumber: string
  ): Promise<SchoolVerificationResult | null> {
    try {
      const token = await this.getValidToken();
      
      const response = await this.makeRequest<CBSESchool>(
        `/schools/affiliation/${affiliationNumber}`,
        'GET',
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success && response.data) {
        const school: School = {
          schoolId: response.data.schoolId,
          udiseCode: response.data.udiseCode,
          board: 'cbse',
          affiliationNumber: response.data.affiliationNumber,
          schoolName: response.data.schoolName,
          address: response.data.address,
          contact: response.data.contact,
          affiliationStatus: response.data.affiliationStatus,
          affiliationLevel: response.data.affiliationLevel,
          streams: response.data.streams,
          yearOfEstablishment: response.data.yearOfEstablishment,
          management: response.data.management,
          coEducation: response.data.coEducation,
          mediumOfInstruction: response.data.mediumOfInstruction,
          verifiedAt: new Date().toISOString(),
        };

        const status = this.mapAffiliationStatus(response.data.affiliationStatus);

        return {
          schoolId: school.schoolId,
          udiseCode: school.udiseCode,
          board: 'cbse',
          verificationDate: new Date().toISOString(),
          status: status.verified ? 'verified' : 'pending',
          school,
          warnings: status.warnings,
          recommendations: status.recommendations,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to verify CBSE school ${affiliationNumber}:`, error);
      return null;
    }
  }

  /**
   * Search CBSE affiliated schools
   */
  async searchSchools(filters: SchoolSearchFilters): Promise<PaginatedSchools | null> {
    try {
      const token = await this.getValidToken();
      
      const params = new URLSearchParams();
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.affiliationStatus) params.append('status', filters.affiliationStatus);
      if (filters.management) params.append('management', filters.management);
      params.append('board', 'cbse');
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 20).toString());

      const response = await this.makeRequest<{ schools: CBSESchool[]; total: number }>(
        `/schools/search?${params.toString()}`,
        'GET',
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success && response.data) {
        const schools: School[] = response.data.schools.map(s => ({
          schoolId: s.schoolId,
          udiseCode: s.udiseCode,
          board: 'cbse',
          affiliationNumber: s.affiliationNumber,
          schoolName: s.schoolName,
          address: s.address,
          contact: s.contact,
          affiliationStatus: s.affiliationStatus,
          affiliationLevel: s.affiliationLevel,
          streams: s.streams,
          yearOfEstablishment: s.yearOfEstablishment,
          management: s.management,
          coEducation: s.coEducation,
          mediumOfInstruction: s.mediumOfInstruction,
          verifiedAt: new Date().toISOString(),
        }));

        return {
          schools,
          total: response.data.total,
          page: filters.page || 1,
          limit: filters.limit || 20,
          totalPages: Math.ceil(response.data.total / (filters.limit || 20)),
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to search CBSE schools:', error);
      return null;
    }
  }

  /**
   * Verify 10th/12th class result
   */
  async verifyStudentResult(
    rollNumber: string,
    year: number,
    classLevel: 10 | 12
  ): Promise<StudentVerification | null> {
    try {
      const token = await this.getValidToken();
      
      const endpoint = classLevel === 10 
        ? `/results/class10/${rollNumber}/${year}`
        : `/results/class12/${rollNumber}/${year}`;

      const response = await this.makeRequest<CBSEStudentResult>(
        endpoint,
        'GET',
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success && response.data) {
        const isAuthentic = response.data.overallResult.resultStatus === 'pass' ||
          response.data.overallResult.resultStatus === 'compartment';

        return {
          studentId: `cbse_${rollNumber}_${year}`,
          schoolId: response.data.schoolNumber,
          board: 'cbse',
          rollNumber: response.data.rollNumber,
          enrollmentNumber: response.data.enrollmentNumber,
          yearOfPassing: year,
          class: classLevel,
          result: {
            overall: response.data.overallResult.grade,
            percentage: response.data.overallResult.percentage,
            grade: response.data.overallResult.grade,
            cgpa: response.data.overallResult.cgpa,
          },
          subjects: response.data.subjects.map(s => ({
            name: s.subjectName,
            marks: s.totalMarks,
            grade: s.grade,
          })),
          certificateNumber: response.data.certificateNumber,
          verificationDate: new Date().toISOString(),
          isAuthentic,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to verify CBSE result for roll ${rollNumber}:`, error);
      return null;
    }
  }

  /**
   * Get school details by UDISE code
   */
  async getSchoolByUDISE(udiseCode: string): Promise<School | null> {
    try {
      const token = await this.getValidToken();
      
      const response = await this.makeRequest<CBSESchool>(
        `/schools/udise/${udiseCode}`,
        'GET',
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success && response.data) {
        return {
          schoolId: response.data.schoolId,
          udiseCode: response.data.udiseCode,
          board: 'cbse',
          affiliationNumber: response.data.affiliationNumber,
          schoolName: response.data.schoolName,
          address: response.data.address,
          contact: response.data.contact,
          affiliationStatus: response.data.affiliationStatus,
          affiliationLevel: response.data.affiliationLevel,
          streams: response.data.streams,
          yearOfEstablishment: response.data.yearOfEstablishment,
          management: response.data.management,
          coEducation: response.data.coEducation,
          mediumOfInstruction: response.data.mediumOfInstruction,
          verifiedAt: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to get CBSE school by UDISE ${udiseCode}:`, error);
      return null;
    }
  }

  /**
   * Batch verify multiple schools
   */
  async batchVerifySchools(
    affiliationNumbers: string[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<Map<string, SchoolVerificationResult>> {
    const results = new Map<string, SchoolVerificationResult>();
    let completed = 0;

    for (const affiliationNumber of affiliationNumbers) {
      const result = await this.verifySchoolAffiliation(affiliationNumber);
      if (result) {
        results.set(affiliationNumber, result);
      }
      completed++;
      onProgress?.(completed, affiliationNumbers.length);
    }

    return results;
  }

  /**
   * Map CBSE affiliation status to internal status
   */
  private mapAffiliationStatus(status: string): {
    verified: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'affiliated') {
      return {
        verified: true,
        warnings: [],
        recommendations: [],
      };
    }
    
    if (statusLower === 'temporary_affiliation') {
      return {
        verified: true,
        warnings: ['School has temporary affiliation - verify renewal status'],
        recommendations: ['Check for permanent affiliation upgrade'],
      };
    }
    
    if (statusLower === 'upgradation_pending') {
      return {
        verified: true,
        warnings: ['Upgradation to higher level is pending'],
        recommendations: ['Verify upgradation status with CBSE regional office'],
      };
    }
    
    if (statusLower === 'deaffiliated' || statusLower === 'closed') {
      return {
        verified: false,
        warnings: ['School is no longer affiliated with CBSE'],
        recommendations: ['Contact CBSE regional office for current status'],
      };
    }

    return {
      verified: false,
      warnings: ['Unable to determine affiliation status'],
      recommendations: ['Contact CBSE directly for verification'],
    };
  }

  /**
   * Get CBSE regions list
   */
  getRegions(): { code: CBSERegion; name: string }[] {
    return Object.entries(CBSE_REGIONS).map(([code, name]) => ({
      code: code as CBSERegion,
      name,
    }));
  }

  /**
   * Make authenticated API request with retry
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST',
    body?: any,
    additionalHeaders?: Record<string, string>
  ): Promise<CBSEApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const headers: Record<string, string> = {
          'Accept': 'application/json',
          ...additionalHeaders,
        };

        if (body) {
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
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();

        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.config.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
        }
      }
    }

    return {
      success: false,
      error: {
        code: 'API_ERROR',
        message: lastError?.message || 'Request failed after all retries',
      },
    };
  }
}

// Export singleton instance
export const cbseIntegration = new CBSEIntegration();

// Helper function to validate CBSE affiliation number format
export function validateCBSEAffiliationNumber(affiliationNumber: string): boolean {
  // CBSE affiliation numbers are typically 10 digits with hyphens
  // Format: XXXX-XX-XXXX or XXXXXXXXXX
  const cleaned = affiliationNumber.replace(/-/g, '');
  return /^\d{10}$/.test(cleaned);
}

// Helper to format CBSE affiliation number
export function formatCBSEAffiliationNumber(affiliationNumber: string): string {
  const cleaned = affiliationNumber.replace(/-/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6)}`;
  }
  return affiliationNumber;
}

// Helper to validate roll number format
export function validateCBSERollNumber(rollNumber: string, classLevel: 10 | 12): boolean {
  // CBSE roll numbers are typically 7 digits for class 10, 7 digits for class 12
  return /^\d{7}$/.test(rollNumber);
}
