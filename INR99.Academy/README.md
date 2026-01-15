# INR99.Academy

## India's Learning Infrastructure - As reliable and affordable as UPI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

INR99.Academy is a comprehensive learning platform designed to make quality education accessible to every Indian at just ₹99/month. Built with a mobile-first approach, it works perfectly on low-end smartphones with low bandwidth optimization.

---

## 🌟 About

INR99.Academy addresses the critical gap in affordable quality education in India. While premium platforms charge ₹10,000-50,000/year, INR99 offers the same value proposition at ₹1,188/year—making it 10x more accessible.

### Our Mission

To democratize quality education in India by making it as accessible and affordable as UPI payments. Every Indian, regardless of their economic background, deserves access to world-class educational content.

### Why INR99?

- **Affordable**: Just ₹99/month (₹3/day)
- **Accessible**: Works on low-end smartphones
- **Comprehensive**: From school education to professional skills
- **Localized**: Content in Hindi and English
- **Flexible**: Learn at your own pace, anywhere

---

## 🚀 Key Features

### 📚 Learning Experience

| Feature | Description |
|---------|-------------|
| **Micro-lessons** | 5-12 minute lessons designed for learning anytime, anywhere |
| **Learning Paths** | Curated journeys from beginner to advanced with clear outcomes |
| **Progress Tracking** | Comprehensive learning progress tracking and resume functionality |
| **Low-bandwidth Mode** | Audio-first and text-only options for areas with poor connectivity |
| **Assessments** | Quizzes and practice questions to reinforce learning |
| **Certificate System** | Verified digital certificates upon course completion |

### 🎓 Course Taxonomy

The platform offers a comprehensive 6-tier course structure:

#### 🏫 School Education (Class 1-12)
- **Primary (1-5)**: English Grammar, Mathematics, Science Fundamentals
- **Middle (6-8)**: Mathematics, Science, English Literature
- **Secondary (9-10)**: Mathematics, Physics, Chemistry, Biology
- **Senior Secondary (11-12)**: Physics, Chemistry, Biology, Advanced Mathematics

#### 🎓 College (Undergraduate)
- **Arts & Humanities**: Communication, Philosophy, History, Literature
- **Commerce & Business**: Accounting, Economics, Marketing, B.Com, BBA
- **Engineering & Technology**: Programming, Mathematics, Physics, B.Tech
- **Medical Sciences**: Anatomy, Physiology, Biochemistry, Research

#### 🎓 Post-Graduate
- **MBA**: Finance, Marketing, HR, Operations
- **M.Com**: Accounting, Finance, Business, Taxation
- **M.Sc/MCA**: Data Science, Cyber Security, Computer Science
- **M.A./LL.M**: Economics, History, Psychology, Law

#### 💼 Professional / Career Skills
- **Technology & Programming**: Python, Web Development, Mobile Development, Data Science
- **Business & Entrepreneurship**: Strategy, Project Management, Startup
- **Design & Creative**: UI/UX, Graphic Design, Photography, Video Editing
- **Marketing & Communication**: Digital Marketing, SEO, Public Speaking

#### 📋 Competitive Exams & Certifications
- **Professional Certifications**: CA, CS, CMA, CFA, FRM, ACCA, Actuarial
- **Government Exams**: UPSC, SSC, Banking, Police, TET, Defense

#### 🧠 Citizen & Life Systems
- **Personal Finance**: Tax, Insurance, Investment, Stock Market
- **Digital Literacy**: UPI, Banking, Government Portals, Online Safety
- **Community Systems**: Food Work, Bulk Buying, Work Models

### 🎥 Live Learning

- **Interactive Live Classes**: Real-time video sessions with expert instructors
- **Live Q&A**: Ask questions and get instant answers during sessions
- **Session Scheduling**: Browse upcoming sessions and register in advance
- **Attendance Tracking**: Track participation and session duration
- **Session Recording**: Option to record and playback live sessions

### 👨‍🏫 Instructor Dashboard

- **Course Management**: Create and manage courses and lessons
- **Student Progress**: Track student engagement and completion rates
- **Live Session Hosting**: Schedule and conduct live learning sessions
- **Earnings Dashboard**: View earnings and payout information
- **Discussion Forums**: Course-specific Q&A and discussion threads

### 🛡️ Admin Dashboard

- **User Management**: Complete user lifecycle management
- **Content Management**: Course, lesson, and assessment management
- **Live Session Management**: Create, schedule, and manage live sessions
- **Analytics Dashboard**: Real-time statistics on users, courses, and revenue
- **Discussion Moderation**: Tools to manage community discussions

### 💳 Subscription & Payments

- **Affordable Pricing**: Just ₹99/month with quarterly and yearly plans
- **Multiple Payment Methods**: UPI, Credit/Debit Cards, Digital Wallets
- **Flexible Plans**: Monthly (₹99), Quarterly (₹297), Yearly (₹1188)
- **Subscription Management**: Automatic renewal and cancellation

### 🎓 Certification System

- **Course Completion Certificates**: Verified certificates upon completion
- **Digital Verification**: Unique certificate numbers with public verification
- **Shareable Credentials**: Download and share with employers

### 🏢 Confusion Removers

Specialized content to clear common confusion points:

- **Digital Confusion**: UPI, Banking, Government Portals
- **Financial Confusion**: Stock Market, Mutual Funds, Insurance
- **Government Services**: Schemes, Certificates, Benefits

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui with Lucide Icons
- **State Management**: React Context + Custom Hooks

### Backend
- **Runtime**: Node.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with JWT tokens
- **API**: RESTful endpoints with Next.js API Routes

### Infrastructure
- **Deployment**: Vercel / Docker
- **Version Control**: GitHub
- **Package Manager**: Bun / npm

---

## 📁 Project Structure

```
INR99.Academy/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin management APIs
│   │   │   ├── auth/          # Authentication APIs
│   │   │   ├── categories/    # Category management
│   │   │   ├── courses/       # Course APIs
│   │   │   ├── enrollments/   # Enrollment management
│   │   │   ├── live-sessions/ # Live session APIs
│   │   │   ├── payments/      # Payment processing
│   │   │   ├── progress/      # Progress tracking
│   │   │   ├── school/        # School data APIs
│   │   │   └── subscriptions/ # Subscription management
│   │   ├── admin/             # Admin dashboard
│   │   ├── auth/              # Login/Register pages
│   │   ├── business/          # Business landing page
│   │   ├── categories/        # Course categories
│   │   ├── certificates/      # Certificate management
│   │   ├── community/         # Community discussions
│   │   ├── confusion/         # Confusion remover content
│   │   ├── courses/           # Course catalog & details
│   │   ├── dashboard/         # User dashboards
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── instructor/    # Instructor dashboard
│   │   │   └── student/       # Student dashboard
│   │   ├── instructor/        # Instructor portal
│   │   ├── learning-paths/    # Learning path pages
│   │   ├── learning-ledger/   # Progress tracking
│   │   ├── live-sessions/     # Live learning
│   │   ├── profile/           # User profile
│   │   ├── school/            # School education
│   │   ├── subscription/      # Subscription management
│   │   └── verify-certificate/# Certificate verification
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth-modal.tsx    # Authentication modal
│   │   ├── course-card.tsx   # Course display card
│   │   ├── footer.tsx        # Footer component
│   │   ├── navigation.tsx    # Navigation bar
│   │   ├── payment-processor.tsx # Payment handling
│   │   ├── lesson-player.tsx # Video lesson player
│   │   ├── assessment-player.tsx # Quiz system
│   │   ├── discussion-*.tsx  # Community features
│   │   └── bandwidth-toggle.tsx # Low-bandwidth option
│   ├── contexts/             # React contexts
│   │   ├── auth-context.tsx  # Authentication state
│   │   └── bandwidth-context.tsx # Bandwidth settings
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts          # Auth utilities
│   │   ├── db.ts            # Database connection
│   │   ├── course-data.ts   # Static course data
│   │   └── utils.ts         # Helper functions
│   ├── middleware.ts         # Route protection
│   └── auth.ts              # Auth configuration
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding
├── public/
│   ├── assets/              # Static assets
│   └── images/              # Image files
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
└── package.json
```

---

## 📊 Database Schema

Key Prisma models include:

- **User**: Authentication, profile, and role management
- **Course**: Course catalog with taxonomy (vertical, category, subcategory)
- **Lesson**: Modular micro-lessons with video/text/quiz types
- **LearningPath**: Curated learning journeys
- **Enrollment**: Student course enrollments
- **Progress**: Lesson completion tracking
- **Assessment**: Quizzes and practice questions
- **Certificate**: Course completion certificates
- **Discussion**: Community Q&A and forums
- **LiveSession**: Scheduled live learning sessions
- **Attendance**: Session attendance records
- **Subscription**: User subscription management
- **Payment**: Transaction history

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- Bun or npm
- SQLite (or PostgreSQL for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jitenkr2030/INR99.Academy.git
   cd INR99.Academy
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other variables
   ```

4. **Set up the database**
   ```bash
   bun run db:push
   bun run db:generate
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint

# Database
bun run db:push          # Push schema to database
bun run db:generate      # Generate Prisma client
bun run db:migrate       # Run migrations
bun run db:seed          # Seed database with initial data
```

---

## 🔐 Authentication System

The platform uses a secure authentication system:

- **Mobile Number Authentication**: OTP-based verification for Indian users
- **NextAuth.js Integration**: Session-based authentication with JWT tokens
- **Role-Based Access Control**: Student, Instructor, Admin roles
- **Protected Routes**: Middleware-based route protection

### User Roles

| Role | Description |
|------|-------------|
| **Student** | Access to courses, progress tracking, certificates |
| **Instructor** | Course creation, student management, earnings |
| **Admin** | Full platform management, user moderation |

---

## 💳 Payment Integration

Multiple Indian payment methods supported:

- **UPI**: Direct transfers and QR code scanning
- **Cards**: Credit and debit card processing
- **Wallets**: Paytm, PhonePe, Google Pay, Amazon Pay

### Subscription Plans

| Plan | Price | Savings |
|------|-------|---------|
| Monthly | ₹99/month | - |
| Quarterly | ₹297/3 months | 10% |
| Yearly | ₹1,188/year | 15% |

---

## 🎯 Course Categories

### Technology & Programming
- Python, JavaScript, Java, C/C++, PHP, Go, Rust
- Web Development (React, Next.js, Node.js)
- Mobile App Development
- AI & Machine Learning
- Data Science & Analytics
- Cybersecurity

### Design & Creative
- Graphic Design
- UI/UX Design (Figma)
- Video & Audio Production
- Photography
- Content Writing

### Business & Finance
- Financial Markets
- Personal Finance & Investing
- Taxation (India)
- Business Strategy
- Entrepreneurship
- Accounting

### Marketing & Sales
- Digital Marketing
- SEO & SEM
- Social Media Marketing
- Brand Building
- Sales Skills

### Professional Development
- Resume Building
- Interview Preparation
- Public Speaking
- Leadership Skills
- Time Management

### School & Academic
- CBSE/ICSE Curriculum (Class 1-12)
- JEE/NEET Preparation
- English & Communication
- Mathematics & Science

### Competitive Exams
- UPSC Civil Services
- SSC CGL/CHSL
- Banking Exams
- Teaching Exams (TET)
- Defense & Police Exams

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically

### Docker

```bash
# Build image
docker build -t inr99-academy .

# Run container
docker run -p 3000:3000 inr99-academy
```

### Environment Variables

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-domain.com
```

---

## 📈 Roadmap

### Short-term (1-3 months)
- [ ] Mobile app launch (React Native)
- [ ] Hindi content expansion
- [ ] Payment gateway integration (Razorpay)
- [ ] School partnership program launch

### Medium-term (3-6 months)
- [ ] Regional language content (Tamil, Telugu, Marathi)
- [ ] WhatsApp-based learning
- [ ] Instructor certification program
- [ ] Government tender applications

### Long-term (6-12 months)
- [ ] AI-powered personalized learning
- [ ] Virtual reality learning experiences
- [ ] International expansion
- [ ] IPO preparation

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- shadcn/ui for the beautiful component library
- Prisma team for the amazing ORM
- Tailwind CSS for utility-first styling
- All contributors who help make this project better

---

## 📞 Contact & Support

- **Website**: [https://inr99.academy](https://inr99.academy)
- **Email**: support@inr99.academy
- **GitHub**: [https://github.com/jitenkr2030/INR99.Academy](https://github.com/jitenkr2030/INR99.Academy)

---

**INR99.Academy** - India's Digital Public Learning Infrastructure

*Not just a course site, but a learning utility, just like UPI.*
