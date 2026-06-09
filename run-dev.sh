#!/bin/bash

# CafeFlow Development Environment
# Runs db + redis in Docker, backend + frontend locally

set -e

ROOT_DIR="/home/dnx-xy/Developments/Cafe-R"
WORKSPACE_DIR="$ROOT_DIR/workspace"

log() { echo -e "\033[1;36m[INFO]\033[0m $1"; }
success() { echo -e "\033[1;32m[SUCCESS]\033[0m $1"; }
error() { echo -e "\033[1;31m[ERROR]\033[0m $1"; }

cleanup() {
  echo ""
  log "Stopping local dev servers..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  wait $BACKEND_PID 2>/dev/null || true
  wait $FRONTEND_PID 2>/dev/null || true
  success "Local servers stopped. Docker containers (db, redis) left running."
  log "Run 'docker compose -f $WORKSPACE_DIR/docker-compose.yml down' to stop them."
}

trap cleanup EXIT INT TERM

# Check dependencies
command -v docker &>/dev/null || { error "Docker not found"; exit 1; }
command -v npm &>/dev/null || { error "npm not found"; exit 1; }
docker info &>/dev/null || { error "Docker not running"; exit 1; }

wait_for_pg() {
  log "Waiting for PostgreSQL..."
  for i in $(seq 1 30); do
    if docker compose exec -T db pg_isready -U postgres &>/dev/null; then
      success "PostgreSQL is ready"
      return 0
    fi
    echo -n "."
    sleep 1
  done
  echo ""
  error "PostgreSQL did not become ready within 30s"
  return 1
}

wait_for_url() {
  local name="$1" url="$2" timeout="${3:-30}"
  log "Waiting for $name..."
  for i in $(seq 1 "$timeout"); do
    if curl -so /dev/null "$url" &>/dev/null; then
      success "$name is ready"
      return 0
    fi
    echo -n "."
    sleep 1
  done
  echo ""
  error "$name did not start within ${timeout}s"
  return 1
}

# Start Docker services
log "Starting database, redis, and WhatsApp gateway..."
cd "$WORKSPACE_DIR"
docker compose up -d db redis wa-gateway

# Wait for PostgreSQL to actually accept connections
wait_for_pg

# Start backend locally
log "Starting backend (port 3001)..."
cd "$WORKSPACE_DIR/backend"
WHATSAPP_GATEWAY_URL=http://localhost:3002 npm run start:dev &
BACKEND_PID=$!

wait_for_url "Backend" "http://localhost:3001" 45

# Start frontend locally
log "Starting frontend (port 3000)..."
cd "$WORKSPACE_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

wait_for_url "Frontend" "http://localhost:3000" 60

# Show status
echo ""
echo "==========================================="
echo "   CafeFlow Development Environment"
echo "==========================================="
echo "  Backend:  http://localhost:3001"
echo "  Frontend: http://localhost:3000"
echo "  DB:       localhost:5432"
echo "  Redis:    localhost:6379"
echo "  WhatsApp: http://localhost:3002 (wa-gateway)"
echo "==========================================="
echo "  Press Ctrl+C to stop"
echo ""

wait
