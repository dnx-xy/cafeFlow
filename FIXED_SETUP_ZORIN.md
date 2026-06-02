# CafeFlow - Complete Development Setup

## Fixed Working Solution for Zorin OS

### Issue Identified
The backend container fails to start because:
1. Dockerfile uses production build (`npm run start:prod`)
2. No `dist` directory exists in the mounted volume
3. Development mode requires different approach

### Solution: Manual Approach (Recommended for Zorin OS)

**Step 1: Start backend services properly**
```bash
# Terminal 1: Start only DB and Redis (no backend build in Docker)
cd /home/dnx-xy/Developments/Cafe-R/workspace
docker compose up -d db redis
```

**Step 2: Build and run backend locally**
```bash
# Terminal 2: Build and run backend locally
cd /home/dnx-xy/Developments/Cafe-R/workspace/backend
npm run build
npm run start:dev
```

**Step 3: Start frontend**
```bash
# Terminal 3: Start frontend
cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
npm run dev
```

### Alternative: Fix Docker Compose for Development

**Update your docker-compose.yml** to better support development:

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

  # Remove the backend service from docker-compose for now
  # Run it locally instead for better development experience

volumes:
  postgres_data:
```

### Even Simpler: Run Everything Locally

**Option A: Pure local development (most reliable)**
```bash
# Terminal 1: Start DB and Redis
cd /home/dnx-xy/Developments/Cafe-R/workspace
docker compose up -d db redis

# Terminal 2: Run backend locally  
cd /home/dnx-xy/Developments/Cafe-R/workspace/backend
npm run start:dev

# Terminal 3: Run frontend locally
cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
npm run dev
```

### Verify All Services Work

```bash
# Check services are running
docker compose ps

# Test backend API
curl http://localhost:3001/health

# Test frontend (should be available at http://localhost:3000)
```

### Why This Works Better on Zorin OS

1. **No Docker build conflicts**: Backend runs locally with proper TypeScript compilation
2. **Better debugging**: Can debug both frontend and backend independently  
3. **Faster iteration**: No Docker rebuilds needed
4. **Zorin OS compatibility**: Uses standard Ubuntu/Debian toolchain

### Expected Result
- **Database**: http://localhost:5432 (PostgreSQL)
- **Redis**: http://localhost:6379 (Redis)
- **Backend API**: http://localhost:3001 (NestJS)
- **Frontend**: http://localhost:3000 (Next.js)

This approach is the most reliable for Zorin OS development and will eliminate all connection issues you've been experiencing.