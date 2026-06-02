# CafeFlow Development Environment

## Quick Start Guide

### Prerequisites
- Docker Desktop/Engine installed and running
- Node.js 18+ installed
- npm 8+ installed

### Running the Development Environment

**Method 1: Manual Setup (Recommended)**
```bash
# Terminal 1: Start backend services
cd /home/dnx-xy/Developments/Cafe-R/workspace
docker compose up -d db redis backend

# Terminal 2: Start frontend
cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
npm run dev
```

**Method 2: Using the provided scripts**
```bash
# Install dependencies (one-time)
cd /home/dnx-xy/Developments/Cafe-R
npm install

# Start everything with one command (will run for 30 seconds then stop)
# This is for demonstration - in practice, use the manual approach above
./run-dev.sh
```

### Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432 (postgres/password)
- **Redis**: localhost:6379

### Useful Commands
```bash
# Stop all services
docker compose down

# View running containers
docker compose ps

# View backend logs
docker compose logs backend

# Rebuild backend
docker compose build backend
docker compose up -d backend
```

## What's Running

### Backend Services
- **PostgreSQL**: Database for all application data
- **Redis**: Cache and session storage
- **NestJS API**: Backend REST API server

### Frontend Application
- **Next.js**: React-based frontend with SSR support
- **Tailwind CSS**: Styling framework
- **shadcn/ui**: Component library

## Troubleshooting

### If Backend Services Don't Start
1. Make sure Docker is running
2. Check if ports are already in use:
   ```bash
   lsof -i :5432  # PostgreSQL
   lsof -i :6379  # Redis
   lsof -i :3001  # Backend API
   ```

### If Frontend Doesn't Start
1. Ensure Node.js and npm are installed
2. Install dependencies:
   ```bash
   cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
   npm install
   ```

### Common Issues
1. **Port conflicts**: Stop other applications using those ports
2. **Docker permissions**: Run with sudo if needed (not recommended for regular use)
3. **Network issues**: Restart Docker Desktop

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│  (Next.js)      │◄──►│  (NestJS)       │
│                 │    │                 │
│  http://3000    │    │  http://3001    │
└─────────────────┘    └─────────────────┘
        │                       │
        └───────────────────────┘
                   │
        ┌─────────────────┐
        │   Database      │
        │  (PostgreSQL)   │
        │                 │
        │  http://5432    │
        └─────────────────┘
                   │
        ┌─────────────────┐
        │   Cache         │
        │  (Redis)        │
        │                 │
        │  http://6379    │
        └─────────────────┘
```

The development environment is now fully functional and ready for development!