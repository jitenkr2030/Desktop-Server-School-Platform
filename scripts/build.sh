#!/bin/bash

# School Platform Build Script
# Builds both desktop and server applications

set -e

echo "=================================="
echo "School Platform Build Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check for required tools
check_dependencies() {
    echo ""
    echo "Checking dependencies..."
    
    if command -v node &> /dev/null; then
        print_status "Node.js is installed ($(node --version))"
    else
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if command -v npm &> /dev/null; then
        print_status "NPM is installed ($(npm --version))"
    else
        print_error "NPM is not installed"
        exit 1
    fi
    
    if command -v cargo &> /dev/null; then
        print_status "Rust/Cargo is installed ($(cargo --version))"
    else
        print_warning "Rust/Cargo is not installed (required for desktop build)"
        DESKTOP_BUILD=0
    fi
}

# Install dependencies
install_dependencies() {
    echo ""
    echo "Installing dependencies..."
    npm ci
    print_status "Dependencies installed"
}

# Build database
build_database() {
    echo ""
    echo "Building database..."
    
    # Generate Prisma client for PostgreSQL
    npm run db:generate
    print_status "Prisma client generated"
    
    # Generate SQLite schema if needed
    if [ -f prisma/schema.sqlite.prisma ]; then
        npm run db:sqlite:generate
        print_status "SQLite schema generated"
    fi
}

# Build web application
build_web() {
    echo ""
    echo "Building web application..."
    npm run build
    print_status "Web application built"
}

# Build desktop application
build_desktop() {
    if [ ! command -v cargo &> /dev/null ]; then
        print_warning "Skipping desktop build (Rust not installed)"
        return
    fi
    
    echo ""
    echo "Building desktop application..."
    
    # Build Next.js standalone bundle
    npm run build:standalone
    
    # Build Tauri application
    cargo tauri build
    
    print_status "Desktop application built"
    echo ""
    echo "Desktop installer available in: src-tauri/target/release/bundle/"
}

# Run tests
run_tests() {
    echo ""
    echo "Running tests..."
    npm test || print_warning "Some tests failed"
}

# Create distribution package
create_package() {
    echo ""
    echo "Creating distribution package..."
    
    mkdir -p dist
    cp -r .next/standalone-bundle dist/web
    cp -r src-tauri/target/release/bundle dist/desktop
    cp docker-compose.yml dist/
    cp Dockerfile dist/
    
    print_status "Distribution package created in dist/"
}

# Main build process
main() {
    echo "Starting build process..."
    
    DESKTOP_BUILD=1
    
    check_dependencies
    install_dependencies
    build_database
    
    read -p "Build web application? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        build_web
    fi
    
    if [[ $DESKTOP_BUILD == 1 ]]; then
        read -p "Build desktop application? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            build_desktop
        fi
    fi
    
    read -p "Run tests? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_tests
    fi
    
    read -p "Create distribution package? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        create_package
    fi
    
    echo ""
    echo "=================================="
    print_status "Build process completed!"
    echo "=================================="
}

# Run main function
main "$@"
