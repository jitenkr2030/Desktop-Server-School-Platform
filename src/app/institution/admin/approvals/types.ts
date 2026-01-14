export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ContentType = 'LESSON' | 'ASSESSMENT' | 'RESOURCE' | 'COURSE';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ApprovalComment {
  id: string;
  author: string;
  authorName?: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContentApproval {
  id: string;
  contentId: string;
  contentType: ContentType;
  contentTitle: string;
  contentDescription?: string;
  submittedBy: string;
  submittedByName?: string;
  submittedAt: string;
  status: ApprovalStatus;
  priority: Priority;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  comments: ApprovalComment[];
  metadata?: Record<string, unknown>;
}

export interface CreateApprovalRequest {
  contentId: string;
  contentType: ContentType;
  contentTitle: string;
  contentDescription?: string;
  priority?: Priority;
  metadata?: Record<string, unknown>;
}

export interface UpdateApprovalRequest {
  status?: ApprovalStatus;
  priority?: Priority;
  rejectionReason?: string;
}

export interface AddCommentRequest {
  text: string;
}

export interface ApprovalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byType: Record<ContentType, number>;
}

export interface ApprovalListResponse {
  approvals: ContentApproval[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApprovalFilters {
  status?: ApprovalStatus;
  contentType?: ContentType;
  priority?: Priority;
  submittedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
