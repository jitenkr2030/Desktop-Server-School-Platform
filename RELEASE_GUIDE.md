# INR99 Academy Release Guide

This document provides comprehensive instructions for creating, building, packaging, and publishing GitHub releases for the INR99 Academy Desktop-Server School Platform.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Environment Setup](#environment-setup)
5. [Building Applications](#building-applications)
6. [Creating Releases](#creating-releases)
7. [Automated CI/CD](#automated-cicd)
8. [Manual Release Process](#manual-release-process)
9. [Troubleshooting](#troubleshooting)

## Overview

The INR99 Academy platform uses a sophisticated release system that supports multiple operating systems and deployment scenarios. The release infrastructure includes:

- **GitHub Actions Workflow**: Automated multi-platform builds for Windows, Linux, and macOS
- **Build Scripts**: Automated environment setup and application building
- **Release Scripts**: One-command release creation and publishing
- **Package Formats**: DEB, RPM, MSI, DMG, and AppImage support

## Prerequisites

### Required Tools

Before creating releases, ensure the following tools are installed:

- **Git**: Version control (https://git-scm.com/)
- **Node.js**: Version 18 or later (https://nodejs.org/)
- **Rust Toolchain**: Latest stable version (https://rustup.rs/)
- **GitHub CLI**: For release management (https://cli.github.com/)

### Platform-Specific Requirements

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y build-essential libwebkit2gtk-4.1-dev \
  libappindicator3-dev libssl-dev libsqlite3-dev
```

**Windows:**
- WebView2 Runtime (https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
- WiX Toolset (https://wixtoolset.org/)

**macOS:**
- Xcode Command Line Tools: `xcode-select --install`
- Homebrew (recommended): https://brew.sh/

## Quick Start

### Option 1: Automated Release (Recommended)

```bash
# 1. Set GitHub token
export GITHUB_TOKEN="your-github-token"

# 2. Run the release script
./scripts/create-release.sh v1.0.0
```

This will:
- Update version numbers
- Build applications for your current platform
- Generate checksums
- Create git tag
- Publish to GitHub

### Option 2: GitHub Actions (Multi-Platform)

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0
```

This triggers the GitHub Actions workflow that builds for all platforms and creates a release automatically.

## Environment Setup

### Automated Setup

Run the setup script to prepare your environment:

```bash
# Make executable (Linux/macOS)
chmod +x scripts/setup-env.sh

# Run setup
./scripts/setup-env.sh
```

This script:
- Detects your operating system
- Installs required dependencies
- Configures Rust toolchain
- Installs Node.js packages
- Generates Prisma client
- Fetches Rust dependencies

### Manual Setup

If you prefer manual setup:

```bash
# Install Node.js dependencies
npm install

# Generate Prisma client
npx prisma generate

# Fetch Rust dependencies
cd src-tauri
cargo fetch
cd ..
```

## Building Applications

### Build All Platforms

To build for all platforms, use GitHub Actions:

```bash
# Push a tag to trigger multi-platform builds
git tag v1.0.0
git push origin v1.0.0
```

### Build Locally

#### Linux Build

```bash
# Build Next.js
npm run build

# Build Tauri for Linux
cd src-tauri
cargo build --release --target x86_64-unknown-linux-gnu
cd ..

# Create DEB package
npm run desktop:build -- --bundles deb
```

Output: `src-tauri/target/release/bundle/deb/*.deb`

#### Windows Build

```powershell
# Build Next.js
npm run build

# Create MSI package
npm run desktop:build -- --bundles msi
```

Output: `src-tauri\target\release\bundle\msi\*.msi`

#### macOS Build

```bash
# Build Next.js
npm run build

# Create DMG package
npm run desktop:build -- --bundles dmg
```

Output: `src-tauri/target/release/bundle/dmg/*.dmg`

## Creating Releases

### Automatic Release Creation

The easiest way to create a release:

```bash
# Set your GitHub token
export GITHUB_TOKEN="ghp_your-token-here"

# Run the release script
./scripts/create-release.sh v1.0.0
```

Options:
- `--skip-build`: Skip building, only upload existing artifacts
- `--skip-upload`: Prepare artifacts without uploading
- `--draft`: Create a draft release
- `--prerelease`: Mark as prerelease

### Manual GitHub Release

If you prefer manual control:

1. **Create the release on GitHub:**
   ```bash
   gh release create v1.0.0 \
     --title "INR99 Academy v1.0.0" \
     --notes "Release notes here" \
     ./path/to/artifacts/*
   ```

2. **Or use the API:**
   ```bash
   curl -X POST \
     -H "Authorization: token $GITHUB_TOKEN" \
     "https://api.github.com/repos/jitenkr2030/Desktop-Server-School-Platform/releases" \
     -d '{"tag_name":"v1.0.0","name":"INR99 Academy v1.0.0","body":"Notes","draft":false}'
   ```

## Automated CI/CD

### GitHub Actions Workflow

The `.github/workflows/release.yml` file defines the CI/CD pipeline:

**Trigger:** Push to tags matching `v*` (e.g., `v1.0.0`)

**Jobs:**
1. **linux-build**: Builds DEB, RPM, and AppImage packages
2. **windows-build**: Builds MSI installer
3. **macos-build**: Builds DMG disk image
4. **create-release**: Aggregates artifacts and creates GitHub release

### Required Secrets

For production releases, configure these secrets in GitHub:

- `TAURI_SIGNING_PRIVATE_KEY`: Code signing key (Windows)
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: Key password (Windows)
- `TAURI_SIGNING_CERTIFICATE`: Apple signing certificate (macOS)
- `TAURI_SIGNING_CERTIFICATE_PASSWORD`: Certificate password (macOS)
- `TAURI_NOTARIZE_API_KEY`: Notarization API key (macOS)

### Configure Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the required secrets

## Manual Release Process

### Step 1: Update Version Numbers

```bash
# Update version in package.json
sed -i 's/"version": ".*"/"version": "1.0.0"/' package.json

# Update version in Cargo.toml
sed -i 's/^version = ".*"/version = "1.0.0"/' src-tauri/Cargo.toml

# Update version in tauri.conf.json
sed -i 's/"version": ".*"/"version": "1.0.0"/' src-tauri/tauri.conf.json

# Commit changes
git add -A
git commit -m "Bump version to 1.0.0"
```

### Step 2: Build Artifacts

Build for each platform as described in the [Building Applications](#building-applications) section.

### Step 3: Generate Checksums

```bash
# Create checksums
cd path/to/artifacts
shasum -a 256 * > SHA256SUMS.txt
md5sum * > MD5SUMS.txt
```

### Step 4: Create Release

```bash
# Create git tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Upload artifacts
gh release create v1.0.0 \
  --title "INR99 Academy v1.0.0" \
  --notes "See CHANGELOG.md" \
  ./*.msi ./*.deb ./*.rpm ./*.dmg SHA256SUMS.txt
```

### Step 5: Verify Release

```bash
# Check release was created
gh release view v1.0.0

# List assets
gh release view v1.0.0 --json assets
```

## Troubleshooting

### Build Failures

**Error: Missing webkit2gtk**
```bash
# Ubuntu/Debian
sudo apt-get install libwebkit2gtk-4.1-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel
```

**Error: Node.js not found**
Ensure Node.js 18+ is installed and in your PATH.

**Error: Cargo not found**
Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`

### Upload Failures

**Error: Authentication failed**
- Verify your GitHub token has `repo` scope
- Ensure the token is set: `export GITHUB_TOKEN="your-token"`

**Error: File too large**
GitHub has a 2GB limit per asset. Split large files if necessary.

### Release Not Triggering

**Workflow not running:**
- Ensure you pushed a tag, not just a commit
- Check workflow syntax is valid: `yamllint .github/workflows/release.yml`
- Verify GitHub Actions are enabled in repository settings

## Best Practices

1. **Version Numbering**: Follow semantic versioning (MAJOR.MINOR.PATCH)
2. **Release Notes**: Include installation instructions and known issues
3. **Testing**: Test builds on each platform before releasing
4. **Security**: Use code signing for production releases
5. **Backup**: Keep local backups of build artifacts

## Support

- **Issues**: https://github.com/jitenkr2030/Desktop-Server-School-Platform/issues
- **Wiki**: https://github.com/jitenkr2030/Desktop-Server-School-Platform/wiki
- **Discussions**: https://github.com/jitenkr2030/Desktop-Server-School-Platform/discussions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
