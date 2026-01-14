'use client';

import { useState, useCallback, useEffect } from 'react';
import * as api from './api';
import {
  ContentApproval,
  ApprovalListResponse,
  ApprovalStats,
  ApprovalFilters
} from './types';

interface UseApprovalsOptions {
  autoFetch?: boolean;
  initialFilters?: ApprovalFilters;
  pageSize?: number;
}

interface UseApprovalsReturn {
  approvals: ContentApproval[];
  stats: ApprovalStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: ApprovalFilters;
  setFilters: (filters: ApprovalFilters) => void;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
  approveContent: (id: string, comment?: string) => Promise<void>;
  rejectContent: (id: string, reason: string) => Promise<void>;
  addComment: (approvalId: string, text: string) => Promise<void>;
  deleteApproval: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useApprovals(options: UseApprovalsOptions = {}): UseApprovalsReturn {
  const {
    autoFetch = true,
    initialFilters = {},
    pageSize = 20
  } = options;

  const [approvals, setApprovals] = useState<ContentApproval[]>([]);
  const [stats, setStats] = useState<ApprovalStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize,
    total: 0,
    totalPages: 0
  });
  const [filters, setFiltersState] = useState<ApprovalFilters>(initialFilters);

  const fetchApprovals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getApprovals(filters, pagination.page, pagination.pageSize);
      setApprovals(response.approvals);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch approvals');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await api.getApprovalStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchApprovals();
      fetchStats();
    }
  }, [autoFetch, fetchApprovals, fetchStats]);

  const refresh = useCallback(async () => {
    await fetchApprovals();
    await fetchStats();
  }, [fetchApprovals, fetchStats]);

  const approveContent = useCallback(async (id: string, comment?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await api.approveContent(id, comment);
      setApprovals(prev => prev.map(a => a.id === id ? updated : a));
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats]);

  const rejectContent = useCallback(async (id: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await api.rejectContent(id, reason);
      setApprovals(prev => prev.map(a => a.id === id ? updated : a));
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats]);

  const addComment = useCallback(async (approvalId: string, text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await api.addComment(approvalId, { text });
      setApprovals(prev => prev.map(a => a.id === approvalId ? updated : a));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteApproval = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.deleteApproval(id);
      setApprovals(prev => prev.filter(a => a.id !== id));
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete approval');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats]);

  const setFilters = useCallback((newFilters: ApprovalFilters) => {
    setFiltersState(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    approvals,
    stats,
    isLoading,
    error,
    pagination,
    filters,
    setFilters,
    setPage,
    refresh,
    approveContent,
    rejectContent,
    addComment,
    deleteApproval,
    clearError
  };
}
