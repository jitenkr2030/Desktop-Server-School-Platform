# White-Label Multi-Tenant Platform - Implementation Task List

## Overview

This document contains a comprehensive task list for implementing a white-label multi-tenant B2B SaaS platform where schools, colleges, and institutions can:
- Self-register and login with their own credentials
- Receive a white-label branded platform (custom subdomain, logo, colors)
- Access all INR99 Academy content
- Upload their own content
- Manage their own users (teachers, students)
- Everything fully automated at ₹99/month

---

## Phase 1: Foundation - Database & Architecture (Week 1-2)

### 1.1 Database Schema Design

- [x] **Create tenants table** ✅ DONE (Jan 2026)
  - Add tenant_id (UUID PRIMARY KEY)
  - Add institution_name (VARCHAR)
  - Add subdomain (VARCHAR, unique)
  - Add branding_config (JSONB): logo_url, primary_color, secondary_color, font_family, favicon
  - Add subscription_status (ENUM: active, inactive, trial, suspended)
  - Add created_at (TIMESTAMP)
  - Add updated_at (TIMESTAMP)

- [x] **Create tenant_users table** ✅ DONE
  - Add user_id (UUID, FK to users table)
  - Add tenant_id (UUID, FK to tenants table)
  - Add role (ENUM: admin, teacher, student, parent)
  - Add is_active (BOOLEAN)
  - Add created_at (TIMESTAMP)

- [x] **Create custom_domains table** ✅ DONE (as tenant_domains)
  - Map domain to tenant_id
  - Track domain status

- [x] **Create tenant_branding table** ✅ DONE
  - All branding fields: logo_url, primary_color, secondary_color, font_family, custom_css

- [x] **Create tenant_subscriptions table** ✅ DONE
  - Track subscription status, billing cycle, payments

- [x] **Create tenant_settings table** ✅ DONE
  - Per-tenant configuration options

### 1.2 Middleware & Routing

- [x] **Create tenant resolution middleware** ✅ DONE (Jan 2026)
  - Extract subdomain from request Host header
  - Set tenant context for request
  - Handle domain not found errors

- [x] **Create branding middleware** ✅ DONE
  - Load tenant branding configuration
  - Apply branding to all rendered pages
  - Inject tenant-specific CSS variables

### 1.3 API Structure

- [ ] **Create tenant management API endpoints** - NEXT TASK
  - POST /api/tenants/register (self-registration)
  - GET /api/tenants/:id (get tenant details)
  - PATCH /api/tenants/:id (update branding)
  - GET /api/tenants/:id/usage (usage statistics)

- [ ] **Create subdomain availability API**
  - GET /api/subdomains/check?name=xxx
  - Validate subdomain format
  - Check availability in database

---

## Phase 2: Authentication & User Management (Week 3-4)

### 2.1 Multi-Tenant Authentication

- [ ] **Update login flow**
  - Accept email/password
  - Determine user's tenant_id
  - Apply tenant-specific branding on login page
  - Redirect to tenant's subdomain after login

- [ ] **Create tenant-aware session management**
  - Store tenant_id in session
  - Verify session belongs to current tenant
  - Handle sessions across subdomains

- [ ] **Implement role-based access control (RBAC)**
  - Define permissions per role (admin, teacher, student, parent)
  - Create permission middleware
  - Create decorator/helper for route protection

### 2.2 User Registration & Management

- [x] **Create institution signup page** ✅ DONE (Jan 2026)
  - Institution details form (name, type, email, phone)
  - Subdomain selection with live availability check
  - Admin account creation
  - Terms of service acceptance
  - Redirect to payment after submission

- [x] **Create admin dashboard** ✅ DONE (Jan 2026)
  - Overview statistics (users, courses, usage)
  - Quick actions (add teacher, add class, upload content)
  - Recent activity feed
  - Subscription status and renewal date

- [x] **Create branding settings page** ✅ DONE (Jan 2026)
  - Logo upload (file upload to cloud storage)
  - Primary color picker
  - Secondary color picker
  - Font family selection (dropdown with 10+ options)
  - Live preview of changes

- [x] **Create billing dashboard** ✅ DONE (Jan 2026)
  - Current subscription status
  - Payment history
  - Download invoices
  - Update payment method

- [x] **Create user management** ✅ DONE (Jan 2026)
  - Invite teachers via email
  - Bulk student management
  - Role-based user listing
  - Search and filter functionality

- [ ] **Create teacher management**
  - Invite teachers via email
  - Teacher registration flow
  - Teacher dashboard with assigned classes
  - Teacher permissions configuration

- [ ] **Create student management**
  - Bulk student upload via CSV
  - Individual student creation
  - Student ID generation
  - Parent account linking (optional)
  - Class assignment

- [ ] **Create class/grade management**
  - Create classes (Class 1, Class 2, etc.)
  - Assign teachers to classes
  - Enroll students in classes
  - Assign courses to classes

### 2.3 Parent Access (Optional)

- [ ] **Create parent registration**
  - Link parent to student(s)
  - Parent dashboard view
  - Progress reports for linked students
  - Notification preferences

---

## Phase 3: White-Label Branding System (Week 5-6)

### 3.1 Branding Configuration

- [ ] **Create branding settings page**
  - Logo upload (file upload to cloud storage)
  - Primary color picker
  - Secondary color picker
  - Font family selection (dropdown with 10+ options)
  - Favicon upload
  - Preview changes before saving

- [ ] **Implement dynamic CSS generation**
  - Generate tenant-specific CSS based on branding config
  - Apply CSS variables for colors and fonts
  - Cache generated CSS for performance

- [ ] **Create subdomain auto-provisioning**
  - Auto-create subdomain in DNS (via API if using DNS provider with API)
  - Generate SSL certificate (Let's Encrypt)
  - Configure CDN to serve subdomain
  - Set up redirect from subdomain to platform

### 3.2 Custom Domain Support (Optional - Phase 4)

- [ ] **Create custom domain setup flow**
  - Enter custom domain name
  - Generate DNS verification records
  - Verify domain ownership
  - Provision SSL certificate
  - Configure routing rules

- [ ] **Implement SSL certificate management**
  - Automatic certificate issuance via Let's Encrypt
  - Certificate renewal before expiry
  - Handle multiple domains per tenant

### 3.3 Email Branding

- [ ] **Configure transactional emails**
  - Update email templates with tenant branding
  - Use tenant's logo in email headers
  - Apply tenant colors to email styling
  - Send from tenant's email address (configurable)

---

## Phase 4: Content Management System (Week 7-8)

### 4.1 INR99 Content Access

- [ ] **Import existing INR99 Academy content**
  - Migrate all courses from course-data.ts
  - Set source='INR99' for platform content
  - Make content visible to all tenants by default
  - Set is_public=true for cross-tenant access

- [ ] **Create content catalog**
  - Display all available INR99 courses
  - Show content organized by category and level
  - Search functionality
  - Filter by subject, difficulty, type

- [ ] **Implement content licensing**
  - Track which tenants have access to which content
  - Handle content updates (automatic propagation)
  - Version control for content updates

### 4.2 Custom Content Upload

- [ ] **Create course creation wizard**
  - Course details form (title, description, thumbnail)
  - Category and tag selection
  - Difficulty level selection
  - Visibility settings (private, class-specific, public)

- [ ] **Implement lesson creation**
  - Add lessons to courses
  - Lesson types: video, text, quiz, assignment
  - Video upload to cloud storage (AWS S3, Cloudinary, etc.)
  - Document/file upload support
  - Rich text editor for text lessons

- [ ] **Create assessment builder**
  - Quiz creation with multiple question types
  - Question bank (reuse questions across quizzes)
  - Auto-grading configuration
  - Passing score and time limits
  - Random question selection

- [ ] **Implement content approval workflow**
  - Draft mode (content not visible to students)
  - Review mode (pending admin approval)
  - Published mode (visible to students)
  - Archive mode (hidden but preserved)

### 4.3 Content Organization

- [ ] **Create library view for institution**
  - Show all accessible content (INR99 + custom)
  - Organize by source (Platform vs Institution)
  - Filter by type, subject, class
  - Search across all content

- [ ] **Implement course assignment**
  - Assign courses to classes
  - Assign courses to individual students
  - Set due dates and deadlines
  - Track assignment status

---

## Phase 5: Payment Integration (Week 9)

### 5.1 Payment Gateway Setup

- [ ] **Integrate Razorpay**
  - Create merchant account
  - Generate API keys
  - Implement payment links
  - Handle webhooks for payment confirmation

- [ ] **Create checkout flow**
  - Display pricing summary
  - Collect payment details
  - Handle payment success/failure
  - Generate invoice automatically

- [ ] **Implement subscription management**
  - Monthly billing cycle
  - Auto-renewal handling
  - Payment failure notifications
  - Grace period before suspension

### 5.2 Billing Dashboard

- [ ] **Create tenant billing page**
  - Current subscription status
  - Payment history
  - Download invoices
  - Update payment method
  - Cancel subscription option

- [ ] **Create admin revenue dashboard**
  - Total monthly recurring revenue
  - New subscriptions this month
  - Churned subscriptions
  - Revenue by institution type
  - Geographic distribution

---

## Phase 6: Frontend Development (Week 10-12)

### 6.1 Institution Onboarding Flow

- [ ] **Create landing page for institutions**
  - Value proposition for schools/colleges
  - Pricing display (₹99/month)
  - Feature highlights
  - Testimonials
  - Sign up CTA button

- [ ] **Create signup page**
  - Institution information form
  - Subdomain selection
  - Admin account creation
  - Terms and conditions
  - Progress indicator

- [ ] **Create payment page**
  - Order summary
  - Payment method selection
  - UPI QR code display
  - Card payment form
  - Success/failure handling

- [ ] **Create welcome/onboarding page**
  - Getting started guide
  - Video tutorial embed
  - Quick actions (upload logo, invite teachers)
  - Support contact information

### 6.2 Institution Dashboard

- [ ] **Create main dashboard**
  - Statistics cards (students, teachers, courses, activity)
  - Recent activity feed
  - Quick action buttons
  - Usage charts (daily/weekly/monthly)
  - Announcements/notifications

- [ ] **Create settings page**
  - Profile settings
  - Branding settings (logo, colors)
  - Notification preferences
  - Security settings (password change, 2FA)
  - Billing information

### 6.3 User Experience

- [ ] **Create loading states**
  - Skeleton screens for all pages
  - Loading spinners for API calls
  - Progress indicators for file uploads
  - Smooth transitions between pages

- [ ] **Implement error handling**
  - User-friendly error messages
  - Retry mechanisms for failed requests
  - Offline mode indicator
  - 404/500 page customization with tenant branding

---

## Phase 7: Testing & Quality Assurance (Week 13)

### 7.1 Functional Testing

- [ ] **Create test suite for tenant management**
  - Tenant creation
  - Subdomain availability checking
  - Branding updates
  - Data isolation verification

- [ ] **Create test suite for user management**
  - User registration across tenants
  - Role-based access control
  - Session management
  - Password reset flow

- [ ] **Create test suite for content**
  - INR99 content visibility
  - Custom content upload
  - Content assignment
  - Progress tracking

### 7.2 Security Testing

- [ ] **Conduct penetration testing**
  - Cross-tenant data access attempts
  - SQL injection vulnerabilities
  - XSS vulnerabilities
  - Authentication bypass attempts

- [ ] **Verify data isolation**
  - Attempt to access data from other tenants
  - Verify tenant_id is properly enforced
  - Test session hijacking prevention

### 7.3 Performance Testing

- [ ] **Load testing**
  - Simulate 100 concurrent tenants
  - Simulate 1,000 concurrent users
  - Measure response times
  - Identify bottlenecks

- [ ] **Database performance**
  - Query optimization for multi-tenant queries
  - Index performance analysis
  - Connection pool sizing

---

## Phase 8: Deployment & Monitoring (Week 14)

### 8.1 Deployment Setup

- [ ] **Configure production environment**
  - Set up production database
  - Configure environment variables
  - Set up CDN for static assets
  - Configure email service (SendGrid, AWS SES)

- [ ] **Set up CI/CD pipeline**
  - GitHub Actions workflow
  - Automated testing on push
  - Automated deployment to production
  - Rollback capability

### 8.2 Monitoring & Logging

- [ ] **Set up application monitoring**
  - Error tracking (Sentry)
  - Performance monitoring (New Relic, DataDog)
  - Uptime monitoring
  - API response time tracking

- [ ] **Set up logging**
  - Structured logging with request IDs
  - Log aggregation (Datadog, ELK stack)
  - Alerting for errors
  - Audit trail for tenant actions

### 8.3 Documentation

- [ ] **Create user documentation**
  - Getting started guide for institutions
  - Teacher onboarding guide
  - Student user guide
  - Video tutorials

- [ ] **Create API documentation**
  - API endpoint reference
  - Authentication guide
  - Webhook documentation
  - Rate limiting information

---

## Priority Matrix

### Must Have (Phase 1-3)

| Priority | Task | Estimated Effort |
|----------|------|------------------|
| Critical | Multi-tenant database schema | 2 days |
| Critical | Tenant resolution middleware | 1 day |
| Critical | Data isolation middleware | 1 day |
| Critical | Institution signup flow | 3 days |
| Critical | Login with tenant branding | 2 days |
| Critical | Role-based access control | 2 days |
| High | Branding settings page | 2 days |
| High | INR99 content import | 1 day |
| High | Payment integration (₹99) | 3 days |
| High | Basic dashboard | 2 days |

### Should Have (Phase 4-5)

| Priority | Task | Estimated Effort |
|----------|------|------------------|
| High | Custom content upload | 4 days |
| High | Class management | 2 days |
| High | Subscription management | 2 days |
| Medium | Custom domain support | 3 days |
| Medium | Email branding | 1 day |
| Medium | Parent access | 2 days |

### Nice to Have (Phase 6-8)

| Priority | Task | Estimated Effort |
|----------|------|------------------|
| Medium | Advanced analytics | 3 days |
| Medium | Mobile app | 10 days |
| Low | White-label mobile app | 5 days |
| Low | SSO integration | 3 days |

---

## Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Foundation | Week 1-2 | Multi-tenant database, middleware, basic API |
| Phase 2: Auth & Users | Week 3-4 | Authentication, user management, RBAC |
| Phase 3: Branding | Week 5-6 | White-label system, subdomain provisioning |
| Phase 4: Content | Week 7-8 | Content management, upload, assignment |
| Phase 5: Payments | Week 9 | Payment integration, billing dashboard |
| Phase 6: Frontend | Week 10-12 | Institution portal, dashboards |
| Phase 7: Testing | Week 13 | QA, security testing, performance testing |
| Phase 8: Deployment | Week 14 | Production setup, monitoring, docs |

**Total Estimated Time: 14 weeks**

---

## Resource Requirements

### Development Team

| Role | Quantity | Responsibilities |
|------|----------|------------------|
| Full-stack Developer | 2 | Backend + frontend development |
| DevOps Engineer | 0.5 | Infrastructure, CI/CD, monitoring |
| QA Engineer | 1 | Testing, quality assurance |
| UI/UX Designer | 0.5 | Design mockups, prototyping |

### External Services

| Service | Monthly Cost | Purpose |
|---------|--------------|---------|
| Cloud Hosting (AWS/GCP) | ₹50,000-1,00,000 | Compute, storage |
| Database (PostgreSQL managed) | ₹10,000-20,000 | Managed database |
| CDN (Cloudflare) | ₹5,000-10,000 | Content delivery |
| SSL Certificates (Let's Encrypt) | Free | HTTPS certificates |
| Payment Gateway (Razorpay) | 2% per transaction | Payment processing |
| Email Service (SendGrid) | ₹5,000 | Transactional emails |
| Monitoring (DataDog/Sentry) | ₹10,000-20,000 | Error tracking, APM |

---

## Success Metrics

### Technical Metrics

| Metric | Target |
|--------|--------|
| Page load time | < 3 seconds |
| API response time | < 500ms |
| Uptime | 99.9% |
| Time to deploy | < 1 hour |

### Business Metrics

| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|--------|------------------|------------------|-------------------|
| New institutions | 50 | 500 | 5,000 |
| Active institutions | 30 | 350 | 4,000 |
| MRR | ₹5,000 | ₹50,000 | ₹5,00,000 |
| Churn rate | < 10% | < 5% | < 3% |
| NPS score | > 30 | > 50 | > 70 |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data breach between tenants | Low | High | Strict isolation, regular audits |
| Server overload | Medium | High | Auto-scaling, CDN, caching |
| Payment failures | Medium | Medium | Multiple gateways, dunning |
| Domain provisioning issues | Low | Medium | DNS provider with API |
| Content piracy | Medium | Medium | Watermarking, access controls |

---

## Next Steps

1. **Review and approve** this task list
2. **Prioritize** which features to build first
3. **Allocate resources** (team, budget, timeline)
4. **Set up development environment**
5. **Begin with Phase 1: Foundation**

---

*Document Version: 1.0*
*Created: January 2026*
*Last Updated: January 2026*
