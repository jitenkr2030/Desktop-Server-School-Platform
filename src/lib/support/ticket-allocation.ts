/**
 * Support Ticket Allocation System
 * Routes support tickets based on tier level, urgency, and complexity
 */

import { TierLevel } from '@/lib/tiers/tier-types';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'technical' | 'billing' | 'verification' | 'account' | 'integration' | 'general';
export type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
export type TicketChannel = 'email' | 'chat' | 'phone' | 'portal' | 'api';

export interface SupportTicket {
  id: string;
  organizationId: string;
  organizationName: string;
  tier: TierLevel;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  channel: TicketChannel;
  assignedTo?: string;
  assignedTeam?: SupportTeam;
  createdAt: Date;
  updatedAt: Date;
  firstResponseAt?: Date;
  resolvedAt?: Date;
  slaDeadline?: Date;
  tags: string[];
  metadata: Record<string, any>;
}

export interface SupportTeam {
  id: string;
  name: string;
  tier: TierLevel[];
  specializations: TicketCategory[];
  maxCapacity: number;
  currentLoad: number;
  averageResolutionTime: number; // in hours
}

export interface TicketAllocationResult {
  ticket: SupportTicket;
  assignedTeam: SupportTeam;
  estimatedResolution: Date;
  slaBreachRisk: 'low' | 'medium' | 'high';
}

// Support team definitions with tier mappings
export const SUPPORT_TEAMS: SupportTeam[] = [
  {
    id: 'tier1-general',
    name: 'General Support L1',
    tier: ['starter', 'growth', 'scale', 'enterprise'],
    specializations: ['general', 'account'],
    maxCapacity: 100,
    currentLoad: 45,
    averageResolutionTime: 24
  },
  {
    id: 'tier1-verification',
    name: 'Verification Support L1',
    tier: ['starter', 'growth', 'scale', 'enterprise'],
    specializations: ['verification'],
    maxCapacity: 80,
    currentLoad: 35,
    averageResolutionTime: 12
  },
  {
    id: 'tier2-technical',
    name: 'Technical Support L2',
    tier: ['growth', 'scale', 'enterprise'],
    specializations: ['technical', 'integration'],
    maxCapacity: 50,
    currentLoad: 28,
    averageResolutionTime: 8
  },
  {
    id: 'tier2-billing',
    name: 'Billing Support L2',
    tier: ['growth', 'scale', 'enterprise'],
    specializations: ['billing'],
    maxCapacity: 40,
    currentLoad: 18,
    averageResolutionTime: 6
  },
  {
    id: 'tier3-enterprise',
    name: 'Enterprise Solutions L3',
    tier: ['enterprise'],
    specializations: ['technical', 'integration', 'verification', 'billing', 'account'],
    maxCapacity: 20,
    currentLoad: 8,
    averageResolutionTime: 4
  },
  {
    id: 'dedicated-account',
    name: 'Dedicated Account Manager',
    tier: ['enterprise'],
    specializations: ['account', 'billing', 'general'],
    maxCapacity: 10,
    currentLoad: 4,
    averageResolutionTime: 2
  }
];

// SLA definitions by tier and priority (in hours)
export const SLA_CONFIG: Record<TierLevel, Record<TicketPriority, number>> = {
  starter: {
    low: 72,
    medium: 48,
    high: 24,
    critical: 12
  },
  growth: {
    low: 48,
    medium: 24,
    high: 12,
    critical: 8
  },
  scale: {
    low: 24,
    medium: 12,
    high: 8,
    critical: 4
  },
  enterprise: {
    low: 12,
    medium: 8,
    high: 4,
    critical: 2
  }
};

// Response time targets by tier (in hours)
export const FIRST_RESPONSE_SLA: Record<TierLevel, Record<TicketPriority, number>> = {
  starter: {
    low: 24,
    medium: 12,
    high: 4,
    critical: 2
  },
  growth: {
    low: 12,
    medium: 8,
    high: 2,
    critical: 1
  },
  scale: {
    low: 8,
    medium: 4,
    high: 1,
    critical: 0.5
  },
  enterprise: {
    low: 4,
    medium: 2,
    high: 0.5,
    critical: 0.25
  }
};

export class TicketAllocator {
  /**
   * Allocate a ticket to the appropriate support team
   */
  allocate(ticket: Partial<SupportTicket>): TicketAllocationResult {
    const tier = (ticket.tier || 'starter') as TierLevel;
    const priority = (ticket.priority || 'medium') as TicketPriority;
    const category = (ticket.category || 'general') as TicketCategory;

    // Find appropriate team
    const team = this.findBestTeam(tier, category, priority);
    
    // Calculate SLA deadline
    const slaHours = SLA_CONFIG[tier][priority];
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + slaHours);

    // Calculate estimated resolution
    const resolutionTime = team.averageResolutionTime * (this.getPriorityMultiplier(priority));
    const estimatedResolution = new Date();
    estimatedResolution.setHours(estimatedResolution.getHours() + resolutionTime);

    // Calculate SLA breach risk
    const slaBreachRisk = this.calculateSlaBreachRisk(team, slaHours);

    // Create full ticket object
    const fullTicket: SupportTicket = {
      id: this.generateTicketId(),
      organizationId: ticket.organizationId || '',
      organizationName: ticket.organizationName || '',
      tier,
      subject: ticket.subject || '',
      description: ticket.description || '',
      category,
      priority,
      status: 'new',
      channel: ticket.channel || 'portal',
      assignedTeam: team,
      createdAt: new Date(),
      updatedAt: new Date(),
      slaDeadline,
      tags: ticket.tags || [],
      metadata: ticket.metadata || {}
    };

    return {
      ticket: fullTicket,
      assignedTeam: team,
      estimatedResolution,
      slaBreachRisk
    };
  }

  /**
   * Find the best support team based on tier, category, and priority
   */
  private findBestTeam(
    tier: TierLevel,
    category: TicketCategory,
    priority: TicketPriority
  ): SupportTeam {
    // Filter teams that support this tier
    let eligibleTeams = SUPPORT_TEAMS.filter(team => 
      team.tier.includes(tier)
    );

    // Filter teams with the right specialization
    const specializedTeams = eligibleTeams.filter(team =>
      team.specializations.includes(category)
    );

    if (specializedTeams.length > 0) {
      eligibleTeams = specializedTeams;
    }

    // For high-priority and enterprise tiers, prefer specialized teams
    if (priority === 'critical' || tier === 'enterprise') {
      const enterpriseTeams = eligibleTeams.filter(team =>
        team.id === 'tier3-enterprise' || team.id === 'dedicated-account'
      );
      if (enterpriseTeams.length > 0) {
        eligibleTeams = enterpriseTeams;
      }
    }

    // Sort by current load and select least loaded team
    return eligibleTeams.sort((a, b) => {
      // Consider load percentage
      const loadA = a.currentLoad / a.maxCapacity;
      const loadB = b.currentLoad / b.maxCapacity;
      
      // Prefer teams with lower load
      if (loadA !== loadB) {
        return loadA - loadB;
      }
      
      // Tie-break by average resolution time
      return a.averageResolutionTime - b.averageResolutionTime;
    })[0];
  }

  /**
   * Calculate SLA breach risk based on team load and SLA requirements
   */
  private calculateSlaBreachRisk(
    team: SupportTeam,
    slaHours: number
  ): 'low' | 'medium' | 'high' {
    const loadPercentage = team.currentLoad / team.maxCapacity;
    
    // High load increases breach risk
    if (loadPercentage > 0.9) {
      return 'high';
    }
    
    if (loadPercentage > 0.75) {
      return loadPercentage > 0.85 ? 'high' : 'medium';
    }
    
    // Low SLA time increases risk
    if (slaHours <= 2) {
      return loadPercentage > 0.7 ? 'high' : 'medium';
    }
    
    return 'low';
  }

  /**
   * Get priority multiplier for resolution time calculation
   */
  private getPriorityMultiplier(priority: TicketPriority): number {
    const multipliers: Record<TicketPriority, number> = {
      low: 1.5,
      medium: 1,
      high: 0.5,
      critical: 0.25
    };
    return multipliers[priority];
  }

  /**
   * Generate unique ticket ID
   */
  private generateTicketId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TKT-${timestamp}-${random}`;
  }

  /**
   * Check if a ticket can be handled by a specific tier
   */
  canHandleTicket(tier: TierLevel, category: TicketCategory): boolean {
    const teams = SUPPORT_TEAMS.filter(team =>
      team.tier.includes(tier) && team.specializations.includes(category)
    );
    return teams.length > 0;
  }

  /**
   * Get available support channels for a tier
   */
  getAvailableChannels(tier: TierLevel): TicketChannel[] {
    const baseChannels: TicketChannel[] = ['email', 'portal'];
    
    if (tier === 'growth' || tier === 'scale' || tier === 'enterprise') {
      baseChannels.push('chat');
    }
    
    if (tier === 'scale' || tier === 'enterprise') {
      baseChannels.push('phone');
    }
    
    if (tier === 'enterprise') {
      baseChannels.push('api');
    }
    
    return baseChannels;
  }

  /**
   * Get expected wait time for a tier and category
   */
  getExpectedWaitTime(tier: TierLevel, category: TicketCategory): number {
    const team = this.findBestTeam(tier, category, 'medium');
    const loadPercentage = team.currentLoad / team.maxCapacity;
    
    // Base wait time in hours
    const baseWait = team.averageResolutionTime * loadPercentage * 0.1;
    
    // Tier multiplier
    const tierMultipliers: Record<TierLevel, number> = {
      starter: 2,
      growth: 1.5,
      scale: 1,
      enterprise: 0.5
    };
    
    return Math.round(baseWait * tierMultipliers[tier] * 10) / 10;
  }

  /**
   * Calculate priority based on ticket content analysis
   */
  calculatePriority(
    subject: string,
    description: string,
    tier: TierLevel
  ): TicketPriority {
    const content = `${subject} ${description}`.toLowerCase();
    
    // Critical keywords
    const criticalKeywords = ['urgent', 'emergency', 'down', 'not working', 'blocked', 'production'];
    if (criticalKeywords.some(kw => content.includes(kw))) {
      return 'critical';
    }
    
    // High priority keywords
    const highKeywords = ['asap', 'important', 'error', 'failed', 'issue'];
    if (highKeywords.some(kw => content.includes(kw))) {
      return 'high';
    }
    
    // Low priority indicators
    const lowKeywords = ['when possible', 'no rush', 'question', 'how to'];
    if (lowKeywords.some(kw => content.includes(kw))) {
      return 'low';
    }
    
    // Enterprise customers get priority boost
    if (tier === 'enterprise') {
      return 'high';
    }
    
    return 'medium';
  }

  /**
   * Suggest category based on ticket content
   */
  suggestCategory(subject: string, description: string): TicketCategory {
    const content = `${subject} ${description}`.toLowerCase();
    
    const categoryKeywords: Record<TicketCategory, string[]> = {
      technical: ['error', 'bug', 'crash', 'api', 'integration', 'code', 'technical'],
      billing: ['invoice', 'payment', 'charge', 'subscription', 'pricing', 'bill'],
      verification: ['verify', 'verification', 'document', 'status', 'approved', 'rejected'],
      account: ['account', 'login', 'password', 'user', 'permission', 'access'],
      integration: ['api', 'webhook', 'connect', 'sync', 'import', 'export'],
      general: []
    };
    
    let bestCategory: TicketCategory = 'general';
    let bestScore = 0;
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const score = keywords.filter(kw => content.includes(kw)).length;
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category as TicketCategory;
      }
    }
    
    return bestCategory;
  }
}

export const ticketAllocator = new TicketAllocator();
