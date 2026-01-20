'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User,
  Tag,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  MoreHorizontal,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Settings,
  Api
} from 'lucide-react';
import { 
  SupportTicket, 
  TicketPriority, 
  TicketCategory, 
  TicketStatus, 
  TicketChannel,
  ticketAllocator,
  SLA_CONFIG,
  FIRST_RESPONSE_SLA
} from '@/lib/support/ticket-allocation';
import { TierLevel } from '@/lib/tiers/tier-types';
import styles from './tickets-page.module.css';

interface TicketStats {
  total: number;
  open: number;
  pending: number;
  resolved: number;
  avgResponseTime: number;
  slaCompliance: number;
}

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low', color: '#64748b', bgColor: '#f1f5f9' },
  medium: { label: 'Medium', color: '#f59e0b', bgColor: '#fef3c7' },
  high: { label: 'High', color: '#ef4444', bgColor: '#fef2f2' },
  critical: { label: 'Critical', color: '#dc2626', bgColor: '#fee2e2' }
};

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; icon: React.ReactNode }> = {
  new: { label: 'New', color: '#3b82f6', icon: <AlertCircle size={14} /> },
  assigned: { label: 'Assigned', color: '#8b5cf6', icon: <User size={14} /> },
  in_progress: { label: 'In Progress', color: '#f59e0b', icon: <Clock size={14} /> },
  waiting_customer: { label: 'Waiting', color: '#6b7280', icon: <Hourglass size={14} /> },
  resolved: { label: 'Resolved', color: '#10b981', icon: <CheckCircle size={14} /> },
  closed: { label: 'Closed', color: '#94a3b8', icon: <XCircle size={14} /> }
};

const CATEGORY_CONFIG: Record<TicketCategory, { label: string; icon: React.ReactNode }> = {
  technical: { label: 'Technical', icon: <AlertCircle size={14} /> },
  billing: { label: 'Billing', icon: <DollarSign size={14} /> },
  verification: { label: 'Verification', icon: <CheckCircle size={14} /> },
  account: { label: 'Account', icon: <User size={14} /> },
  integration: { label: 'Integration', icon: <Api size={14} /> },
  general: { label: 'General', icon: <MessageSquare size={14} /> }
};

const CHANNEL_CONFIG: Record<TicketChannel, { label: string; icon: React.ReactNode }> = {
  email: { label: 'Email', icon: <Mail size={14} /> },
  chat: { label: 'Chat', icon: <MessageCircle size={14} /> },
  phone: { label: 'Phone', icon: <Phone size={14} /> },
  portal: { label: 'Portal', icon: <Globe size={14} /> },
  api: { label: 'API', icon: <Api size={14} /> }
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | 'all'>('all');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [currentTier] = useState<TierLevel>('growth');
  const [availableChannels, setAvailableChannels] = useState<TicketChannel[]>([]);

  const fetchTickets = useCallback(async () => {
    try {
      const response = await fetch('/api/support/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      // Use mock data for demonstration
      setTickets(generateMockTickets());
      setStats(generateMockStats());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
    setAvailableChannels(ticketAllocator.getAvailableChannels(currentTier));
  }, [fetchTickets, currentTier]);

  const generateMockTickets = (): SupportTicket[] => {
    return [
      {
        id: 'TKT-ABC123-XYZ1',
        organizationId: 'org-1',
        organizationName: 'Tech University',
        tier: 'growth',
        subject: 'Unable to upload verification documents',
        description: 'Getting an error when trying to upload PDF documents for student verification. The upload bar gets to 100% then fails.',
        category: 'technical',
        priority: 'high',
        status: 'in_progress',
        channel: 'portal',
        assignedTo: 'John Smith',
        assignedTeam: { id: 'tier2-technical', name: 'Technical Support L2', tier: ['growth', 'scale', 'enterprise'], specializations: ['technical'], maxCapacity: 50, currentLoad: 28, averageResolutionTime: 8 },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000),
        firstResponseAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        tags: ['document-upload', 'pdf', 'error'],
        metadata: { browser: 'Chrome 120', os: 'Windows 11' }
      },
      {
        id: 'TKT-DEF456-XYZ2',
        organizationId: 'org-1',
        organizationName: 'Tech University',
        tier: 'growth',
        subject: 'Question about bulk verification pricing',
        description: 'I would like to understand the pricing for bulk verification of more than 500 students. Can you provide a quote?',
        category: 'billing',
        priority: 'medium',
        status: 'new',
        channel: 'email',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        tags: ['pricing', 'bulk'],
        metadata: {}
      },
      {
        id: 'TKT-GHI789-XYZ3',
        organizationId: 'org-1',
        organizationName: 'Tech University',
        tier: 'growth',
        subject: 'Verification status pending for 3 days',
        description: 'I submitted verifications for 50 students 3 days ago and they are still showing as pending. This is affecting our admission deadline.',
        category: 'verification',
        priority: 'critical',
        status: 'assigned',
        channel: 'phone',
        assignedTo: 'Sarah Johnson',
        assignedTeam: { id: 'tier1-verification', name: 'Verification Support L1', tier: ['starter', 'growth', 'scale', 'enterprise'], specializations: ['verification'], maxCapacity: 80, currentLoad: 35, averageResolutionTime: 12 },
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        firstResponseAt: new Date(Date.now() - 70 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
        tags: ['pending', 'urgent', 'admission'],
        metadata: { studentsAffected: 50 }
      },
      {
        id: 'TKT-JKL012-XYZ4',
        organizationId: 'org-1',
        organizationName: 'Tech University',
        tier: 'growth',
        subject: 'How to integrate with our student information system',
        description: 'We are looking to integrate the verification API with our SIS. Can you share documentation on the integration process?',
        category: 'integration',
        priority: 'low',
        status: 'resolved',
        channel: 'chat',
        assignedTo: 'Mike Chen',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        firstResponseAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ['integration', 'api', 'documentation'],
        metadata: {}
      }
    ];
  };

  const generateMockStats = (): TicketStats => ({
    total: 47,
    open: 12,
    pending: 8,
    resolved: 27,
    avgResponseTime: 4.2,
    slaCompliance: 94
  });

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getSlaStatus = (ticket: SupportTicket): { status: 'on-track' | 'at-risk' | 'breached'; message: string } => {
    if (!ticket.slaDeadline) {
      return { status: 'on-track', message: 'No SLA set' };
    }

    const now = new Date();
    const deadline = new Date(ticket.slaDeadline);
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < 0) {
      return { status: 'breached', message: `SLA breached by ${Math.abs(hoursRemaining).toFixed(1)}h` };
    } else if (hoursRemaining < 2) {
      return { status: 'at-risk', message: `${hoursRemaining.toFixed(1)}h remaining` };
    }
    return { status: 'on-track', message: `${hoursRemaining.toFixed(1)}h remaining` };
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading support tickets...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Support Tickets</h1>
          <p>Manage your support requests and track resolution progress</p>
        </div>
        <button 
          className={styles.newTicketButton}
          onClick={() => setShowNewTicketModal(true)}
        >
          <Plus size={18} />
          New Ticket
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <MessageSquare size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.total}</span>
              <span className={styles.statLabel}>Total Tickets</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
              <Clock size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.open}</span>
              <span className={styles.statLabel}>Open</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
              <Hourglass size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.pending}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
              <CheckCircle size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.resolved}</span>
              <span className={styles.statLabel}>Resolved</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fce7f3', color: '#db2777' }}>
              <Clock size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.avgResponseTime}h</span>
              <span className={styles.statLabel}>Avg Response</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
              <ArrowRight size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.slaCompliance}%</span>
              <span className={styles.statLabel}>SLA Compliance</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search tickets by subject or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as TicketCategory | 'all')}
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          
          <select 
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as TicketPriority | 'all')}
          >
            <option value="all">All Priorities</option>
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as TicketStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className={styles.ticketsSection}>
        {filteredTickets.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageSquare size={48} />
            <h3>No tickets found</h3>
            <p>Try adjusting your filters or create a new ticket</p>
          </div>
        ) : (
          <div className={styles.ticketsList}>
            {filteredTickets.map(ticket => {
              const slaStatus = getSlaStatus(ticket);
              const isExpanded = expandedTicket === ticket.id;
              
              return (
                <div 
                  key={ticket.id} 
                  className={`${styles.ticketCard} ${isExpanded ? styles.expandedCard : ''}`}
                  onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                >
                  <div className={styles.ticketHeader}>
                    <div className={styles.ticketId}>{ticket.id}</div>
                    <div className={styles.ticketMeta}>
                      <span 
                        className={styles.priorityBadge}
                        style={{ 
                          background: PRIORITY_CONFIG[ticket.priority].bgColor,
                          color: PRIORITY_CONFIG[ticket.priority].color
                        }}
                      >
                        {PRIORITY_CONFIG[ticket.priority].label}
                      </span>
                      <span 
                        className={styles.statusBadge}
                        style={{ color: STATUS_CONFIG[ticket.status].color }}
                      >
                        {STATUS_CONFIG[ticket.status].icon}
                        {STATUS_CONFIG[ticket.status].label}
                      </span>
                      <span 
                        className={styles.categoryBadge}
                        style={{ background: '#f1f5f9', color: '#64748b' }}
                      >
                        {CATEGORY_CONFIG[ticket.category].icon}
                        {CATEGORY_CONFIG[ticket.category].label}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.ticketSubject}>
                    <h3>{ticket.subject}</h3>
                    <p>{ticket.description.substring(0, 100)}...</p>
                  </div>
                  
                  <div className={styles.ticketFooter}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.channel}>
                        {CHANNEL_CONFIG[ticket.channel].icon}
                        {CHANNEL_CONFIG[ticket.channel].label}
                      </span>
                      <span className={styles.createdAt}>
                        <Clock size={14} />
                        {formatTimeAgo(ticket.createdAt)}
                      </span>
                      {ticket.assignedTo && (
                        <span className={styles.assignedTo}>
                          <User size={14} />
                          {ticket.assignedTo}
                        </span>
                      )}
                    </div>
                    
                    <div className={styles.ticketActions}>
                      <span 
                        className={`${styles.slaStatus} ${styles[slaStatus.status]}`}
                      >
                        {slaStatus.status === 'on-track' && <CheckCircle size={14} />}
                        {slaStatus.status === 'at-risk' && <Clock size={14} />}
                        {slaStatus.status === 'breached' && <AlertCircle size={14} />}
                        {slaStatus.message}
                      </span>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.ticketExpanded}>
                      <div className={styles.expandedSection}>
                        <h4>Full Description</h4>
                        <p>{ticket.description}</p>
                      </div>
                      
                      <div className={styles.expandedSection}>
                        <h4>Tags</h4>
                        <div className={styles.tagsList}>
                          {ticket.tags.map(tag => (
                            <span key={tag} className={styles.tag}>
                              <Tag size={12} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {ticket.metadata && Object.keys(ticket.metadata).length > 0 && (
                        <div className={styles.expandedSection}>
                          <h4>Additional Information</h4>
                          <div className={styles.metadataList}>
                            {Object.entries(ticket.metadata).map(([key, value]) => (
                              <div key={key} className={styles.metadataItem}>
                                <span className={styles.metadataKey}>{key}</span>
                                <span className={styles.metadataValue}>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className={styles.expandedActions}>
                        <button className={styles.actionButton}>
                          <MessageCircle size={16} />
                          Add Comment
                        </button>
                        <button className={styles.actionButton}>
                          <Clock size={16} />
                          Update Status
                        </button>
                        <button className={styles.actionButton}>
                          <ArrowRight size={16} />
                          View Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <NewTicketModal 
          onClose={() => setShowNewTicketModal(false)}
          onSubmit={async (ticketData) => {
            // Handle ticket submission
            console.log('New ticket:', ticketData);
            setShowNewTicketModal(false);
            fetchTickets();
          }}
          availableChannels={availableChannels}
          tier={currentTier}
        />
      )}
    </div>
  );
}

// New Ticket Modal Component
function NewTicketModal({ 
  onClose, 
  onSubmit,
  availableChannels,
  tier
}: { 
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  availableChannels: TicketChannel[];
  tier: TierLevel;
}) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('general');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [channel, setChannel] = useState<TicketChannel>(availableChannels[0] || 'portal');
  const [submitting, setSubmitting] = useState(false);
  const [suggestedPriority, setSuggestedPriority] = useState<TicketPriority | null>(null);

  useEffect(() => {
    // Auto-suggest priority based on content
    const suggested = ticketAllocator.calculatePriority(subject, description, tier);
    if (suggested !== priority) {
      setSuggestedPriority(suggested);
    }
  }, [subject, description, tier, priority]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ subject, description, category, priority, channel });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>×</button>
        <h2>Create New Ticket</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your issue..."
              rows={5}
              required
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)}>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>
                Priority
                {suggestedPriority && suggestedPriority !== priority && (
                  <span className={styles.suggestion}>
                    (Suggested: {PRIORITY_CONFIG[suggestedPriority].label})
                  </span>
                )}
              </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Contact Channel</label>
            <div className={styles.channelOptions}>
              {availableChannels.map(ch => (
                <button
                  key={ch}
                  type="button"
                  className={`${styles.channelOption} ${channel === ch ? styles.selected : ''}`}
                  onClick={() => setChannel(ch)}
                >
                  {CHANNEL_CONFIG[ch].icon}
                  {CHANNEL_CONFIG[ch].label}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.slaInfo}>
            <Clock size={16} />
            <span>
              Based on your {tier} tier, expected first response time: {
                FIRST_RESPONSE_SLA[tier][priority]
              } hour{ FIRST_RESPONSE_SLA[tier][priority] !== 1 ? 's' : '' }
            </span>
          </div>
          
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper components for icons
function DollarSign({ size }: { size: number }) {
  return <span style={{ fontSize: size, fontWeight: 'bold' }}>$</span>;
}

function Hourglass({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2v6m12-6v6M4.5 4.5l15 15m-15 0l15-15" />
    </svg>
  );
}
