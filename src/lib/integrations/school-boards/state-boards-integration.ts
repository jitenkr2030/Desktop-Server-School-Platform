/**
 * State Boards Integration Module
 * Supports major Indian state education boards
 */

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

// State Board Configuration
export interface StateBoardConfig extends SchoolBoardConfig {
  stateCode: string;
}

// Common state board school data structure
export interface StateBoardSchool extends Omit<School, 'board'> {
  board: SchoolBoardType;
  boardRegistrationNumber: string;
  districtCode: string;
  blockCode: string;
  clusterCode: string;
  schoolCategory: 'primary' | 'upper_primary' | 'secondary' | 'higher_secondary';
  managementType: School['management'];
  recognitionStatus: 'recognized' | 'unrecognized' | 'pending';
  minoritySchool: boolean;
  residential: boolean;
  shiftSchool: boolean;
}

// State Board Result Data
export interface StateBoardResult {
  rollNumber: string;
  registrationNumber: string;
  candidateName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  schoolCode: string;
  schoolName: string;
  stream?: string; // For 11th/12th
  subjects: {
    subjectCode: string;
    subjectName: string;
    theoryMarks: number;
    practicalMarks: number;
    totalMarks: number;
    grade?: string;
  }[];
  result: {
    totalMarks: number;
    percentage: number;
    division: 'first' | 'second' | 'third' | 'fail';
    resultStatus: 'pass' | 'fail' | 'compartment';
    compartmentSubjects?: string[];
  };
  passCertificateNumber: string;
  marksheetNumber: string;
  resultDate: string;
}

// Major state boards configuration
export const STATE_BOARDS: Record<SchoolBoardType, {
  name: string;
  apiBaseUrl: string;
  state: string;
  stateCode: string;
}> = {
  'up': {
    name: 'Uttar Pradesh Board',
    apiBaseUrl: 'https://api.upmsce.edu.in',
    state: 'Uttar Pradesh',
    stateCode: '09',
  },
  'mp': {
    name: 'Madhya Pradesh Board',
    apiBaseUrl: 'https://api.mpbse.edu.in',
    state: 'Madhya Pradesh',
    stateCode: '23',
  },
  'rajasthan': {
    name: 'Rajasthan Board',
    apiBaseUrl: 'https://api.rajsboard.edu.in',
    state: 'Rajasthan',
    stateCode: '08',
  },
  'maharashtra': {
    name: 'Maharashtra State Board',
    apiBaseUrl: 'https://api.msbshse.edu.in',
    state: 'Maharashtra',
    stateCode: '27',
  },
  'karnataka': {
    name: 'Karnataka Board',
    apiBaseUrl: 'https://api.kseeb.edu.in',
    state: 'Karnataka',
    stateCode: '29',
  },
  'tamilnadu': {
    name: 'Tamil Nadu Board',
    apiBaseUrl: 'https://api.dntert.gov.in',
    state: 'Tamil Nadu',
    stateCode: '33',
  },
  'gujarat': {
    name: 'Gujarat Board',
    apiBaseUrl: 'https://api.gseb.org',
    state: 'Gujarat',
    stateCode: '24',
  },
  'westbengal': {
    name: 'West Bengal Board',
    apiBaseUrl: 'https://api.wbbpe.edu.in',
    state: 'West Bengal',
    stateCode: '19',
  },
};

// API Response type
export interface StateBoardApiResponse<T> {
  success: boolean;
  status: string;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export class StateBoardsIntegration {
  private configs: Record<string, StateBoardConfig> = {};
  private sessions: Record<string, { token: string; expiry: Date }> = {};

  constructor() {
    // Initialize configs for all state boards
    for (const [boardCode, boardInfo] of Object.entries(STATE_BOARDS)) {
      this.configs[boardCode] = {
        apiBaseUrl: boardInfo.apiBaseUrl,
        apiKey: process.env[`${boardCode.toUpperCase()}_BOARD_API_KEY`] || '',
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000,
        stateCode: boardInfo.stateCode,
      };
    }
  }

  /**
   * Get available state boards
   */
  getAvailableBoards(): { code: SchoolBoardType; name: string; state: string }[] {
    return Object.entries(STATE_BOARDS).map(([code, info]) => ({
      code: code as SchoolBoardType,
      name: info.name,
      state: info.state,
    }));
  }

  /**
   * Initialize session for a specific state board
   */
  async initializeSession(boardCode: string): Promise<boolean> {
    const config = this.configs[boardCode];
    if (!config) {
      console.error(`Unknown state board: ${boardCode}`);
      return false;
    }

    try {
      const response = await this.makeRequest<{ token: string; expiresIn: number }>(
        boardCode,
        '/auth/token',
        'POST',
        { grant_type: 'client_credentials' }
      );

      if (response.success && response.data) {
        this.sessions[boardCode] = {
          token: response.data.token,
          expiry: new Date(Date.now() + response.data.expiresIn * 1000),
        };
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Failed to initialize session for ${boardCode}:`, error);
      return false;
    }
  }

  /**
   * Get valid session token for a board
   */
  private async getValidToken(boardCode: string): Promise<string> {
    const session = this.sessions[boardCode];
    const config = this.configs[boardCode];
    
    if (!session || !session.expiry || new Date() >= session.expiry) {
      const initialized = await this.initializeSession(boardCode);
      if (!initialized) {
        throw new Error(`Failed to initialize session for ${boardCode}`);
      }
      return this.sessions[boardCode].token;
    }
    
    return session.token;
  }

  /**
   * Verify school affiliation with a state board
   */
  async verifySchoolAffiliation(
    boardCode: SchoolBoardType,
    schoolCode: string
  ): Promise<SchoolVerificationResult | null> {
    try {
      const token = await this.getValidToken(boardCode);
      const config = this.configs[boardCode];
      
      const response = await this.makeRequest<StateBoardSchool>(
        boardCode,
        `/schools/${schoolCode}`,
        'GET',
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success && response.data) {
        const school: School = {
          schoolId: response.data.schoolId,
          udiseCode: response.data.udiseCode,
          board: boardCode,
          affiliationNumber: response.data.boardRegistrationNumber,
          schoolName: response.data.schoolName,
          address: response.data.address,
          contact: response.data.contact,
          affiliationStatus: response.data.recognitionStatus,
          affiliationLevel: {
            primary: response.data.schoolCategory === 'primary' || 
                     response.data.schoolCategory === 'upper_primary',
            upperPrimary: response.data.schoolCategory === 'upper_primary' ||
                          response.data.schoolCategory === 'secondary',
            secondary: response.data.schoolCategory === 'secondary' ||
                       response.data.schoolCategory === 'higher_secondary',
            seniorSecondary: response.data.schoolCategory === 'higher_secondary',
          },
          streams: response.data.streams || [],
          yearOfEstablishment: response.data.yearOfEstablishment,
          management: response.data.managementType,
          coEducation: response.data.coEducation,
          mediumOfInstruction: response.data.mediumOfInstruction,
          verifiedAt: new Date().toISOString(),
        };

        const status = this.mapRecognitionStatus(response.data);

        return {
          schoolId: school.schoolId,
          udiseCode: school.udiseCode,
          board: boardCode,
          verificationDate: new Date().toISOString(),
          status: status.verified ? 'verified' : 'pending',
          school,
          warnings: status.warnings,
          recommendations: status.recommendations,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to verify ${boardCode} school ${schoolCode}:`, error);
      return null;
    }
  }

  /**
   * Search schools in a state board
   */
  async searchSchools(
    boardCode: SchoolBoardType,
    filters: SchoolSearchFilters
  ): Promise<PaginatedSchools | null> {
    try {
      const token = await this.getValidToken(boardCode);
      
      const params = new URLSearchParams();
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.affiliationStatus) params.append('status', filters.affiliationStatus);
      if (filters.management) params.append('management', filters.management);
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 20).toString());

      const response = await this.makeRequest<{ schools: StateBoardSchool[]; total: number }>(
        boardCode,
        `/schools/search?${params.toString()}`,
        'GET',
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success && response.data) {
        const schools: School[] = response.data.schools.map(s => ({
          schoolId: s.schoolId,
          udiseCode: s.udiseCode,
          board: boardCode,
          affiliationNumber: s.boardRegistrationNumber,
          schoolName: s.schoolName,
          address: s.address,
          contact: s.contact,
          affiliationStatus: s.recognitionStatus,
          affiliationLevel: s.affiliationLevel,
          streams: s.streams,
          yearOfEstablishment: s.yearOfEstablishment,
          management: s.managementType,
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
      console.error(`Failed to search ${boardCode} schools:`, error);
      return null;
    }
  }

  /**
   * Verify student result from a state board
   */
  async verifyStudentResult(
    boardCode: SchoolBoardType,
    rollNumber: string,
    year: number,
    classLevel: 10 | 12
  ): Promise<StudentVerification | null> {
    try {
      const token = await this.getValidToken(boardCode);
      
      const endpoint = classLevel === 10 
        ? `/results/10th/${rollNumber}/${year}`
        : `/results/12th/${rollNumber}/${year}`;

      const response = await this.makeRequest<StateBoardResult>(
        boardCode,
        endpoint,
        'GET',
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success && response.data) {
        const isAuthentic = response.data.result.resultStatus === 'pass';

        return {
          studentId: `${boardCode}_${rollNumber}_${year}`,
          schoolId: response.data.schoolCode,
          board: boardCode,
          rollNumber: response.data.rollNumber,
          enrollmentNumber: response.data.registrationNumber,
          yearOfPassing: year,
          class: classLevel,
          result: {
            overall: response.data.result.division,
            percentage: response.data.result.percentage,
            grade: response.data.result.division,
            cgpa: response.data.result.percentage / 9.5,
          },
          subjects: response.data.subjects.map(s => ({
            name: s.subjectName,
            marks: s.totalMarks,
            grade: s.grade || this.calculateGrade(s.totalMarks),
          })),
          certificateNumber: response.data.passCertificateNumber,
          verificationDate: new Date().toISOString(),
          isAuthentic,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to verify ${boardCode} result for roll ${rollNumber}:`, error);
      return null;
    }
  }

  /**
   * Batch verify schools across multiple boards
   */
  async batchVerifySchools(
    requests: { boardCode: SchoolBoardType; schoolCode: string }[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<Map<string, SchoolVerificationResult>> {
    const results = new Map<string, SchoolVerificationResult>();
    let completed = 0;

    for (const request of requests) {
      const result = await this.verifySchoolAffiliation(
        request.boardCode,
        request.schoolCode
      );
      
      if (result) {
        results.set(`${request.boardCode}_${request.schoolCode}`, result);
      }
      
      completed++;
      onProgress?.(completed, requests.length);
    }

    return results;
  }

  /**
   * Map recognition status to internal status
   */
  private mapRecognitionStatus(school: StateBoardSchool): {
    verified: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (school.recognitionStatus === 'recognized') {
      return {
        verified: true,
        warnings: [],
        recommendations: [],
      };
    }

    if (school.recognitionStatus === 'unrecognized') {
      return {
        verified: false,
        warnings: ['School is not recognized by the state board'],
        recommendations: ['Verify with District Education Office', 'Check if recognition is pending'],
      };
    }

    if (school.recognitionStatus === 'pending') {
      return {
        verified: false,
        warnings: ['School recognition is pending approval'],
        recommendations: ['Check back after recognition is approved'],
      };
    }

    return {
      verified: false,
      warnings: ['Unable to determine recognition status'],
      recommendations: ['Contact the state board directly'],
    };
  }

  /**
   * Calculate grade from marks
   */
  private calculateGrade(marks: number): string {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    return 'D';
  }

  /**
   * Get state by board code
   */
  getStateInfo(boardCode: SchoolBoardType): { name: string; state: string; stateCode: string } | null {
    const info = STATE_BOARDS[boardCode];
    if (!info) return null;
    
    return {
      name: info.name,
      state: info.state,
      stateCode: info.stateCode,
    };
  }

  /**
   * Make API request with retry
   */
  private async makeRequest<T>(
    boardCode: string,
    endpoint: string,
    method: 'GET' | 'POST',
    body?: any,
    additionalHeaders?: Record<string, string>
  ): Promise<StateBoardApiResponse<T>> {
    const config = this.configs[boardCode];
    if (!config) {
      return {
        success: false,
        status: 'error',
        error: `Unknown board: ${boardCode}`,
        timestamp: new Date().toISOString(),
      };
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const headers: Record<string, string> = {
          'Accept': 'application/json',
          ...additionalHeaders,
        };

        if (body) {
          headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        return {
          success: data.status === 'success' || data.success,
          status: data.status || 'success',
          data: data.data,
          error: data.error,
          message: data.message,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < config.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, config.retryDelay * attempt));
        }
      }
    }

    return {
      success: false,
      status: 'error',
      error: lastError?.message || 'Request failed after all retries',
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const stateBoardsIntegration = new StateBoardsIntegration();

// Helper function to validate school code format for state boards
export function validateStateBoardSchoolCode(boardCode: SchoolBoardType, schoolCode: string): boolean {
  // Different state boards have different formats
  const formats: Record<string, RegExp> = {
    'up': /^\d{8,11}$/, // UP board school codes
    'mp': /^\d{6,8}$/,  // MP board school codes
    'rajasthan': /^\d{7,9}$/, // Rajasthan board school codes
    'maharashtra': /^\d{5,7}$/, // Maharashtra board school codes
    'karnataka': /d{5,8}$/, // Karnataka board school codes
    'tamilnadu': /^\d{6,8}$/, // Tamil Nadu board school codes
    'gujarat': /^\d{5,7}$/, // Gujarat board school codes
    'westbengal': /^\d{6,8}$/, // West Bengal board school codes
  };

  const format = formats[boardCode];
  return format ? format.test(schoolCode) : /^\d{5,10}$/.test(schoolCode);
}

// Helper function to validate roll number format for state boards
export function validateStateBoardRollNumber(boardCode: SchoolBoardType, rollNumber: string): boolean {
  // Roll numbers are typically 4-7 digits depending on the board
  return /^\d{4,7}$/.test(rollNumber);
}
