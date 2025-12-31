# Quick Start - Code Execution Engine

Get your CodeSync execution engine running in 5 minutes!

## Prerequisites Check

✅ **Docker Desktop installed and running**
   - Download from: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version`

✅ **Node.js and npm installed**
   - Verify: `node --version` and `npm --version`

## Step 1: Install Dependencies (Already Done!)

The required packages are already installed:
```bash
cd backend
npm install  # Already includes dockerode, bull, ioredis, tar-stream
```

## Step 2: Start Docker

**Windows/Mac:**
- Open Docker Desktop application
- Wait for Docker to start (whale icon in system tray)

**Linux:**
```bash
sudo systemctl start docker
```

## Step 3: Start Redis (Optional but Recommended)

**Using Docker Compose (Easiest):**
```bash
# From project root
docker-compose up -d redis
```

**Or skip Redis** - The system will work without it (just no queue management).

## Step 4: Start Backend

```bash
cd backend
npm run dev
```

**Expected output:**
```
✓ Docker is available
Pulling Docker images for code execution...
Image pulled successfully: node:18-alpine
Image pulled successfully: python:3.10-alpine
...
Execution queue initialized with Redis
Server is running on port 3000
```

**Note:** First startup takes 2-3 minutes to pull Docker images. Subsequent starts are instant!

## Step 5: Start Frontend

```bash
cd frontend
npm run dev
```

## Step 6: Test It!

1. Open http://localhost:5173
2. Login with your account
3. Navigate to a problem or create a session
4. Write some code (e.g., Python):
   ```python
   print("Hello from CodeSync!")
   ```
5. Click "Run Code"
6. See output in the panel!

## Troubleshooting

### ❌ "Docker is not available"
- Make sure Docker Desktop is running
- Run `docker ps` to verify
- Restart Docker if needed

### ❌ "Rate limit exceeded"
- Wait 1 minute between executions
- Default: 10 executions per minute

### ❌ Images taking too long to pull
- First time only! Images are ~100-200MB each
- Subsequent runs use cached images
- Check internet connection

## What's Next?

- Read [CODE_EXECUTION_SETUP.md](CODE_EXECUTION_SETUP.md) for detailed documentation
- Configure Redis for better performance
- Customize timeouts and resource limits
- Deploy to production

## Quick Commands

```bash
# Start everything with Docker Compose
docker-compose up -d

# Check Docker status
docker ps

# View backend logs
cd backend && npm run dev

# Stop Redis
docker-compose down

# Remove all execution containers
docker ps -a | grep "node\|python\|gcc\|openjdk" | awk '{print $1}' | xargs docker rm -f

# Check queue stats (admin only)
curl http://localhost:3000/api/code/stats
```

## Architecture at a Glance

```
User Code → Frontend → Backend API → Queue (Redis) → Docker Container → Result
```

Each execution gets:
- Isolated container
- 256MB RAM
- 5-10 second timeout
- No network access
- Auto-cleanup

## Support

Having issues? Check:
1. Docker is running: `docker ps`
2. Backend is running: `curl http://localhost:3000/health`
3. Server logs for errors
4. [CODE_EXECUTION_SETUP.md](CODE_EXECUTION_SETUP.md) for detailed troubleshooting

Happy coding! 