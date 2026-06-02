# Simple Development Setup Instructions

## How to Run CafeFlow Development Environment

### Method 1: Manual Setup (Recommended for now)

1. **Start Backend Services** (Database and API):
```bash
cd /home/dnx-xy/Developments/Cafe-R/workspace
docker compose up -d db redis backend
```

2. **Install and Start Frontend**:
```bash
cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
npm install
npm run dev
```

### Method 2: Using npm scripts (from package.json)

1. **Install dependencies**:
```bash
cd /home/dnx-xy/Developments/Cafe-R
npm install
```

2. **Start development environment**:
```bash
npm run dev
```

### Access the Applications:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432 (user: postgres, password: password)
- **Redis**: localhost:6379

### Useful Commands:
```bash
# Stop all services
docker compose down

# View running containers
docker compose ps

# View logs for backend
docker compose logs backend

# Rebuild backend (after code changes)
docker compose build backend
docker compose up -d backend
```

### Prerequisites:
- Docker Desktop/Engine running
- Node.js 18+ installed
- npm 8+ installed

### Troubleshooting:
If you encounter build issues with frontend:
1. The frontend Docker build might be failing due to missing files
2. Run the frontend separately using npm run dev
3. The backend services should work independently

This setup allows you to develop both frontend and backend simultaneously with hot reloading for frontend changes.