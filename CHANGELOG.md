# Changelog

All notable changes to the INR99 Academy Desktop-Server School Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release preparation
- Monorepo structure with Turborepo
- Three applications (cloud, school, parent)
- Five shared packages (auth, db, sync, ui, utils)
- Tauri desktop application support
- Docker deployment configurations

## [1.0.0] - 2026-01-20

### Added
- **Architecture**: Hybrid cloud-on-premise architecture for educational institutions
- **Multi-role System**: User roles for students, parents, instructors, and administrators
- **Course Management**: Comprehensive course creation, delivery, and progress tracking
- **Assessment System**: Assessments, examinations, and grading capabilities
- **Attendance Tracking**: Class attendance management and reporting
- **Sync Agent**: Secure data synchronization between school servers and cloud
- **Subscription Management**: Tier-based subscriptions with license management
- **Tauri Desktop**: Native desktop application for Windows, Linux, and macOS
- **Docker Support**: Containerized deployment for school servers

### Features
- Educational content delivery across multiple disciplines
- Real-time progress tracking and analytics
- Parent engagement and monitoring dashboard
- Institutional administration and management
- Revenue protection layer for subscription management
- Offline functionality for low-connectivity environments

### Technical
- Built with Next.js 14+ and React 19
- Tauri 2.0 for desktop applications
- Prisma ORM with SQLite and PostgreSQL support
- TypeScript with strict mode
- Tailwind CSS with shadcn/ui components
- Docker and Docker Compose for deployment
- WebSocket-based sync agent with AES-256-GCM encryption

### Security
- Encrypted data transmission between school servers and cloud
- Machine binding for license validation
- Role-based access control
- Secure authentication with session management

## Roadmap

### Upcoming Features (v1.1.0)
- Mobile application (iOS/Android)
- Enhanced analytics and reporting
- Additional integration modules
- Multi-language support
- Advanced assessment types

### Future Enhancements
- AI-powered learning recommendations
- Video conferencing integration
- Advanced proctoring capabilities
- Custom branding options
- API for third-party integrations

---

## How to Update This Changelog

When making changes, add entries in the following format:

```markdown
## [X.X.X] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Changed feature description

### Deprecated
- Deprecated feature description

### Removed
- Removed feature description

### Fixed
- Bug fix description

### Security
- Security improvement description
```

---

## Versioning Strategy

- **MAJOR**: Breaking changes that require user attention or data migration
- **MINOR**: New features and improvements in a backward-compatible manner
- **PATCH**: Bug fixes and security patches

## Release Channels

- **Stable**: Production-ready releases (latest MINOR.PATCH)
- **Beta**: Pre-release for testing (latest MINOR-rc)
- **Nightly**: Latest development build (main branch)

---

## Acknowledgments

Thank you to all contributors and users who have helped shape this platform!
