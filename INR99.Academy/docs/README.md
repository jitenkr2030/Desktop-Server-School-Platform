# INR99.Academy

India's Learning Infrastructure - As reliable and affordable as UPI

## 🌟 About

INR99.Academy is a comprehensive learning platform designed to make quality education accessible to every Indian at just ₹99/month. Built with a mobile-first approach, it works perfectly on low-end smartphones with low bandwidth optimization.

## 🚀 Features

### 📚 Learning Experience
- **Micro-lessons**: 5-12 minute lessons designed for learning anytime, anywhere
- **Learning Paths**: Curated journeys from beginner to intermediate with clear outcomes
- **Progress Tracking**: Comprehensive learning progress tracking and resume functionality
- **Low-bandwidth Mode**: Audio-first and text-only options for areas with poor connectivity
- **Assessments**: Lightweight quizzes and practice questions to reinforce learning

### 🎥 Live Learning (NEW)
- **Interactive Live Classes**: Real-time video sessions with expert instructors
- **Live Q&A**: Ask questions and get instant answers during sessions
- **Session Scheduling**: Browse upcoming sessions and register in advance
- **Attendance Tracking**: Track participation and session duration
- **Multi-Participant Sessions**: Support for multiple students in live classes
- **Live Chat**: Real-time messaging during live sessions
- **Session Recording**: Option to record and playback live sessions

### 💳 Subscription & Payments
- **Affordable Pricing**: Just ₹99/month with quarterly and yearly plans available
- **Multiple Payment Methods**: UPI, Credit/Debit Cards, and Digital Wallets (Paytm, PhonePe, Google Pay, Amazon Pay)
- **Flexible Plans**: Monthly (₹99), Quarterly (₹297), and Yearly (₹1188) options
- **Money Back Guarantee**: 30-day money-back guarantee

### 🎓 Certification System
- **Course Completion Certificates**: Optional certificates upon course completion
- **Digital Verification**: Unique certificate numbers with public verification system
- **Shareable Credentials**: Download and share certificates with employers and networks

### 👨‍🏫 Instructor Dashboard
- **Course Management**: Create and manage courses and lessons
- **Student Progress**: Track student engagement and completion rates
- **Live Session Hosting**: Schedule and conduct live learning sessions
- **Earnings Dashboard**: View earnings and payout information
- **Profile Management**: Manage instructor profile and expertise areas
- **Discussion Forums**: Course-specific Q&A and discussion threads
- **Peer Learning**: Connect with fellow learners and instructors
- **Knowledge Sharing**: Ask questions, share insights, and collaborate on learning
- **Moderation Tools**: Pinned discussions and content moderation

### 🛡️ Admin Dashboard
- **User Management**: Complete user lifecycle management
- **Content Management**: Course, lesson, and assessment management
- **Live Session Management**: Create, schedule, and manage live learning sessions
- **Analytics Dashboard**: Real-time statistics on users, courses, and revenue
- **Discussion Moderation**: Tools to manage community discussions

## 🏗️ Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with JWT tokens
- **State Management**: React Context and hooks for client state
- **UI Components**: Complete shadcn/ui component set with Lucide icons
- **Payment Integration**: Custom payment processor supporting UPI, cards, and wallets
- **Real-time**: Ready for WebSocket integration for live features

## 📱 Mobile-First Design

The platform is designed to work seamlessly across all devices, with special attention to:
- Low-end smartphones
- Slow internet connections
- Minimal data usage
- Touch-friendly interfaces
- Offline capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Bun or npm
- SQLite

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jitenkr2030/INR99.Academy.git
   cd INR99.Academy
   ```

2. **Install dependencies**
   ```bash
   bun install
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

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── community/         # Community features
│   ├── certificates/      # Certificate management
│   ├── courses/           # Course pages
│   ├── dashboard/         # User dashboard
│   ├── instructor/        # Instructor dashboard
│   ├── learning-paths/    # Learning paths
│   ├── live-sessions/     # Live learning feature
│   ├── subscription/      # Subscription management
│   └── verify-certificate/ # Certificate verification
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── auth-modal.tsx    # Authentication modal
│   ├── navigation.tsx    # Navigation component
│   └── payment-processor.tsx # Payment processing
├── contexts/             # React contexts
│   ├── auth-context.tsx  # Authentication context
│   ├── bandwidth-context.tsx # Bandwidth optimization
│   └── learning-progress-context.tsx # Progress tracking
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database connection
│   └── utils.ts         # Helper functions
└── hooks/                # Custom React hooks
    ├── use-mobile.ts    # Mobile detection
    └── use-toast.ts     # Toast notifications
```

## 📊 Database Schema

The application uses a comprehensive database schema with the following key models:

- **Users**: Authentication and profile management
- **Courses**: Course catalog and content
- **Lessons**: Modular micro-lessons
- **Learning Paths**: Curated learning journeys
- **Subscriptions**: User subscription management
- **Progress**: Course progress tracking
- **Assessments**: Quizzes and practice questions
- **Certificates**: Course completion certificates
- **Discussions**: Community Q&A and forums
- **Payment Records**: Transaction history
- **Live Sessions**: Scheduled and live learning sessions
- **Attendance**: Live session attendance tracking

## 🔐 Authentication

The platform uses a secure authentication system:
- **Mobile Number Authentication**: OTP-based verification for Indian users
- **NextAuth.js Integration**: Session-based authentication with JWT tokens
- **Role-Based Access Control**: Student, Instructor, Admin, and Super Admin roles
- **Secure Token Management**: Protected API routes with session validation

## 💳 Payment Integration

The payment system supports multiple Indian payment methods:
- **UPI Payments**: Direct UPI transfers and QR code scanning
- **Credit/Debit Cards**: Secure card processing
- **Digital Wallets**: Paytm, PhonePe, Google Pay, Amazon Pay
- **Subscription Management**: Automatic subscription handling

## 🎯 Course Categories

The platform offers a comprehensive course universe covering:

### 🧠 Foundational Learning
- Learning How to Learn
- Digital Literacy

### 💰 Money, Finance & Economics
- Personal Finance
- Investing
- Taxation (India-Focused)
- Economics

### 🧾 Business, Commerce & Entrepreneurship
- Business Basics
- Entrepreneurship
- Accounting
- Compliance & Law

### 💻 Technology & Computer Science
- Computer Basics
- Programming (Python, JavaScript, Java, C/C++, PHP, Go, Rust)
- Web Development
- Mobile App Development
- AI & Data
- Cybersecurity

### 🎨 Design, Creative & Media
- Graphic Design
- UI/UX Design
- Video & Audio
- Writing & Content

### 📢 Marketing, Sales & Growth
- Digital Marketing
- Advertising
- Sales Skills
- Brand Building

### 🧑‍💼 Career, Jobs & Professional Development
- Career Planning
- Job Preparation
- Workplace Skills
- Freelancing & Gig Economy

### 🧪 Science, Engineering & Research
- Mathematics
- Physics, Chemistry, Biology
- Data Science & Research

### 🧬 Health, Fitness & Well-being
- Physical Health
- Mental Health
- Yoga & Meditation

### 🌍 Language & Communication
- English Skills
- Indian Languages
- Foreign Languages

### 🏛 Government, Civics & Awareness
- Indian Constitution
- Competitive Exams
- Govt Schemes

### 🛍 E-commerce & Online Business
- Platform selling
- D2C brands
- Digital products

### 🎮 Gaming, Esports & New-age Careers
- Game design
- Esports careers
- Streaming

### 🏠 Life Skills & Practical Knowledge
- Financial discipline
- Consumer rights
- Travel planning

### 🧰 DIY, Tools & Practical Skills
- Excel mastery
- Automation tools
- No-code platforms

### 🧭 Spirituality, Philosophy & Thinking
- Indian philosophy
- Ethics
- Critical thinking

### 🔒 Safety, Law & Awareness
- Cyber fraud prevention
- Consumer law
- Digital safety

### 🧑‍🤝‍🧑 Community-led Learning
- Peer teaching
- Study groups
- Instructor AMA

### 🏫 School Learning (Class 1–12)
- Curriculum Coverage (CBSE, ICSE, State Boards)
- Subject-wise learning

### 🎓 College Learning
- Degree Coverage
- College Subjects

### 📚 Exam Support
- Concept revision
- Problem-solving techniques

## 🛠️ Development

### Available Scripts

```bash
# Development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Code linting
bun run lint

# Database operations
bun run db:push      # Push schema to database
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run migrations
bun run db:reset     # Reset database
```

### Code Quality

- **TypeScript**: Strict typing throughout the application
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting (configured)
- **Prisma**: Type-safe database access

## 🌐 Deployment

### Production Build

```bash
bun run build
bun run start
```

### Environment Variables

Required environment variables:

```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_APP_URL=your_app_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- shadcn/ui for the beautiful component library
- Prisma team for the amazing ORM
- All contributors who help make this project better

## 📞 Support

For support, please email support@inr99.academy or create an issue in the repository.

---

**INR99.Academy** - India's Digital Public Learning Infrastructure  
*Not just a course site, but a learning utility, just like UPI.*