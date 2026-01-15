/**
 * ICSE (Indian Certificate of Secondary Education) Integration Module
 * Real API connection for ICSE school affiliation and student verification
 */

import { z } from 'zod';
import { 
  School, 
  SchoolVerificationResult, 
  StudentVerification,
  SchoolBoardConfig,
  SchoolSearchFilters,
  PaginatedSchools,
  getBoardDisplayName,
  getAffiliationStatusDisplay,
  getVerificationStatusDisplay
} from './school-board-types';

// ICSE Configuration
export interface ICSEConfig extends SchoolBoardConfig {
  councilNumber?: string;
}

// ICSE School data
export interface ICSESchool extends Omit<School, 'board'> {
  board: 'icse';
  councilNumber: string; // Format: XXXXXX
  schoolIndexNumber: string;
  region: string;
  zone: string;
  affiliationType: 'constituent' | 'affiliated';
  sectionType: 'boys' | 'girls' | 'co-ed';
  establishedYear: number;
  mediumOfInstruction: string[];
  recognisedBy: string[];
  boardType: 'icse' | 'isc';
  lastEvaluationDate?: string;
  nextEvaluationDue?: string;
}

// ICSE Student data
export interface ICSEStudentResult {
  indexNumber: string;
  candidateName: string;
  gender: string;
  dateOfBirth: string;
  subjectOptions: {
    subjectGroup: string;
    subjects: {
      subjectCode: string;
      subjectName: string;
      marks: number;
      grade: string;
    }[];
  }[];
  overallResult: {
    totalMarks: number;
    percentage: number;
    grade: string;
    position: number;
    resultStatus: 'pass' | 'fail';
  };
  schoolCode: string;
  schoolName: string;
  examYear: number;
  examMonth: string; // 'march' or 'october' for private candidates
  certificateNumber: string;
  marksheetNumber: string;
}

// API Response types
export interface ICSEApiResponse<T> {
  success: boolean;
  responseCode: string;
  responseMessage: string;
  data?: T;
  errors?: string[];
  timestamp: string;
}

// ICSE Zones
export const ICSE_ZONES = {
  'east': 'East Zone',
  'west': 'West Zone',
  'north': 'North Zone',
  'south': 'South Zone',
  'central': 'Central Zone',
  'delhi': 'Delhi Zone',
} as const;

export type ICSEZone = keyof typeof ICSE_ZONES;

// ICSE Subject groups for Class 10
export const ICSE_CLASS_10_SUBJECTS = [
  'English Language',
  'English Literature',
  'Hindi',
  'History & Civics',
  'Geography',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Commercial Studies',
  'Environmental Science',
  'Sanskrit',
  'French',
  'German',
  'Spanish',
  'Art & Craft',
  'Physical Education',
];

// ICSE Subject groups for Class 12 (ISC)
export const ICSE_CLASS_12_SUBJECTS = [
  'English',
  'Hindi',
  'History',
  'Political Science',
  'Geography',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Commerce',
  'Accounts',
  'Business Studies',
  'Psychology',
  'Sociology',
  'Physical Education',
  'Fine Arts',
  'Music',
  'French',
  'German',
  'Spanish',
];

export class ICSEIntegration {
  private config: ICSEConfig;
  private sessionToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: Partial<ICSEConfig> = {}) {
    this.config = {
      apiBaseUrl: config.apiBaseUrl || process.env.ICSE_API_BASE_URL || 'https://api.icse.org.in',
      apiKey: config.apiKey || process.env.ICSE_API_KEY || '',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      councilNumber: config.councilNumber,
    };
  }

  /**
   * Initialize session with ICSE API
   */
  async initializeSession(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ sessionToken: string; expiresIn: number }>(
        '/auth/session',
        'POST',
        {
          apiKey: this.config.apiKey,
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
      console.error('ICSE session initialization failed:', error);
      return false;
    }
  }

  /**
   * Check and refresh session if needed
   */
  private async ensureValidSession(): Promise<string> {
    if (!this.sessionToken || !this.tokenExpiry || new Date() >= this.tokenExpiry) {
      const initialized = await this.initializeSession();
      if (!initialized) {
        throw new Error('Failed to initialize ICSE session');
      }
    }
    return this.sessionToken!;
  }

  /**
   * Verify ICSE school affiliation
   */
  async verifySchoolAffiliation(
    councilNumber: string
  ): Promise<SchoolVerificationResult | null> {
    try {
      const token = await this.ensureValidSession();
      
      const response = await this.makeRequest<ICSESchool>(
        `/schools/affiliation/${councilNumber}`,
        'GET',
        undefined,
        { 'X-Session-Token': token }
      );

      if (response.success && response.data) {
        const school: School = {
          schoolId: response.data.schoolId,
          udiseCode: response.data.udiseCode,
          board: 'icse',
          affiliationNumber: response.data.councilNumber,
          schoolName: response.data.schoolName,
          address: response.data.address,
          contact: response.data.contact,
          affiliationStatus: response.data.affiliationStatus || 'affiliated',
          affiliationLevel: {
            primary: response.data.affiliationType === 'constituent' || 
                     response.data.schoolIndexNumber?.startsWith('P'),
            upperPrimary: true,
            secondary: true,
            seniorSecondary: response.data.boardType === 'isc',
          },
          streams: ['science', 'commerce', 'arts'], // ICSE typically offers all streams
          yearOfEstablishment: response.data.establishedYear,
          management: 'private_aided', // Most ICSE schools are private
          coEducation: response.data.sectionType === 'co-ed',
          mediumOfInstruction: response.data.mediumOfInstruction,
          verifiedAt: new Date().toISOString(),
        };

        const status = this.mapAffiliationStatus(response.data);

        return {
          schoolId: school.schoolId,
          udiseCode: school.udiseCode,
          board: 'icse',
          verificationDate: new Date().toISOString(),
          status: status.verified ? 'verified' : 'pending',
          school,
          warnings: status.warnings,
          recommendations: status.recommendations,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to verify ICSE school ${councilNumber}:`, error);
      return null;
    }
  }

  /**
   * Search ICSE affiliated schools
   */
  async searchSchools(filters: SchoolSearchFilters): Promise<PaginatedSchools | null> {
    try {
      const token = await this.ensureValidSession();
      
      const params = new URLSearchParams();
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.affiliationStatus) params.append('status', filters.affiliationStatus);
      params.append('board', 'icse');
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 20).toString());

      const response = await this.makeRequest<{ schools: ICESchool[]; total: number }>(
        `/schools/search?${params.toString()}`,
        'GET',
        undefined,
        { 'X-Session-Token': token }
      );

      if (response.success && response.data) {
        const schools: School[] = response.data.schools.map(s => ({
          schoolId: s.schoolId,
          udiseCode: s.udiseCode,
          board: 'icse',
          affiliationNumber: s.councilNumber,
          schoolName: s.schoolName,
          address: s.address,
          contact: s.contact,
          affiliationStatus: s.affiliationStatus || 'affiliated',
          affiliationLevel: {
            primary: true,
            upperPrimary: true,
            secondary: true,
            seniorSecondary: s.boardType === 'isc',
          },
          streams: ['science', 'commerce', 'arts'],
          yearOfEstablishment: s.establishedYear,
          management: 'private_aided',
          coEducation: s.sectionType === 'co-ed',
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
      console.error('Failed to search ICSE schools:', error);
      return null;
    }
  }

  /**
   * Verify ICSE/ISC student result (Class 10/12)
   */
  async verifyStudentResult(
    indexNumber: string,
    year: number,
    examMonth: 'march' | 'october' = 'march'
  ): Promise<StudentVerification | null> {
    try {
      const token = await this.ensureValidSession();
      
      const endpoint = `/results/${indexNumber}/${year}/${examMonth}`;

      const response = await this.makeRequest<ICSEStudentResult>(
        endpoint,
        'GET',
        undefined,
        { 'X-Session-Token': token }
      );

      if (response.success && response.data) {
        const isAuthentic = response.data.overallResult.resultStatus === 'pass';

        return {
          studentId: `icse_${indexNumber}_${year}`,
          schoolId: response.data.schoolCode,
          board: 'icse',
          rollNumber: response.data.indexNumber,
          enrollmentNumber: response.data.indexNumber,
          yearOfPassing: year,
          class: response.data.schoolName.toLowerCase().includes('isc') ? 12 : 10,
          result: {
            overall: response.data.overallResult.grade,
            percentage: response.data.overallResult.percentage,
            grade: response.data.overallResult.grade,
            cgpa: response.data.overallResult.percentage / 9.5, // Approximate CGPA
          },
          subjects: response.data.subjectOptions.flatMap(og => 
            og.subjects.map(s => ({
              name: s.subjectName,
              marks: s.marks,
              grade: s.grade,
            }))
          ),
          certificateNumber: response.data.certificateNumber,
          verificationDate: new Date().toISOString(),
          isAuthentic,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to verify ICSE result for index ${indexNumber}:`, error);
      return null;
    }
  }

  /**
   * Get school details by council number
   */
  async getSchoolByCouncilNumber(councilNumber: string): Promise<School | null> {
    try {
      const token = await this.ensureValidSession();
      
      const response = await this.makeRequest<ICESchool>(
        `/schools/${councilNumber}`,
        'GET',
        undefined,
        { 'X-Session-Token': token }
      );

      if (response.success && response.data) {
        return {
          schoolId: response.data.schoolId,
          udiseCode: response.data.udiseCode,
          board: 'icse',
          affiliationNumber: response.data.councilNumber,
          schoolName: response.data.schoolName,
          address: response.data.address,
          contact: response.data.contact,
          affiliationStatus: response.data.affiliationStatus || 'affiliated',
          affiliationLevel: {
            primary: true,
            upperPrimary: true,
            secondary: true,
            seniorSecondary: response.data.boardType === 'isc',
          },
          streams: ['science', 'commerce', 'arts'],
          yearOfEstablishment: response.data.establishedYear,
          management: 'private_aided',
          coEducation: response.data.sectionType === 'co-ed',
          mediumOfInstruction: response.data.mediumOfInstruction,
          verifiedAt: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to get ICSE school ${councilNumber}:`, error);
      return null;
    }
  }

  /**
   * Batch verify multiple schools
   */
  async batchVerifySchools(
    councilNumbers: string[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<Map<string, SchoolVerificationResult>> {
    const results = new Map<string, SchoolVerificationResult>();
    let completed = 0;

    // Ensure session is valid
    await this.ensureValidSession();

    for (const councilNumber of councilNumbers) {
      const result = await this.verifySchoolAffiliation(councilNumber);
      if (result) {
        results.set(councilNumber, result);
      }
      completed++;
      onProgress?.(completed, councilNumbers.length);
    }

    return results;
  }

  /**
   * Map ICSE school status to internal status
   */
  private mapAffiliationStatus(school: ICESchool): {
    verified: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (school.affiliationType === 'constituent') {
      // Constituent schools are directly managed by ICSE
      return {
        verified: true,
        warnings: [],
        recommendations: [],
      };
    }

    // Check evaluation dates
    if (school.lastEvaluationDate) {
      const evalDate = new Date(school.lastEvaluationDate);
      const yearsSinceEval = (Date.now() - evalDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      
      if (yearsSinceEval > 5) {
        warnings.push('School evaluation is overdue');
        recommendations.push('Verify current evaluation status with ICSE');
      }
    }

    // Check if school is recognized
    if (!school.recognisedBy?.includes('Ministry of Education')) {
      warnings.push('Check Ministry of Education recognition status');
    }

    return {
      verified: warnings.length === 0,
      warnings,
      recommendations,
    };
  }

  /**
   * Get ICSE zones list
   */
  getZones(): { code: ICSEZone; name: string }[] {
    return Object.entries(ICSE_ZONES).map(([code, name]) => ({
      code: code as ICSEZone,
      name,
    }));
  }

  /**
   * Get available subjects for a class
   */
  getAvailableSubjects(classLevel: 10 | 12): string[] {
    return classLevel === 10 ? ICSE_CLASS_10_SUBJECTS : ICSE_CLASS_12_SUBJECTS;
  }

  /**
   * Make authenticated API request with retry
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST',
    body?: any,
    additionalHeaders?: Record<string, string>
  ): Promise<ICSEApiResponse<T>> {
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
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
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
}

// Export singleton instance
export const icseIntegration = new ICSEIntegration();

// Helper function to validate ICSE council number format
export function validateICSECouncilNumber(councilNumber: string): boolean {
  // ICSE council numbers are typically 6 digits
  // Format: XXXXXX
  return /^\d{6}$/.test(councilNumber);
}

// Helper to format council number
export function formatICSECouncilNumber(councilNumber: string): string {
  const cleaned = councilNumber.replace(/\s/g, '');
  return cleaned.padStart(6, '0');
}

// Helper to validate ICSE index number format
export function validateICSEIndexNumber(indexNumber: string): boolean {
  // ICSE index numbers are typically 6-7 digits
  // Format: XXXXXX or XXXXXXX
  return /^\d{6,7}$/.test(indexNumber);
}
