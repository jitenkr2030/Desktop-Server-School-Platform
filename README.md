# Desktop-Server School Platform

## Comprehensive Educational Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-24c9a6)](https://tauri.app/)
[![Docker](https://img.shields.io/badge/Docker-2496ed)](https://www.docker.com/)

The Desktop-Server School Platform is a comprehensive educational management system designed for schools, coaching institutes, and educational institutions. It supports both **desktop deployment** (Tauri + SQLite) and **server deployment** (Docker + PostgreSQL), making it versatile for various institutional needs.

---

## 🌟 About

This platform addresses the critical need for affordable, accessible educational technology in institutions of all sizes. Whether you need a standalone desktop application for a single computer lab or a full server deployment for a networked school, this platform delivers enterprise-grade features with consumer-friendly simplicity.

### Our Mission

To democratize quality educational infrastructure by providing institutions with a flexible, scalable, and affordable platform that works both online and offline, ensuring uninterrupted learning regardless of connectivity constraints.

### Why This Platform?

- **Dual Deployment**: Desktop (offline-first) and Server (cloud-based) options
- **Comprehensive**: From student management to assessments and certificates
- **Scalable**: Supports single users to thousands of concurrent users
- **Affordable**: Open-source with no licensing costs
- **Offline-First**: Full functionality without constant internet connectivity
- **Customizable**: White-label support for institution branding

---

## 🚀 Key Features

### 📚 Core Educational Features

| Feature | Description |
|---------|-------------|
| **Student Management** | Complete student lifecycle management with profiles, attendance, and progress tracking |
| **Course Management** | Create and manage courses, modules, and lessons with multimedia support |
| **Assessment System** | Quizzes, exams, and practice assessments with automatic grading |
| **Progress Tracking** | Real-time learning progress with detailed analytics |
| **Certificate Generation** | Automated certificate generation upon course completion |
| **Attendance Management** | Track student attendance for classes and live sessions |

### 🎓 Academic Structure

The platform supports multiple educational levels:

#### 🏫 School Education (Class 1-12)
- Primary Education (Classes 1-5)
- Middle School (Classes 6-8)
- Secondary Education (Classes 9-10)
- Senior Secondary (Classes 11-12)

#### 🎓 Higher Education
- Undergraduate Programs (BBA, B.Com, B.Sc, B.Tech)
- Postgraduate Programs (MBA, M.Com, M.Sc, M.Tech)
- Diploma and Certificate Courses

#### 💼 Professional Development
- Corporate Training Programs
- Skill Development Courses
- Certification Programs

### 👨‍🏫 Role-Based Access Control

| Role | Capabilities |
|------|--------------|
| **Administrator** | Full system management, user administration, content approval |
| **Teacher/Instructor** | Course creation, student management, assessment creation |
| **Student** | Course access, progress tracking, certificate download |
| **Parent** | Student progress monitoring (optional) |

### 🎥 Live Learning

- **Interactive Live Classes**: Real-time video sessions with instructors
- **Live Q&A**: Interactive question and answer sessions
- **Session Scheduling**: Schedule and manage live sessions
- **Attendance Tracking**: Automatic attendance for live sessions
- **Recording Playback**: Access recorded sessions anytime

### 💻 Desktop Application Features (Tauri)

- **Offline Mode**: Full functionality without internet connection
- **Local Database**: SQLite database for standalone operation
- **System Notifications**: Important alerts and reminders
- **Auto-Sync**: Automatic data synchronization when online
- **Compact Size**: ~50MB installer (10x smaller than Electron alternatives)

### 🖥️ Server Deployment Features (Docker)

- **Multi-User Support**: Thousands of concurrent users
- **PostgreSQL Database**: Robust data management
- **Real-Time Updates**: Socket.IO for live features
- **Docker Containerization**: Easy deployment and scaling
- **Load Balancing**: Ready for horizontal scaling

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui with Lucide Icons
- **State Management**: React Context + Zustand

### Desktop (Tauri)
- **Backend**: Rust 2.0
- **Frontend**: Next.js in WebView
- **Database**: SQLite with Prisma ORM
- **System Integration**: Native notifications, file system access

### Server (Docker)
- **Runtime**: Node.js 20 LTS
- **Database**: PostgreSQL 15
- **ORM**: Prisma with connection pooling
- **Real-Time**: Socket.IO with Redis adapter
- **Caching**: Redis for session and cache management

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Caddy (automatic HTTPS)
- **Version Control**: GitHub
- **Package Manager**: npm / Bun

---

## 📁 Project Structure

```
Desktop-Server-School-Platform/
├── src/                                   # Next.js Web Application
│   ├── app/                              # Pages and Routes
│   │   ├── page.tsx                      # Landing page
│   │   ├── layout.tsx                    # Main layout
│   │   ├── admin/                        # Admin dashboard
│   │   ├── auth/                         # Authentication
│   │   ├── courses/                      # Course management
│   │   ├── dashboard/                    # User dashboards
│   │   ├── live-sessions/                # Live learning
│   │   └── api/                          # API routes
│   ├── components/                       # React Components
│   │   ├── ui/                           # Reusable UI components
│   │   ├── providers/                    # Context providers
│   │   └── dashboard/                    # Dashboard components
│   ├── lib/                              # Core Libraries
│   │   ├── desktop-service.ts            # Desktop integration
│   │   ├── offline-manager.ts            # Offline content
│   │   ├── db-manager.ts                 # Database utilities
│   │   └── auth.ts                       # Authentication
│   ├── hooks/                            # Custom React Hooks
│   │   └── usePlatform.ts                # Platform detection
│   └── contexts/                         # React Contexts
│
├── src-tauri/                            # Tauri Desktop Application
│   ├── tauri.conf.json                   # Main configuration
│   ├── Cargo.toml                        # Rust dependencies
│   ├── build.rs                          # Build script
│   ├── src/
│   │   ├── main.rs                       # Entry point
│   │   ├── commands.rs                   # Tauri commands
│   │   └── lib.rs                        # Library exports
│   └── icons/                            # Application icons
│
├── prisma/                               # Database Layer
│   ├── schema.prisma                     # PostgreSQL schema (Server)
│   ├── schema.sqlite.prisma              # SQLite schema (Desktop)
│   └── seed.ts                           # Database seeding
│
├── scripts/                              # Build Scripts
│   └── build.sh                          # Build automation
│
├── docker/                               # Docker Configuration
│   ├── Dockerfile                        # Application container
│   └── docker-compose.yml                # Full stack deployment
│
├── docs/                                 # Documentation
└── public/                               # Static Assets
```

---

## 🛠️ Getting Started

### Prerequisites

#### For Desktop Application
- Node.js 18+
- Rust and Cargo (for Tauri)
- Bun or npm

#### For Server Deployment
- Docker & Docker Compose
- 4GB RAM minimum (8GB recommended)
- 10GB disk space

### Installation

#### Option 1: Desktop Application

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/desktop-server-school-platform.git
   cd desktop-server-school-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Rust (required for Tauri)**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   cargo install tauri-cli
   ```

4. **Set up database**
   ```bash
   npm run db:sqlite:generate
   npm run db:sqlite:push
   ```

5. **Run desktop application**
   ```bash
   npm run desktop:dev
   ```

6. **Build desktop installer**
   ```bash
   npm run desktop:build
   ```

#### Option 2: Server Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/desktop-server-school-platform.git
   cd desktop-server-school-platform
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Desktop Development
npm run desktop:dev          # Start Tauri desktop development
npm run desktop:build        # Build desktop installer

# Web Development
npm run dev                  # Start web development server
npm run build                # Build for production
npm run start                # Start production server

# Database
npm run db:generate          # Generate Prisma client
npm run db:push              # Push schema (PostgreSQL)
npm run db:sqlite:push       # Push schema (SQLite)
npm run db:migrate           # Run migrations
npm run db:seed              # Seed database

# Docker
docker-compose up -d         # Start all services
docker-compose down          # Stop all services
docker-compose logs -f       # View logs
```

---

## 📊 Database Schema

### Core Models

- **User**: Authentication, profile, and role management
- **StudentProfile**: Extended student information
- **InstructorProfile**: Instructor qualifications and ratings
- **SchoolClass**: Academic class/grade management
- **Course**: Course catalog with taxonomy
- **Module**: Course modules for content organization
- **Lesson**: Individual lessons (video, text, quiz)
- **CourseProgress**: Student progress tracking
- **Assessment**: Quizzes and examinations
- **Certificate**: Course completion certificates
- **LiveSession**: Scheduled live learning sessions
- **Attendance**: Session attendance records
- **Subscription**: Institutional subscription management
- **Tenant**: Multi-tenant support for multiple schools

---

## 🔐 Authentication & Security

- **JWT-based Authentication**: Secure session management
- **Role-Based Access Control**: Granular permission system
- **Password Encryption**: bcrypt with salt rounds
- **API Rate Limiting**: Protection against abuse
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Content sanitization

---

## 📈 Deployment Options

### Development
- Local development server
- Hot reload for both desktop and web

### Production - Desktop
- Windows Installer (.msi)
- macOS Application (.dmg)
- Linux Package (.deb, .AppImage)

### Production - Server
- Single server deployment
- Containerized with Docker
- Ready for cloud platforms (AWS, GCP, Azure)
- Kubernetes-ready manifests available

---

## 🎨 Customization

### White-Label Support

Customize the platform for your institution:

- Logo and branding colors
- Custom domain support
- Institution-specific content
- Custom landing pages
- Email templates

### Theming

- Light/Dark mode support
- Custom color schemes
- Typography options
- Layout customization

---

## 📈 Roadmap

### Short-term (1-3 months)
- [ ] Mobile app companion (React Native)
- [ ] Advanced analytics dashboard
- [ ] Parent portal launch
- [ ] Bulk student import/export

### Medium-term (3-6 months)
- [ ] AI-powered recommendations
- [ ] WhatsApp integration
- [ ] Multi-language support
- [ ] Advanced examination system

### Long-term (6-12 months)
- [ ] Virtual classroom integration
- [ ] Learning analytics AI
- [ ] Blockchain certificates
- [ ] ERP module integration

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

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
- Tauri team for the desktop framework
- Prisma team for the amazing ORM
- Tailwind CSS for utility-first styling
- All contributors who help make this project better

---

## 📞 Contact & Support

- **Documentation**: See `/docs` directory
- **Deployment Guide**: See `README-DESKTOP-SERVER.md`
- **Implementation Status**: See `IMPLEMENTATION_STATUS.md`
- **GitHub Issues**: Report bugs and request features

---

**Desktop-Server School Platform** - Empowering Education Through Technology

*Whether you need a desktop application for offline learning or a server-based platform for networked schools, we've got you covered.*
