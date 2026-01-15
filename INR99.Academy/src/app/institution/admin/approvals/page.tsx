import React from 'react';
import Link from 'next/link';

// Mock data for demonstration - in production, this would come from API calls
const mockApprovals = [
  {
    id: '1',
    contentId: 'content_001',
    contentTitle: 'Introduction to Mathematics - Chapter 5',
    contentType: 'LESSON',
    submittedBy: 'teacher_john',
    submittedAt: '2025-01-10T14:30:00Z',
    status: 'PENDING',
    priority: 'HIGH',
    comments: [
      { id: 'c1', author: 'admin_sarah', text: 'Please review the examples in section 3.', createdAt: '2025-01-11T09:15:00Z' }
    ]
  },
  {
    id: '2',
    contentId: 'content_002',
    contentTitle: 'Science Experiment Guide - Photosynthesis',
    contentType: 'LESSON',
    submittedBy: 'teacher_mary',
    submittedAt: '2025-01-12T10:00:00Z',
    status: 'PENDING',
    priority: 'MEDIUM',
    comments: []
  },
  {
    id: '3',
    contentId: 'content_003',
    contentTitle: 'History Quiz - World War II',
    contentType: 'ASSESSMENT',
    submittedBy: 'teacher_david',
    submittedAt: '2025-01-08T16:45:00Z',
    status: 'APPROVED',
    priority: 'LOW',
    comments: [
      { id: 'c2', author: 'admin_mike', text: 'Great quiz structure! Approved.', createdAt: '2025-01-09T11:30:00Z' }
    ]
  },
  {
    id: '4',
    contentId: 'content_004',
    contentTitle: 'English Literature Reading List',
    contentType: 'RESOURCE',
    submittedBy: 'teacher_emily',
    submittedAt: '2025-01-11T08:20:00Z',
    status: 'REJECTED',
    priority: 'MEDIUM',
    comments: [
      { id: 'c3', author: 'admin_sarah', text: 'Please add more contemporary literature to the list.', createdAt: '2025-01-12T14:00:00Z' }
    ]
  },
  {
    id: '5',
    contentId: 'content_005',
    contentTitle: 'Computer Science - Python Basics',
    contentType: 'LESSON',
    submittedBy: 'teacher_alex',
    submittedAt: '2025-01-13T13:00:00Z',
    status: 'PENDING',
    priority: 'HIGH',
    comments: []
  }
];

type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type ContentType = 'LESSON' | 'ASSESSMENT' | 'RESOURCE' | 'COURSE';
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

interface ApprovalComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface ApprovalItem {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: ContentType;
  submittedBy: string;
  submittedAt: string;
  status: ApprovalStatus;
  priority: Priority;
  comments: ApprovalComment[];
}

function getStatusColor(status: ApprovalStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-800';
    case 'MEDIUM':
      return 'bg-orange-100 text-orange-800';
    case 'LOW':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatContentType(type: ContentType): string {
  const typeMap: Record<ContentType, string> = {
    LESSON: 'Lesson',
    ASSESSMENT: 'Assessment',
    RESOURCE: 'Resource',
    COURSE: 'Course'
  };
  return typeMap[type] || type;
}

interface ApprovalCardProps {
  approval: ApprovalItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onAddComment: (id: string, comment: string) => void;
  selectedApproval: string | null;
  onSelectApproval: (id: string | null) => void;
}

function ApprovalCard({ 
  approval, 
  onApprove, 
  onReject, 
  onAddComment, 
  selectedApproval,
  onSelectApproval 
}: ApprovalCardProps) {
  const [newComment, setNewComment] = React.useState('');
  const isSelected = selectedApproval === approval.id;

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(approval.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 transition-all ${
      isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div 
        className="cursor-pointer"
        onClick={() => onSelectApproval(isSelected ? null : approval.id)}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{approval.contentTitle}</h3>
            <p className="text-sm text-gray-500">
              {formatContentType(approval.contentType)} • Submitted by {approval.submittedBy}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
              {approval.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(approval.priority)}`}>
              {approval.priority}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          <span>Submitted: {formatDate(approval.submittedAt)}</span>
          <span>{approval.comments.length} comment{approval.comments.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Comments</h4>
            {approval.comments.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No comments yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {approval.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="mt-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Comment
            </button>
          </div>

          {approval.status === 'PENDING' && (
            <div className="flex gap-2">
              <button
                onClick={() => onApprove(approval.id)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(approval.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface StatsCardsProps {
  pending: number;
  approved: number;
  rejected: number;
}

function StatsCards({ pending, approved, rejected }: StatsCardsProps) {
  const stats = [
    { label: 'Pending', count: pending, color: 'yellow', bg: 'bg-yellow-50' },
    { label: 'Approved', count: approved, color: 'green', bg: 'bg-green-50' },
    { label: 'Rejected', count: rejected, color: 'red', bg: 'bg-red-50' }
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.bg} rounded-lg p-4`}>
          <p className="text-sm text-gray-600">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
        </div>
      ))}
    </div>
  );
}

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' }
  ];

  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeFilter === filter.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          {filter.label}
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
            {counts[filter.key] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = React.useState<ApprovalItem[]>(mockApprovals);
  const [selectedApproval, setSelectedApproval] = React.useState<string | null>(null);
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredApprovals = approvals.filter((approval) => {
    const matchesFilter = activeFilter === 'all' || approval.status === activeFilter;
    const matchesSearch = approval.contentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: approvals.length,
    PENDING: approvals.filter(a => a.status === 'PENDING').length,
    APPROVED: approvals.filter(a => a.status === 'APPROVED').length,
    REJECTED: approvals.filter(a => a.status === 'REJECTED').length
  };

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'APPROVED' } : a
    ));
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'REJECTED' } : a
    ));
  };

  const handleAddComment = (id: string, comment: string) => {
    setApprovals(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          comments: [
            ...a.comments,
            {
              id: `c${Date.now()}`,
              author: 'admin_current',
              text: comment,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return a;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Approvals</h1>
              <p className="text-gray-600 mt-1">Review and manage content submissions</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <StatsCards 
          pending={counts.PENDING} 
          approved={counts.APPROVED} 
          rejected={counts.REJECTED} 
        />

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or submitter..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <FilterTabs 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {/* Approval List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredApprovals.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No content approvals found</p>
            </div>
          ) : (
            <div className="p-4">
              {filteredApprovals.map((approval) => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onAddComment={handleAddComment}
                  selectedApproval={selectedApproval}
                  onSelectApproval={setSelectedApproval}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
