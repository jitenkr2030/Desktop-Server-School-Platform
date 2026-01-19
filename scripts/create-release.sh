#!/bin/bash

# ============================================================================
# INR99 Academy - Release Creation Script
# Creates, builds, packages, and publishes GitHub releases
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
REPO_OWNER="jitenkr2030"
REPO_NAME="Desktop-Server-School-Platform"
GITHUB_TOKEN="${GITHUB_TOKEN:-$PAT_TOKEN}"
VERSION="${1:-$(date +%Y.%-m.%-d)}"
RELEASE_DIR="releases/${VERSION}"
DRAFT_RELEASE=false
PRE_RELEASE=false
SKIP_BUILD=false
SKIP_UPLOAD=false

# Functions
print_step() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  STEP: $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Show help
show_help() {
    cat << EOF
INR99 Academy - Release Creation Script

Usage: $0 [OPTIONS] [VERSION]

Options:
  -v, --version VERSION    Specify version number (default: today's date)
  -b, --skip-build         Skip building, only upload existing artifacts
  -u, --skip-upload        Skip GitHub upload, only prepare artifacts
  -d, --draft              Create a draft release
  -p, --prerelease         Create a prerelease
  -h, --help               Show this help message

Environment Variables:
  GITHUB_TOKEN    GitHub Personal Access Token (required for upload)
  PAT_TOKEN       Alternative environment variable for GitHub token

Examples:
  $0                          # Release with today's date
  $0 v1.0.0                   # Release version 1.0.0
  $0 --skip-build v1.0.0      # Upload existing artifacts
  $0 --draft v1.0.0           # Create draft release

EOF
}

# Parse arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -v|--version)
                VERSION="$2"
                shift 2
                ;;
            -b|--skip-build)
                SKIP_BUILD=true
                shift
                ;;
            -u|--skip-upload)
                SKIP_UPLOAD=true
                shift
                ;;
            -d|--draft)
                DRAFT_RELEASE=true
                shift
                ;;
            -p|--prerelease)
                PRE_RELEASE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            -*)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
            *)
                VERSION="$1"
                shift
                ;;
        esac
    done
    
    # Ensure version has 'v' prefix
    if [[ ! "$VERSION" == v* ]]; then
        VERSION="v${VERSION}"
    fi
    
    print_info "Release version: $VERSION"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking Prerequisites"
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    print_success "Git is installed"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Run ./scripts/setup-env.sh first."
        exit 1
    fi
    print_success "Node.js is installed: $(node --version)"
    
    # Check Rust
    if ! command -v cargo &> /dev/null; then
        print_error "Rust toolchain is not installed. Run ./scripts/setup-env.sh first."
        exit 1
    fi
    print_success "Rust is installed: $(cargo --version)"
    
    # Check GitHub CLI
    if command -v gh &> /dev/null; then
        print_success "GitHub CLI is installed"
        GH_CLI_AVAILABLE=true
        
        # Check authentication
        if ! gh auth status &> /dev/null; then
            print_warning "GitHub CLI not authenticated. Will use API."
            GH_CLI_AVAILABLE=false
        fi
    else
        print_warning "GitHub CLI not found. Will use API."
        GH_CLI_AVAILABLE=false
    fi
    
    # Check GitHub token
    if [ -z "$GITHUB_TOKEN" ] && [ -z "$PAT_TOKEN" ]; then
        print_warning "GitHub token not set. Set GITHUB_TOKEN or PAT_TOKEN env variable."
        print_warning "Upload will fail without a token."
    else
        [ -n "$GITHUB_TOKEN" ] && print_success "GitHub token configured" || print_success "PAT_TOKEN configured"
    fi
}

# Update version numbers
update_versions() {
    print_step "Updating Version Numbers to $VERSION"
    
    # Update package.json
    if [ -f "package.json" ]; then
        sed -i "s/\"version\": \"[0-9.]*\"/\"version\": \"${VERSION#v}\"/" package.json
        print_success "Updated package.json"
    fi
    
    # Update Cargo.toml
    if [ -f "src-tauri/Cargo.toml" ]; then
        sed -i "s/^version = \"[0-9.]*\"/version = \"${VERSION#v}\"/" src-tauri/Cargo.toml
        print_success "Updated src-tauri/Cargo.toml"
    fi
    
    # Update tauri.conf.json
    if [ -f "src-tauri/tauri.conf.json" ]; then
        sed -i "s/\"version\": \"[0-9.]*\"/\"version\": \"${VERSION#v}\"/" src-tauri/tauri.conf.json
        print_success "Updated src-tauri/tauri.conf.json"
    fi
}

# Build the application
build_app() {
    if [ "$SKIP_BUILD" = true ]; then
        print_step "Skipping Build (--skip-build flag set)"
        return
    fi
    
    print_step "Building Application for $VERSION"
    
    # Create release directory
    mkdir -p "$RELEASE_DIR"
    
    # Build Next.js frontend
    print_info "Building Next.js frontend..."
    npm run build
    print_success "Next.js build complete"
    
    # Determine platform and build
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_info "Building for Linux..."
        cd src-tauri
        cargo build --release --target x86_64-unknown-linux-gnu
        cd ..
        npm run desktop:build -- --bundles deb
        print_success "Linux build complete"
        
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_info "Building for macOS..."
        cd src-tauri
        cargo build --release --target x86_64-apple-darwin
        cargo build --release --target aarch64-apple-darwin
        cd ..
        npm run desktop:build -- --bundles dmg
        print_success "macOS build complete"
        
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        print_info "Building for Windows..."
        npm run desktop:build -- --bundles msi
        print_success "Windows build complete"
        
    else
        print_warning "Unknown platform. Building for current platform..."
        npm run desktop:build
    fi
    
    # Copy artifacts to release directory
    print_info "Copying artifacts to $RELEASE_DIR..."
    find src-tauri/target/release/bundle -type f \( -name "*.deb" -o -name "*.rpm" -o -name "*.AppImage" -o -name "*.dmg" -o -name "*.pkg" -o -name "*.msi" -o -name "*.exe" \) -exec cp {} "$RELEASE_DIR/" \; 2>/dev/null || true
    
    # List artifacts
    if [ -d "$RELEASE_DIR" ]; then
        print_success "Artifacts in $RELEASE_DIR:"
        ls -lh "$RELEASE_DIR/"
    fi
}

# Generate checksums
generate_checksums() {
    print_step "Generating Checksums"
    
    if [ ! -d "$RELEASE_DIR" ]; then
        print_error "Release directory not found: $RELEASE_DIR"
        return
    fi
    
    cd "$RELEASE_DIR"
    
    # Generate SHA256 checksums
    print_info "Generating SHA256 checksums..."
    echo "# INR99 Academy $VERSION Checksums" > SHA256SUMS.txt
    echo "# Generated: $(date)" >> SHA256SUMS.txt
    echo "" >> SHA256SUMS.txt
    shasum -a 256 * > SHA256SUMS.txt
    print_success "Generated SHA256SUMS.txt"
    
    # Generate MD5 checksums (legacy support)
    if command -v md5sum &> /dev/null; then
        print_info "Generating MD5 checksums..."
        echo "# INR99 Academy $VERSION MD5 Checksums" > MD5SUMS.txt
        echo "# Generated: $(date)" >> MD5SUMS.txt
        echo "" >> MD5SUMS.txt
        md5sum * >> MD5SUMS.txt
        print_success "Generated MD5SUMS.txt"
    fi
    
    # Display checksums
    echo ""
    cat SHA256SUMS.txt
    
    cd - > /dev/null
}

# Create release notes
create_release_notes() {
    print_step "Creating Release Notes"
    
    # Get recent changes from git
    CHANGES=$(git log --oneline --since="2 weeks ago" 2>/dev/null | head -20 || echo "See changelog for details")
    
    # Create release notes
    cat > "$RELEASE_DIR/RELEASE_NOTES.md" << EOF
# INR99 Academy $VERSION Release Notes

## Overview

**INR99 Academy Desktop-Server School Platform v${VERSION}**

This is a release of the INR99 Academy educational platform, featuring comprehensive course management, assessment systems, and hybrid cloud-on-premise architecture for educational institutions.

## What's New

### Features
- Hybrid cloud-on-premise architecture
- Multi-role user system (students, parents, instructors, admins)
- Comprehensive course management and delivery
- Assessment and examination system
- Attendance tracking and class management
- Secure sync agent for data synchronization
- Subscription and license management

### Improvements
- Performance optimizations
- Bug fixes and stability improvements
- Enhanced security
- Better cross-platform support

## Installation

### Windows
1. Download \`INR99_Academy_${VERSION#v}_x64.msi\`
2. Run the installer as Administrator
3. Launch from Start Menu

### Linux (Debian/Ubuntu)
\`\`\`bash
sudo apt install ./INR99_Academy_${VERSION#v}_amd64.deb
\`\`\`

### Linux (Fedora/RHEL)
\`\`\`bash
sudo dnf install ./INR99_Academy-${VERSION#v}.x86_64.rpm
\`\`\`

### macOS
1. Download \`INR99_Academy_${VERSION#v}.dmg\`
2. Open DMG and drag to Applications
3. Launch the application

## System Requirements

- **Windows**: Windows 10+ (64-bit)
- **Linux**: Ubuntu 20.04+ / Fedora 35+
- **macOS**: macOS 11+
- **Memory**: 2-4 GB RAM recommended
- **Storage**: 200 MB minimum

## Recent Changes

\`\`\`
$CHANGES
\`\`\`

## Full Changelog

See [CHANGELOG.md](https://github.com/$REPO_OWNER/$REPO_NAME/blob/main/CHANGELOG.md)

## Support

- **Issues**: https://github.com/$REPO_OWNER/$REPO_NAME/issues
- **Wiki**: https://github.com/$REPO_OWNER/$REPO_NAME/wiki
- **Discussions**: https://github.com/$REPO_OWNER/$REPO_NAME/discussions

## Download Checksums

SHA256 checksums are available in SHA256SUMS.txt

## Thank You

Thank you for using INR99 Academy!
EOF
    
    print_success "Created RELEASE_NOTES.md"
}

# Create git tag
create_git_tag() {
    print_step "Creating Git Tag $VERSION"
    
    # Commit version changes if any
    if [[ $(git status --porcelain) ]]; then
        print_info "Committing version changes..."
        git add -A
        git commit -m "Release $VERSION"
        print_success "Committed changes"
    fi
    
    # Create tag
    print_info "Creating tag $VERSION..."
    git tag -a "$VERSION" -m "Release $VERSION"
    print_success "Created tag $VERSION"
    
    # Push tag
    print_info "Pushing tag to GitHub..."
    git push origin "$VERSION"
    print_success "Tag pushed to GitHub"
}

# Upload to GitHub
upload_to_github() {
    if [ "$SKIP_UPLOAD" = true ]; then
        print_step "Skipping GitHub Upload (--skip-upload flag set)"
        print_info "Artifacts are ready in $RELEASE_DIR/"
        print_info "To upload manually, run: gh release create $VERSION $RELEASE_DIR/*"
        return
    fi
    
    print_step "Uploading to GitHub"
    
    # Check token
    if [ -z "$GITHUB_TOKEN" ] && [ -z "$PAT_TOKEN" ]; then
        print_error "GitHub token not set. Cannot upload."
        print_info "Set GITHUB_TOKEN or PAT_TOKEN environment variable."
        return
    fi
    
    TOKEN="${GITHUB_TOKEN:-$PAT_TOKEN}"
    
    # Create release using GitHub API
    print_info "Creating release $VERSION..."
    
    RESPONSE=$(curl -s -X POST \
        -H "Authorization: token $TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases" \
        -d "{
            \"tag_name\": \"$VERSION\",
            \"name\": \"INR99 Academy $VERSION\",
            \"body_file\": \"$RELEASE_DIR/RELEASE_NOTES.md\",
            \"draft\": $DRAFT_RELEASE,
            \"prerelease\": $PRE_RELEASE,
            \"generate_release_notes\": true
        }")
    
    # Extract release ID
    RELEASE_ID=$(echo $RESPONSE | grep -o '"id": [0-9]*' | head -1 | grep -o '[0-9]*')
    
    if [ -z "$RELEASE_ID" ]; then
        print_error "Failed to create release"
        echo "$RESPONSE"
        return
    fi
    
    print_success "Release created with ID: $RELEASE_ID"
    
    # Upload assets
    print_info "Uploading assets..."
    
    for file in "$RELEASE_DIR"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            filesize=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            
            print_info "Uploading $filename ($filesize bytes)..."
            
            curl -s -X POST \
                -H "Authorization: token $TOKEN" \
                --data-binary @"$file" \
                "https://uploads.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/$RELEASE_ID/assets?name=$filename" \
                -H "Content-Type: application/octet-stream" \
                -o /dev/null
            
            print_success "Uploaded $filename"
        fi
    done
    
    # Print release URL
    RELEASE_URL=$(echo $RESPONSE | grep -o '"html_url": "[^"]*"' | grep -o 'https://[^"]*')
    echo ""
    print_success "========================================"
    print_success "  Release Created Successfully!"
    print_success "========================================"
    echo ""
    print_info "Release URL: $RELEASE_URL"
    echo ""
}

# Final summary
print_final_summary() {
    echo ""
    echo "========================================"
    echo "  Release Process Complete!"
    echo "========================================"
    echo ""
    echo "Version: $VERSION"
    echo "Artifacts: $RELEASE_DIR/"
    echo ""
    echo "Next steps:"
    echo "1. Review the release on GitHub"
    echo "2. Announce the release to users"
    echo "3. Update documentation if needed"
    echo ""
    print_success "Happy coding!"
}

# Main function
main() {
    echo "========================================"
    echo "  INR99 Academy Release Script"
    echo "  Version: $VERSION"
    echo "========================================"
    
    parse_args "$@"
    check_prerequisites
    update_versions
    build_app
    generate_checksums
    create_release_notes
    create_git_tag
    upload_to_github
    print_final_summary
}

# Run main function
main "$@"
