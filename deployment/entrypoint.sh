#!/bin/bash
# ============================================
# INR99 Academy - Container Entrypoint
# Application startup and initialization
# ============================================

set -e

# ========================================
# Configuration
# ========================================
APP_DIR="/app"
LOG_DIR="/app/logs"

# ========================================
# Logging Function
# ========================================
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] [${level}] ${message}"
}

# ========================================
# Signal Handlers
# ========================================
cleanup() {
    log "INFO" "Received shutdown signal, gracefully stopping..."
    # Allow ongoing requests to complete
    sleep 2
    log "INFO" "Shutdown complete"
    exit 0
}

trap cleanup SIGTERM SIGINT SIGHUP

# ========================================
# Pre-flight Checks
# ========================================
preflight_checks() {
    log "INFO" "Running pre-flight checks..."
    
    # Check database connectivity
    if [ -n "$DATABASE_URL" ]; then
        log "INFO" "Checking database connectivity..."
        max_retries=30
        retry_count=0
        
        while [ $retry_count -lt $max_retries ]; do
            if bunx prisma db execute --stdin <<< "SELECT 1" 2>/dev/null; then
                log "INFO" "Database connection successful"
                break
            fi
            
            retry_count=$((retry_count + 1))
            log "WARN" "Database not ready, waiting... (attempt ${retry_count}/${max_retries})"
            sleep 2
        done
        
        if [ $retry_count -eq $max_retries ]; then
            log "ERROR" "Database connection failed after ${max_retries} attempts"
            # Continue anyway - may be in degraded mode
        fi
    fi
    
    # Run database migrations
    log "INFO" "Running database migrations..."
    if bunx prisma migrate deploy 2>/dev/null; then
        log "INFO" "Database migrations completed"
    else
        log "WARN" "Database migrations failed or not required"
    fi
    
    # Seed database if needed (development only)
    if [ "$NODE_ENV" != "production" ] && [ -n "$SEED_SECRET" ]; then
        log "INFO" "Seeding database..."
        bun run db:seed 2>/dev/null || true
    fi
    
    log "INFO" "Pre-flight checks completed"
}

# ========================================
# Logging Configuration
# ========================================
setup_logging() {
    log "INFO" "Setting up logging..."
    
    # Create log directory
    mkdir -p "$LOG_DIR"
    chown -R bun:bun "$LOG_DIR"
    
    # Configure log rotation
    if command -v logrotate &> /dev/null; then
        cat > /etc/logrotate.d/inr99-app << EOF
$LOG_DIR/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 bun bun
    postrotate
        kill -HUP \$(cat /var/run/nginx.pid 2>/dev/null) 2>/dev/null || true
    endscript
}
EOF
    fi
    
    log "INFO" "Logging configured"
}

# ========================================
# Metrics Configuration
# ========================================
setup_metrics() {
    log "INFO" "Setting up metrics endpoint..."
    
    if [ "$ENABLE_METRICS" = "true" ]; then
        log "INFO" "Metrics endpoint enabled on /api/metrics"
    fi
}

# ========================================
# Main Application Start
# ========================================
start_application() {
    log "INFO" "Starting INR99 Academy application..."
    log "INFO" "Environment: ${NODE_ENV:-unknown}"
    log "INFO" "Version: ${VERSION:-development}"
    
    # Export Bun runtime configuration
    export Bun_runtime="${BUN_RUNTIME:-auto}"
    
    # Start the application
    exec bun .next/standalone/server.js
}

# ========================================
# Health Check Endpoint
# ========================================
healthcheck() {
    # Check if the server is responding
    if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
        exit 0
    else
        exit 1
    fi
}

# ========================================
# Command Router
# ========================================
case "${1:-start}" in
    start)
        preflight_checks
        setup_logging
        setup_metrics
        start_application
        ;;
    healthcheck)
        healthcheck
        ;;
    migrate)
        log "INFO" "Running database migrations..."
        bunx prisma migrate deploy
        ;;
    seed)
        log "INFO" "Seeding database..."
        bun run db:seed
        ;;
    shell)
        log "INFO" "Starting interactive shell..."
        exec bun repl
        ;;
    *)
        log "INFO" "Unknown command: $1, executing as bun script..."
        exec bun "$@"
        ;;
esac
