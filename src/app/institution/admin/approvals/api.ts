import {
  ContentApproval,
  ApprovalListResponse,
  ApprovalStats,
  CreateApprovalRequest,
  UpdateApprovalRequest,
  AddCommentRequest,
  ApprovalFilters
} from './types';

const API_BASE = '/api/institution/approvals';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getApprovals(
  filters?: ApprovalFilters,
  page = 1,
  pageSize = 20
): Promise<ApprovalListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString()
  });

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }

  const response = await fetch(`${API_BASE}?${params.toString()}`);
  return handleResponse<ApprovalListResponse>(response);
}

export async function getApprovalById(id: string): Promise<ContentApproval> {
  const response = await fetch(`${API_BASE}/${id}`);
  return handleResponse<ContentApproval>(response);
}

export async function createApproval(data: CreateApprovalRequest): Promise<ContentApproval> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse<ContentApproval>(response);
}

export async function updateApproval(
  id: string,
  data: UpdateApprovalRequest
): Promise<ContentApproval> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse<ContentApproval>(response);
}

export async function approveContent(id: string, comment?: string): Promise<ContentApproval> {
  return updateApproval(id, {
    status: 'APPROVED',
    ...(comment && { rejectionReason: comment })
  });
}

export async function rejectContent(id: string, reason: string): Promise<ContentApproval> {
  return updateApproval(id, {
    status: 'REJECTED',
    rejectionReason: reason
  });
}

export async function addComment(
  approvalId: string,
  data: AddCommentRequest
): Promise<ContentApproval> {
  const response = await fetch(`${API_BASE}/${approvalId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse<ContentApproval>(response);
}

export async function getComments(approvalId: string): Promise<ContentApproval['comments']> {
  const response = await fetch(`${API_BASE}/${approvalId}/comments`);
  const result = await handleResponse<{ comments: ContentApproval['comments'] }>(response);
  return result.comments;
}

export async function getApprovalStats(): Promise<ApprovalStats> {
  const response = await fetch(`${API_BASE}/stats`);
  return handleResponse<ApprovalStats>(response);
}

export async function deleteApproval(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete' }));
    throw new Error(error.message);
  }
}
