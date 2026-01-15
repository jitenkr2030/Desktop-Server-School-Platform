# INR99 Academy - White-Label Learning Platform

<div align="center">

![INR99 Academy](https://via.placeholder.com/1200x400/3b82f6/ffffff?text=INR99+Academy+White+Label+Platform)

**A powerful, multi-tenant learning infrastructure that empowers institutions, businesses, and entrepreneurs to launch their own branded learning platforms in minutes.**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Support](#support)

</div>

---

## 🎯 Overview

INR99 Academy is a comprehensive white-label learning management platform designed for organizations seeking to deliver branded educational experiences without the complexity of building infrastructure from scratch. The platform combines modern web technologies with flexible customization options, enabling rapid deployment of professional learning environments tailored to specific branding requirements.

The white-label architecture supports multi-tenant deployments where each organization maintains complete control over their visual identity, domain configuration, and feature availability. Whether you are an educational institution, corporate training department, or independent educator, the platform provides the tools necessary to create compelling learning experiences that reflect your unique brand identity.

Key architectural foundations include a PostgreSQL database with Prisma ORM for type-safe database operations, Next.js 15 for server-side rendering and optimal performance, and a comprehensive API layer that enables deep integration with existing systems. The platform handles everything from course delivery and user management to assessment processing and certificate generation, all while maintaining strict tenant isolation and data privacy.

---

## ✨ Features

### 1. Dynamic Branding System

The dynamic branding system transforms how organizations present their learning platforms by providing comprehensive visual customization capabilities. Every element of the user interface can be tailored to match organizational brand guidelines, creating seamless brand experiences that reinforce identity across all touchpoints.

**Color Customization**: Organizations can define complete color palettes including primary colors for main actions and navigation elements, secondary colors for supporting UI components, and accent colors for highlights and calls-to-action. The system generates derived color variants automatically, producing appropriate hover states, focus indicators, and disabled state colors that maintain visual consistency throughout the platform.

**Typography Management**: Support for custom font families enables organizations to use their brand-specified typography. The system integrates with Google Fonts and supports custom font file uploads for organizations with licensed typefaces. Font settings apply consistently across all platform pages, ensuring typographic unity throughout the learning experience.

**Logo and Asset Management**: Multiple logo variants can be configured including light and dark versions for different page contexts, favicons for browser tabs and bookmarks, and social media images for link previews. Custom login background images and branded social sharing graphics complete the visual identity package.

**Custom CSS Injection**: For organizations requiring advanced styling beyond the built-in customization options, the platform provides a custom CSS injection feature. This enables implementation of unique design elements, animations, or layout modifications that align with specific brand guidelines while maintaining compatibility with platform updates.

### 2. Subdomain Management

The subdomain management system automates the complex process of provisioning and managing custom web addresses for each tenant, eliminating the need for manual DNS configuration and reducing deployment time from days to minutes.

**Automatic Subdomain Provisioning**: When a new tenant registers, the system automatically provisions a dedicated subdomain in the format `tenantname.inr99.academy`. This process includes DNS record creation, SSL certificate generation, and web server configuration, all handled through a single API call. The provisioning process completes in under 30 seconds, enabling immediate platform access for new organizations.

**DNS Integration**: The platform integrates with major DNS providers including Cloudflare and AWS Route53 through a provider-agnostic architecture. DNS records are created automatically, including CNAME records for subdomains, TXT records for domain verification, and appropriate A records for custom domain configurations. The integration supports both automated and manual DNS setup modes to accommodate organizational requirements.

**SSL Certificate Management**: Security is paramount in modern web applications, and the platform ensures all tenant domains are served over HTTPS with valid SSL certificates. For Cloudflare-provisioned subdomains, SSL certificates are generated automatically through Cloudflare's edge network. Custom domains can use certificates from Let's Encrypt, Cloudflare Origin certificates, or uploaded third-party certificates.

**Custom Domain Support**: Organizations with existing domain names can configure their domains to point to their white-label platform instance. The system supports apex domains, subdomains, and wildcard configurations. Domain verification processes ensure organizational ownership before enabling custom domain access.

### 3. Multi-Tenant Architecture

The multi-tenant architecture provides robust isolation between organizations while maximizing infrastructure efficiency. Each tenant operates within a secure boundary, with dedicated resources and configurations that prevent data leakage and ensure consistent performance regardless of overall platform load.

**Tenant Isolation**: Data isolation is enforced at multiple levels including database queries, file storage, and session management. Cross-tenant data access is prevented through comprehensive query scoping, ensuring that user data, course content, and organizational settings remain strictly private. The isolation architecture has been designed to meet enterprise security requirements and support compliance with data protection regulations.

**Tenant Scoping Middleware**: A sophisticated middleware layer intercepts all requests and applies appropriate tenant context based on subdomain or custom domain identification. This middleware handles authentication redirection, session management, and feature flag application, ensuring each tenant receives a tailored experience without requiring custom code for each organization.

**Subscription Tiers**: The platform supports multiple subscription tiers that determine feature availability and resource limits for each tenant. The FREE tier provides essential features for small organizations getting started, while STARTER, PROFESSIONAL, and ENTERPRISE tiers unlock advanced capabilities such as custom domains, increased user limits, priority support, and enhanced analytics.

### 4. User and Access Management

Comprehensive user management capabilities enable organizations to control access to their learning platforms through flexible role-based access control systems and configurable registration workflows.

**Role-Based Access Control**: The platform implements a comprehensive RBAC system with predefined roles including OWNER, ADMIN, INSTRUCTOR, and MEMBER. Each role carries specific permissions that determine access to platform features. OWNERs have complete control over tenant configuration and billing, ADMINs manage users and settings, INSTRUCTORS create and deliver content, and MEMBERS access learning resources according to assigned permissions.

**Custom Role Configuration**: Organizations can extend the role system with custom roles that combine specific permissions to match organizational structures. Custom roles enable implementation of department-specific access patterns, external evaluator access, or any other organizational hierarchy that requires tailored permission sets.

**Registration Management**: Configurable registration settings allow organizations to control how users join their learning platforms. Options include open registration where anyone can create an account, approval-required registration where administrators must approve new users, and invitation-only registration where existing members must invite new users. These settings can be combined with custom registration fields to collect organization-specific information during signup.

**Session Management**: User sessions are managed securely with configurable timeout periods, device tracking, and the ability for administrators to revoke active sessions. Multi-factor authentication can be required for specific roles or across the entire tenant, adding additional security for sensitive learning environments.

### 5. Content Customization

The content customization system enables organizations to adapt platform content to their specific contexts, providing localized and contextually relevant learning experiences without requiring content duplication.

**Content Overrides**: Organizations can override default platform content including course titles, descriptions, and thumbnails. This feature enables localization of content for different regions, adaptation of messaging for specific audiences, and correction of errors without modifying source content that affects other tenants.

**Custom Fields**: Beyond standard user profile fields, organizations can configure custom fields that capture organization-specific information. Custom fields support various data types including text, numbers, dates, dropdown selections, and checkbox groups. Field visibility can be configured for specific user roles, enabling collection of information only where relevant.

**Welcome Messages and Policies**: Organizations can configure custom welcome messages that greet users upon first login, helping set expectations and provide organization-specific guidance. Terms of service and privacy policy documents can be customized to reflect organizational legal requirements, with version tracking ensuring users accept appropriate policy versions.

### 6. Feature Flags and Configuration

A comprehensive feature flag system enables organizations to customize their platform experience by enabling or disabling specific functionality according to their operational requirements.

**Core Feature Toggles**: Organizations can control availability of major platform features including live sessions, certificates, discussions, and analytics. Disabling unused features simplifies the user interface and reduces cognitive load for users who do not require certain capabilities.

**Course Configuration**: Default settings for course creation can be configured at the tenant level, including maximum courses per user, default difficulty levels, and approval workflows for published content. These defaults provide consistency while still allowing individual instructors to override settings when needed.

**Analytics Configuration**: Organizations can configure analytics collection and reporting preferences, balancing the value of learning insights against user privacy concerns. Analytics dashboards provide actionable insights into course completion rates, assessment performance, and engagement patterns.

---

## 🚀 Quick Start

### Prerequisites

Before deploying the white-label platform, ensure your environment meets the following requirements:

- Node.js 20.x or higher
- PostgreSQL 14.x database
- npm, yarn, or bun package manager
- DNS provider account (Cloudflare recommended)
- SSL certificate capability

### Environment Configuration

Create a `.env` file in the project root with the following configuration:

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/inr99_academy"

# Application Configuration
NEXT_PUBLIC_APP_URL="https://inr99.academy"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://inr99.academy"

# DNS Provider Configuration (Cloudflare Example)
DNS_PROVIDER="cloudflare"
DNS_PROVIDER_API_KEY="your-cloudflare-api-token"
DNS_PROVIDER_API_SECRET="your-cloudflare-api-secret"
DNS_BASE_DOMAIN="inr99.academy"

# Email Configuration (Optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASSWORD="your-password"

# Payment Configuration (Optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Installation Steps

1. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/your-org/inr99-academy.git
   cd inr99-academy
   npm install
   ```

2. **Initialize the database**:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the platform**:
   - Main platform: http://localhost:3000
   - Tenant signup: http://localhost:3000/institution/signup

### Docker Deployment

For production deployments, the platform includes Docker configuration:

```bash
docker-compose up -d
```

This starts all required services including the Next.js application, PostgreSQL database, Redis cache, and monitoring tools.

---

## 📖 Documentation

### Tenant Registration API

Organizations can register as tenants through the programmatic API:

**Endpoint**: `POST /api/tenants/register`

**Request Body**:
```json
{
  "institutionName": "Acme Academy",
  "email": "admin@acme.com",
  "phone": "+1234567890",
  "subdomain": "acme",
  "adminName": "John Doe",
  "adminPassword": "secure-password"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Institution registered successfully",
  "tenant": {
    "id": "tenant_abc123",
    "name": "Acme Academy",
    "slug": "acme",
    "subdomain": "acme.inr99.academy",
    "domainStatus": "ACTIVE"
  },
  "user": {
    "id": "user_xyz789",
    "email": "admin@acme.com",
    "name": "John Doe"
  },
  "dnsProvisioning": {
    "subdomain": "acme",
    "fullDomain": "acme.inr99.academy",
    "sslStatus": "provisioned",
    "records": [...]
  }
}
```

### Subdomain Check API

Validate subdomain availability before registration:

**Endpoint**: `GET /api/subdomains/check?subdomain=acme`

**Response**:
```json
{
  "available": true,
  "message": "Subdomain is available"
}
```

### Branding Configuration API

Tenants can configure their branding through the admin interface or programmatically:

**Endpoint**: `PUT /api/admin/settings/branding`

**Request Body**:
```json
{
  "primaryColor": "#3b82f6",
  "secondaryColor": "#1e40af",
  "accentColor": "#f59e0b",
  "backgroundColor": "#ffffff",
  "textColor": "#1f2937",
  "fontFamily": "Inter",
  "logoUrl": "https://...",
  "customCss": ".brand-button { ... }"
}
```

### DNS Provider Integration

The platform supports multiple DNS providers through a provider abstraction layer:

#### Cloudflare Configuration

```typescript
// Environment variables
DNS_PROVIDER=cloudflare
DNS_PROVIDER_API_KEY=your-cloudflare-api-token
DNS_PROVIDER_API_SECRET=your-cloudflare-api-secret
```

Cloudflare integration provides automatic SSL provisioning through Cloudflare's edge network, proxied records for improved performance, and automatic failover.

#### AWS Route53 Configuration

```typescript
// Environment variables
DNS_PROVIDER=route53
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

Route53 integration supports private hosted zones, health checks, and routing policies for advanced configurations.

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │  Web App  │  │  Mobile   │  │  Admin    │               │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘               │
└────────┼──────────────┼──────────────┼──────────────────────┘
         │              │              │
         └──────────────┼──────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │  Next.js│   │  Auth   │   │  CDN    │
    │  Server │   │  Layer  │   │         │
    └────┬────┘   └─────────┘   └─────────┘
         │
    ┌────▼───────────────────────────────┐
    │         API Gateway                │
    │  ┌─────────┐ ┌─────────┐ ┌────────┐│
    │  │ Tenant  │ │ Course  │ │ User   ││
    │  │ Router  │ │ Router  │ │ Router ││
    │  └─────────┘ └─────────┘ └────────┘│
    └────┬───────────────────────────────┘
         │
    ┌────▼───────────────────────────────┐
    │         Database Layer             │
    │  ┌─────────┐ ┌─────────┐ ┌────────┐│
    │  │Tenant   │ │ Course  │ │ User   ││
    │  │ Tables  │ │ Tables  │ │ Tables ││
    │  └─────────┘ └─────────┘ └────────┘│
    └────────────────────────────────────┘
```

### Technology Stack

**Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS, and Radix UI components. The frontend implements server-side rendering for optimal performance and SEO, with client-side hydration for interactive features.

**Backend**: Next.js API routes provide the backend interface, with middleware handling authentication, tenant identification, and request validation. The architecture supports both serverless and containerized deployments.

**Database**: PostgreSQL with Prisma ORM provides type-safe database operations. The schema includes comprehensive models for tenants, users, courses, assessments, certificates, and content management.

**Authentication**: NextAuth.js handles authentication with support for multiple providers, session management, and role-based access control.

**Infrastructure**: Docker containers enable consistent deployments across environments. The platform supports deployment to major cloud providers including AWS, Google Cloud Platform, and Azure.

---

## 📊 Subscription Tiers

| Feature | FREE | STARTER | PROFESSIONAL | ENTERPRISE |
|---------|------|---------|--------------|------------|
| Users | 100 | 500 | 2,000 | Unlimited |
| Custom Subdomain | ✅ | ✅ | ✅ | ✅ |
| Custom Domain | ❌ | ✅ | ✅ | ✅ |
| Custom CSS | ❌ | ✅ | ✅ | ✅ |
| Priority Support | ❌ | Email | Chat | Dedicated |
| Analytics | Basic | Advanced | Full | Custom |
| API Access | Limited | Standard | Full | Full |
| White Label | ❌ | Logo Only | Full | Full |

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

- **Documentation**: https://docs.inr99.academy
- **Discord**: https://discord.gg/inr99
- **Email**: support@inr99.academy

---

<div align="center">

**Built with ❤️ by INR99 Academy Team**

</div>
