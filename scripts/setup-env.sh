#!/bin/bash

# ============================================================================
# INR99 Academy - Environment Setup Script
# This script prepares the system for building the INR99 Academy desktop app
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Detect OS
detect_os() {
    print_info "Detecting operating system..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            source /etc/os-release
            OS_NAME="$NAME"
            OS_VERSION="$VERSION"
        else
            OS_NAME="Linux"
            OS_VERSION="Unknown"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS_NAME="macOS"
        OS_VERSION=$(sw_vers -productVersion 2>/dev/null || echo "Unknown")
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
        OS_NAME="Windows"
        OS_VERSION=$(wmic os get Version 2>/dev/null | grep -o '[0-9.]*' || echo "Unknown")
    else
        OS_NAME="Unknown"
        OS_VERSION="Unknown"
    fi
    
    print_success "Detected: $OS_NAME $OS_VERSION"
}

# Check and install Node.js
check_nodejs() {
    print_info "Checking Node.js..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js already installed: $NODE_VERSION"
        
        # Check version
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 18 ]; then
            print_warning "Node.js version is below 18. Consider updating to Node.js 18+"
        fi
    else
        print_warning "Node.js not found. Installing..."
        install_nodejs
    fi
}

# Install Node.js
install_nodejs() {
    print_info "Installing Node.js..."
    
    if [[ "$OS_NAME" == "Ubuntu" ]] || [[ "$OS_NAME" == "Debian" ]]; then
        # Install NodeSource repository
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OS_NAME" == "Fedora" ]] || [[ "$OS_NAME" == "Red Hat" ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo dnf install -y nodejs
    elif [[ "$OS_NAME" == "macOS" ]]; then
        if command -v brew &> /dev/null; then
            brew install node@20
        else
            print_error "Homebrew not found. Please install Node.js manually from https://nodejs.org/"
            exit 1
        fi
    else
        print_error "Unsupported OS for automated Node.js installation"
        print_info "Please install Node.js 18+ manually from https://nodejs.org/"
        exit 1
    fi
    
    print_success "Node.js installed successfully"
}

# Check and install Rust
check_rust() {
    print_info "Checking Rust toolchain..."
    
    if command -v cargo &> /dev/null; then
        RUST_VERSION=$(rustc --version)
        print_success "Rust toolchain already installed: $RUST_VERSION"
    else
        print_warning "Rust not found. Installing..."
        install_rust
    fi
}

# Install Rust
install_rust() {
    print_info "Installing Rust toolchain..."
    
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
    
    # Source cargo
    source "$HOME/.cargo/env" || source /root/.cargo/env
    
    print_success "Rust toolchain installed successfully"
}

# Install Linux-specific dependencies
install_linux_deps() {
    print_info "Installing Linux-specific dependencies..."
    
    if [[ "$OS_NAME" == "Ubuntu" ]] || [[ "$OS_NAME" == "Debian" ]] || [[ "$OS_NAME" == "Linux Mint" ]]; then
        sudo apt-get update
        sudo apt-get install -y \
            build-essential \
            curl \
            wget \
            file \
            libssl-dev \
            libgtk-3-dev \
            libnotify-dev \
            libappindicator3-dev \
            librsvg2-dev \
            libwebkit2gtk-4.1-dev \
            libsoup-3.0-dev \
            libsqlite3-dev \
            libxss-dev \
            libxtst-dev \
            libasound2-dev \
            libatspi2.0-dev \
            libnss3
    elif [[ "$OS_NAME" == "Fedora" ]] || [[ "$OS_NAME" == "Red Hat" ]] || [[ "$OS_NAME" == "CentOS" ]]; then
        sudo dnf install -y \
            gcc \
            gcc-c++ \
            make \
            curl \
            wget \
            file \
            openssl-devel \
            gtk3-devel \
            libappindicator-gtk3-devel \
            librsvg-devel \
            webkit2gtk4.1-devel \
            libsoup-devel \
            sqlite-devel \
            libXcomposite-devel \
            libXdamage-devel \
            libXrandr-devel \
            libXfixes-devel \
            libX11-devel \
            libXi-devel \
            libXcursor-devel \
            libXext-devel \
            at-spi2-atk-devel \
            nss
    elif [[ "$OS_NAME" == "Arch" ]] || [[ "$OS_NAME" == "Manjaro" ]]; then
        sudo pacman -S --noconfirm \
            base-devel \
            curl \
            wget \
            file \
            openssl \
            gtk3 \
            libappindicator-gtk3 \
            librsvg \
            webkit2gtk \
            libsoup \
            sqlite \
            libxcomposite \
            libxdamage \
            libxrandr \
            libxfixes \
            libx11 \
            libxi \
            libxcursor \
            libxext \
            at-spi2-atk \
            nss
    else
        print_warning "Unknown Linux distribution. Please install dependencies manually."
        print_info "Required packages: webkit2gtk, libappindicator, libssl-dev, build-essential"
    fi
    
    print_success "Linux dependencies installed"
}

# Install macOS-specific dependencies
install_macos_deps() {
    print_info "Installing macOS-specific dependencies..."
    
    if ! command -v xcode-select &> /dev/null; then
        print_error "Xcode Command Line Tools not found."
        print_info "Please run: xcode-select --install"
        exit 1
    fi
    
    # Install Homebrew if not present
    if ! command -v brew &> /dev/null; then
        print_info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    print_success "macOS dependencies ready"
}

# Install Windows-specific dependencies
install_windows_deps() {
    print_info "Checking Windows-specific dependencies..."
    
    # Check for WebView2
    if [ -f "$LOCALAPPDATA\Microsoft\WebView2\Core\1.0" ] || [ -d "$PROGRAMFILES(x86)\Microsoft\Edge\Application" ]; then
        print_success "WebView2 runtime found"
    else
        print_warning "WebView2 runtime not found. Please install from:"
        print_info "https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download"
    fi
    
    # Check for WiX (for MSI builds)
    if command -v candle &> /dev/null; then
        print_success "WiX Toolset found"
    else
        print_warning "WiX Toolset not found. MSI builds may not work."
        print_info "Install from: https://wixtoolset.org/"
    fi
    
    print_success "Windows dependencies check complete"
}

# Install Node.js dependencies
install_node_deps() {
    print_info "Installing Node.js dependencies..."
    
    if [ -f "package.json" ]; then
        npm ci
        print_success "Node.js dependencies installed"
    else
        print_error "package.json not found!"
        exit 1
    fi
}

# Generate Prisma client
generate_prisma() {
    print_info "Generating Prisma client..."
    
    if [ -f "prisma/schema.prisma" ] || [ -f "prisma/schema.sqlite.prisma" ]; then
        npx prisma generate
        print_success "Prisma client generated"
    else
        print_warning "Prisma schema not found. Skipping..."
    fi
}

# Fetch Rust dependencies
fetch_rust_deps() {
    print_info "Fetching Rust dependencies..."
    
    if [ -f "src-tauri/Cargo.toml" ]; then
        cd src-tauri
        cargo fetch
        cd ..
        print_success "Rust dependencies fetched"
    else
        print_warning "src-tauri/Cargo.toml not found. Skipping..."
    fi
}

# Verify installation
verify_installation() {
    print_info "Verifying installation..."
    
    ERRORS=0
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js not working"
        ((ERRORS++))
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm not working"
        ((ERRORS++))
    fi
    
    # Check Rust
    if ! command -v cargo &> /dev/null; then
        print_error "Cargo not working"
        ((ERRORS++))
    fi
    
    # Check tauri-cli
    if ! command -v tauri &> /dev/null; then
        print_warning "Tauri CLI not found. Installing..."
        cargo install tauri-cli
    fi
    
    if [ $ERRORS -eq 0 ]; then
        print_success "All tools verified successfully!"
    else
        print_error "$ERRORS verification(s) failed"
        exit 1
    fi
}

# Print summary
print_summary() {
    echo ""
    echo "========================================"
    echo "  Environment Setup Complete!"
    echo "========================================"
    echo ""
    echo "System: $OS_NAME $OS_VERSION"
    echo ""
    echo "Next steps:"
    echo "1. Build the application:"
    echo "   npm run build"
    echo "   cd src-tauri && cargo build --release"
    echo ""
    echo "2. For local development:"
    echo "   npm run desktop:dev"
    echo ""
    echo "3. For production build:"
    echo "   npm run desktop:build"
    echo ""
    echo "4. To create a release:"
    echo "   ./scripts/create-release.sh v1.0.0"
    echo ""
    print_success "Happy coding!"
}

# Main function
main() {
    echo "========================================"
    echo "  INR99 Academy - Environment Setup"
    echo "========================================"
    echo ""
    
    detect_os
    
    # OS-specific setup
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        install_linux_deps
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        install_macos_deps
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        install_windows_deps
    fi
    
    check_nodejs
    check_rust
    
    # Project setup
    install_node_deps
    generate_prisma
    fetch_rust_deps
    
    verify_installation
    print_summary
}

# Run main function
main "$@"
