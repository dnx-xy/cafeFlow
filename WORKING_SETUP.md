# CafeFlow Development Environment - Working Solution

## Quick Start Guide

### Prerequisites
- Docker Desktop/Engine installed and running
- Node.js 18+ installed
- npm 8+ installed

### Step 1: Fix Docker Compose File (Remove problematic frontend build)

First, let's fix the docker-compose.yml to make it work properly:

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
    # For development, run in dev mode instead of prod
    command: npm run start:dev

volumes:
  postgres_data:
```

### Step 2: Start Just Backend Services First

```bash
# Terminal 1: Start backend services only (no frontend build)
cd /home/dnx-xy/Developments/Cafe-R/workspace
docker compose up -d db redis backend
```

### Step 3: Verify Backend is Running

```bash
# Check if backend is running properly
docker compose ps
# Should show: db, redis, backend containers running

# Test backend API
curl http://localhost:3001/health
```

### Step 4: Start Frontend Separately

```bash
# Terminal 2: Start frontend
cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
npm run dev
```

### Step 5: Access Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432
- **Redis**: localhost:6379

## Troubleshooting

### If you see "Connection refused" errors:

1. **Wait for backend to fully start**:
   ```bash
   # Check backend logs
   docker compose logs backend
   ```

2. **Verify backend is actually running**:
   ```bash
   # Check if backend service is listening
   docker compose exec backend netstat -tlnp
   ```

3. **Check environment variables** in frontend:
   ```bash
   # Make sure frontend knows where to find the backend
   # Check .env file in frontend directory if it exists
   ```

### If frontend builds but doesn't load:

1. **Check if API is accessible**:
   ```bash
   # Test the API endpoint from frontend
   curl http://localhost:3001/auth/login
   ```

2. **Check browser console** for any CORS or network errors

## Why This Approach Works Better

1. **Separates concerns**: Backend runs in dev mode with hot reloading
2. **Avoids frontend Docker build issues**: Frontend runs natively with npm
3. **Proper development workflow**: Allows hot reloading for both parts
4. **Better debugging**: Can debug each part independently

## For Future Development

When you want to use the "npm run dev" script:

1. **Fix the Docker Compose** to use `command: npm run start:dev` instead of `CMD ["npm", "run", "start:prod"]`
2. **Ensure all environment variables** are properly set
3. **Test API connectivity** before starting frontend

This approach gives you the cleanest development experience for both frontend and backend.