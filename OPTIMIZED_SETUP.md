# CafeFlow Development Environment - Optimized Setup

## Quick Start Guide

### Prerequisites
- Docker Desktop/Engine installed and running
- Node.js 18+ installed
- npm 8+ installed

### Step 1: Optimize Next.js Development (Fix Slow Filesystem Warning)

The warning about slow filesystem is common on WSL or network drives. To fix it:

```bash
# Create a local directory for Next.js cache
mkdir -p /tmp/nextjs-cache

# Set environment variable to use local cache
export NEXT_PRIVATE_LOCAL_CACHE_DIR=/tmp/nextjs-cache
```

Or add to your shell profile (~/.bashrc or ~/.zshrc):
```bash
export NEXT_PRIVATE_LOCAL_CACHE_DIR=/tmp/nextjs-cache
```

### Step 2: Start Services (Optimized Approach)

**Terminal 1: Start backend services**
```bash
cd /home/dnx-xy/Developments/Cafe-R/workspace
docker compose up -d db redis backend
```

**Terminal 2: Start frontend with optimized cache**
```bash
cd /home/dnx-xy/Developments/Cafe-R/workspace/frontend
NEXT_PRIVATE_LOCAL_CACHE_DIR=/tmp/nextjs-cache npm run dev
```

### Step 3: Alternative - Move Project to Local Drive

If you're on WSL, consider moving the project to a Windows drive for better performance:

```bash
# Move project to Windows drive (if on WSL)
mv /home/dnx-xy/Developments/Cafe-R /mnt/c/Users/YourWindowsUser/Developments/Cafe-R
# Then work from the Windows path
```

### Step 4: Verify Setup Works

```bash
# Check backend is running
docker compose ps

# Test API
curl http://localhost:3001/health

# Check frontend starts properly
# Visit http://localhost:3000 in browser
```

## Why This Fixes the Issue

1. **Local Cache**: Next.js will use `/tmp/nextjs-cache` instead of the potentially slow filesystem
2. **Performance**: Eliminates the 239ms benchmark delay on every build
3. **WSL Optimization**: Particularly effective on WSL file systems where /home is slow

## Alternative Solutions

### Option 1: Disable the Warning (Quick Fix)
```bash
# Run with warning suppressed
npm run dev -- --no-lint
```

### Option 2: Use Next.js 15+ with Improved Caching
If upgrading, newer versions have better caching mechanisms.

### Option 3: Docker Volume Mount Optimization
For Docker-based development, optimize volume mounts:
```yaml
# In docker-compose.yml
volumes:
  - ./frontend:/app:cached  # Use cached mount for better performance
```

## Expected Behavior After Fix

- No more "Slow filesystem detected" warnings
- Faster hot reloads and builds
- Smoother development experience
- Full CafeFlow functionality working at:
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:3001

The filesystem warning is purely performance-related and doesn't prevent functionality - it just makes development slower than it could be.