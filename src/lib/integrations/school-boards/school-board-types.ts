/**
 * School Board Verification Integration
 * Supports CBSE, ICSE, State Boards, and International Boards
 */

import { z } from 'zod';

// Board Types
export type SchoolBoardType = 
  | 'cbse'           // Central Board of Secondary Education
  | 'icse'           // Indian Certificate of Secondary Education
  | 'state_board'    // State government boards
  | 'up'             // Uttar Pradesh Board
  | 'mp'             // Madhya Pradesh Board
  | 'rajasthan'      // Rajasthan Board of Secondary Education
  | 'maharashtra'    // Maharashtra State Board
  | 'karnataka'      // Karnataka Secondary Education
  | 'tamilnadu'      // Tamil Nadu State Board
  | 'gujarat'        // Gujarat Secondary and Higher Secondary
  | 'westbengal'     // West Bengal Board
  | 'international'  // International boards
  | 'ib'             // International Baccalaureate
  | 'cambridge'      // Cambridge International
  | 'aissce';        // AISSCE (Class 12)

export type AffiliationStatus = 
  | 'affiliated'
  | 'temporary_affiliation'
  | 'upgradation_pending'
  | 'deaffiliated'
  | 'closed'
  | 'pending';

export type SchoolVerificationStatus = 
  | 'verified'
  | 'pending'
  | 'rejected'
  | 'expired'
  | 'not_found';

// School data schema
export const schoolSchema = z.object({
  schoolId: z.string(),
  udiseCode: z.string().optional(), // Unified District Information System for Education
  board: z.string(),
  affiliationNumber: z.string(),
  schoolName: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    district: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  contact: z.object({
    phone: z.string(),
    email: z.string().email().optional(),
    principal: z.string().optional(),
  }),
  affiliationStatus: z.string(),
  affiliationLevel: z.object({
    primary: z.boolean(),
    upperPrimary: z.boolean(),
    secondary: z.boolean(),
    seniorSecondary: z.boolean(),
  }),
  streams: z.array(z.enum(['science', 'commerce', 'arts', 'vocational', 'technical'])).optional(),
  yearOfEstablishment: z.number(),
  management: z.enum(['government', 'private_aided', 'private_unaided']),
  coEducation: z.boolean(),
  mediumOfInstruction: z.array(z.string()),
  verifiedAt: z.string(),
});

export type School = z.infer<typeof schoolSchema>;

// School verification result
export interface SchoolVerificationResult {
  schoolId: string;
  udiseCode?: string;
  board: SchoolBoardType;
  verificationDate: string;
  status: SchoolVerificationStatus;
  school: School;
  warnings?: string[];
  recommendations?: string[];
}

// Student verification (for 10th/12th marks, certificates)
export interface StudentVerification {
  studentId: string;
  schoolId: string;
  board: SchoolBoardType;
  rollNumber: string;
  enrollmentNumber: string;
  yearOfPassing: number;
  class: number;
  result: {
    overall: string;
    percentage: number;
    grade: string;
    cgpa: number;
  };
  subjects: {
    name: string;
    marks: number;
    grade: string;
  }[];
  certificateNumber: string;
  verificationDate: string;
  isAuthentic: boolean;
}

// API Configuration
export interface SchoolBoardConfig {
  apiBaseUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

// Search filters
export interface SchoolSearchFilters {
  board?: SchoolBoardType;
  state?: string;
  district?: string;
  affiliationStatus?: AffiliationStatus;
  management?: School['management'];
  type?: 'primary' | 'secondary' | 'senior_secondary';
  page?: number;
  limit?: number;
}

export interface PaginatedSchools {
  schools: School[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Utility functions for board display names
export function getBoardDisplayName(board: SchoolBoardType): string {
  const boardNames: Record<SchoolBoardType, string> = {
    cbse: 'CBSE',
    icse: 'ICSE',
    state_board: 'State Board',
    up: 'Uttar Pradesh Board',
    mp: 'Madhya Pradesh Board',
    rajasthan: 'Rajasthan Board',
    maharashtra: 'Maharashtra State Board',
    karnataka: 'Karnataka Board',
    tamilnadu: 'Tamil Nadu Board',
    gujarat: 'Gujarat Board',
    westbengal: 'West Bengal Board',
    international: 'International Board',
    ib: 'International Baccalaureate',
    cambridge: 'Cambridge International',
    aissce: 'AISSCE (Class 12)',
  };
  return boardNames[board] || board.toUpperCase();
}

export function getAffiliationStatusDisplay(status: AffiliationStatus): {
  label: string;
  color: string;
  bgColor: string;
} {
  const config: Record<AffiliationStatus, { label: string; color: string; bgColor: string }> = {
    affiliated: { label: 'Affiliated', color: '#059669', bgColor: '#d1fae5' },
    temporary_affiliation: { label: 'Temporary', color: '#d97706', bgColor: '#fef3c7' },
    upgradation_pending: { label: 'Upgradation Pending', color: '#7c3aed', bgColor: '#ede9fe' },
    deaffiliated: { label: 'De-affiliated', color: '#dc2626', bgColor: '#fee2e2' },
    closed: { label: 'Closed', color: '#64748b', bgColor: '#f1f5f9' },
    pending: { label: 'Pending', color: '#3b82f6', bgColor: '#dbeafe' },
  };
  return config[status];
}

export function getVerificationStatusDisplay(status: SchoolVerificationStatus): {
  label: string;
  color: string;
  bgColor: string;
} {
  const config: Record<SchoolVerificationStatus, { label: string; color: string; bgColor: string }> = {
    verified: { label: 'Verified', color: '#059669', bgColor: '#d1fae5' },
    pending: { label: 'Pending', color: '#d97706', bgColor: '#fef3c7' },
    rejected: { label: 'Rejected', color: '#dc2626', bgColor: '#fee2e2' },
    expired: { label: 'Expired', color: '#64748b', bgColor: '#f1f5f9' },
    not_found: { label: 'Not Found', color: '#6b7280', bgColor: '#f1f5f9' },
  };
  return config[status];
}

// Stream display names
export function getStreamDisplayName(stream: string): string {
  const streamNames: Record<string, string> = {
    science: 'Science',
    commerce: 'Commerce',
    arts: 'Arts',
    vocational: 'Vocational',
    technical: 'Technical',
  };
  return streamNames[stream] || stream;
}

// Management type display
export function getManagementTypeDisplay(type: School['management']): string {
  const managementNames: Record<School['management'], string> = {
    government: 'Government',
    private_aided: 'Private Aided',
    private_unaided: 'Private Unaided',
  };
  return managementNames[type];
}
