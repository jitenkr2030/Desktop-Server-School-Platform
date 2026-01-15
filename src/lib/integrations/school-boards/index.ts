/**
 * School Boards Integration Index
 * Central export point for all school board verification integrations
 */

// Types
export * from './school-board-types';

// CBSE Integration
export {
  CBSEIntegration,
  cbseIntegration,
  validateCBSEAffiliationNumber,
  formatCBSEAffiliationNumber,
  type CBSEConfig,
  type CBSESchool,
  type CBSEStudentResult,
} from './cbse-integration';

// ICSE Integration
export {
  ICSEIntegration,
  icseIntegration,
  validateICSECouncilNumber,
  formatICSECouncilNumber,
  type ICSEConfig,
  type ICESchool,
  type ICSEStudentResult,
} from './icse-integration';

// State Boards Integration
export {
  StateBoardsIntegration,
  stateBoardsIntegration,
  validateStateBoardSchoolCode,
  STATE_BOARDS,
  type StateBoardConfig,
  type StateBoardSchool,
  type StateBoardResult,
} from './state-boards-integration';

// School Board Manager
export {
  SchoolBoardManager,
  schoolBoardManager,
  type SchoolVerificationRequest,
  type StudentVerificationRequest,
  type UnifiedVerificationResult,
  type BatchVerificationResult,
  type BoardInfo,
} from './school-board-manager';
