# Desktop-Server School Platform - Deployment Guide

## Comprehensive Guide for Desktop and Server Deployment

This guide provides detailed instructions for deploying the Desktop-Server School Platform in both **desktop (offline)** and **server (online)** configurations. Choose the deployment method that best fits your institution's needs.

---

## 🎯 Deployment Options Overview

| Feature | Desktop (Tauri) | Server (Docker) |
|---------|----------------|-----------------|
| **Database** | SQLite | PostgreSQL |
| **Users** | Single user | Multi-user |
| **Offline Mode** | ✅ Full support | ⚡ Limited |
| **Installation Size** | ~50 MB | ~200 MB |
| **Startup Time** | < 3 seconds | < 5 seconds |
| **Network Required** | No | Yes |
| **Real-time Features** | When online | Always |
| **Best For** | Individual labs, offline use | Schools, online access |

---

## 🖥️ Desktop Deployment (Tauri)

The desktop application is perfect for:
- Computer labs with limited internet connectivity
- Individual teachers or students
- Offline learning environments
- Institutions prioritizing data privacy

### Prerequisites

1. **Node.js 18+**
   ```bash
   # Check Node.js version
   node --version
   
   # If not installed, download from https://nodejs.org/
   ```

2. **Rust and Cargo**
   ```bash
   # Install Rust (required for Tauri)
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Verify installation
   rustc --version
   cargo --version
   
   # Install Tauri CLI
   cargo install tauri-cli
   ```

3. **Git**
   ```bash
   # Verify Git installation
   git --version
   ```

### Installation Steps

#### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-repo/desktop-server-school-platform.git

# Navigate to project directory
cd desktop-server-school-platform
```

#### Step 2: Install Dependencies

```bash
# Install npm dependencies
npm install

# Or using Bun (faster)
bun install
```

#### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.desktop .env

# Edit configuration (optional)
nano .env
```

**Default Environment Variables:**
```env
# Desktop Configuration
DATABASE_PROVIDER=sqlite
DATABASE_URL_SQLITE=file:./db/academy.db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ENABLE_OFFLINE_MODE=true
MAX_OFFLINE_STORAGE=5368709120
CONTENT_STORAGE_PATH=./content
```

#### Step 4: Set Up Database

```bash
# Generate Prisma client for SQLite
npm run db:sqlite:generate

# Push schema to SQLite database
npm run db:sqlite:push

# Seed database with initial data (optional)
npm run db:seed
```

#### Step 5: Run Desktop Application

```bash
# Start development server
npm run desktop:dev

# The application will open in a Tauri window
```

#### Step 6: Build Production Installer

```bash
# Build desktop installer
npm run desktop:build

# Output location: src-tauri/target/release/bundle/
# - Windows: .msi installer
# - macOS: .dmg image
# - Linux: .deb or .AppImage
```

### Desktop Features

| Feature | Description |
|---------|-------------|
| **Offline Access** | All courses available without internet |
| **Local Database** | SQLite database stored locally |
| **Auto-Sync** | Automatically syncs when online |
| **System Notifications** | Important alerts and reminders |
| **File System Access** | Import/export data locally |
| **Compact Size** | ~50MB installer (10x smaller than Electron) |

---

## 🖥️ Server Deployment (Docker)

The server deployment is perfect for:
- Schools with network infrastructure
- Multi-user environments
- Real-time collaboration features
- Cloud or on-premise hosting

### Prerequisites

1. **Docker**
   ```bash
   # Check Docker installation
   docker --version
   docker-compose --version
   
   # If not installed, visit https://docs.docker.com/
   ```

2. **Docker Compose**
   ```bash
   # Verify Docker Compose
   docker-compose --version
   ```

3. **Git**
   ```bash
   # Verify Git installation
   git --version
   ```

### Installation Steps

#### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-repo/desktop-server-school-platform.git

# Navigate to project directory
cd desktop-server-school-platform
```

#### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

**Required Environment Variables:**
```env
# Database (PostgreSQL)
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://postgres:postgres@db:5432/school_platform

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
NODE_ENV=production
PORT=3000

# Real-time
SOCKET_PORT=3001

# Redis
REDIS_URL=redis://redis:6379
```

#### Step 3: Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| **App** | 3000 | Next.js application |
| **Socket.IO** | 3001 | Real-time server |
| **PostgreSQL** | 5432 | Database server |
| **Redis** | 6379 | Cache server |

### Server Features

| Feature | Description |
|---------|-------------|
| **Multi-User** | Supports thousands of concurrent users |
| **Real-Time** | Live updates via Socket.IO |
| **Scalable** | Ready for horizontal scaling |
| **Containerized** | Easy deployment with Docker |
| **Auto-SSL** | Automatic HTTPS with Caddy |
| **Monitoring** | Built-in health checks |

---

## 📁 Project Structure

```
desktop-server-school-platform/
├── src/                                   # Next.js Application
│   ├── app/                              # Pages and Routes
│   │   ├── page.tsx                      # Landing page
│   │   ├── admin/                        # Admin dashboard
│   │   ├── auth/                         # Authentication
│   │   ├── courses/                      # Course management
│   │   ├── dashboard/                    # User dashboards
│   │   └── api/                          # API routes
│   ├── components/                       # React Components
│   │   ├── ui/                           # Reusable UI components
│   │   └── providers/                    # Context providers
│   ├── lib/                              # Core Libraries
│   │   ├── desktop-service.ts            # Desktop integration
│   │   ├── offline-manager.ts            # Offline content
│   │   ├── db-manager.ts                 # Database utilities
│   │   └── auth.ts                       # Authentication
│   └── hooks/                            # Custom React Hooks
│       └── usePlatform.ts                # Platform detection
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
├── docker/                               # Docker Configuration
│   ├── Dockerfile                        # Application container
│   ├── Dockerfile.socket                 # Socket.IO container
│   └── docker-compose.yml                # Full stack deployment
│
├── scripts/                              # Build Scripts
│   └── build.sh                          # Build automation
│
├── public/                               # Static Assets
│   ├── images/                           # Static images
│   └── assets/                           # Course assets
│
└── docs/                                 # Documentation
```

---

## 🛠️ Database Management

### Desktop (SQLite)

```bash
# Generate Prisma client
npm run db:sqlite:generate

# Push schema to database
npm run db:sqlite:push

# Reset database (destructive)
npm run db:sqlite:reset

# Seed database
npm run db:seed
```

### Server (PostgreSQL)

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Create new migration
npm run db:migrate:dev

# Seed database
npm run db:seed
```

---

## 🔧 Configuration Reference

### Environment Variables

#### Desktop Configuration
```env
# Database
DATABASE_PROVIDER=sqlite
DATABASE_URL_SQLITE=file:./db/academy.db

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Features
ENABLE_OFFLINE_MODE=true
MAX_OFFLINE_STORAGE=5368709120
CONTENT_STORAGE_PATH=./content
```

#### Server Configuration
```env
# Database
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://user:password@localhost:5432/school_platform

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3000

# Redis
REDIS_URL=redis://localhost:6379

# Real-time
SOCKET_PORT=3001
CLIENT_URL=http://localhost:3000
```

---

## 📊 Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript 5.0 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Desktop** | Tauri 2.0 (Rust + WebView) |
| **Database** | Prisma ORM (SQLite / PostgreSQL) |
| **Server** | Node.js 20, Docker, Redis |
| **Real-time** | Socket.IO |
| **Authentication** | NextAuth.js, JWT |

---

## 🚀 Quick Reference Commands

### Desktop Application
```bash
# Development
npm run desktop:dev

# Production Build
npm run desktop:build

# Build standalone bundle
npm run build:standalone
```

### Web Application
```bash
# Development
npm run dev

# Production Build
npm run build

# Production Server
npm run start
```

### Docker Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# View running containers
docker-compose ps
```

---

## 🔐 Security Considerations

### Desktop Deployment
- Database stored locally (encrypted by OS)
- JWT tokens stored securely
- No network exposure by default

### Server Deployment
- Use HTTPS in production
- Configure firewall rules
- Enable database encryption
- Regular backup schedule
- Rate limiting enabled
- CORS configured properly

---

## 📈 Monitoring & Logging

### Desktop Application
- Logs stored in application directory
- Console output for debugging

### Server Deployment
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs db
docker-compose logs redis

# Real-time logs
docker-compose logs -f
```

---

## 🆘 Troubleshooting

### Desktop Issues

**Tauri not starting:**
```bash
# Clear cache and rebuild
rm -rf src-tauri/target
npm run desktop:build
```

**Database errors:**
```bash
# Reset SQLite database
rm -rf prisma/db/*.db
npm run db:sqlite:push
npm run db:sqlite:seed
```

### Server Issues

**Container won't start:**
```bash
# Check Docker logs
docker-compose logs

# Verify port availability
netstat -tlnp | grep 3000
```

**Database connection failed:**
```bash
# Wait for database to be ready
docker-compose logs db

# Restart database service
docker-compose restart db
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Documentation**: See `/docs` directory
- **Main README**: See `README.md`
- **Implementation Status**: See `IMPLEMENTATION_STATUS.md`
- **GitHub Issues**: Report bugs and request features

---

**Desktop-Server School Platform** - Empowering Education Through Technology

*Choose your deployment method and start transforming your institution today!*
