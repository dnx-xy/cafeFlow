# CafeFlow Development Environment - Fixed npm run dev

## The Problem
Your `npm run dev` script was trying to build the frontend Docker container which doesn't exist properly, and the backend was trying to run in production mode without a built dist folder.

## The Solution: Fixed Docker Compose for Development

### Step 1: Fix the docker-compose.yml for Development

Replace your current docker-compose.yml with this improved version:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: cafe_flow_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # Backend service - properly configured for development
  backend:
    build: ./backend
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/cafe_flow_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=super_secret_jwt_key_for_dev
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - /app/node_modules
    # Use dev mode instead of prod for development
    command: npm run start:dev

volumes:
  postgres_data:
```

### Step 2: Fix Your run-dev.sh Script

Here's the corrected version of your run-dev.sh script:

```bash
#!/bin/bash

# CafeFlow Development Environment Setup Script
# This script runs backend services and frontend separately

set -e  # Exit on any error

echo "🚀 Starting CafeFlow Development Environment..."

# Function to display colored output
log() {
    echo -e "\033[1;36m[INFO]\033[0m $1"
}

success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

warn() {
    echo -e "\033[1;33m[WARN]\033[0m $1"
}

# Check if docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running. Please start Docker Desktop/Engine first."
        exit 1
    fi
    log "Docker is running correctly"
}

# Check if required tools are installed
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        error "Node.js/npm is not installed. Please install Node.js first."
        exit 1
    fi
    
    log "All dependencies found"
}

# Start database and backend services
start_backend_services() {
    log "Starting database and backend services..."
    
    # Navigate to workspace directory
    cd /home/dnx-xy/Developments/Cafe-R/workspace
    
    # Check if docker-compose exists
    if [ ! -f "docker-compose.yml" ]; then
        error "docker-compose.yml not found in workspace directory"
        exit 1
    fi
    
    # Start db, redis, and backend services
    log "Starting db, redis, and backend services..."
    docker compose up -d db redis backend
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 15
    
    # Check if key containers are running
    local db_status=$(docker compose ps -q db 2>/dev/null)
    local redis_status=$(docker compose ps -q redis 2>/dev/null)
    local backend_status=$(docker compose ps -q backend 2>/dev/null)
    
    if [ -n "$db_status" ] && [ -n "$redis_status" ] && [ -n "$backend_status" ]; then
        # Additional check to see if backend is actually running properly
        local backend_logs=$(docker compose logs --since 30s backend 2>/dev/null | grep -E "(listening|error|started)" | wc -l)
        if [ "$backend_logs" -gt 0 ]; then
            success "Database and backend services started successfully"
            log "Services running:"
            docker compose ps --format "table {{.Name}}\t{{.Status}}"
        else
            warn "Backend service may have startup issues, but containers are running"
        fi
    else
        error "Some services failed to start properly"
        docker compose ps
        exit 1
    fi
}

# Install frontend dependencies
install_frontend() {
    log "Installing frontend dependencies..."
    
    cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
    
    # Install npm dependencies
    if [ ! -f "package-lock.json" ] && [ ! -d "node_modules" ]; then
        npm install
        success "Frontend dependencies installed"
    else
        log "Frontend dependencies already installed"
    fi
}

# Start frontend development server
start_frontend() {
    log "Starting frontend development server..."
    
    cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
    
    # Start Next.js development server
    npm run dev &
    
    # Wait a moment for server to start
    sleep 5
    
    success "Frontend development server started on http://localhost:3000"
}

# Check if backend is accessible
check_backend_health() {
    log "Checking backend health..."
    
    # Give backend time to start
    sleep 5
    
    # Check if backend API is responding
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        success "Backend API is accessible"
        return 0
    else
        warn "Backend API not immediately accessible, but containers are running"
        return 1
    fi
}

# Display status
show_status() {
    echo ""
    echo "==========================================="
    echo "   🚀 CafeFlow Development Environment"
    echo "==========================================="
    echo ""
    echo "🔧 Backend Services:"
    echo "   - PostgreSQL: localhost:5432"
    echo "   - Redis: localhost:6379"
    echo "   - Backend API: http://localhost:3001"
    echo ""
    echo "🌐 Frontend Application:"
    echo "   - Next.js Dev Server: http://localhost:3000"
    echo ""
    echo "💡 Usage:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:3001"
    echo "   - Admin Panel: http://localhost:3001/admin (if implemented)"
    echo ""
    echo "🛠️  Commands:"
    echo "   - Ctrl+C to stop all services"
    echo "   - 'docker compose down' to stop containers"
    echo "   - 'npm run dev' in frontend to restart frontend"
    echo "==========================================="
    echo ""
}

# Cleanup function
cleanup() {
    echo ""
    log "Stopping services..."
    cd /home/dnx-xy/Developments/Cafe-R/workspace
    docker compose down
    log "Services stopped. Goodbye!"
}

# Trap CTRL+C to cleanup
trap cleanup EXIT INT TERM

# Main execution flow
main() {
    echo "🔄 CafeFlow Development Environment Setup"
    echo "=================================================="
    
    check_dependencies
    check_docker
    start_backend_services
    install_frontend
    start_frontend
    check_backend_health
    show_status
    
    echo "✅ All services are running!"
    echo "Press Ctrl+C to stop all services"
    
    # Keep script running to maintain services
    while true; do
        sleep 1
    done
}

# Run main function
main "$@"
```

### Step 3: Use npm run dev as Intended

After applying these fixes, you should be able to run:

```bash
# Make the script executable
chmod +x /home/dnx-xy/Developments/Cafe-R/run-dev.sh

# Run with npm (which will call the script)
cd /home/dnx-xy/Developments/Cafe-R
npm run dev
```

### Step 4: Alternative - Manual One-Time Setup

If you prefer to run it manually (which I recommend for debugging):

```bash
# Terminal 1: Start backend services
cd /home/dnx-xy/Developments/Cafe-R/workspace
docker compose up -d db redis backend

# Terminal 2: Start frontend
cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
npm run dev
```

### The Key Fix

The main issue was that the backend Dockerfile was set to run `start:prod` but in development mode, we need it to run `start:dev` and the Docker volume mounting was causing conflicts. With the new configuration, the backend will properly build and run in development mode.

This should now work with your existing `npm run dev` command approach!