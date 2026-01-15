import { NextRequest, NextResponse } from 'next/server';
import { 
  validateStudentCount, 
  getGracePeriodDetails,
  formatGraceStatus 
} from '@/lib/verification/grace-period';

// In-memory store for demo
interface TenantDomain {
  domain: string;
  verified: boolean;
  verificationMethod: 'dns' | 'file' | 'email' | null;
  verifiedAt: Date | null;
  createdAt: Date;
}

const domainStore: Map<string, TenantDomain[]> = new Map();

// GET - Get domain verification status
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || 'demo-tenant';
    const domains = domainStore.get(tenantId) || [];
    
    return NextResponse.json({
      success: true,
      data: domains,
    });
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}

// POST - Add or verify a domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, domain, verificationMethod } = body;
    
    const tenantId = request.headers.get('x-tenant-id') || 'demo-tenant';
    
    if (action === 'add') {
      // Add new domain
      if (!domain) {
        return NextResponse.json(
          { success: false, error: 'Domain is required' },
          { status: 400 }
        );
      }
      
      // Validate domain format
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        return NextResponse.json(
          { success: false, error: 'Invalid domain format' },
          { status: 400 }
        );
      }
      
      const tenantDomains = domainStore.get(tenantId) || [];
      
      // Check if domain already exists
      if (tenantDomains.find(d => d.domain === domain)) {
        return NextResponse.json(
          { success: false, error: 'Domain already added' },
          { status: 400 }
        );
      }
      
      const newDomain: TenantDomain = {
        domain,
        verified: false,
        verificationMethod: null,
        verifiedAt: null,
        createdAt: new Date(),
      };
      
      tenantDomains.push(newDomain);
      domainStore.set(tenantId, tenantDomains);
      
      return NextResponse.json({
        success: true,
        data: newDomain,
        message: 'Domain added successfully',
      }, { status: 201 });
    }
    
    if (action === 'verify') {
      // Verify domain using specified method
      if (!domain || !verificationMethod) {
        return NextResponse.json(
          { success: false, error: 'Domain and verification method are required' },
          { status: 400 }
        );
      }
      
      const tenantDomains = domainStore.get(tenantId) || [];
      const domainRecord = tenantDomains.find(d => d.domain === domain);
      
      if (!domainRecord) {
        return NextResponse.json(
          { success: false, error: 'Domain not found' },
          { status: 404 }
        );
      }
      
      // Simulate verification based on method
      let verified = false;
      
      switch (verificationMethod) {
        case 'dns':
          // In production, perform actual DNS lookup
          verified = Math.random() > 0.3; // 70% success for demo
          break;
        case 'file':
          // In production, check if file exists at domain/.well-known/...
          verified = Math.random() > 0.2; // 80% success for demo
          break;
        case 'email':
          // In production, send verification email
          verified = Math.random() > 0.4; // 60% success for demo
          break;
        default:
          return NextResponse.json(
            { success: false, error: 'Invalid verification method' },
            { status: 400 }
          );
      }
      
      if (verified) {
        domainRecord.verified = true;
        domainRecord.verificationMethod = verificationMethod;
        domainRecord.verifiedAt = new Date();
      }
      
      return NextResponse.json({
        success: true,
        data: {
          verified,
          domain: domainRecord.domain,
          verificationMethod,
          verifiedAt: domainRecord.verifiedAt,
        },
        message: verified ? 'Domain verified successfully' : 'Verification failed',
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing domain request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a domain
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    
    const tenantId = request.headers.get('x-tenant-id') || 'demo-tenant';
    
    if (!domain) {
      return NextResponse.json(
        { success: false, error: 'Domain is required' },
        { status: 400 }
      );
    }
    
    const tenantDomains = domainStore.get(tenantId) || [];
    const filteredDomains = tenantDomains.filter(d => d.domain !== domain);
    
    domainStore.set(tenantId, filteredDomains);
    
    return NextResponse.json({
      success: true,
      message: 'Domain removed successfully',
    });
  } catch (error) {
    console.error('Error removing domain:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove domain' },
      { status: 500 }
    );
  }
}
