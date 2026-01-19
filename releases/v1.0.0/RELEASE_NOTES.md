# INR99 Academy v1.0.0 - Initial Stable Release

## Overview

We are excited to announce the first stable release of INR99 Academy Desktop-Server School Platform! This comprehensive educational technology platform is designed to serve educational institutions with a powerful hybrid cloud-on-premise architecture.

## Key Features

### Educational Platform
- **Course Management**: Comprehensive course creation, delivery, and progress tracking
- **Assessment System**: Assessments, examinations, and grading capabilities
- **Attendance Tracking**: Class attendance management and reporting
- **Parent Engagement**: Dashboard for parents to monitor their children's progress
- **Multi-role Access**: Students, parents, instructors, and administrators

### Institutional Management
- **School Server Deployment**: On-premise server for complete operational control
- **Hybrid Architecture**: Cloud integration while maintaining local autonomy
- **Secure Sync Agent**: Encrypted data synchronization between school servers and cloud
- **License Management**: Machine-bound licensing for institutional deployments

### Desktop Applications
- **Windows**: Native MSI installer with full system integration
- **Linux**: DEB and RPM packages for major distributions
- **macOS**: DMG disk image with drag-and-drop installation
- **Cross-platform**: Consistent experience across all operating systems

## Installation

### Windows
1. Download `INR99_Academy_1.0.0_x64.msi`
2. Run the MSI installer as Administrator
3. Follow the installation wizard
4. Launch from Start Menu

### Linux (Debian/Ubuntu)
```bash
sudo apt install ./INR99_Academy_1.0.0_amd64.deb
```

### Linux (Fedora/RHEL)
```bash
sudo dnf install ./INR99_Academy-1.0.0.x86_64.rpm
```

### macOS
1. Download `INR99_Academy_1.0.0.dmg`
2. Open DMG and drag to Applications
3. Launch the application

## System Requirements

- **Windows**: Windows 10+ (64-bit), 4 GB RAM
- **Linux**: Ubuntu 20.04+ / Fedora 35+, 2 GB RAM
- **macOS**: macOS 11+, 4 GB RAM
- **Storage**: 200 MB minimum
- **Internet**: Required for activation and cloud sync

## Architecture

### Monorepo Structure
- **Cloud**: Central hub for subscription management and parent services
- **School**: On-premise server for institutional operations
- **Parent**: Web application for guardian engagement

### Shared Packages
- **Auth**: Authentication and session management
- **DB**: Database schemas and operations (Prisma)
- **Sync**: Secure synchronization agent (WebSocket + AES-256-GCM)
- **UI**: Reusable component library (shadcn/ui)
- **Utils**: Common utility functions

## Technology Stack

- **Frontend**: Next.js 14+ with React 19, TypeScript
- **Desktop**: Tauri 2.0 (Rust + WebView)
- **Database**: SQLite (local), PostgreSQL (cloud)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Deployment**: Docker and Docker Compose
- **Build System**: Turborepo

## Security Features

- Encrypted data transmission (AES-256-GCM)
- Machine binding for license validation
- Role-based access control (RBAC)
- Secure authentication with session management

## Documentation

- **Repository**: https://github.com/jitenkr2030/Desktop-Server-School-Platform
- **Wiki**: https://github.com/jitenkr2030/Desktop-Server-School-Platform/wiki
- **Issues**: https://github.com/jitenkr2030/Desktop-Server-School-Platform/issues
- **Discussions**: https://github.com/jitenkr2030/Desktop-Server-School-Platform/discussions

## What's Included

This release includes:
- ✅ Core educational platform
- ✅ Tauri desktop applications
- ✅ Docker deployment configurations
- ✅ GitHub Actions CI/CD pipeline
- ✅ Environment setup scripts
- ✅ Release automation tools
- ✅ Comprehensive documentation

## Roadmap

Upcoming features in v1.1.0:
- Mobile applications (iOS/Android)
- Enhanced analytics and reporting
- Additional integration modules
- Multi-language support
- Advanced assessment types

## Thank You

Thank you for using INR99 Academy! We look forward to your feedback and contributions.

---

**Release Date**: January 20, 2026
**Version**: 1.0.0
**License**: MIT
