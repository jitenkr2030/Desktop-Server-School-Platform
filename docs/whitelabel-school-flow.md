# White-Label School/College Feature Flow

This document provides a comprehensive overview of how the white-label school and college platform feature works, from institution discovery through student access.

---

## Table of Contents

1. [Overview](#overview)
2. [Flow Diagram](#flow-diagram)
3. [Step-by-Step Flow](#step-by-step-flow)
4. [Technical Architecture](#technical-architecture)
5. [Stakeholder Views](#stakeholder-views)
6. [Key Benefits](#key-benefits)
7. [Current Limitations](#current-limitations)

---

## Overview

The white-label feature enables schools and colleges to launch their own branded learning platforms on subdomains like `yourschool.inr99.academy`. The entire flow is automated, requiring no technical setup from the institution. Schools receive a completely free branded platform while students pay ₹99/month directly to INR99 Academy.

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WHITE-LABEL SCHOOL FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
   │   VISITOR    │      │   SIGNUP     │      │  REGISTRATION│
   │   Lands on   │──────▶   Form       │──────▶    API       │
   │   Landing    │      │  (3 steps)   │      │  Processing  │
   └──────────────┘      └──────────────┘      └──────────────┘
                                                      │
                                                      ▼
   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
   │   STUDENT    │◀─────│   STUDENT    │◀─────│   STUDENT    │
   │   Accesses   │      │   Accesses   │      │   Registers  │
   │   Platform   │      │   Platform   │      │   (₹99/mo)   │
   └──────────────┘      └──────────────┘      └──────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
   │  Tenant-     │      │  Branded     │      │  Admin       │
   │  Specific    │      │   Platform   │      │  Dashboard   │
   │   Content    │      │   Live       │      │   Created    │
   └──────────────┘      └──────────────┘      └──────────────┘
```

---

## Step-by-Step Flow

### Phase 1: Institution Discovers and Initiates Signup

**1. Landing Page Discovery**

```
URL: https://inr99.academy/
          │
          ▼
┌─────────────────────────────────────┐
│     White-Label Section             │
│  🏢 Launch Your Own Learning        │
│     Platform                        │
│                                     │
│  🏫 Schools / Colleges              │
│  ✓ Pay NOTHING                      │
│  ✓ Get full platform access         │
│  ... (all 8 benefits)               │
│                                     │
│  [Start Your School Platform] ──────▶ /institution/signup
└─────────────────────────────────────┘
```

**Key Elements Shown:**

- Clear value proposition: "100% FREE for schools/colleges"
- All 8 benefits displayed with checkmarks
- CTA buttons for Schools and Colleges
- Link to signup page

**The 8 Benefits Displayed:**

| Benefit | Description |
|---------|-------------|
| Pay NOTHING | Zero cost to the institution |
| Get full platform access | Complete INR99 Academy content |
| Get ready-made content | Pre-built courses for all classes |
| Get live sessions | Access to live learning sessions |
| Get course builder | Tools to create custom content |
| Get branding/subdomain | Custom colors, logo, subdomain |
| Get student dashboards | Progress tracking for students |
| Zero financial burden | No hidden costs, completely free |

---

### Phase 2: Institution Completes Signup Form

**URL:** `/institution/signup`

The signup process has **3 steps** with a clean, progressive interface:

#### Step 1: Institution Details

```
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 1: Institution Details                  │
├─────────────────────────────────────────────────────────────────┤
│  Institution Name *    [Delhi Public School]                    │
│                                                                 │
│  Institution Type *    [School ▼]                               │
│                        ├─ School                                │
│                        ├─ College                               │
│                        ├─ University                            │
│                        ├─ Coaching Institute                    │
│                        └─ Corporate Training                    │
│                                                                 │
│  Admin Email *         [admin@dps.edu]                          │
│                                                                 │
│  Phone Number *        [+91 98765 43210]                        │
│                                                                 │
│  [Continue]                                                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 2: Subdomain Selection

```
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 2: Subdomain Selection                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Your platform will be accessible at:                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [dpsdelhi] .inr99.academy                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✓ dpsdelhi.inr99.academy is available!                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Preview:                                               │   │
│  │  [🔵 Delhi Public School] dpsdelhi.inr99.academy       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Continue]                                                    │
└─────────────────────────────────────────────────────────────────┘
```

**Subdomain Validation Rules:**

- Must be 3-63 characters
- Only lowercase letters (a-z), numbers (0-9), and hyphens
- Cannot start or end with hyphen
- Cannot use reserved words (www, mail, admin, api, app, dashboard, inr99, etc.)

#### Step 3: Admin Account Creation

```
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 3: Admin Account                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Admin Name *           [Principal Sharma]                      │
│                                                                 │
│  Password *             [********] (minimum 8 characters)       │
│                                                                 │
│  Confirm Password *     [********]                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🏫 School Plan - Completely FREE                       │   │
│  │                                                         │   │
│  │  What your institution gets (at ZERO cost):             │   │
│  │                                                         │   │
│  │  ✓ Custom branded platform with your logo and colors   │   │
│  │  ✓ Full platform access - All courses, live sessions    │   │
│  │  ✓ Ready-made content - Class 1-12, college, exams      │   │
│  │  ✓ Live learning sessions with expert instructors       │   │
│  │  ✓ Course builder tools - Create your own courses       │   │
│  │  ✓ Student & parent dashboards - Track progress         │   │
│  │  ✓ Zero financial burden - Your school pays NOTHING     │   │
│  │                                                         │   │
│  │  💡 How it works: Students pay ₹99/month directly to    │   │
│  │     INR99 Academy. Your school simply facilitates       │   │
│  │     access for them.                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Create Free Account]                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

### Phase 3: Registration API Processing

**API Endpoint:** `POST /api/tenants/register`

#### Request

```json
{
  "institutionName": "Delhi Public School",
  "email": "admin@dps.edu",
  "phone": "+919876543210",
  "subdomain": "dpsdelhi",
  "adminName": "Principal Sharma",
  "adminPassword": "securepassword123"
}
```

#### Processing Steps

```
┌───────────────────────────────────────────────────────────────┐
│                    REGISTRATION PROCESS                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  1. VALIDATION                                                │
│     ├─ Check all required fields present                     │
│     ├─ Validate subdomain format (a-z, 0-9, hyphens)         │
│     ├─ Check subdomain length (3-63 chars)                   │
│     └─ Check reserved words (www, mail, admin, etc.)        │
│                                                               │
│  2. DUPLICATE CHECK                                           │
│     ├─ Check if subdomain already taken                      │
│     └─ Check if email already registered                     │
│                                                               │
│  3. PASSWORD SECURITY                                         │
│     └─ Hash password with bcrypt (12 rounds)                 │
│                                                               │
│  4. DNS PROVISIONING (if API key configured)                 │
│     ├─ Initialize Cloudflare/Route53 provider                │
│     ├─ Create CNAME record for subdomain                     │
│     ├─ Provision SSL certificate                             │
│     └─ Return DNS records for manual setup if needed         │
│                                                               │
│  5. DATABASE OPERATIONS (in transaction)                     │
│     ├─ Create TENANT record:                                 │
│     │  ├─ name: "Delhi Public School"                       │
│     │  ├─ slug: "dpsdelhi"                                  │
│     │  ├─ status: "PENDING"                                 │
│     │  ├─ subscriptionTier: "FREE"                          │
│     │  └─ maxUsers: 100                                     │
│     │                                                        │
│     ├─ Create BRANDING record:                               │
│     │  ├─ primaryColor: "#3b82f6" (default blue)            │
│     │  ├─ secondaryColor: "#1e40af"                         │
│     │  ├─ accentColor: "#f59e0b"                            │
│     │  ├─ backgroundColor: "#ffffff"                        │
│     │  ├─ textColor: "#1f2937"                              │
│     │  └─ fontFamily: "Inter"                               │
│     │                                                        │
│     ├─ Create DOMAIN record:                                 │
│     │  ├─ domain: "dpsdelhi.inr99.academy"                  │
│     │  ├─ type: "SUBDOMAIN"                                 │
│     │  ├─ status: "PENDING" or "ACTIVE"                     │
│     │  └─ dnsProvisioned: true/false                        │
│     │                                                        │
│     ├─ Create SETTINGS record:                               │
│     │  ├─ allowRegistration: true                           │
│     │  ├─ requireApproval: false                            │
│     │  ├─ defaultUserRole: "STUDENT"                        │
│     │  ├─ maxCoursesPerUser: 10                             │
│     │  ├─ enableLiveSessions: true                          │
│     │  ├─ enableCertificates: true                          │
│     │  ├─ enableDiscussion: true                            │
│     │  └─ enableAnalytics: true                             │
│     │                                                        │
│     ├─ Create ADMIN USER:                                    │
│     │  ├─ email: "admin@dps.edu"                            │
│     │  ├─ name: "Principal Sharma"                          │
│     │  ├─ password: (hashed)                                │
│     │  ├─ mobileNumber: "+919876543210"                     │
│     │  ├─ role: "ADMIN"                                     │
│     │  ├─ isActive: true                                    │
│     │  └─ isVerified: false                                 │
│     │                                                        │
│     └─ Create TENANT-USER LINK:                              │
│        ├─ tenantId: (new tenant UUID)                        │
│        ├─ userId: (new user UUID)                            │
│        ├─ email: "admin@dps.edu"                             │
│        ├─ name: "Principal Sharma"                           │
│        ├─ role: "OWNER"                                      │
│        ├─ status: "ACTIVE"                                   │
│        └─ joinedAt: timestamp                                │
│                                                               │
│  6. RESPONSE                                                  │
│     └─ Return success with tenant info and DNS details       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

#### Response

```json
{
  "success": true,
  "message": "Institution registered successfully",
  "tenant": {
    "id": "uuid-tenant-id",
    "name": "Delhi Public School",
    "slug": "dpsdelhi",
    "subdomain": "dpsdelhi.inr99.academy",
    "domainStatus": "PENDING"
  },
  "user": {
    "id": "uuid-user-id",
    "email": "admin@dps.edu",
    "name": "Principal Sharma"
  },
  "dnsProvisioning": {
    "subdomain": "dpsdelhi",
    "fullDomain": "dpsdelhi.inr99.academy",
    "sslStatus": "pending",
    "records": [
      {
        "type": "CNAME",
        "name": "dpsdelhi",
        "value": "inr99.academy",
        "ttl": 3600
      }
    ]
  }
}
```

---

### Phase 4: Subdomain Activation

**What Happens After Registration:**

```
URL: https://dpsdelhi.inr99.academy
          │
          ▼
┌───────────────────────────────────────────────────────────────┐
│                    DNS RESOLUTION                             │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  User's browser queries DNS for:                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Type: CNAME                                             │ │
│  │  Name: dpsdelhi.inr99.academy                            │ │
│  │  Value: inr99.academy (points to main platform)          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  DNS Provider (Cloudflare/Route53):                           │
│  ├─ Finds matching CNAME record                              │
│  ├─ Resolves to platform IP                                  │
│  └─ Returns IP address to browser                            │
│                                                               │
│  If SSL provisioned:                                          │
│  └─ Browser establishes HTTPS connection                     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**DNS Record Example:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | dpsdelhi | inr99.academy | 3600 |

---

### Phase 5: Tenant Detection and Branding Application

**How the Platform Detects Which School is Being Accessed:**

```
┌───────────────────────────────────────────────────────────────┐
│                    TENANT DETECTION                           │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  1. REQUEST ARRIVES                                           │
│     GET https://dpsdelhi.inr99.academy/courses                │
│                                                               │
│  2. MIDDLEWARE EXTRACTS SUBDOMAIN                             │
│     ├─ Extract hostname: "dpsdelhi.inr99.academy"            │
│     ├─ Parse subdomain: "dpsdelhi"                           │
│     └─ Set headers:                                           │
│        ├─ x-tenant-slug: "dpsdelhi"                          │
│        └─ x-tenant-hostname: "dpsdelhi.inr99.academy"        │
│                                                               │
│  3. LOOKUP TENANT IN DATABASE                                 │
│     ┌─────────────────────────────────────────────────────┐  │
│     │  Query: SELECT * FROM tenant WHERE slug = ?         │  │
│     │  Params: ["dpsdelhi"]                               │  │
│     │  Result: Delhi Public School tenant record          │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                               │
│  4. RETRIEVE BRANDING                                         │
│     ┌─────────────────────────────────────────────────────┐  │
│     │  SELECT * FROM branding WHERE tenantId = ?          │  │
│     │  Result: {                                          │  │
│     │    primaryColor: "#dc2626",  // School's red        │  │
│     │    secondaryColor: "#991b1b",                      │  │
│     │    accentColor: "#fbbf24",                         │  │
│     │    backgroundColor: "#ffffff",                     │  │
│     │    textColor: "#1f2937",                           │  │
│     │    logoUrl: "https://cdn.dps.edu/logo.png",         │  │
│     │    faviconUrl: "https://cdn.dps.edu/favicon.ico",   │  │
│     │    fontFamily: "Poppins"                           │  │
│     │  }                                                  │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                               │
│  5. APPLY BRANDING TO PAGE                                    │
│     └─ Inject CSS variables with school's colors             │
│     └─ Show school's logo in header                          │
│     └─ Use school's font family                              │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

### Phase 6: Data Isolation (Multi-Tenant Security)

**How Student Data is Kept Separate Between Schools:**

```
┌───────────────────────────────────────────────────────────────┐
│                    DATA ISOLATION                              │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐     ┌─────────────────┐                  │
│  │  DPS Delhi      │     │  Ryan International│               │
│  │  Students       │     │  Students          │               │
│  └────────┬────────┘     └────────┬────────┘                  │
│           │                      │                            │
│           │  When querying:      │                            │
│           │                      │                            │
│           ▼                      ▼                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  API Query (e.g., /api/institution/api/students)        │ │
│  │                                                         │ │
│  │  BEFORE Isolation:                                      │ │
│  │  SELECT * FROM students                                 │ │
│  │  ⚠️ Returns ALL students from ALL schools!             │ │
│  │                                                         │ │
│  │  AFTER Isolation:                                       │ │
│  │  SELECT * FROM students                                 │ │
│  │  WHERE tenantId = 'dpsdelhi-uuid'                       │ │
│  │  ✓ Returns ONLY DPS Delhi students                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ISOLATION ENFORCED BY:                                       │
│  ├─ withDataIsolation() middleware                           │
│  ├─ Extracts x-tenant-slug from request                      │
│  ├─ Validates tenant exists and is active                    │
│  ├─ Adds tenantId filter to all queries                     │
│  └─ Rejects unauthorized cross-tenant access                │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

### Phase 7: Student Access Flow

**How Students Access the School's Platform:**

```
┌───────────────────────────────────────────────────────────────┐
│                    STUDENT JOURNEY                            │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  1. STUDENT VISITS SCHOOL'S PLATFORM                          │
│     URL: https://dpsdelhi.inr99.academy                       │
│                                                               │
│  2. PLATFORM LOADS WITH SCHOOL BRANDING                       │
│     ├─ School's colors applied                               │
│     ├─ School's logo in header                               │
│     ├─ School's name displayed                               │
│     └─ All content customized to school                      │
│                                                               │
│  3. STUDENT REGISTERS/LOGINS                                  │
│     ├─ Student creates account                               │
│     ├─ Account linked to tenant (DPS Delhi)                  │
│     ├─ Can access school-specific courses                    │
│     └─ Payment of ₹99/month goes to INR99 Academy            │
│                                                               │
│  4. STUDENT CONSUMES CONTENT                                  │
│     ├─ View courses assigned to school                       │
│     ├─ Attend live sessions                                  │
│     ├─ Take assessments                                      │
│     └─ Track progress                                        │
│                                                               │
│  5. SCHOOL ADMIN SEES ANALYTICS                               │
│     ├─ Student enrollment numbers                            │
│     ├─ Course completion rates                               │
│     ├─ Assessment performance                                │
│     └─ Engagement metrics                                    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Core Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Signup Page | `/src/app/institution/signup/page.tsx` | Multi-step form for institution registration |
| Registration API | `/src/app/api/tenants/register/route.ts` | Creates tenant, admin user, branding, domains |
| DNS Provider | `/src/lib/brand/dns-provider.ts` | Auto-provisions subdomains via Cloudflare/Route53 |
| Tenant Middleware | `/src/lib/middleware/tenant-isolation.ts` | Extracts tenant from request, enforces data isolation |
| Tenant Utilities | `/src/app/tenant-pages/lib/tenant.ts` | Looks up tenant by subdomain, retrieves branding |
| Tenant Layout | `/src/app/tenant-pages/layout.tsx` | Applies branding, renders tenant-specific pages |
| Branding Provider | `/src/components/tenant/tenant-branding-provider.tsx` | Context provider for client-side branding |
| Branding Wrapper | `/src/components/tenant/tenant-branding-wrapper.tsx` | Server component wrapper for branding |

### Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  tenant                                                      │
│  ├─ id: UUID (primary key)                                   │
│  ├─ name: "Delhi Public School"                              │
│  ├─ slug: "dpsdelhi" (unique)                                │
│  ├─ status: PENDING/ACTIVE/SUSPENDED                         │
│  ├─ subscriptionTier: FREE                                   │
│  ├─ maxUsers: 100                                            │
│  └─ createdAt: timestamp                                     │
│                                                              │
│  branding                                                    │
│  ├─ id: UUID                                                 │
│  ├─ tenantId: foreign key                                    │
│  ├─ primaryColor: "#dc2626"                                  │
│  ├─ secondaryColor: "#991b1b"                                │
│  ├─ accentColor: "#fbbf24"                                   │
│  ├─ backgroundColor: "#ffffff"                               │
│  ├─ textColor: "#1f2937"                                     │
│  ├─ fontFamily: "Poppins"                                    │
│  ├─ logoUrl: "https://..."                                   │
│  ├─ faviconUrl: "https://..."                                │
│  ├─ customCss: "..."                                         │
│  └─ createdAt: timestamp                                     │
│                                                              │
│  domain                                                      │
│  ├─ id: UUID                                                 │
│  ├─ tenantId: foreign key                                    │
│  ├─ domain: "dpsdelhi.inr99.academy"                         │
│  ├─ type: SUBDOMAIN                                          │
│  ├─ status: PENDING/ACTIVE/FAILED                            │
│  ├─ dnsProvisioned: boolean                                  │
│  ├─ dnsRecords: JSON                                         │
│  └─ createdAt: timestamp                                     │
│                                                              │
│  tenant_settings                                             │
│  ├─ id: UUID                                                 │
│  ├─ tenantId: foreign key                                    │
│  ├─ allowRegistration: boolean                               │
│  ├─ requireApproval: boolean                                 │
│  ├─ defaultUserRole: STUDENT                                 │
│  ├─ maxCoursesPerUser: 10                                    │
│  ├─ enableLiveSessions: boolean                              │
│  ├─ enableCertificates: boolean                              │
│  ├─ enableDiscussion: boolean                                │
│  ├─ enableAnalytics: boolean                                 │
│  └─ createdAt: timestamp                                     │
│                                                              │
│  tenant_user                                                 │
│  ├─ id: UUID                                                 │
│  ├─ tenantId: foreign key                                    │
│  ├─ userId: foreign key                                      │
│  ├─ email: "admin@dps.edu"                                   │
│  ├─ name: "Principal Sharma"                                 │
│  ├─ role: OWNER/ADMIN/TEACHER/STUDENT                        │
│  ├─ status: ACTIVE/PENDING/SUSPENDED                         │
│  └─ joinedAt: timestamp                                      │
│                                                              │
│  user                                                        │
│  ├─ id: UUID                                                 │
│  ├─ email: "admin@dps.edu"                                   │
│  ├─ name: "Principal Sharma"                                 │
│  ├─ password: (hashed)                                       │
│  ├─ mobileNumber: "+919876543210"                            │
│  ├─ role: ADMIN/TEACHER/STUDENT                              │
│  ├─ isActive: boolean                                        │
│  ├─ isVerified: boolean                                      │
│  └─ createdAt: timestamp                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Stakeholder Views

### School Admin

| Screen | URL | Features |
|--------|-----|----------|
| Admin Dashboard | `/{tenant-slug}/dashboard/admin` | Overview, analytics, user management |
| Branding Settings | `/{tenant-slug}/admin/branding` | Customize colors, logo, fonts |
| Class Management | `/{tenant-slug}/admin/classes` | Create/manage classes |
| User Management | `/{tenant-slug}/admin/users` | Manage teachers, students |
| Analytics | `/{tenant-slug}/admin/analytics` | View engagement metrics |
| Billing | `/{tenant-slug}/admin/billing` | Subscription details (FREE tier) |
| Settings | `/{tenant-slug}/admin/settings` | Platform configuration |

### Teacher

| Screen | URL | Features |
|--------|-----|----------|
| Teacher Dashboard | `/{tenant-slug}/dashboard/teacher` | My courses, upcoming sessions |
| Course Builder | `/{tenant-slug}/courses/builder` | Create courses from PPTX |
| Assessments | `/{tenant-slug}/assessments` | Create quizzes, view results |
| My Students | `/{tenant-slug}/students` | View enrolled students |
| Schedule | `/{tenant-slug}/schedule` | Manage class timings |

### Student

| Screen | URL | Features |
|--------|-----|----------|
| Student Dashboard | `/{tenant-slug}/dashboard/student` | My courses, progress |
| Courses | `/{tenant-slug}/courses` | Browse available courses |
| My Courses | `/{tenant-slug}/my-courses` | Continue learning |
| Live Sessions | `/{tenant-slug}/live-sessions` | Join scheduled sessions |
| Assessments | `/{tenant-slug}/assessments` | Take quizzes, view results |
| Certificates | `/{tenant-slug}/certificates` | View earned certificates |
| Parent Links | `/{tenant-slug}/student/parent-links` | Link parent account |
| Profile | `/{tenant-slug}/profile` | Manage account settings |

### Parent

| Screen | URL | Features |
|--------|-----|----------|
| Parent Dashboard | `/{tenant-slug}/parent/dashboard` | Child's progress overview |
| Child's Progress | `/{tenant-slug}/parent/progress` | Detailed progress reports |
| Schedule | `/{tenant-slug}/parent/schedule` | View child's class schedule |
| Parent Login | `/{tenant-slug}/parent/login` | Separate login for parents |

---

## Key Benefits

| Benefit | Description |
|---------|-------------|
| **Zero Setup for Schools** | Complete platform in minutes, no technical knowledge needed |
| **Automatic Branding** | School's colors/logo applied automatically |
| **Auto-Provisioned Subdomains** | DNS configured automatically (with API key) |
| **Data Isolation** | Each school's data completely separate and secure |
| **Full Platform Access** | All INR99 courses, live sessions, assessments included |
| **FREE for Schools** | Schools pay nothing, students pay ₹99 directly to INR99 |
| **Scalable** | Add unlimited schools on same infrastructure |
| **Customizable** | Schools can further customize via admin panel |
| **No Revenue Share** | Schools get 100% free access, no commission on student payments |
| **Instant Activation** | Subdomain active immediately after registration |
| **SSL Included** | Automatic SSL certificate provisioning |
| **Multi-device** | Works on desktop, tablet, and mobile |
| **Offline Support** | Low-bandwidth mode for poor connectivity areas |

---

## Current Limitations

| Limitation | Status | Plan |
|------------|--------|------|
| DNS auto-provisioning | Partial | Only works if DNS API key configured; manual DNS records otherwise |
| Content isolation | Manual | Content tagging by tenant not yet fully implemented |
| Analytics | Basic | More detailed tenant-specific analytics coming |
| White-label admin | Partial | More branding options planned |
| Custom domains | Not implemented | Schools can only use .inr99.academy subdomains currently |
| White-label mobile app | Not implemented | Mobile app branding customization pending |
| White-label email | Not implemented | Custom email domains for notifications pending |
| SSO integration | Not implemented | Single Sign-On for school IT systems pending |

---

## Future Enhancements

### Short-term (1-2 months)

1. **Enhanced Branding Options**
   - Custom CSS injection
   - More font choices
   - Custom favicon upload
   - Custom 404 pages

2. **Improved Analytics**
   - Detailed engagement reports
   - Student performance insights
   - Course effectiveness metrics
   - Export reports to PDF/Excel

3. **Parent Portal**
   - Dedicated parent mobile app
   - SMS notifications
   - Progress alerts
   - Teacher-parent messaging

### Medium-term (3-6 months)

1. **Custom Domains**
   - Schools can use their own domain (e.g., learning.dps.edu)
   - Automatic SSL for custom domains
   - Domain verification flow

2. **Advanced Content Management**
   - Tenant-specific content libraries
   - Content approval workflows
   - Draft and publish cycles

3. **Integration APIs**
   - Student Information System (SIS) integration
   - Learning Management System (LMS) APIs
   - Single Sign-On (SSO) with school systems

### Long-term (6-12 months)

1. **Mobile App White-label**
   - Schools can have their own branded mobile app
   - Push notifications with school branding
   - Offline content sync

2. **White-label Email**
   - Custom email domain for communications
   - Email templates with school branding
   - Automated notifications

3. **Multi-tier Pricing**
   - Free tier (current)
   - Pro tier with advanced features
   - Enterprise tier with dedicated support

---

## Conclusion

The white-label school/college feature transforms INR99 Academy from a standalone learning platform into a **learning infrastructure** that any institution can adopt with zero cost and minimal setup. The automated flow ensures that schools can be up and running within minutes, with their own branded subdomain, custom colors and logo, and full access to all platform features.

The multi-tenant architecture guarantees data isolation and security, while the zero-revenue-share model makes it an attractive proposition for schools looking to provide digital learning to their students without any financial burden.

---

*Document Version: 1.0*  
*Last Updated: 2026-01-15*  
*For: INR99 Academy Development Team*
