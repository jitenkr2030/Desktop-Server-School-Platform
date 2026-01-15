# Multi-Tenant Learning Platform Architecture

## Overview

This document outlines the comprehensive architecture for building a multi-user learning platform that serves individual learners, colleges, universities, and institutes. The platform is designed to be scalable, secure, and flexible enough to accommodate various educational institutions while maintaining data isolation and providing tailored experiences for each user type.

The architecture follows industry best practices for multi-tenant SaaS applications, ensuring that each institution can operate independently while sharing common infrastructure and resources. This approach maximizes cost efficiency while providing the flexibility needed to meet diverse institutional requirements.

### Core Design Principles

The platform architecture is built upon four fundamental principles that guide all technical decisions. First, **multi-tenancy with data isolation** ensures that each institution's data remains completely separate and secure, preventing any unauthorized access or data leakage between tenants. Second, **scalability through microservices** allows individual components to scale independently based on demand, ensuring optimal performance during peak usage periods. Third, **API-first development** enables seamless integrations with existing institutional systems and third-party services. Fourth, **user-centric design** prioritizes the unique needs of each user type, from individual learners to institutional administrators.

### Platform Goals

The primary objectives of this platform include supporting multiple organizational types with their distinct requirements, providing flexible deployment options to accommodate various institutional preferences, enabling seamless content sharing and licensing between institutions, ensuring compliance with educational regulations such as FERPA and GDPR, and creating a sustainable revenue model that benefits both the platform and its institutional partners.

---

## 1. Multi-Tenant Architecture

### 1.1 Architecture Overview

The multi-tenant architecture forms the foundation of the platform, enabling multiple institutions to share the same infrastructure while maintaining complete data isolation. This architectural pattern is essential for cost-efficient scaling, as it allows resources to be shared across tenants while keeping each institution's data separate and secure.

The architecture employs a **shared-database, shared-schema** approach with row-level security, where all tenants share the same database instance and tables, but each row is tagged with a tenant identifier. This approach provides an excellent balance between resource efficiency and data security, making it ideal for educational platforms where content may be shared while user data must remain isolated.

The platform uses a **tenant context** that is established at the beginning of each request, either through authentication tokens, subdomains, or custom headers. This context is then used throughout the application to scope all database queries to the specific tenant, ensuring that users can only access data from their own institution.

### 1.2 Tenant Management

Each institution on the platform is represented as a **tenant** with the following core attributes and capabilities:

**Tenant Identification:**
- Unique tenant identifier used for data isolation
- Custom subdomain for branded access (e.g., institution.platform.com)
- Custom domain support for white-label deployments
- API keys for programmatic access

**Institutional Profile:**
- Institution name and type (college, university, institute, corporate)
- Contact information and billing details
- Branding assets (logo, colors, favicon)
- Custom domain configuration
- Social media and website links

**Configuration Management:**
- Feature flags enabling/disabling platform capabilities
- Custom branding and theming options
- Integration settings (SSO, payment gateways)
- User role configurations
- Notification preferences

**Billing & Subscriptions:**
- Subscription tier and billing cycle
- Usage tracking (users, storage, API calls)
- Payment history and invoices
- Credit limits and overage policies

### 1.3 Data Isolation Strategies

Data isolation is implemented at multiple levels to ensure complete separation between tenants:

**Database Level:**
- All tables include a `tenant_id` column as the first foreign key
- Database views are created with automatic tenant filtering
- Stored procedures accept tenant context as a mandatory parameter
- Database users are configured with least-privilege access

**Application Level:**
- Middleware extracts tenant context from incoming requests
- Repository layer automatically applies tenant filters to all queries
- DTOs (Data Transfer Objects) validate tenant ownership before mutations
- Audit logging tracks all data access by tenant

**API Level:**
- Rate limiting is applied per tenant
- API responses are filtered based on tenant permissions
- Cross-tenant data access attempts are logged and blocked
- API documentation is customized per tenant

### 1.4 Database Schema

The database schema is designed to support multi-tenancy while maintaining query efficiency:

```sql
-- Tenants table stores all institutions
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- college, university, institute, individual
    subdomain VARCHAR(100) UNIQUE,
    custom_domain VARCHAR(255) UNIQUE,
    logo_url TEXT,
    brand_colors JSONB,
    settings JSONB DEFAULT '{}',
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users are associated with specific tenants
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- Courses can be shared or private to a tenant
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    duration_minutes INTEGER,
    is_public BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    pricing_model VARCHAR(50) DEFAULT 'free', -- free, paid, subscription
    price DECIMAL(10, 2),
    license_type VARCHAR(50) DEFAULT 'private', -- private, shared, licensed
    source_tenant_id UUID REFERENCES tenants(id),
    tags TEXT[],
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments link users to courses with tenant context
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, user_id, course_id)
);

-- Lessons table with course and tenant association
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- video, text, quiz, assignment
    content_url TEXT,
    content TEXT,
    duration_minutes INTEGER,
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress tracking per lesson
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, completed
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(enrollment_id, lesson_id)
);

-- Indexes for performance optimization
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_courses_tenant ON courses(tenant_id);
CREATE INDEX idx_enrollments_tenant ON enrollments(tenant_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
```

### 1.5 Row-Level Security

PostgreSQL Row-Level Security (RLS) policies ensure data isolation at the database level:

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Create policy to filter by tenant context
CREATE POLICY "Users can only access their tenant's data" ON users
    FOR ALL USING (current_setting('app.current_tenant_id') = tenant_id::TEXT);

CREATE POLICY "Courses are visible per tenant rules" ON courses
    FOR ALL USING (
        is_public = true OR
        tenant_id = current_setting('app.current_tenant_id')::UUID OR
        source_tenant_id = current_setting('app.current_tenant_id')::UUID
    );
```

---

## 2. User Role Hierarchy

### 2.1 Role Definitions

The platform implements a comprehensive Role-Based Access Control (RBAC) system that supports the complex permission requirements of educational institutions. Each role is carefully designed to provide appropriate access levels while maintaining security and operational efficiency.

**Individual Learner:**
Individual learners are self-registered users who access the platform for personal development and skill enhancement. They can browse available courses, make purchases, track their learning progress, and earn certificates upon course completion. Individual learners have the most limited access scope, focused entirely on their personal learning journey without administrative capabilities.

**Student:**
Students are users enrolled through an institution or who have self-enrolled in specific courses. They have access to assigned courses, can view their progress and grades, participate in course discussions, and submit assignments. Students cannot create content or access administrative functions, ensuring they remain focused on their learning objectives.

**Teaching Assistant:**
Teaching assistants support instructors in managing courses and helping students. They can grade assignments, moderate discussions, view course analytics, and communicate with students. Teaching assistants cannot modify course content or access sensitive administrative functions, providing a controlled level of access for academic support roles.

**Instructor:**
Instructors have ownership of the courses they create and can manage all aspects of those courses. They can create and modify course content, create assignments and quizzes, grade student work, view detailed course analytics, and communicate with enrolled students. Instructors have full control over their courses but cannot access platform-wide settings or other instructors' courses.

**Department Head:**
Department heads oversee multiple courses and instructors within an academic department. They can view aggregated analytics across their department, manage instructor assignments, approve new courses, and generate department-level reports. Department heads provide administrative oversight without full administrative privileges.

**Institution Admin:**
Institution administrators have comprehensive control over their organization's presence on the platform. They can manage all users within their institution, configure institutional settings, handle billing and subscriptions, manage integrations with external systems, and access comprehensive analytics. Institution admins ensure smooth platform operations for their organization.

**Super Admin:**
Super administrators have platform-wide access and responsibilities. They can create and manage tenant organizations, configure global platform settings, handle billing and subscriptions across all tenants, resolve technical issues, and implement platform-wide changes. Super administrators ensure the overall health and growth of the platform.

### 2.2 Permission Matrix

| Permission | Individual Learner | Student | Teaching Assistant | Instructor | Department Head | Institution Admin | Super Admin |
|------------|-------------------|---------|-------------------|------------|-----------------|-------------------|-------------|
| View Courses | Own enrollments | Assigned courses | Assigned courses | Created courses | All department courses | All institution courses | All courses |
| Create Courses | No | No | No | Yes | Yes | Yes | Yes |
| Edit Own Courses | No | No | No | Yes | Yes | Yes | Yes |
| Delete Courses | No | No | No | No | Yes | Yes | Yes |
| Manage Users | No | No | No | No | Dept users | Institution users | All users |
| View Analytics | Own only | Own only | Course only | Course only | Department | Institution | Platform |
| Manage Billing | No | No | No | No | No | Yes | Yes |
| Platform Settings | No | No | No | No | No | No | Yes |
| Manage Tenants | No | No | No | No | No | No | Yes |
| Content Approval | No | No | No | No | Yes | Yes | Yes |

### 2.3 Role Implementation

Roles are implemented using a combination of database storage and application logic:

```typescript
// Role types defined as string literals
type UserRole = 
  | 'individual_learner'
  | 'student'
  | 'teaching_assistant'
  | 'instructor'
  | 'department_head'
  | 'institution_admin'
  | 'super_admin';

// Permission definitions
const permissions: Record<UserRole, string[]> = {
  individual_learner: [
    'courses:view:own',
    'progress:view:own',
    'certificates:view:own',
    'profile:edit:own'
  ],
  student: [
    'courses:view:assigned',
    'lessons:access:assigned',
    'assignments:submit',
    'progress:view:own',
    'discussions:participate'
  ],
  teaching_assistant: [
    'courses:view:assigned',
    'lessons:manage:assigned',
    'assignments:grade',
    'discussions:moderate',
    'analytics:view:course'
  ],
  instructor: [
    'courses:create',
    'courses:edit:own',
    'lessons:create:own',
    'lessons:edit:own',
    'assignments:create:own',
    'assignments:grade:own',
    'students:view:enrolled',
    'analytics:view:own'
  ],
  department_head: [
    'courses:view:department',
    'courses:approve:department',
    'instructors:manage:department',
    'analytics:view:department',
    'reports:generate:department'
  ],
  institution_admin: [
    'users:manage:institution',
    'courses:manage:institution',
    'billing:manage:institution',
    'settings:manage:institution',
    'integrations:manage:institution',
    'analytics:view:institution',
    'reports:generate:institution'
  ],
  super_admin: [
    'tenants:create',
    'tenants:manage',
    'platform:settings',
    'billing:manage:all',
    'users:manage:all',
    'analytics:view:platform',
    'reports:generate:platform'
  ]
};

// Permission check middleware
function hasPermission(role: UserRole, requiredPermission: string): boolean {
  const rolePermissions = permissions[role] || [];
  return rolePermissions.includes(requiredPermission);
}
```

---

## 3. Feature Differentiation by User Type

### 3.1 Individual Learner Features

Individual learners represent a distinct user segment that requires a self-service, consumer-focused experience. The platform must provide intuitive navigation, seamless purchasing, and personalized learning paths to maximize engagement and retention.

**Self-Service Course Discovery:**
- Advanced search and filtering by category, difficulty, duration, and rating
- Course recommendations based on learning history and interests
- Preview content for informed purchasing decisions
- User reviews and ratings for social proof
- Wishlist and bookmarking for future purchase consideration

**Personal Dashboard:**
- Comprehensive view of enrolled courses and progress
- Learning streak tracking and achievements
- Recommended next steps based on current progress
- Calendar view of upcoming deadlines and schedule
- Time spent analytics and learning patterns

**Purchase and Subscription Management:**
- One-time course purchases
- Monthly and annual subscription options
- Course bundles and special offers
- Gift courses to other users
- Secure payment processing with multiple options
- Invoice generation and payment history

**Certificate Management:**
- Automatic certificate generation upon course completion
- Shareable digital certificates with verification links
- Portfolio of earned certificates
- LinkedIn integration for certificate display

**Mobile Experience:**
- Responsive design for all device sizes
- Offline content access for mobile learning
- Push notifications for progress reminders
- Seamless sync across devices

### 3.2 Student Features

Students enrolled through institutions require features that support their academic journey while maintaining alignment with institutional requirements and workflows.

**Course Access:**
- View assigned courses and required curriculum
- Access course materials organized by module and lesson
- Sequential lesson progression with completion tracking
- Offline access to downloaded content
- Access to course announcements and updates

**Academic Activities:**
- Submit assignments within defined deadlines
- Take quizzes and assessments with automatic scoring
- Participate in discussion forums and peer interactions
- View grades and feedback from instructors
- Request clarifications and help from teaching staff

**Progress Tracking:**
- Detailed progress indicators for each course
- Grade tracking and GPA calculation
- Comparison with class averages (anonymized)
- Identification of areas needing improvement
- Academic advisor notifications (if enabled)

**Institutional Integration:**
- Single Sign-On through institutional credentials
- Grade sync with Student Information Systems (SIS)
- Calendar integration with academic schedules
- Email notifications through institutional channels

### 3.3 Instructor Features

Instructors require comprehensive tools to create, deliver, and manage their courses effectively. The focus is on content creation efficiency and student outcome improvement.

**Course Creation and Management:**
- Intuitive course builder with drag-and-drop interface
- Support for multiple content types (video, text, interactive)
- Lesson scheduling and release management
- Course versioning and revision history
- Draft and publish workflow with approval chains

**Content Creation Tools:**
- Video upload and transcoding with thumbnail generation
- Rich text editor with media embedding
- Quiz builder with multiple question types
- Assignment creation with rubric support
- Interactive content support (H5P, SCORM)

**Student Management:**
- View enrolled students and their progress
- Student performance dashboards
- Identification of at-risk students
- Direct messaging with individual students
- Bulk actions for enrollment management

**Assessment and Grading:**
- Assignment submission review interface
- Inline commenting and feedback
- Rubric-based grading
- Grade book with export capabilities
- Automatic grade calculations and curves

**Analytics and Insights:**
- Course completion rates and trends
- Student engagement metrics
- Content effectiveness analysis
- Drop-off points identification
- Comparative performance data

### 3.4 Department Head Features

Department heads need visibility into departmental performance and tools to ensure academic standards are maintained across all courses and instructors.

**Department Overview:**
- Aggregated dashboard showing all department courses
- Summary metrics for student enrollment and completion
- Instructor performance comparisons
- Budget and resource utilization tracking
- Department-wide announcements and communications

**Course Management:**
- Review and approve new course submissions
- Course curriculum alignment verification
- Course retirement and archiving management
- Cross-course dependency management
- Curriculum gap analysis

**Instructor Oversight:**
- View all courses by instructor
- Instructor workload distribution
- Performance reviews and metrics
- Professional development recommendations
- Hiring and assignment recommendations

**Reporting and Compliance:**
- Generate comprehensive department reports
- Accreditation support documentation
- Compliance reporting for regulatory requirements
- Annual review preparation tools
- Student outcome analysis

### 3.5 Institution Admin Features

Institution administrators have the highest level of access within their organization, responsible for platform configuration, user management, and operational oversight.

**User Management:**
- Bulk user import from CSV or SIS integration
- Role assignment and management
- User deactivation and archival
- Password reset and account recovery
- User activity monitoring and auditing

**Institutional Configuration:**
- Branding customization (logo, colors, custom domain)
- Feature enablement based on subscription tier
- Integration configuration (SSO, payment, SIS)
- Notification preferences setup
- Custom fields and metadata configuration

**Billing and Subscriptions:**
- Subscription tier management
- Usage monitoring and alerting
- Invoice review and payment processing
- Add-on purchases and upgrades
- Budget allocation across departments

**Integration Management:**
- SSO configuration (SAML, OAuth)
- SIS integration setup and monitoring
- Payment gateway configuration
- LTI tool integration
- API access management

**Security and Compliance:**
- Audit log review and export
- Data retention policy configuration
- Compliance reporting (FERPA, GDPR)
- Security settings management
- Incident response procedures

### 3.6 Super Admin Features

Super administrators manage the entire platform, ensuring smooth operations and supporting tenant growth.

**Tenant Management:**
- Create and configure new tenant organizations
- Tenant status monitoring and management
- Subscription tier assignment and upgrades
- Resource allocation and quota management
- Tenant health scoring

**Platform Configuration:**
- Global feature flag management
- Pricing plan configuration
- System-wide settings management
- Maintenance mode and deployment coordination
- Emergency access procedures

**Financial Management:**
- Revenue tracking and reporting
- Commission and partner payout management
- Financial reporting and compliance
- Pricing strategy optimization
- Billing dispute resolution

**Platform Operations:**
- System health monitoring
- Performance optimization
- Security incident response
- User support escalation handling
- Platform roadmap and feature prioritization

---

## 4. Deployment Models

### 4.1 SaaS (Software as a Service)

The SaaS deployment model provides the fastest time-to-value for institutions, with minimal technical requirements and predictable subscription costs.

**Characteristics:**
- Cloud-hosted on shared infrastructure
- Multi-tenant database architecture
- Automatic updates and maintenance
- Standard integrations and features
- Subscription-based pricing

**Technical Implementation:**
- Application deployed on Kubernetes cluster
- Auto-scaling based on CPU and memory metrics
- CDN for static asset delivery
- Managed database services (PostgreSQL, Redis)
- Automated backup and disaster recovery

**Pricing Structure:**
- Per-student monthly pricing
- Tiered plans based on feature access
- Minimum commitment requirements
- Volume discounts for large institutions
- Annual payment discounts

**Best For:**
- Small to medium colleges and institutes
- Individual learners and independent users
- Organizations without dedicated IT staff
- Institutions wanting quick deployment
- Startups and growing organizations

### 4.2 Private Cloud / Dedicated

The private cloud deployment provides dedicated resources for each institution, offering enhanced security and customization capabilities.

**Characteristics:**
- Isolated infrastructure for each tenant
- Dedicated database instances
- Custom configurations and integrations
- Higher security and compliance levels
- Premium pricing with setup fees

**Technical Implementation:**
- Dedicated virtual private cloud (VPC)
- Isolated Kubernetes namespace
- Dedicated database instance
- Custom firewall and security rules
- Private CDN for content delivery

**Pricing Structure:**
- Monthly or annual base fee
- Per-user pricing above included allocation
- Setup and migration fees
- Premium support add-on
- Custom development hourly rates

**Best For:**
- Large universities with strict security requirements
- Healthcare and medical training programs
- Government and military organizations
- Financial services training programs
- Organizations with regulatory compliance needs

### 4.3 On-Premise (Self-Hosted)

The on-premise deployment model provides maximum control over data and infrastructure, suitable for organizations with specific security or data sovereignty requirements.

**Characteristics:**
- Institution hosts on their own infrastructure
- Complete data control and sovereignty
- Maximum customization potential
- Requires technical expertise for maintenance
- One-time licensing with optional support

**Technical Implementation:**
- Docker-based deployment
- Helm charts for Kubernetes deployment
- Detailed installation documentation
- Configuration management scripts
- Monitoring and logging stack

**Pricing Structure:**
- One-time perpetual license fee
- Annual maintenance and support fee
- Implementation services (setup, migration)
- Training services
- Premium support tiers

**Best For:**
- Research institutions with sensitive data
- Military and defense training
- Highly regulated industries
- Organizations with air-gapped networks
- Institutions with existing IT infrastructure

### 4.4 Deployment Comparison Matrix

| Feature | SaaS | Private Cloud | On-Premise |
|---------|------|---------------|------------|
| Setup Time | Days | Weeks | Months |
| Monthly Cost | Low | Medium-High | One-time + maintenance |
| Data Location | Provider cloud | Provider cloud (isolated) | Customer infrastructure |
| Customization | Limited | Extensive | Complete |
| Scalability | Automatic | Dedicated resources | Customer managed |
| Maintenance | Provider | Provider | Customer |
| Compliance | Standard | Enhanced | Maximum |
| Integration | Standard APIs | Custom integrations | Full access |
| Support | Standard | Premium | Variable |
| Updates | Automatic | Scheduled | Manual |

---

## 5. Authentication and SSO

### 5.1 Authentication Methods

The platform supports multiple authentication methods to accommodate diverse institutional requirements and user preferences.

**Email/Password Authentication:**
- Secure password storage using bcrypt
- Password complexity requirements
- Account lockout after failed attempts
- Password reset through email
- Optional two-factor authentication

**Social Login:**
- Google OAuth 2.0
- Microsoft Azure AD
- Apple Sign-In
- Facebook Login
- LinkedIn Connect

**Single Sign-On (SSO):**
- SAML 2.0 identity provider integration
- OAuth 2.0 / OpenID Connect support
- Automatic user provisioning
- Role mapping from identity provider
- Session management and logout handling

**Institution-Specific SSO:**
- Integration with existing campus credentials
- Support for common IdPs (Okta, OneLogin, Ping Identity)
- Custom SAML configuration
- Multi-instance support for different departments
- Guest access for external users

### 5.2 SSO Implementation

```typescript
// SSO configuration for SAML
interface SAMLConfig {
  entityId: string;
  assertionConsumerServiceUrl: string;
  singleLogoutServiceUrl: string;
  idpMetadataUrl: string;
  signCertificate: string;
  encryptCertificate: string;
  attributeMapping: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
  };
}

// SSO configuration for OAuth/OIDC
interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  redirectUri: string;
  scopes: string[];
  attributeMapping: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

// SSO provider implementation
class SSOProvider {
  private config: SAMLConfig | OAuthConfig;
  
  async initiateLogin(tenantId: string, returnUrl?: string): Promise<string> {
    // Generate SSO login URL and redirect user
  }
  
  async handleCallback(request: Request): Promise<AuthResult> {
    // Validate SSO response
    // Extract user attributes
    // Create or update user in database
    // Generate session token
  }
  
  async handleLogout(request: Request): Promise<void> {
    // Terminate SSO session
    // Clear local session
  }
}
```

### 5.3 LTI Integration

Learning Tools Interoperability (LTI) enables seamless integration with Learning Management Systems:

**LTI 1.3 Support:**
- LTI Advantage services (Assignment and Grade Services, Names and Role Provisioning Services)
- Deep linking for content embedding
- Resource link launch configuration
- Proctoring tool support
- Content selection extensions

**Supported LMS Platforms:**
- Canvas LMS
- Blackboard Learn
- Moodle
- Brightspace (D2L)
- Schoology
- SAP Litmos

**LTI Configuration:**
```json
{
  "title": "INR99 Academy Integration",
  "description": "Access courses and track progress",
  "oidc_initiation_url": "https://api.inr99.com/lti/login",
  "target_link_uri": "https://api.inr99.com/lti/launch",
  "public_jwk_url": "https://api.inr99.com/.well-known/jwks.json",
  "custom_parameters": {
    "course_id": "$Canvas.course.id",
    "user_id": "$Canvas.user.id"
  },
  "extensions": [
    {
      "platform": "canvas.instructure.com",
      "settings": {
        "placements": [
          {
            "placement": "course_navigation",
            "message_type": "LtiResourceLinkRequest",
            "target_link_uri": "https://api.inr99.com/lti/course"
          }
        ]
      }
    }
  ]
}
```

---

## 6. Content Management

### 6.1 Content Types

The platform supports diverse content types to accommodate various teaching methods and learning styles:

**Video Content:**
- Upload and automatic transcoding
- Multiple quality levels (360p, 720p, 1080p)
- Adaptive bitrate streaming
- Video thumbnails and previews
- Caption support (SRT, VTT)
- Interactive video features ( bookmarks, chapters)

**Text Content:**
- Rich text editor with formatting
- Image embedding and gallery
- Code blocks with syntax highlighting
- Mathematical notation (LaTeX)
- Embedded media support
- Responsive design

**Interactive Content:**
- Quizzes and assessments
- Flashcards and spaced repetition
- Drag-and-drop activities
- Matching and ordering exercises
- H5P content support
- SCORM compatibility

**Assignments:**
- File upload submissions
- Text-based responses
- Rubric-based grading
- Peer review workflows
- Plagiarism detection integration
- Turnitin integration

### 6.2 Course Licensing

Courses can be configured with different licensing models to support various business models:

**Private Courses:**
- Created and owned by a single institution
- Not visible or accessible to other tenants
- Full customization and modification rights
- Complete data ownership

**Shared Courses:**
- Created by one institution but shared with others
- Can be licensed to multiple institutions
- Revenue sharing with content creator
- Content updates propagate to all licensees

**Marketplace Courses:**
- Available for purchase on the course marketplace
- Creator sets licensing terms and pricing
- Platform takes percentage commission
- Quality review and approval process
- Rating and review system

### 6.3 Content Versioning

All course content supports versioning to track changes and enable rollback:

```typescript
interface ContentVersion {
  id: string;
  entityType: 'course' | 'lesson' | 'module';
  entityId: string;
  versionNumber: number;
  changes: ContentChange[];
  createdBy: string;
  createdAt: Date;
  comment?: string;
  isPublished: boolean;
}

interface ContentChange {
  field: string;
  oldValue: any;
  newValue: any;
  type: 'created' | 'updated' | 'deleted';
}
```

---

## 7. Analytics and Reporting

### 7.1 Analytics Layers

Analytics are implemented at multiple levels to provide insights for different stakeholders:

**Individual Analytics:**
- Time spent learning per course and lesson
- Completion rates and progress trends
- Assessment scores and improvement over time
- Learning streaks and consistency
- Skill progression tracking
- Comparison with peer averages

**Course Analytics:**
- Enrollment numbers and trends
- Completion rates by lesson and module
- Drop-off points analysis
- Assessment score distributions
- Content engagement metrics
- Instructor performance metrics

**Institutional Analytics:**
- Department-level comparisons
- Budget utilization tracking
- User adoption and engagement
- ROI calculations
- Compliance reporting
- Benchmarking against similar institutions

**Platform Analytics:**
- Overall platform health metrics
- Revenue and growth tracking
- User acquisition and retention
- Content performance analysis
- Feature usage statistics
- Infrastructure utilization

### 7.2 Dashboard Components

```typescript
interface DashboardConfig {
  userType: UserRole;
  refreshInterval: number;
  widgets: DashboardWidget[];
}

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'list';
  title: string;
  dataSource: string;
  refreshable: boolean;
  configurable: boolean;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
}

// Example dashboard configuration for institution admin
const institutionAdminDashboard: DashboardConfig = {
  userType: 'institution_admin',
  refreshInterval: 300000, // 5 minutes
  widgets: [
    {
      id: 'total-users',
      type: 'metric',
      title: 'Total Users',
      dataSource: 'users/count',
      refreshable: true,
      configurable: false,
      size: 'small',
      position: { x: 0, y: 0 }
    },
    {
      id: 'active-courses',
      type: 'metric',
      title: 'Active Courses',
      dataSource: 'courses/count',
      refreshable: true,
      configurable: false,
      size: 'small',
      position: { x: 1, y: 0 }
    },
    {
      id: 'completion-rate',
      type: 'chart',
      title: 'Course Completion Rate',
      dataSource: 'analytics/completion-trends',
      refreshable: true,
      configurable: true,
      size: 'medium',
      position: { x: 0, y: 1 }
    },
    {
      id: 'revenue-chart',
      type: 'chart',
      title: 'Monthly Revenue',
      dataSource: 'billing/revenue',
      refreshable: true,
      configurable: true,
      size: 'large',
      position: { x: 0, y: 2 }
    }
  ]
};
```

### 7.3 Reporting Features

The platform provides comprehensive reporting capabilities:

**Scheduled Reports:**
- Automated report generation
- Email delivery scheduling
- Multiple format exports (PDF, CSV, Excel)
- Report versioning and history
- Custom report builder

**Real-Time Reporting:**
- Live dashboard updates
- Custom query builder
- Ad-hoc report creation
- Data visualization tools
- Export capabilities

**Compliance Reports:**
- FERPA compliance reports
- GDPR data export
- Audit trail reports
- Access logs and monitoring
- Regulatory templates

---

## 8. API Architecture

### 8.1 REST API Design

The platform provides a comprehensive REST API for custom integrations and third-party applications:

**API Endpoints:**

| Resource | Methods | Description |
|----------|---------|-------------|
| `/api/v1/tenants` | GET, POST, PUT, DELETE | Tenant management |
| `/api/v1/users` | GET, POST, PUT, DELETE | User management |
| `/api/v1/courses` | GET, POST, PUT, DELETE | Course management |
| `/api/v1/enrollments` | GET, POST, PUT, DELETE | Enrollment management |
| `/api/v1/progress` | GET, POST, PUT | Progress tracking |
| `/api/v1/analytics` | GET | Analytics and reporting |
| `/api/v1/auth` | POST | Authentication |
| `/api/v1/billing` | GET, POST | Billing and subscriptions |

**API Request/Response Format:**

```json
// Request
{
  "method": "GET",
  "url": "/api/v1/courses",
  "headers": {
    "Authorization": "Bearer {token}",
    "X-Tenant-ID": "{tenant_id}"
  },
  "query": {
    "page": 1,
    "limit": 20,
    "category": "programming",
    "difficulty": "beginner"
  }
}

// Response
{
  "status": "success",
  "data": {
    "courses": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-01-03T12:00:00Z"
  }
}
```

### 8.2 Webhooks

The platform supports webhooks for real-time event notifications:

**Available Webhooks:**
- `user.created` - New user registration
- `user.deleted` - User account deletion
- `enrollment.created` - New course enrollment
- `enrollment.completed` - Course completion
- `payment.received` - Payment confirmation
- `certificate.issued` - Certificate generation

**Webhook Configuration:**
```typescript
interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    maxBackoff: number;
  };
}

// Webhook payload
interface WebhookPayload {
  id: string;
  event: string;
  timestamp: Date;
  data: any;
  signature: string; // HMAC-SHA256 of payload
}
```

### 8.3 API Rate Limiting

Rate limits are applied based on subscription tier:

| Tier | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Free | 60 | 1,000 |
| Basic | 120 | 10,000 |
| Professional | 300 | 100,000 |
| Enterprise | 1,000 | Unlimited |

---

## 9. Revenue Models

### 9.1 Pricing Tiers

**Individual Learners:**
- Free tier with limited course access
- Course purchases from ₹99-₹999 per course
- Premium subscription at ₹199/month (full access)
- Annual subscription at ₹1,990/year (best value)

**Institutional Plans:**

| Plan | Price/Student/Month | Min Users | Features |
|------|---------------------|-----------|----------|
| Starter | ₹49 | 100 | Basic courses, analytics |
| Professional | ₹79 | 500 | All courses, SSO, SIS |
| Enterprise | ₹99 | 1000 | Custom branding, dedicated support |
| Custom | Variable | 2500+ | Full customization, on-premise |

### 9.2 Revenue Sharing

**Course Marketplace:**
- Platform takes 30% commission
- Content creator receives 70%
- Plus ₹1 transaction fee per sale

**Institutional Licensing:**
- Revenue share with content creators for shared courses
- Tiered percentage based on institutional size
- Annual settlement with content partners

### 9.3 Additional Revenue Streams

**Add-On Services:**
- Custom course development: ₹50,000/course
- Integration services: ₹25,000/integration
- Training programs: ₹10,000/participant
- Priority support: ₹5,000/month

**Certification:**
- Verifiable certificates: ₹99/certificate
- Branded certificates: ₹499/certificate
- Digital badges: ₹49/badge

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

**Database and Infrastructure:**
- Set up multi-tenant database schema
- Implement row-level security
- Configure Kubernetes cluster
- Set up CI/CD pipeline
- Implement monitoring and logging

**Authentication System:**
- User registration and login
- JWT-based session management
- Password reset functionality
- Basic role-based access control

**Core Course Delivery:**
- Course browsing and search
- Lesson viewing with progress tracking
- Basic video player
- Progress persistence

**Deliverables:**
- Functional course delivery system
- User management with roles
- Basic analytics dashboard
- API documentation

### Phase 2: Institutional Features (Weeks 5-8)

**User Roles Enhancement:**
- Complete RBAC implementation
- Instructor role capabilities
- Admin role capabilities
- Custom permission sets

**Institution Management:**
- Tenant creation and management
- Branding customization
- Bulk user import
- Department management

**Course Creation:**
- Course builder interface
- Content upload and management
- Quiz creation tools
- Assignment management

**Basic Analytics:**
- Course completion tracking
- User progress dashboards
- Basic reporting

**Deliverables:**
- Multi-tenant platform
- Complete role system
- Course creation tools
- Basic analytics

### Phase 3: Integration (Weeks 9-12)

**SSO Integration:**
- SAML 2.0 support
- OAuth 2.0 support
- Custom IdP configuration
- Role mapping from IdP

**LTI Integration:**
- LTI 1.3 implementation
- Deep linking support
- Grade passback
- Canvas integration
- Moodle integration

**Payment Integration:**
- Multiple payment gateway support
- Subscription management
- Invoice generation
- Refund processing

**Deliverables:**
- SSO capability
- LMS integration
- Payment processing
- API for integrations

### Phase 4: Advanced Features (Weeks 13-16)

**Advanced Analytics:**
- Predictive analytics
- Custom report builder
- Data export capabilities
- Benchmarking tools

**Certificate System:**
- Certificate generation
- Digital badges
- Verification system
- LinkedIn integration

**Mobile Experience:**
- Native mobile apps
- Offline content access
- Push notifications
- Mobile-optimized web

**Deliverables:**
- Advanced analytics
- Certificate system
- Mobile applications
- Performance optimization

### Phase 5: Scaling (Ongoing)

**Performance Optimization:**
- Caching implementation
- CDN optimization
- Database optimization
- Auto-scaling configuration

**Security Enhancement:**
- Penetration testing
- Security audit
- Compliance certification
- Incident response plan

**Feature Enhancement:**
- AI-powered recommendations
- Adaptive learning paths
- Gamification elements
- Social learning features

---

## 11. Technical Stack Recommendations

### 11.1 Backend Technologies

**Primary Framework:**
- Node.js with TypeScript
- Express.js or Fastify for API
- Prisma ORM for database access
- GraphQL option for complex queries

**Database:**
- PostgreSQL for relational data
- Redis for caching and sessions
- Elasticsearch for search
- S3-compatible storage for files

**Infrastructure:**
- Kubernetes for container orchestration
- Docker for containerization
- Terraform for infrastructure as code
- AWS/GCP/Azure for cloud hosting

### 11.2 Frontend Technologies

**Web Application:**
- React.js with TypeScript
- Next.js for SSR and static generation
- Tailwind CSS for styling
- Zustand or Redux for state management

**Mobile Applications:**
- React Native for cross-platform apps
- Native modules for performance-critical features
- Offline sync capabilities
- Push notification integration

### 11.3 Third-Party Services

**Authentication:**
- Auth0 or Clerk for consumer auth
- Custom SAML for enterprise SSO
- OAuth providers (Google, Microsoft)

**Payments:**
- Stripe for payment processing
- Razorpay for Indian market
- PayPal for international

**Video:**
- Mux or Cloudflare Stream for video hosting
- AWS MediaConvert for transcoding
- CDN for delivery

**Email:**
- SendGrid or Resend for transactional email
- AWS SES for high-volume
- Email templates and automation

**Monitoring:**
- Datadog or New Relic for APM
- Sentry for error tracking
- PagerDuty for alerting

---

## 12. Security Considerations

### 12.1 Data Security

**Encryption:**
- TLS 1.3 for data in transit
- AES-256 for data at rest
- Key rotation every 90 days
- Certificate management

**Access Control:**
- Principle of least privilege
- Audit logging for all access
- Regular access reviews
- Automated deprovisioning

**Data Privacy:**
- GDPR compliance
- FERPA compliance
- Data retention policies
- Right to deletion

### 12.2 Application Security

**Vulnerability Management:**
- Regular penetration testing
- Automated security scanning
- Bug bounty program
- Incident response plan

**Code Security:**
- Secure coding practices
- Dependency scanning
- Code review requirements
- Security training

**Infrastructure Security:**
- Network segmentation
- Firewall rules
- DDoS protection
- WAF implementation

---

## 13. Success Metrics

### 13.1 Platform Metrics

**User Engagement:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration and frequency
- Feature adoption rates

**Learning Outcomes:**
- Course completion rates
- Assessment pass rates
- Time to completion
- Skill improvement metrics

**Business Metrics:**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate
- Net Revenue Retention

### 13.2 Technical Metrics

**Performance:**
- API response times (p95, p99)
- Page load times
- Video buffering rates
- Uptime percentage

**Reliability:**
- Error rates
- Incident frequency
- Mean Time to Recovery (MTTR)
- Mean Time Between Failures (MTBF)

**Scalability:**
- Concurrent user capacity
- Database connection usage
- Cache hit rates
- Queue processing times

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| Tenant | An organization (college, university, institute) using the platform |
| LTI | Learning Tools Interoperability - standard for LMS integration |
| SSO | Single Sign-On - unified authentication across systems |
| RBAC | Role-Based Access Control - permission management system |
| SIS | Student Information System - institutional student data management |
| IdP | Identity Provider - authentication service |
| SAML | Security Assertion Markup Language - SSO protocol |
| OAuth | Open Authorization - authorization protocol |
| RLS | Row-Level Security - database-level data isolation |

---

## Appendix B: Reference Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Load Balancer                                 │
│                    (AWS ALB / Cloudflare Load Balancer)                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐
            │   CDN Layer   │ │  WAF +    │ │  API Gateway  │
            │  (Cloudflare) │ │  DDoS     │ │   (Kong/AWS)  │
            └───────────────┘ └───────────┘ └───────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
            ┌───────▼───────┐         ┌───────▼───────┐         ┌───────▼───────┐
            │   Frontend    │         │  Backend API  │         │  Auth Service │
            │   (Next.js)   │         │   (Node.js)   │         │   (Auth0)     │
            └───────────────┘         └───────────────┘         └───────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
            ┌───────▼───────┐         ┌───────▼───────┐         ┌───────▼───────┐
            │    Redis      │         │  PostgreSQL   │         │    S3/Blob    │
            │   (Cache)     │         │  (Primary DB) │         │   (Storage)   │
            └───────────────┘         └───────────────┘         └───────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
            ┌───────▼───────┐         ┌───────▼───────┐         ┌───────▼───────┐
            │   Video CDN   │         │   Search      │         │  Analytics    │
            │   (Mux/Cloud) │         │  (Elastic)    │         │  (Datadog)    │
            └───────────────┘         └───────────────┘         └───────────────┘
```

---

*Document Version: 1.0*  
*Last Updated: 2026-01-03*  
*Author: Platform Architecture Team*
