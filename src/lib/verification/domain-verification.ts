/**
 * Domain Verification System
 * Implements DNS and file-based domain verification for white-label and custom domains
 */

import { z } from 'zod';

// Verification methods
export type VerificationMethod = 'dns_txt' | 'dns_cname' | 'file_upload' | 'meta_tag';
export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'expired';

export interface DomainVerification {
  id: string;
  organizationId: string;
  domain: string;
  method: VerificationMethod;
  status: VerificationStatus;
  verificationToken?: string;
  verifiedAt?: Date;
  expiresAt?: Date;
  lastCheckedAt?: Date;
  dnsRecords?: DNSRecord[];
  errors?: string[];
  metadata: Record<string, any>;
}

export interface DNSRecord {
  type: 'TXT' | 'CNAME' | 'A';
  name: string;
  value: string;
  expected?: string;
  found?: boolean;
}

export interface VerificationChallenge {
  method: VerificationMethod;
  token: string;
  instructions: string;
  expectedRecord?: DNSRecord;
  fileContent?: string;
  fileName?: string;
}

export interface VerificationResult {
  success: boolean;
  domain: string;
  method: VerificationMethod;
  status: VerificationStatus;
  dnsRecords?: DNSRecord[];
  errors?: string[];
  message: string;
}

// Verification configurations for each method
const VERIFICATION_CONFIGS: Record<VerificationMethod, {
  name: string;
  description: string;
  timeout: number;
}> = {
  dns_txt: {
    name: 'DNS TXT Record',
    description: 'Add a TXT record to your domain\'s DNS configuration',
    timeout: 3600 // 1 hour max wait for DNS propagation
  },
  dns_cname: {
    name: 'DNS CNAME Record',
    description: 'Add a CNAME record pointing to our verification domain',
    timeout: 3600
  },
  file_upload: {
    name: 'HTML File',
    description: 'Upload an HTML file to your domain\'s root directory',
    timeout: 300 // 5 minutes for file to be accessible
  },
  meta_tag: {
    name: 'HTML Meta Tag',
    description: 'Add a meta tag to your domain\'s homepage',
    timeout: 300
  }
};

// Domain validation schema
export const domainSchema = z.object({
  domain: z.string()
    .min(2, 'Domain must be at least 2 characters')
    .max(255, 'Domain must be less than 255 characters')
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/, 'Invalid domain format')
    .refine(domain => {
      // Check for valid TLD
      const tld = domain.split('.').pop();
      return tld && tld.length >= 2;
    }, 'Invalid top-level domain')
});

export class DomainVerifier {
  private organizationId: string;
  private baseUrl: string;

  constructor(organizationId: string, baseUrl: string = 'https://verify.example.com') {
    this.organizationId = organizationId;
    this.baseUrl = baseUrl;
  }

  /**
   * Generate a verification challenge for a domain
   */
  generateChallenge(domain: string, method: VerificationMethod): VerificationChallenge {
    const token = this.generateToken();
    const normalizedDomain = this.normalizeDomain(domain);

    switch (method) {
      case 'dns_txt':
        return {
          method,
          token,
          instructions: `Add a TXT record to your domain's DNS configuration with the following value:`,
          expectedRecord: {
            type: 'TXT',
            name: normalizedDomain,
            value: `verification=${token}`,
            expected: `verification=${token}`
          }
        };

      case 'dns_cname':
        return {
          method,
          token,
          instructions: `Add a CNAME record to your domain's DNS configuration:`,
          expectedRecord: {
            type: 'CNAME',
            name: `verify.${normalizedDomain}`,
            value: `${token}.${this.baseUrl.replace('https://', '')}`,
            expected: `${token}.${this.baseUrl.replace('https://', '')}`
          }
        };

      case 'file_upload':
        return {
          method,
          token,
          instructions: `Create an HTML file named "${token}.html" and upload it to the root of your domain:`,
          fileContent: this.generateVerificationHtml(token),
          fileName: `${token}.html`
        };

      case 'meta_tag':
        return {
          method,
          token,
          instructions: `Add the following meta tag to the <head> section of your domain's homepage:`,
        };

      default:
        throw new Error(`Unsupported verification method: ${method}`);
    }
  }

  /**
   * Verify domain ownership using the specified method
   */
  async verify(
    domain: string,
    method: VerificationMethod,
    token: string
  ): Promise<VerificationResult> {
    const normalizedDomain = this.normalizeDomain(domain);

    switch (method) {
      case 'dns_txt':
        return await this.verifyDnsTxt(normalizedDomain, token);
      case 'dns_cname':
        return await this.verifyDnsCname(normalizedDomain, token);
      case 'file_upload':
        return await this.verifyFileUpload(normalizedDomain, token);
      case 'meta_tag':
        return await this.verifyMetaTag(normalizedDomain, token);
      default:
        return {
          success: false,
          domain: normalizedDomain,
          method,
          status: 'failed',
          message: `Unsupported verification method: ${method}`
        };
    }
  }

  /**
   * Verify using DNS TXT record
   */
  private async verifyDnsTxt(domain: string, token: string): Promise<VerificationResult> {
    try {
      // Simulate DNS lookup (in production, use actual DNS query)
      const expectedValue = `verification=${token}`;
      
      // In production, this would query the actual DNS
      const dnsRecords = await this.queryDnsTxt(domain);
      
      const txtRecord = dnsRecords.find(record => 
        record.type === 'TXT' && record.value.includes(expectedValue)
      );

      if (txtRecord) {
        return {
          success: true,
          domain,
          method: 'dns_txt',
          status: 'verified',
          dnsRecords: [{ type: 'TXT', name: domain, value: txtRecord.value, expected: expectedValue, found: true }],
          message: 'Domain verified successfully via TXT record'
        };
      }

      return {
        success: false,
        domain,
        method: 'dns_txt',
        status: 'failed',
        dnsRecords: dnsRecords.map(r => ({ 
          type: 'TXT', 
          name: domain, 
          value: r.value, 
          expected: expectedValue,
          found: false 
        })),
        message: 'TXT record not found. Please ensure DNS has propagated and try again.'
      };
    } catch (error) {
      return {
        success: false,
        domain,
        method: 'dns_txt',
        status: 'failed',
        errors: [error instanceof Error ? error.message : 'DNS lookup failed'],
        message: 'Failed to verify domain. Please check your DNS configuration.'
      };
    }
  }

  /**
   * Verify using DNS CNAME record
   */
  private async verifyDnsCname(domain: string, token: string): Promise<VerificationResult> {
    try {
      const expectedCname = `${token}.${this.baseUrl.replace('https://', '')}`;
      const expectedRecordName = `verify.${domain}`;
      
      // Simulate DNS lookup
      const dnsRecords = await this.queryDnsCname(expectedRecordName);
      
      const cnameRecord = dnsRecords.find(record =>
        record.type === 'CNAME' && record.value === expectedCname
      );

      if (cnameRecord) {
        return {
          success: true,
          domain,
          method: 'dns_cname',
          status: 'verified',
          dnsRecords: [{ type: 'CNAME', name: expectedRecordName, value: cnameRecord.value, expected: expectedCname, found: true }],
          message: 'Domain verified successfully via CNAME record'
        };
      }

      return {
        success: false,
        domain,
        method: 'dns_cname',
        status: 'failed',
        dnsRecords: dnsRecords.map(r => ({
          type: 'CNAME',
          name: expectedRecordName,
          value: r.value,
          expected: expectedCname,
          found: false
        })),
        message: 'CNAME record not found. Please check your DNS configuration.'
      };
    } catch (error) {
      return {
        success: false,
        domain,
        method: 'dns_cname',
        status: 'failed',
        errors: [error instanceof Error ? error.message : 'DNS lookup failed'],
        message: 'Failed to verify domain. Please check your DNS configuration.'
      };
    }
  }

  /**
   * Verify by checking if the verification file is accessible
   */
  private async verifyFileUpload(domain: string, token: string): Promise<VerificationResult> {
    try {
      const fileUrl = `https://${domain}/${token}.html`;
      
      // In production, this would make an actual HTTP request
      const response = await this.fetchWithTimeout(fileUrl, 5000);
      
      if (response.ok) {
        const content = await response.text();
        if (content.includes(token)) {
          return {
            success: true,
            domain,
            method: 'file_upload',
            status: 'verified',
            message: 'Domain verified successfully via file upload'
          };
        }
      }

      return {
        success: false,
        domain,
        method: 'file_upload',
        status: 'failed',
        message: 'Verification file not found or does not contain the expected token'
      };
    } catch (error) {
      return {
        success: false,
        domain,
        method: 'file_upload',
        status: 'failed',
        errors: [error instanceof Error ? error.message : 'File fetch failed'],
        message: 'Failed to access verification file. Ensure the file is accessible at your domain root.'
      };
    }
  }

  /**
   * Verify by checking if the meta tag exists on the homepage
   */
  private async verifyMetaTag(domain: string, token: string): Promise<VerificationResult> {
    try {
      const pageUrl = `https://${domain}`;
      
      // In production, this would make an actual HTTP request
      const response = await this.fetchWithTimeout(pageUrl, 5000);
      
      if (response.ok) {
        const content = await response.text();
        const metaTagPattern = new RegExp(`<meta[^>]*name=["']verification["'][^>]*content=["']${token}["']`, 'i');
        
        if (metaTagPattern.test(content)) {
          return {
            success: true,
            domain,
            method: 'meta_tag',
            status: 'verified',
            message: 'Domain verified successfully via meta tag'
          };
        }
      }

      return {
        success: false,
        domain,
        method: 'meta_tag',
        status: 'failed',
        message: 'Meta tag not found. Please add the verification meta tag to your homepage.'
      };
    } catch (error) {
      return {
        success: false,
        domain,
        method: 'meta_tag',
        status: 'failed',
        errors: [error instanceof Error ? error.message : 'Page fetch failed'],
        message: 'Failed to access your domain. Ensure it is accessible and try again.'
      };
    }
  }

  /**
   * Generate unique verification token
   */
  private generateToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = 'v-';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  /**
   * Normalize domain name
   */
  private normalizeDomain(domain: string): string {
    return domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }

  /**
   * Generate HTML content for file verification
   */
  private generateVerificationHtml(token: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Domain Verification</title>
</head>
<body>
  <h1>Verification Token</h1>
  <p>${token}</p>
</body>
</html>`;
  }

  /**
   * Simulate DNS TXT query (replace with actual DNS lookup in production)
   */
  private async queryDnsTxt(domain: string): Promise<{ type: 'TXT'; value: string }[]> {
    // In production, use actual DNS query
    return [];
  }

  /**
   * Simulate DNS CNAME query (replace with actual DNS lookup in production)
   */
  private async queryDnsCname(name: string): Promise<{ type: 'CNAME'; value: string }[]> {
    // In production, use actual DNS query
    return [];
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  /**
   * Check if domain is already verified
   */
  async isVerified(domain: string, organizationId: string): Promise<boolean> {
    // In production, check against stored verifications
    return false;
  }

  /**
   * Get all verification methods for a domain
   */
  getAvailableMethods(domain: string): VerificationMethod[] {
    const methods: VerificationMethod[] = ['dns_txt', 'dns_cname', 'file_upload', 'meta_tag'];
    
    // DNS methods require additional DNS management
    // File upload requires web server access
    // Meta tag requires homepage access
    
    return methods;
  }

  /**
   * Estimate verification time for a method
   */
  getEstimatedTime(method: VerificationMethod): string {
    const configs: Record<VerificationMethod, string> = {
      dns_txt: '5 minutes to 24 hours (depending on DNS propagation)',
      dns_cname: '5 minutes to 24 hours (depending on DNS propagation)',
      file_upload: 'Immediate once file is uploaded',
      meta_tag: 'Immediate once tag is added'
    };
    return configs[method];
  }

  /**
   * Get troubleshooting tips for failed verification
   */
  getTroubleshootingTips(method: VerificationMethod): string[] {
    const tips: Record<VerificationMethod, string[]> = {
      dns_txt: [
        'Ensure the TXT record has been added to your DNS configuration',
        'Wait for DNS propagation (can take up to 24 hours)',
        'Check for typos in the record name or value',
        'Verify the record is added to the correct DNS zone',
        'Try using a DNS lookup tool to confirm the record exists'
      ],
      dns_cname: [
        'Ensure the CNAME record points to the correct verification domain',
        'Wait for DNS propagation',
        'Remove any existing A records for the subdomain',
        'Verify the CNAME target domain is accessible',
        'Check for trailing dots in the CNAME target'
      ],
      file_upload: [
        'Ensure the file is uploaded to the root directory',
        'Verify the file name matches exactly (including extension)',
        'Check file permissions allow public access',
        'Verify the domain resolves to your web server',
        'Try accessing the file directly in a browser'
      ],
      meta_tag: [
        'Ensure the meta tag is in the <head> section',
        'Verify the tag is on the homepage (root URL)',
        'Check for case sensitivity in the name and content',
        'Clear your browser cache and try again',
        'Ensure there are no JavaScript redirects on the page'
      ]
    };
    return tips[method];
  }
}

export const createDomainVerifier = (organizationId: string, baseUrl?: string) => {
  return new DomainVerifier(organizationId, baseUrl);
};

// Helper function to validate domain format
export function validateDomain(domain: string): { valid: boolean; error?: string } {
  const result = domainSchema.safeParse(domain);
  if (!result.success) {
    return { valid: false, error: result.error.errors[0].message };
  }
  return { valid: true };
}

// Helper function to check if domain is whitelisted for custom branding
export function isDomainAllowedForTier(domain: string, tier: 'scale' | 'enterprise'): boolean {
  const reservedPatterns = [
    /^www\./,
    /^mail\./,
    /^ftp\./,
    /^admin\./,
    /^api\./,
    /^support\./,
    /^help\./,
    /^docs\./,
    /^blog\./,
    /^status\./,
    /^verify\./,
    /^auth\./,
    /^login\./,
    /^sso\./,
    /\.local$/,
    /\.localhost$/,
    /\.intranet$/,
    /\.internal$/
  ];

  const isReserved = reservedPatterns.some(pattern => pattern.test(domain));

  if (isReserved) {
    return false;
  }

  // Enterprise tier can use any domain
  if (tier === 'enterprise') {
    return true;
  }

  // Scale tier has some restrictions
  if (tier === 'scale') {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /^[0-9]+\./, // Starts with numbers
      /-/,
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(domain.split('.')[0]));
  }

  return false;
}
