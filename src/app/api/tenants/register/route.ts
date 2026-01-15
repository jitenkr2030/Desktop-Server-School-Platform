import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { hash } from 'bcryptjs'
import {
  createDnsProvider,
  SubdomainProvisioningService,
  SubdomainProvisioningConfig,
} from '@/lib/brand/dns-provider'

// Eligibility threshold for free white-label access
const ELIGIBILITY_THRESHOLD = 1500

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      institutionName, 
      email, 
      phone, 
      subdomain, 
      adminName, 
      adminPassword,
      studentCount 
    } = body

    // Validate required fields
    if (!institutionName || !email || !subdomain || !adminName || !adminPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate student count
    if (!studentCount || isNaN(studentCount) || studentCount < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid number of students (minimum 10)' },
        { status: 400 }
      )
    }

    // Determine eligibility status based on student count
    const isEligible = studentCount >= ELIGIBILITY_THRESHOLD
    const eligibilityStatus = isEligible ? 'PENDING' : 'EXPIRED'
    
    // Set verification deadline (30 days from now if eligible)
    const eligibilityDeadline = isEligible 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : null

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json(
        { error: 'Invalid subdomain format' },
        { status: 400 }
      )
    }

    if (subdomain.length < 3 || subdomain.length > 63) {
      return NextResponse.json(
        { error: 'Subdomain must be between 3 and 63 characters' },
        { status: 400 }
      )
    }

    // Check reserved subdomains
    const reservedSubdomains = [
      'www', 'mail', 'admin', 'api', 'app', 'dashboard',
      'inr99', 'support', 'help', 'blog', 'docs',
      'pricing', 'about', 'contact', 'auth', 'login',
      'register', 'instructor', 'student', 'cdn', 'static'
    ]

    if (reservedSubdomains.includes(subdomain.toLowerCase())) {
      return NextResponse.json(
        { error: 'This subdomain is reserved' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Check if subdomain is available in database
    const existingTenant = await db.tenant.findUnique({
      where: { slug: subdomain.toLowerCase() },
    })

    if (existingTenant) {
      return NextResponse.json(
        { error: 'This subdomain is already taken' },
        { status: 400 }
      )
    }

    // Check if email is already registered
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(adminPassword, 12)

    // Initialize DNS provider for subdomain auto-provisioning
    const dnsProviderConfig = {
      provider: (process.env.DNS_PROVIDER as 'cloudflare' | 'route53') || 'cloudflare',
      apiKey: process.env.DNS_PROVIDER_API_KEY,
      apiSecret: process.env.DNS_PROVIDER_API_SECRET,
      region: process.env.AWS_REGION || 'us-east-1',
    }

    let dnsProvisioningResult = null
    let domainStatus: 'PENDING' | 'ACTIVE' | 'FAILED' = 'PENDING'

    // Try to provision subdomain in DNS if provider is configured
    if (process.env.DNS_PROVIDER_API_KEY) {
      const dnsProvider = createDnsProvider(dnsProviderConfig)

      if (dnsProvider) {
        const initialized = await dnsProvider.initialize(dnsProviderConfig)

        if (initialized) {
          const subdomainService = new SubdomainProvisioningService({
            baseDomain: 'inr99.academy',
            dnsProvider,
            sslProvider: 'cloudflare',
            defaultTtl: 3600,
          })

          // Provision the subdomain
          dnsProvisioningResult = await subdomainService.provisionSubdomain(
            subdomain.toLowerCase(),
            '' // tenantId will be added after tenant creation
          )

          // Update domain status based on DNS provisioning
          if (dnsProvisioningResult.sslStatus === 'provisioned') {
            domainStatus = 'ACTIVE'
          } else if (dnsProvisioningResult.sslStatus === 'failed') {
            domainStatus = 'FAILED'
          }
        }
      }
    }

    // Create the tenant and admin user in a transaction
    const tenant = await db.tenant.create({
      data: {
        name: institutionName,
        slug: subdomain.toLowerCase(),
        status: 'PENDING',
        subscriptionTier: 'FREE',
        maxUsers: 100,
        studentCount: studentCount,
        eligibilityStatus: eligibilityStatus,
        eligibilityDeadline: eligibilityDeadline,
        branding: {
          create: {
            primaryColor: '#3b82f6',
            secondaryColor: '#1e40af',
            accentColor: '#f59e0b',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            fontFamily: 'Inter',
          },
        },
        domains: {
          create: {
            domain: `${subdomain.toLowerCase()}.inr99.academy`,
            type: 'SUBDOMAIN',
            status: domainStatus,
            dnsProvisioned: dnsProvisioningResult?.sslStatus === 'provisioned',
            dnsRecords: dnsProvisioningResult?.dnsRecords as any,
          },
        },
        settings: {
          create: {
            allowRegistration: true,
            requireApproval: false,
            defaultUserRole: 'STUDENT',
            maxCoursesPerUser: 10,
            enableLiveSessions: true,
            enableCertificates: true,
            enableDiscussion: true,
            enableAnalytics: true,
          },
        },
      },
    })

    // Create admin user
    const user = await db.user.create({
      data: {
        email,
        name: adminName,
        password: hashedPassword,
        mobileNumber: phone,
        role: 'ADMIN',
        isActive: true,
        isVerified: false,
      },
    })

    // Link user to tenant as owner
    await db.tenantUser.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        email,
        name: adminName,
        role: 'OWNER',
        status: 'ACTIVE',
        joinedAt: new Date(),
      },
    })

    // Return success with DNS provisioning details
    return NextResponse.json({
      success: true,
      message: 'Institution registered successfully',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        subdomain: `${subdomain.toLowerCase()}.inr99.academy`,
        domainStatus: domainStatus,
        studentCount: studentCount,
        eligibilityStatus: eligibilityStatus,
        eligibilityDeadline: eligibilityDeadline,
        isEligible: isEligible,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      dnsProvisioning: dnsProvisioningResult
        ? {
            subdomain: dnsProvisioningResult.subdomain,
            fullDomain: dnsProvisioningResult.fullDomain,
            sslStatus: dnsProvisioningResult.sslStatus,
            records: dnsProvisioningResult.dnsRecords,
          }
        : null,
      verificationRequired: isEligible,
      verificationDeadline: eligibilityDeadline,
    })
  } catch (error) {
    console.error('Tenant registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register institution' },
      { status: 500 }
    )
  }
}
