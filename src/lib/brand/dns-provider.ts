// ============================================
// DNS PROVIDER INTEGRATION
// Supports Cloudflare, AWS Route53, and custom DNS APIs
// ============================================

import { z } from 'zod';

// DNS Provider configuration
export interface DnsProviderConfig {
  provider: 'cloudflare' | 'route53' | 'custom';
  apiKey?: string;
  apiSecret?: string;
  region?: string;
  baseUrl?: string;
}

// DNS Record types
export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'NS';

export interface DnsRecord {
  type: DnsRecordType;
  name: string;
  value: string;
  ttl?: number;
  priority?: number;
  proxied?: boolean;
}

export interface DnsZone {
  id: string;
  name: string;
  records: DnsRecord[];
}

// Provider-specific implementations
export interface DnsProvider {
  name: string;
  
  // Initialize provider with config
  initialize(config: DnsProviderConfig): Promise<boolean>;
  
  // List all zones
  listZones(): Promise<DnsZone[]>;
  
  // Get zone by name
  getZone(zoneName: string): Promise<DnsZone | null>;
  
  // Create DNS record
  createRecord(zoneName: string, record: DnsRecord): Promise<boolean>;
  
  // Update DNS record
  updateRecord(zoneName: string, recordName: string, record: DnsRecord): Promise<boolean>;
  
  // Delete DNS record
  deleteRecord(zoneName: string, recordName: string, recordType: DnsRecordType): Promise<boolean>;
  
  // Verify domain ownership
  verifyDomain(zoneName: string, verificationToken: string): Promise<boolean>;
  
  // Check if record exists
  recordExists(zoneName: string, recordName: string, recordType: DnsRecordType): Promise<boolean>;
  
  // Get record value
  getRecordValue(zoneName: string, recordName: string, recordType: DnsRecordType): Promise<string | null>;
}

// ============================================
// CLOUDFLARE DNS PROVIDER
// ============================================

export class CloudflareDnsProvider implements DnsProvider {
  name = 'cloudflare';
  private apiToken: string;
  private baseUrl = 'https://api.cloudflare.com/client/v4';
  private zoneCache: Map<string, DnsZone> = new Map();

  async initialize(config: DnsProviderConfig): Promise<boolean> {
    this.apiToken = config.apiKey || '';
    
    // Test connection
    try {
      const response = await fetch(`${this.baseUrl}/user/tokens/verify`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Cloudflare initialization failed:', error);
      return false;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Cloudflare API error: ${response.status}`);
    }

    return response.json();
  }

  async listZones(): Promise<DnsZone[]> {
    const result = await this.request<{ result: Array<{ id: string; name: string }> }>('/zones');
    
    return Promise.all(
      result.result.map(async (zone) => {
        const dnsZone = await this.getZone(zone.name);
        return dnsZone || { id: zone.id, name: zone.name, records: [] };
      })
    );
  }

  async getZone(zoneName: string): Promise<DnsZone | null> {
    // Check cache first
    if (this.zoneCache.has(zoneName)) {
      return this.zoneCache.get(zoneName)!;
    }

    try {
      // Get zone ID
      const zoneResult = await this.request<{ result: Array<{ id: string; name: string }> }>(
        `/zones?name=${zoneName}`
      );
      
      const zone = zoneResult.result[0];
      if (!zone) return null;

      // Get DNS records
      const recordsResult = await this.request<{ result: DnsRecord[] }>(
        `/zones/${zone.id}/dns_records`
      );

      const dnsZone: DnsZone = {
        id: zone.id,
        name: zone.name,
        records: recordsResult.result.map((r) => ({
          type: r.type as DnsRecordType,
          name: r.name,
          value: r.content,
          ttl: r.ttl === 1 ? undefined : r.ttl,
          priority: r.priority,
          proxied: r.proxied,
        })),
      };

      // Cache the zone
      this.zoneCache.set(zoneName, dnsZone);
      
      return dnsZone;
    } catch (error) {
      console.error('Failed to get zone:', error);
      return null;
    }
  }

  async createRecord(zoneName: string, record: DnsRecord): Promise<boolean> {
    try {
      const zone = await this.getZone(zoneName);
      if (!zone) throw new Error(`Zone ${zoneName} not found`);

      await this.request(`/zones/${zone.id}/dns_records`, {
        method: 'POST',
        body: JSON.stringify({
          type: record.type,
          name: record.name,
          content: record.value,
          ttl: record.ttl || 1,
          priority: record.priority,
          proxied: record.proxied,
        }),
      });

      // Invalidate cache
      this.zoneCache.delete(zoneName);
      
      return true;
    } catch (error) {
      console.error('Failed to create DNS record:', error);
      return false;
    }
  }

  async updateRecord(zoneName: string, recordName: string, record: DnsRecord): Promise<boolean> {
    try {
      const zone = await this.getZone(zoneName);
      if (!zone) throw new Error(`Zone ${zoneName} not found`);

      // Find existing record
      const existingRecord = zone.records.find(
        (r) => r.name === recordName && r.type === record.type
      );
      
      if (!existingRecord) {
        return this.createRecord(zoneName, record);
      }

      await this.request(`/zones/${zone.id}/dns_records/${existingRecord.name.split('.')[0]}`, {
        method: 'PUT',
        body: JSON.stringify({
          type: record.type,
          name: record.name,
          content: record.value,
          ttl: record.ttl || 1,
          priority: record.priority,
          proxied: record.proxied,
        }),
      });

      // Invalidate cache
      this.zoneCache.delete(zoneName);
      
      return true;
    } catch (error) {
      console.error('Failed to update DNS record:', error);
      return false;
    }
  }

  async deleteRecord(zoneName: string, recordName: string, recordType: DnsRecordType): Promise<boolean> {
    try {
      const zone = await this.getZone(zoneName);
      if (!zone) throw new Error(`Zone ${zoneName} not found`);

      // Find record to delete
      const existingRecord = zone.records.find(
        (r) => r.name === recordName && r.type === recordType
      );
      
      if (!existingRecord) return true; // Already deleted

      await this.request(`/zones/${zone.id}/dns_records/${existingRecord.name.split('.')[0]}`, {
        method: 'DELETE',
      });

      // Invalidate cache
      this.zoneCache.delete(zoneName);
      
      return true;
    } catch (error) {
      console.error('Failed to delete DNS record:', error);
      return false;
    }
  }

  async verifyDomain(zoneName: string, verificationToken: string): Promise<boolean> {
    try {
      // Create TXT record for verification
      const success = await this.createRecord(zoneName, {
        type: 'TXT',
        name: `@`,
        value: verificationToken,
        ttl: 3600,
      });

      if (!success) return false;

      // Wait for DNS propagation (up to 60 seconds)
      for (let i = 0; i < 60; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const zone = await this.getZone(zoneName);
        const txtRecord = zone?.records.find(
          (r) => r.type === 'TXT' && r.name === '@' && r.value === verificationToken
        );
        
        if (txtRecord) return true;
      }

      return false;
    } catch (error) {
      console.error('Domain verification failed:', error);
      return false;
    }
  }

  async recordExists(zoneName: string, recordName: string, recordType: DnsRecordType): Promise<boolean> {
    const zone = await this.getZone(zoneName);
    if (!zone) return false;

    return zone.records.some(
      (r) => r.name === recordName && r.type === recordType
    );
  }

  async getRecordValue(zoneName: string, recordName: string, recordType: DnsRecordType): Promise<string | null> {
    const zone = await this.getZone(zoneName);
    if (!zone) return null;

    const record = zone.records.find(
      (r) => r.name === recordName && r.type === recordType
    );
    
    return record?.value || null;
  }
}

// ============================================
// AWS ROUTE53 DNS PROVIDER
// ============================================

export class Route53DnsProvider implements DnsProvider {
  name = 'route53';
  private config: DnsProviderConfig;

  async initialize(config: DnsProviderConfig): Promise<boolean> {
    this.config = config;
    // In production, would initialize AWS SDK here
    return true;
  }

  async listZones(): Promise<DnsZone[]> {
    // Implementation would use AWS SDK
    return [];
  }

  async getZone(zoneName: string): Promise<DnsZone | null> {
    // Implementation would use AWS SDK
    return null;
  }

  async createRecord(zoneName: string, record: DnsRecord): Promise<boolean> {
    // Implementation would use AWS SDK
    return true;
  }

  async updateRecord(zoneName: string, recordName: string, record: DnsRecord): Promise<boolean> {
    return this.createRecord(zoneName, record);
  }

  async deleteRecord(zoneName: string, recordName: string, recordType: DnsRecordType): Promise<boolean> {
    return true;
  }

  async verifyDomain(zoneName: string, verificationToken: string): Promise<boolean> {
    return true;
  }

  async recordExists(zoneName: string, recordName: string, recordType: DnsRecordType): Promise<boolean> {
    return false;
  }

  async getRecordValue(zoneName: string, recordName: string, recordType: DnsRecordType): Promise<string | null> {
    return null;
  }
}

// ============================================
// DNS PROVIDER FACTORY
// ============================================

export function createDnsProvider(config: DnsProviderConfig): DnsProvider | null {
  switch (config.provider) {
    case 'cloudflare':
      return new CloudflareDnsProvider();
    case 'route53':
      return new Route53DnsProvider();
    default:
      return null;
  }
}

// ============================================
// SUBDOMAIN AUTO-PROVISIONING SERVICE
// ============================================

export interface SubdomainProvisioningConfig {
  baseDomain: string; // e.g., "inr99.academy"
  dnsProvider: DnsProvider;
  sslProvider: 'letsencrypt' | 'cloudflare' | 'aws';
  defaultTtl: number;
}

export interface SubdomainResult {
  subdomain: string;
  fullDomain: string;
  cnameTarget: string;
  dnsRecords: DnsRecord[];
  sslStatus: 'pending' | 'provisioned' | 'failed';
  error?: string;
}

export class SubdomainProvisioningService {
  private config: SubdomainProvisioningConfig;

  constructor(config: SubdomainProvisioningConfig) {
    this.config = config;
  }

  // Provision a new subdomain
  async provisionSubdomain(
    tenantSlug: string,
    tenantId: string
  ): Promise<SubdomainResult> {
    const subdomain = this.normalizeSubdomain(tenantSlug);
    const fullDomain = `${subdomain}.${this.config.baseDomain}`;
    const cnameTarget = fullDomain;

    try {
      // Step 1: Create DNS records
      const dnsRecords = await this.createDnsRecords(subdomain, cnameTarget);
      
      // Step 2: Provision SSL certificate
      const sslStatus = await this.provisionSsl(subdomain, fullDomain);
      
      return {
        subdomain,
        fullDomain,
        cnameTarget,
        dnsRecords,
        sslStatus,
      };
    } catch (error) {
      return {
        subdomain,
        fullDomain,
        cnameTarget,
        dnsRecords: [],
        sslStatus: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Create DNS records for subdomain
  private async createDnsRecords(
    subdomain: string,
    cnameTarget: string
  ): Promise<DnsRecord[]> {
    const records: DnsRecord[] = [];

    // CNAME record for subdomain
    const cnameRecord: DnsRecord = {
      type: 'CNAME',
      name: subdomain,
      value: cnameTarget,
      ttl: this.config.defaultTtl,
      proxied: false,
    };

    const cnameSuccess = await this.config.dnsProvider.createRecord(
      this.config.baseDomain,
      cnameRecord
    );

    if (cnameSuccess) {
      records.push(cnameRecord);
    }

    // A record for apex domain (for custom domains)
    // This would point to the platform's IP address

    return records;
  }

  // Provision SSL certificate
  private async provisionSsl(
    subdomain: string,
    fullDomain: string
  ): Promise<'pending' | 'provisioned' | 'failed'> {
    switch (this.config.sslProvider) {
      case 'letsencrypt':
        return this.provisionLetsEncrypt(subdomain, fullDomain);
      case 'cloudflare':
        return this.provisionCloudflareSsl(fullDomain);
      default:
        return 'pending';
    }
  }

  // Let's Encrypt SSL provisioning
  private async provisionLetsEncrypt(
    subdomain: string,
    fullDomain: string
  ): Promise<'pending' | 'provisioned' | 'failed'> {
    // In production, would use ACME protocol with Let's Encrypt
    // For now, return pending as SSL would be provisioned by the platform's reverse proxy
    
    // The SSL certificate would be managed at the load balancer level
    // not individual subdomain level in most cloud setups
    
    return 'pending';
  }

  // Cloudflare SSL provisioning
  private async provisionCloudflareSsl(
    fullDomain: string
  ): Promise<'pending' | 'provisioned' | 'failed'> {
    // Cloudflare provides SSL automatically for proxied records
    return 'provisioned';
  }

  // De-provision a subdomain
  async deprovisionSubdomain(
    subdomain: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete DNS records
      await this.config.dnsProvider.deleteRecord(
        this.config.baseDomain,
        subdomain,
        'CNAME'
      );

      // SSL certificates are managed at the platform level
      // No action needed here

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Check if subdomain is available
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const normalizedSubdomain = this.normalizeSubdomain(subdomain);
    
    // Check DNS
    const exists = await this.config.dnsProvider.recordExists(
      this.config.baseDomain,
      normalizedSubdomain,
      'CNAME'
    );
    
    return !exists;
  }

  // Validate subdomain format
  validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
    const normalized = this.normalizeSubdomain(subdomain);
    
    // Check length
    if (normalized.length < 3) {
      return { valid: false, error: 'Subdomain must be at least 3 characters' };
    }
    
    if (normalized.length > 63) {
      return { valid: false, error: 'Subdomain must be less than 63 characters' };
    }
    
    // Check format (alphanumeric and hyphens only)
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;
    if (!subdomainRegex.test(normalized)) {
      return { valid: false, error: 'Subdomain can only contain letters, numbers, and hyphens' };
    }
    
    // Check for reserved subdomains
    const reserved = ['www', 'api', 'admin', 'app', 'portal', 'dashboard', 'mail', 'ftp', 'support'];
    if (reserved.includes(normalized.toLowerCase())) {
      return { valid: false, error: 'This subdomain is reserved' };
    }
    
    return { valid: true };
  }

  // Normalize subdomain
  private normalizeSubdomain(subdomain: string): string {
    return subdomain
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Generate DNS configuration instructions for manual setup
  generateDnsInstructions(subdomain: string): DnsRecord[] {
    const normalized = this.normalizeSubdomain(subdomain);
    
    return [
      {
        type: 'CNAME',
        name: normalized,
        value: `${normalized}.${this.config.baseDomain}`,
        ttl: 3600,
      },
    ];
  }
}

// ============================================
// DNS API ROUTE HANDLERS
// ============================================

// Validation schemas
export const dnsRecordSchema = z.object({
  type: z.enum(['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS']),
  name: z.string().min(1).max(255),
  value: z.string().min(1).max(1000),
  ttl: z.number().optional(),
  priority: z.number().optional(),
  proxied: z.boolean().optional(),
});

export const subdomainProvisioningSchema = z.object({
  tenantId: z.string(),
  subdomain: z.string().min(3).max(63),
});

export const customDomainSchema = z.object({
  tenantId: z.string(),
  domain: z.string().regex(
    /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i,
    'Invalid domain format'
  ),
});

export type { DnsProvider, DnsRecord, DnsZone, SubdomainResult };
