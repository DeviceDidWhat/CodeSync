# Free Deployment Guide for CodeSync with Docker

This guide provides **free** hosting options for deploying your CodeSync application with Docker-based code execution.

## 🎯 Challenge: Docker Support Required

Your app requires:
- **Docker** for code execution containers
- **Redis** for queue management
- **MongoDB** for database
- **Node.js** backend server
- **React** frontend (static files)

Most free platforms (Vercel, Netlify, Railway free tier) don't support Docker. Here are your options:

---

## ✅ Option 1: Render.com (RECOMMENDED - Easiest)

**Free Tier:** 750 hours/month per service, Docker support

### Pros:
✅ Native Docker support
✅ Free tier available
✅ Easy deployment from GitHub
✅ Managed Redis available
✅ Auto-deploy on git push

### Cons:
❌ Services sleep after 15 minutes of inactivity
❌ Limited to 512MB RAM on free tier
❌ Slower cold starts

### Deployment Steps:

#### 1. Create Render Account
- Sign up at [render.com](https://render.com)
- Connect your GitHub account

#### 2. Create a Dockerfile for Backend

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

# Install Docker CLI (for dockerode)
RUN apk add --no-cache docker-cli

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### 3. Create render.yaml

Create `render.yaml` in project root:
```yaml
services:
  # Backend service
  - type: web
    name: codesync-backend
    runtime: docker
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: MONGODB_URI
        sync: false  # Add manually in Render dashboard
      - key: CLERK_PUBLISHABLE_KEY
        sync: false
      - key: CLERK_SECRET_KEY
        sync: false
      - key: STREAM_API_KEY
        sync: false
      - key: STREAM_API_SECRET
        sync: false
      - key: REDIS_URL
        fromService:
          type: redis
          name: codesync-redis
          property: connectionString

  # Redis service
  - type: redis
    name: codesync-redis
    ipAllowList: []
    plan: free

  # Frontend (static site)
  - type: web
    name: codesync-frontend
    runtime: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

#### 4. Deploy to Render

```bash
# Commit your changes
git add .
git commit -m "Add Render deployment config"
git push

# Go to Render Dashboard
# 1. Click "New +" → "Blueprint"
# 2. Connect your GitHub repository
# 3. Render will auto-detect render.yaml
# 4. Add environment variables in dashboard
# 5. Deploy!
```

#### 5. Important: Docker Socket Access

**Problem:** Render doesn't provide Docker socket access by default.

**Solution:** Use Docker-in-Docker or switch to an alternative (see below).

---

## ✅ Option 2: Railway.app (Docker Support - Limited Free)

**Free Tier:** $5 credit/month, then paid

### Pros:
✅ Full Docker support
✅ Docker socket access
✅ Easy deployment
✅ Great developer experience

### Cons:
❌ Only $5 free credit (runs out quickly)
❌ Becomes paid after trial

### Deployment Steps:

#### 1. Create Railway Account
- Sign up at [railway.app](https://railway.app)
- Connect GitHub

#### 2. Create Dockerfile (same as above)

#### 3. Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy backend
cd backend
railway up

# Add environment variables
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set CLERK_SECRET_KEY="your-key"
# ... add all env vars

# Deploy frontend separately
cd ../frontend
railway up
```

#### 4. Enable Docker Socket

In Railway dashboard:
- Go to your service settings
- Add volume mount: `/var/run/docker.sock:/var/run/docker.sock`

---

## ✅ Option 3: Oracle Cloud Free Tier (BEST for Long-term)

**Free Tier:** Always free ARM instances, 24GB RAM

### Pros:
✅ Always free (not trial)
✅ Full Docker support
✅ 4 ARM cores + 24GB RAM
✅ No sleep/downtime
✅ Full control (VPS)

### Cons:
❌ Requires manual setup
❌ More complex than managed platforms
❌ Need to manage security

### Deployment Steps:

#### 1. Create Oracle Cloud Account
- Sign up at [oracle.com/cloud/free](https://www.oracle.com/cloud/free/)
- Complete verification

#### 2. Create ARM Instance

1. Go to Compute → Instances → Create Instance
2. Choose **Ubuntu 22.04** (ARM)
3. Select **VM.Standard.A1.Flex**
4. Allocate: 4 OCPUs, 24GB RAM (free tier)
5. Download SSH key pair
6. Create instance

#### 3. Connect via SSH

```bash
ssh -i your-key.pem ubuntu@<instance-ip>
```

#### 4. Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
```

#### 5. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

#### 6. Install Node.js and Git

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

# Verify
node --version
npm --version
```

#### 7. Clone and Setup Your Project

```bash
# Clone repository
git clone https://github.com/your-username/CodeSync.git
cd CodeSync

# Setup backend
cd backend
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=3000
MONGODB_URI=your-mongodb-uri
CLERK_PUBLISHABLE_KEY=your-key
CLERK_SECRET_KEY=your-secret
STREAM_API_KEY=your-key
STREAM_API_SECRET=your-secret
REDIS_HOST=localhost
REDIS_PORT=6379
CLIENT_URL=http://your-instance-ip:5173
EOF

# Build frontend
cd ../frontend
npm install
npm run build

# Start Redis
cd ..
docker-compose up -d redis
```

#### 8. Setup PM2 for Process Management

```bash
# Install PM2
sudo npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name codesync-backend

# Start frontend with serve
cd ../frontend
npm install -g serve
pm2 start "serve -s dist -p 5173" --name codesync-frontend

# Save PM2 config
pm2 save
pm2 startup
```

#### 9. Setup Nginx (Optional - Recommended)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/codesync
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or instance IP

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/codesync /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 10. Configure Firewall

```bash
# Oracle Cloud firewall (in console)
# Add ingress rules for ports 80, 443, 3000, 5173

# Ubuntu firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 5173
sudo ufw enable
```

#### 11. Setup SSL with Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## ✅ Option 4: DigitalOcean (Free Credits for New Users)

**Free Tier:** $200 credit for 60 days

Similar to Oracle Cloud but easier setup. Follow same steps as Oracle Cloud.

---

## ✅ Option 5: Heroku Alternatives - Fly.io

**Free Tier:** 3 shared-cpu-1x VMs, 3GB storage

### Pros:
✅ Docker support
✅ Free tier available
✅ Easy deployment

### Cons:
❌ Credit card required
❌ Limited free resources

### Deployment:

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Initialize
flyctl launch

# Deploy
flyctl deploy
```

---

## 📊 Comparison Table

| Platform | Free Tier | Docker | Easy Setup | Best For |
|----------|-----------|--------|------------|----------|
| **Render** | 750hrs/mo | ⚠️ Limited | ⭐⭐⭐⭐⭐ | Quick demos |
| **Railway** | $5 credit | ✅ Yes | ⭐⭐⭐⭐⭐ | Short-term |
| **Oracle Cloud** | Always free | ✅ Yes | ⭐⭐⭐ | Production |
| **DigitalOcean** | $200/60d | ✅ Yes | ⭐⭐⭐⭐ | Testing |
| **Fly.io** | Limited | ✅ Yes | ⭐⭐⭐⭐ | Small apps |

---

## 🎯 My Recommendation

### For Quick Demo/Testing:
**Use Railway** - Easiest setup, works immediately

### For Long-term Free Hosting:
**Use Oracle Cloud Free Tier** - Best free resources, no time limit

### Setup Steps:
1. Start with Railway for quick deployment
2. Once validated, migrate to Oracle Cloud for permanent hosting

---

## 🔧 Alternative: Remove Docker Requirement

If you want easier deployment, consider using **Judge0 API** or **Piston API** instead of Docker:

### Switch Back to Piston API

**File:** `frontend/src/util/piston.js`

```javascript
const PISTON_API = "https://emkc.org/api/v2/piston";

export const executeCode = async (language, code, stdin = "") => {
  try {
    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        version: "*",
        files: [{ content: code }],
        stdin: stdin,
      }),
    });

    const data = await response.json();
    return {
      success: !data.run?.stderr,
      output: data.run?.stdout || data.run?.stderr || "",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
```

**Then deploy on:**
- Vercel (Frontend + Backend)
- Netlify (Frontend + Netlify Functions)
- Cloudflare Pages + Workers

---

## 📝 Environment Variables Needed

For all platforms, set these:

```env
# Backend
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://...  # Use MongoDB Atlas (free)

# Clerk Auth
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Stream Chat
STREAM_API_KEY=...
STREAM_API_SECRET=...

# Redis (if using external)
REDIS_URL=redis://...  # Use Redis Cloud (free tier)

# Client URL
CLIENT_URL=https://your-frontend-url.com
```

### Free Database Options:
- **MongoDB:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (512MB free)
- **Redis:** [Redis Cloud](https://redis.com/try-free/) (30MB free)

---

## 🚀 Quick Start: Deploy to Railway (Fastest)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Create project
railway init

# 4. Add services
railway add  # Select PostgreSQL (or use external MongoDB)
railway add  # Select Redis

# 5. Deploy backend
cd backend
railway up

# 6. Set environment variables
railway variables set MONGODB_URI="your-uri"
railway variables set CLERK_SECRET_KEY="your-key"
# ... set all variables

# 7. Deploy frontend to Vercel
cd ../frontend
npm i -g vercel
vercel

# Done! Your app is live
```

---

## 🆘 Need Help?

1. **Check logs:** `pm2 logs` (Oracle Cloud) or platform dashboard
2. **Docker issues:** Ensure Docker daemon is running
3. **Network issues:** Check firewall rules
4. **Memory issues:** Reduce container limits in `dockerExecutor.js`

---

## 🎉 Success!

Once deployed, your app will be accessible at:
- Frontend: `https://your-domain.com`
- Backend API: `https://your-domain.com/api`
- Code execution: Fully functional with Docker

**Enjoy your free, production-ready CodeSync deployment!**
