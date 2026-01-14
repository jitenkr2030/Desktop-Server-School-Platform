#!/bin/bash
# ============================================
# INR99 Academy - Health Check Script
# Container health verification
# ============================================

set -e

# ========================================
# Configuration
# ========================================
APP_HOST="localhost"
APP_PORT="${PORT:-3000}"
HEALTH_ENDPOINT="/health"
API_ENDPOINT="/api/health"
TIMEOUT=10

# ========================================
# Color Output
# ========================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ========================================
# Logging Functions
# ========================================
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ========================================
# Check Functions
# ========================================

# Check if port is listening
check_port() {
    if ss -tuln | grep -q ":${APP_PORT} "; then
        log_info "Port ${APP_PORT} is listening"
        return 0
    else
        log_error "Port ${APP_PORT} is not listening"
        return 1
    fi
}

# Check basic health endpoint
check_health_endpoint() {
    local response
    local http_code
    
    response=$(curl -sf -m "${TIMEOUT}" "http://${APP_HOST}:${APP_PORT}${HEALTH_ENDPOINT}" 2>&1) || true
    http_code=$(curl -sf -o /dev/null -w "%{http_code}" -m "${TIMEOUT}" "http://${APP_HOST}:${APP_PORT}${HEALTH_ENDPOINT}" 2>&1) || http_code="000"
    
    if [ "$http_code" = "200" ]; then
        log_info "Health endpoint returned: ${response}"
        return 0
    else
        log_error "Health endpoint failed with HTTP code: ${http_code}"
        log_error "Response: ${response}"
        return 1
    fi
}

# Check API health endpoint
check_api_endpoint() {
    local http_code
    
    http_code=$(curl -sf -o /dev/null -w "%{http_code}" -m "${TIMEOUT}" "http://${APP_HOST}:${APP_PORT}${API_ENDPOINT}" 2>&1) || http_code="000"
    
    if [ "$http_code" = "200" ]; then
        log_info "API health endpoint is responsive"
        return 0
    else
        log_warn "API health endpoint returned HTTP code: ${http_code}"
        return 1
    fi
}

# Check database connectivity
check_database() {
    # This requires the database to be accessible
    # For now, we check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        log_warn "DATABASE_URL not set, skipping database check"
        return 0
    fi
    
    # Simple check - try to query the database
    if command -v bun &> /dev/null && command -v prisma &> /dev/null; then
        if bunx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
            log_info "Database connection successful"
            return 0
        else
            log_error "Database connection failed"
            return 1
        fi
    else
        log_warn "Prisma not available, skipping database check"
        return 0
    fi
}

# Check disk space
check_disk_space() {
    local disk_usage
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -gt 90 ]; then
        log_error "Disk usage is critical: ${disk_usage}%"
        return 1
    elif [ "$disk_usage" -gt 80 ]; then
        log_warn "Disk usage is high: ${disk_usage}%"
        return 1
    else
        log_info "Disk usage is OK: ${disk_usage}%"
        return 0
    fi
}

# Check memory
check_memory() {
    local mem_available
    mem_available=$(free | grep Mem | awk '{print $7}')
    local mem_total
    mem_total=$(free | grep Mem | awk '{print $2}')
    local mem_percent=$(( (mem_total - mem_available) * 100 / mem_total ))
    
    if [ "$mem_percent" -gt 95 ]; then
        log_error "Memory usage is critical: ${mem_percent}%"
        return 1
    elif [ "$mem_percent" -gt 90 ]; then
        log_warn "Memory usage is high: ${mem_percent}%"
        return 1
    else
        log_info "Memory usage is OK: ${mem_percent}%"
        return 0
    fi
}

# ========================================
# Main Health Check
# ========================================

main() {
    log_info "Starting health check..."
    log_info "Environment: ${NODE_ENV:-unknown}"
    
    local exit_code=0
    
    # Run all checks
    check_port || exit_code=1
    check_disk_space || exit_code=1
    check_memory || exit_code=1
    check_health_endpoint || exit_code=1
    check_api_endpoint || exit_code=1
    check_database || exit_code=1
    
    if [ $exit_code -eq 0 ]; then
        log_info "Health check PASSED"
        exit 0
    else
        log_error "Health check FAILED"
        exit 1
    fi
}

# Run main function
main "$@"
