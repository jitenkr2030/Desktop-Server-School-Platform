/**
 * School Board Verification Manager
 * Unified interface for all school board integrations (CBSE, ICSE, State Boards)
 */

import { z } from 'zod';
import {
  School,
  SchoolVerificationResult,
  StudentVerification,
  SchoolBoardType,
  SchoolSearchFilters,
  PaginatedSchools,
  getBoardDisplayName,
  getVerificationStatusDisplay,
  getAffiliationStatusDisplay,
} from './school-board-types';

import {
  CBSEIntegration,
  cbseIntegration,
  validateCBSEAffiliationNumber,
  formatCBSEAffiliationNumber,
} from './cbse-integration';

import {
  ICSEIntegration,
  icseIntegration,
  validateICSECouncilNumber,
  formatICSECouncilNumber,
} from './icse-integration';

import {
  StateBoardsIntegration,
  stateBoardsIntegration,
  validateStateBoardSchoolCode,
  STATE_BOARDS,
} from './state-boards-integration';

// Board code to type mapping
const BOARD_TYPE_MAP: Record<string, SchoolBoardType> = {
  'cbse': 'cbse',
  'icse': 'icse',
  'up': 'up',
  'mp': 'mp',
  'rajasthan': 'rajasthan',
  'maharashtra': 'maharashtra',
  'karnataka': 'karnataka',
  'tamilnadu': 'tamilnadu',
  'gujarat': 'gujarat',
  'westbengal': 'westbengal',
};

// Unified search filters
export interface UnifiedSchoolSearchFilters {
  board?: SchoolBoardType | 'all';
  state?: string;
  district?: string;
  affiliationStatus?: string;
  management?: School['management'];
  page?: number;
  limit?: number;
}

// Verification request types
export type BoardCode = string;

export interface SchoolVerificationRequest {
  board: SchoolBoardType;
  schoolCode: string; // Affiliation number for CBSE, Council number for ICSE, School code for state boards
}

export interface StudentVerificationRequest {
  board: SchoolBoardType;
  rollNumber: string;
  year: number;
  classLevel: 10 | 12;
  examMonth?: string; // For ICSE: 'march' or 'october'
}

export interface UnifiedVerificationResult {
  requestId: string;
  board: SchoolBoardType;
  schoolCode: string;
  status: 'verified' | 'pending' | 'failed';
  result?: SchoolVerificationResult | StudentVerification;
  error?: string;
  completedAt: string;
}

// Batch operation result
export interface BatchVerificationResult<T> {
  success: T[];
  failed: { item: string; error: string }[];
  total: number;
  completedAt: string;
}

// Supported boards information
export interface BoardInfo {
  code: SchoolBoardType;
  name: string;
  fullName: string;
  country: string;
  website: string;
  isActive: boolean;
  features: {
    schoolVerification: boolean;
    studentVerification: boolean;
    batchVerification: boolean;
    apiAccess: boolean;
  };
}

export class SchoolBoardManager {
  // Integration instances
  private cbse: CBSEIntegration;
  private icse: ICSEIntegration;
  private stateBoards: StateBoardsIntegration;

  constructor() {
    this.cbse = cbseIntegration;
    this.icse = icseIntegration;
    this.stateBoards = stateBoardsIntegration;
  }

  /**
   * Get all supported boards
   */
  getSupportedBoards(): BoardInfo[] {
    return [
      {
        code: 'cbse',
        name: 'CBSE',
        fullName: 'Central Board of Secondary Education',
        country: 'India',
        website: 'https://cbse.gov.in',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
      {
        code: 'icse',
        name: 'ICSE',
        fullName: 'Indian Certificate of Secondary Education',
        country: 'India',
        website: 'https://cisce.org',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
      {
        code: 'up',
        name: 'UP Board',
        fullName: 'Uttar Pradesh Board of Secondary Education',
        country: 'India',
        website: 'https://upmsp.edu.in',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
      {
        code: 'mp',
        name: 'MP Board',
        fullName: 'Madhya Pradesh Board of Secondary Education',
        country: 'India',
        website: 'https://mpbse.gov.in',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
      {
        code: 'rajasthan',
        name: 'RBSE',
        fullName: 'Rajasthan Board of Secondary Education',
        country: 'India',
        website: 'https://rajeduboard.rajasthan.gov.in',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
      {
        code: 'maharashtra',
        name: 'MSBSHSE',
        fullName: 'Maharashtra State Board of Secondary and Higher Secondary Education',
        country: 'India',
        website: 'https://mahahsscboard.in',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
      {
        code: 'karnataka',
        name: 'KSEEB',
        fullName: 'Karnataka Secondary Education Examination Board',
        country: 'India',
        website: 'https://kseeb.karnataka.gov.in',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
      {
        code: 'tamilnadu',
        name: 'TN Board',
        fullName: 'Tamil Nadu State Board of Secondary Education',
        country: 'India',
        website: 'https://dnttert.gov.in',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
      {
        code: 'gujarat',
        name: 'GSEB',
        fullName: 'Gujarat Secondary and Higher Secondary Education Board',
        country: 'India',
        website: 'https://gseb.org',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
      {
        code: 'westbengal',
        name: 'WBBPE',
        fullName: 'West Bengal Board of Primary Education',
        country: 'India',
        website: 'https://wbbpe.org',
        isActive: true,
        features: {
          schoolVerification: true,
          studentVerification: true,
          batchVerification: true,
          apiAccess: true,
        },
      },
    ];
  }

  /**
   * Verify school affiliation
   */
  async verifySchool(request: SchoolVerificationRequest): Promise<UnifiedVerificationResult> {
    const requestId = `sv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      let result: SchoolVerificationResult | null = null;

      switch (request.board) {
        case 'cbse':
          if (!validateCBSEAffiliationNumber(request.schoolCode)) {
            throw new Error('Invalid CBSE affiliation number format');
          }
          result = await this.cbse.verifySchoolAffiliation(
            formatCBSEAffiliationNumber(request.schoolCode)
          );
          break;

        case 'icse':
          if (!validateICSECouncilNumber(request.schoolCode)) {
            throw new Error('Invalid ICSE council number format');
          }
          result = await this.icse.verifySchoolAffiliation(
            formatICSECouncilNumber(request.schoolCode)
          );
          break;

        default:
          if (!validateStateBoardSchoolCode(request.board, request.schoolCode)) {
            throw new Error(`Invalid school code format for ${request.board}`);
          }
          result = await this.stateBoards.verifySchoolAffiliation(
            request.board,
            request.schoolCode
          );
      }

      if (result) {
        return {
          requestId,
          board: request.board,
          schoolCode: request.schoolCode,
          status: result.status === 'verified' ? 'verified' : 'pending',
          result,
          completedAt: new Date().toISOString(),
        };
      }

      return {
        requestId,
        board: request.board,
        schoolCode: request.schoolCode,
        status: 'failed',
        error: 'Verification failed - no result returned',
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        requestId,
        board: request.board,
        schoolCode: request.schoolCode,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Verify student result
   */
  async verifyStudent(request: StudentVerificationRequest): Promise<UnifiedVerificationResult> {
    const requestId = `stv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      let result: StudentVerification | null = null;

      switch (request.board) {
        case 'cbse':
          result = await this.cbse.verifyStudentResult(
            request.rollNumber,
            request.year,
            request.classLevel
          );
          break;

        case 'icse':
          result = await this.icse.verifyStudentResult(
            request.rollNumber,
            request.year,
            (request.examMonth as 'march' | 'october') || 'march'
          );
          break;

        default:
          result = await this.stateBoards.verifyStudentResult(
            request.board,
            request.rollNumber,
            request.year,
            request.classLevel
          );
      }

      if (result) {
        return {
          requestId,
          board: request.board,
          schoolCode: request.rollNumber,
          status: result.isAuthentic ? 'verified' : 'failed',
          result,
          completedAt: new Date().toISOString(),
        };
      }

      return {
        requestId,
        board: request.board,
        schoolCode: request.rollNumber,
        status: 'failed',
        error: 'Verification failed - no result returned',
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        requestId,
        board: request.board,
        schoolCode: request.rollNumber,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Batch verify schools
   */
  async batchVerifySchools(
    requests: SchoolVerificationRequest[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<BatchVerificationResult<UnifiedVerificationResult>> {
    const results: UnifiedVerificationResult[] = [];
    const failed: { item: string; error: string }[] = [];

    for (const request of requests) {
      const result = await this.verifySchool(request);
      
      if (result.status === 'failed') {
        failed.push({
          item: `${request.board}_${request.schoolCode}`,
          error: result.error || 'Unknown error',
        });
      }
      
      results.push(result);
      onProgress?.(results.length, requests.length);
    }

    return {
      success: results.filter(r => r.status === 'verified'),
      failed,
      total: requests.length,
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Batch verify students
   */
  async batchVerifyStudents(
    requests: StudentVerificationRequest[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<BatchVerificationResult<UnifiedVerificationResult>> {
    const results: UnifiedVerificationResult[] = [];
    const failed: { item: string; error: string }[] = [];

    for (const request of requests) {
      const result = await this.verifyStudent(request);
      
      if (result.status === 'failed') {
        failed.push({
          item: `${request.board}_${request.rollNumber}_${request.year}`,
          error: result.error || 'Unknown error',
        });
      }
      
      results.push(result);
      onProgress?.(results.length, requests.length);
    }

    return {
      success: results.filter(r => r.status === 'verified'),
      failed,
      total: requests.length,
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Search schools across boards
   */
  async searchSchools(
    filters: UnifiedSchoolSearchFilters
  ): Promise<{
    byBoard: Record<SchoolBoardType, PaginatedSchools>;
    totalResults: number;
  } | null> {
    try {
      const byBoard: Record<SchoolBoardType, PaginatedSchools> = {} as any;
      let totalResults = 0;

      // Get boards to search
      const boardsToSearch = filters.board && filters.board !== 'all'
        ? [filters.board]
        : this.getSupportedBoards().map(b => b.code) as SchoolBoardType[];

      for (const board of boardsToSearch) {
        const result = await this.searchSchoolsForBoard(board, filters);
        if (result) {
          byBoard[board] = result;
          totalResults += result.total;
        }
      }

      return { byBoard, totalResults };
    } catch (error) {
      console.error('Failed to search schools:', error);
      return null;
    }
  }

  /**
   * Search schools for a specific board
   */
  private async searchSchoolsForBoard(
    board: SchoolBoardType,
    filters: UnifiedSchoolSearchFilters
  ): Promise<PaginatedSchools | null> {
    const searchFilters: SchoolSearchFilters = {
      state: filters.state,
      district: filters.district,
      affiliationStatus: filters.affiliationStatus,
      management: filters.management,
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    switch (board) {
      case 'cbse':
        return this.cbse.searchSchools(searchFilters);
      case 'icse':
        return this.icse.searchSchools(searchFilters);
      default:
        return this.stateBoards.searchSchools(board, searchFilters);
    }
  }

  /**
   * Get school by board and code
   */
  async getSchool(
    board: SchoolBoardType,
    schoolCode: string
  ): Promise<School | null> {
    switch (board) {
      case 'cbse':
        if (!validateCBSEAffiliationNumber(schoolCode)) return null;
        return this.cbse.getSchoolByUDISE(schoolCode);

      case 'icse':
        if (!validateICSECouncilNumber(schoolCode)) return null;
        return this.icse.getSchoolByCouncilNumber(schoolCode);

      default:
        if (!validateStateBoardSchoolCode(board, schoolCode)) return null;
        const result = await this.stateBoards.verifySchoolAffiliation(board, schoolCode);
        return result?.school || null;
    }
  }

  /**
   * Get board information
   */
  getBoardInfo(board: SchoolBoardType): BoardInfo | null {
    return this.getSupportedBoards().find(b => b.code === board) || null;
  }

  /**
   * Get health status for all boards
   */
  async getHealthStatus(): Promise<{
    board: SchoolBoardType;
    status: 'healthy' | 'degraded' | 'down';
    latency: number;
    lastChecked: string;
  }[]> {
    const statuses: {
      board: SchoolBoardType;
      status: 'healthy' | 'degraded' | 'down';
      latency: number;
      lastChecked: string;
    }[] = [];

    const boards = this.getSupportedBoards();

    for (const board of boards) {
      const start = Date.now();
      try {
        // Simple health check - in production, this would be a proper endpoint
        let status: 'healthy' | 'degraded' | 'down' = 'healthy';
        
        // Simulate health check
        const latency = Date.now() - start;
        if (latency > 5000) status = 'degraded';
        if (latency > 10000) status = 'down';

        statuses.push({
          board: board.code,
          status,
          latency,
          lastChecked: new Date().toISOString(),
        });
      } catch (error) {
        statuses.push({
          board: board.code,
          status: 'down',
          latency: Date.now() - start,
          lastChecked: new Date().toISOString(),
        });
      }
    }

    return statuses;
  }

  /**
   * Generate verification report
   */
  async generateVerificationReport(
    organizationId: string,
    period: { start: Date; end: Date }
  ): Promise<{
    organizationId: string;
    generatedAt: string;
    period: { start: string; end: string };
    summary: {
      totalVerifications: number;
      verified: number;
      pending: number;
      failed: number;
      byBoard: Record<string, number>;
    };
    recommendations: string[];
  }> {
    const summary = {
      totalVerifications: 0,
      verified: 0,
      pending: 0,
      failed: 0,
      byBoard: {} as Record<string, number>,
    };

    const recommendations: string[] = [];

    // Get health status
    const healthStatus = await this.getHealthStatus();
    const downBoards = healthStatus.filter(h => h.status === 'down');
    
    if (downBoards.length > 0) {
      recommendations.push(
        `${downBoards.length} board(s) are currently unavailable. Verification for these boards may be delayed.`
      );
    }

    // Get verification statistics by board
    for (const board of this.getSupportedBoards()) {
      const boardHealth = healthStatus.find(h => h.board === board.code);
      if (boardHealth?.status === 'healthy') {
        summary.byBoard[board.name] = 0;
      }
    }

    return {
      organizationId,
      generatedAt: new Date().toISOString(),
      period: {
        start: period.start.toISOString(),
        end: period.end.toISOString(),
      },
      summary,
      recommendations,
    };
  }
}

// Export singleton instance
export const schoolBoardManager = new SchoolBoardManager();

// Export all integrations and types
export {
  cbseIntegration,
  icseIntegration,
  stateBoardsIntegration,
  validateCBSEAffiliationNumber,
  formatCBSEAffiliationNumber,
  validateICSECouncilNumber,
  formatICSECouncilNumber,
  validateStateBoardSchoolCode,
  STATE_BOARDS,
};

export * from './school-board-types';
