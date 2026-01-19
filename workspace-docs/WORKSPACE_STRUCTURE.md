# Desktop-Server School Platform - Workspace Structure

## Project Overview

This workspace contains the **Desktop-Server School Platform**, a comprehensive educational management system that can be deployed as both a desktop application (using Tauri) and a server-based web application (using Next.js and Docker). The project has been transformed from the original INR99.Academy repository into a versatile platform suitable for educational institutions of all sizes.

## Directory Structure

```
desktop-server-school-platform/
├── src/                                    # Next.js Application
│   ├── app/                                # Pages and Routes
│   │   ├── page.tsx                        # Landing page
│   │   ├── layout.tsx                      # Main layout
│   │   ├── globals.css                     # Global styles
│   │   ├── about/                          # About page
│   │   ├── admin/                          # Admin dashboard
│   │   │   ├── page.tsx                    # Admin dashboard home
│   │   │   ├── courses/                    # Course management
│   │   │   ├── users/                      # User management
│   │   │   └── analytics/                  # Analytics dashboard
│   │   ├── auth/                           # Authentication
│   │   │   ├── login/                      # Login page
│   │   │   ├── register/                   # Registration page
│   │   │   └── verify/                     # Email verification
│   │   ├── categories/                     # Course categories
│   │   ├── courses/                        # Course pages
│   │   │   ├── page.tsx                    # Course listing
│   │   │   ├── [id]/                       # Individual course
│   │   │   │   ├── page.tsx                # Course details
│   │   │   │   └── learn/                  # Learning interface
│   │   ├── dashboard/                      # User dashboards
│   │   │   ├── page.tsx                    # Student dashboard
│   │   │   ├── instructor/                 # Instructor dashboard
│   │   │   └── admin/                      # Admin dashboard
│   │   ├── live-sessions/                  # Live session management
│   │   ├── profile/                        # User profile
│   │   └── api/                            # API routes
│   │       ├── auth/                       # Authentication endpoints
│   │       ├── courses/                    # Course endpoints
│   │       └── users/                      # User endpoints
│   │
│   ├── components/                         # React Components
│   │   ├── ui/                             # Reusable UI components
│   │   │   ├── button.tsx                  # Button component
│   │   │   ├── card.tsx                    # Card component
│   │   │   ├── input.tsx                   # Input component
│   │   │   ├── modal.tsx                   # Modal component
│   │   │   └── ...                         # Other UI components
│   │   ├── providers/                      # Context providers
│   │   │   ├── platform-provider.tsx       # Platform detection provider
│   │   │   └── auth-provider.tsx           # Authentication provider
│   │   ├── confusion/                      # Confusion remover components
│   │   ├── tenant/                         # Multi-tenant components
│   │   └── ...                             # Feature-specific components
│   │
│   ├── lib/                                # Core Libraries
│   │   ├── desktop-service.ts              # Desktop app integration
│   │   ├── offline-manager.ts              # Offline content management
│   │   ├── db-manager.ts                   # Database utilities
│   │   ├── auth.ts                         # Authentication utilities
│   │   ├── utils.ts                        # General utility functions
│   │   └── integrations/                   # Third-party integrations
│   │
│   ├── hooks/                              # Custom React Hooks
│   │   └── usePlatform.ts                  # Platform detection hook
│   │
│   └── contexts/                           # React Contexts
│       ├── auth-context.tsx                # Authentication context
│       ├── bandwidth-context.tsx           # Bandwidth management
│       └── learning-progress-context.tsx   # Learning progress tracking
│
├── src-tauri/                              # Tauri Desktop Application
│   ├── tauri.conf.json                     # Main configuration
│   ├── tauri.config.dev.json               # Development configuration
│   ├── Cargo.toml                          # Rust dependencies
│   ├── build.rs                            # Build script
│   ├── src/
│   │   ├── main.rs                         # Entry point
│   │   ├── commands.rs                     # Tauri commands
│   │   └── lib.rs                          # Library exports
│   └── icons/                              # Application icons
│       ├── icon.png                        # Main icon
│       └── icon.ico                        # Windows icon
│
├── prisma/                                 # Database Layer
│   ├── schema.prisma                       # PostgreSQL schema (Server)
│   ├── schema.sqlite.prisma                # SQLite schema (Desktop)
│   ├── seed.ts                             # Database seeding
│   ├── populate-courses.ts                 # Course population script
│   ├── dev.db                              # SQLite development database
│   └── db/                                 # Database files directory
│
├── docker/                                 # Docker Configuration
│   ├── Dockerfile                          # Application container
│   ├── Dockerfile.socket                   # Socket.IO container
│   ├── socket-server.js                    # Socket.IO server
│   └── docker-compose.yml                  # Full stack deployment
│
├── scripts/                                # Build Scripts
│   ├── build.sh                            # Build automation script
│   └── ...                                 # Other utility scripts
│
├── public/                                 # Static Assets
│   ├── images/                             # Static images
│   │   ├── hero-image.jpg                  # Hero section image
│   │   └── ...                             # Other images
│   ├── assets/                             # Course assets
│   │   ├── videos/                         # Video content
│   │   ├── documents/                      # Document resources
│   │   └── ...                             # Other assets
│   ├── favicon.svg                         # Favicon
│   └── logo.svg                            # Logo
│
├── docs/                                   # Documentation
│   ├── API_FIX_REPORT.md
│   ├── AUTH_SYSTEM_FIX_FINAL.md
│   ├── BUILD_FIX_SUMMARY.md
│   ├── CLIENT_SIDE_EXCEPTION_FIX.md
│   ├── DEMO_ACCOUNTS_GUIDE.md
│   ├── DEPLOYMENT_SUMMARY.md
│   ├── GITHUB_UPDATE_STATUS.md
│   ├── HOMEPAGE_DEBUG.md
│   ├── IMPLEMENTATION_STATUS.md
│   ├── ISSUE_RESOLUTION_REPORT.md
│   ├── LOGIN_PAGE_FIX.md
│   ├── ORIGINAL_LANDING_PAGE_RESTORED.md
│   ├── SECURITY_FIX_REPORT.md
│   ├── SUSPENSE_BOUNDARY_FIX.md
│   ├── category-expansion-summary.md
│   ├── financial-analysis.md
│   ├── india-learning-infrastructure.md
│   ├── phase-1-implementation-summary.md
│   ├── phase-4-summary.md
│   ├── platform-architecture.md
│   ├── platform-eligibility-challenges-solutions.md
│   ├── public-speaking-presentation-course.md
│   └── whitelabel-school-flow.md
│
├── Configuration Files
│   ├── package.json                        # NPM dependencies
│   ├── tsconfig.json                       # TypeScript config
│   ├── tsconfig.desktop.json               # Desktop TypeScript config
│   ├── tailwind.config.ts                  # Tailwind CSS config
│   ├── next.config.ts                      # Next.js config
│   ├── postcss.config.mjs                  # PostCSS config
│   ├── eslint.config.mjs                   # ESLint config
│   ├── components.json                     # Components config
│   ├── .env                                # Environment variables
│   ├── .env.desktop                        # Desktop environment
│   └── bun.lock                            # Bun lock file
│
├── Deployment Files
│   ├── docker-compose.yml                  # Full stack deployment
│   ├── Caddyfile                           # Caddy web server config
│   └── ...                                 # Other deployment files
│
└── Documentation
    ├── README.md                           # Main documentation
    ├── README-DESKTOP-SERVER.md            # Desktop-Server guide
    ├── IMPLEMENTATION_STATUS.md            # Implementation status
    └── workspace-docs/
        ├── README.md                       # Workspace documentation
        └── WORKSPACE_STRUCTURE.md          # This file
```

## Key Components

### 1. Desktop Application (Tauri)

The desktop application is built using Tauri 2.0, which combines a Rust backend with a web-based frontend rendered in a native WebView. This approach provides excellent performance while allowing developers to use familiar web technologies like React and TypeScript for the user interface. The desktop application is designed to run completely offline using SQLite as its database, making it ideal for environments with limited or no internet connectivity.

The Tauri configuration in `src-tauri/tauri.conf.json` defines application properties such as the window title, size, and security settings. The Rust backend in `src-tauri/src/` handles system-level operations such as file system access, notifications, and database connections. The Tauri commands defined in `commands.rs` expose these capabilities to the frontend, enabling features like local data persistence and system integration that are not available in the web version.

### 2. Server Application (Next.js)

The server application is built on Next.js 15, providing a modern React-based framework with server-side rendering, API routes, and optimized performance. The application can be deployed to any Node.js hosting environment and is designed to scale with the needs of the educational institution. PostgreSQL serves as the database for the server version, offering robust relational data management and support for complex queries.

Real-time functionality is provided through Socket.IO, enabling features like live notifications, real-time progress tracking, and interactive learning sessions. The server architecture follows best practices for security, including proper authentication with JWT tokens, encrypted data storage, and secure API endpoints that validate requests and prevent unauthorized access.

### 3. Database Layer (Prisma)

The database layer uses Prisma ORM to manage database operations in a type-safe manner. Two separate schema files are maintained to support the different database systems used by the desktop and server applications. The `schema.prisma` file defines the PostgreSQL schema for the server deployment, while `schema.sqlite.prisma` contains a simplified schema optimized for the desktop application's SQLite database.

The Prisma schemas include models for users, courses, categories, lessons, progress tracking, and other entities required for a comprehensive educational platform. Both schemas share common entities but may have slight differences in their relationships and constraints to accommodate the different database systems. Database migrations are handled through Prisma's migration system, ensuring consistent schema changes across different environments.

## Technology Stack

The platform is built using a carefully selected technology stack that balances performance, developer productivity, and maintainability. The frontend leverages React 19 and Next.js 15 with TypeScript for type-safe code and excellent developer tooling. Styling is handled through Tailwind CSS and shadcn/ui components, providing a modern and responsive user interface with minimal CSS overhead.

The desktop application uses Tauri 2.0, which provides native desktop capabilities through a combination of Rust and WebView. This approach results in significantly smaller application sizes compared to Electron-based solutions while maintaining cross-platform compatibility across Windows, macOS, and Linux. The server deployment utilizes Docker containers for consistent and reproducible deployments, with Docker Compose managing the multi-container setup including the Next.js application, PostgreSQL database, and Socket.IO server.

## Environment Configuration

### Desktop Environment Variables

The desktop application uses environment variables defined in `.env.desktop` to configure its behavior. The most important variable is `DATABASE_URL_SQLITE`, which specifies the path to the SQLite database file. Additional variables control features like offline storage limits, content caching, and application settings specific to the desktop environment.

### Server Environment Variables

The server application uses environment variables from `.env` to configure database connections, authentication, and other server-specific settings. The `DATABASE_URL` variable specifies the PostgreSQL connection string, while `JWT_SECRET` is used for authentication token generation and validation. Other variables control features like content storage paths, maximum offline storage limits, and application modes.

## Build Commands

The project includes a comprehensive set of npm scripts for building and running the application in different modes. The development server can be started with `npm run dev` for the web application or `npm run desktop:dev` for the Tauri desktop application. Production builds are created with `npm run build` for the web application and `npm run desktop:build` for creating desktop installers.

Docker deployments are managed through docker-compose commands. The command `docker-compose up -d` starts all services in detached mode, while `docker-compose down` stops and removes all containers. The Docker configuration includes health checks and restart policies to ensure reliable service availability.

## Quick Start

### Desktop Application Setup

To set up and run the desktop application, first install the required dependencies using `npm install` or `bun install`. Then install the Tauri CLI globally using `cargo install tauri-cli`. Once these prerequisites are complete, the desktop application can be started in development mode with the command `npm run desktop:dev`. This will launch both the Tauri window and any necessary backend services.

### Server Application Setup

For the server application, install dependencies and run `npm run dev` to start the Next.js development server. For production deployments, build the application with `npm run build` and then start it with `npm start`. To use Docker, ensure Docker and Docker Compose are installed, then run `docker-compose up -d` from the project root to start all services including the PostgreSQL database and Socket.IO server.

### Database Setup

The database schema is managed through Prisma. To initialize the database, run `npx prisma db push` to create the database schema based on the appropriate schema file. For development, use `npx prisma db push --schema prisma/schema.sqlite.prisma` for SQLite or `npx prisma db push --schema prisma/schema.prisma` for PostgreSQL. Database seeding can be done with `npx prisma db seed` to populate the database with initial data.
