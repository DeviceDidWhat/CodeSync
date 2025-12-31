# 🚀 Deploy CodeSync in 10 Minutes - Step by Step

Choose your deployment method based on your preference:

---

## 🎯 METHOD 1: Render.com (EASIEST - RECOMMENDED)

### Step 1: Prepare Your Repository

```bash
# Make sure all files are committed
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 2: Sign Up for Free Services

1. **Render**: Go to [render.com](https://render.com) and sign up with GitHub
2. **MongoDB Atlas**: Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create free cluster
3. **Redis Cloud**: Go to [redis.com/try-free](https://redis.com/try-free/) and create free database (Optional - Render provides Redis)

### Step 3: Get MongoDB Connection String

1. In MongoDB Atlas dashboard:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Save this for later

### Step 4: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Click **"Apply"**

### Step 5: Add Environment Variables

In Render dashboard, go to each service and add these environment variables:

**Backend Service:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codesync
CLERK_PUBLISHABLE_KEY=pk_test_... (from Clerk dashboard)
CLERK_SECRET_KEY=sk_test_... (from Clerk dashboard)
STREAM_API_KEY=... (from GetStream dashboard)
STREAM_API_SECRET=... (from GetStream dashboard)
INNGEST_EVENT_KEY=... (from Inngest dashboard)
INNGEST_SIGNING_KEY=... (from Inngest dashboard)
CLIENT_URL=https://your-frontend-url.onrender.com
```

**Frontend Service:**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STREAM_API_KEY=...
VITE_API_URL=https://your-backend-url.onrender.com
```

### Step 6: Update CLIENT_URL

After frontend deploys:
1. Copy frontend URL from Render
2. Update `CLIENT_URL` in backend environment variables
3. Redeploy backend

### Step 7: Test!

Visit your frontend URL and test code execution!

**⚠️ Important Note:** Render's free tier doesn't provide direct Docker socket access. You may need to either:
- Upgrade to paid tier for Docker support
- Switch to Oracle Cloud (Method 2)
- Use Piston API instead of Docker (see FREE_DEPLOYMENT_GUIDE.md)

---

## 🎯 METHOD 2: Oracle Cloud (BEST FREE OPTION)

### Step 1: Create Oracle Cloud Account

1. Go to [oracle.com/cloud/free](https://www.oracle.com/cloud/free/)
2. Sign up (requires credit card verification but charges nothing)
3. Complete setup

### Step 2: Create VM Instance

1. In Oracle Cloud Console, go to **Compute → Instances**
2. Click **"Create Instance"**
3. Configure:
   - **Name:** codesync-server
   - **Image:** Ubuntu 22.04 (ARM)
   - **Shape:** VM.Standard.A1.Flex
   - **OCPUs:** 4
   - **Memory:** 24GB
   - **Download SSH keys** (IMPORTANT!)
4. Click **"Create"**
5. Wait 2-3 minutes for provisioning
6. Copy the **Public IP address**

### Step 3: Configure Firewall (Oracle Cloud)

1. Go to your instance → **Subnet → Security List**
2. Add **Ingress Rules**:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 3000 (Backend)
   - Port 5173 (Frontend dev)

### Step 4: Connect to Server

```bash
# Windows (use Git Bash or WSL)
ssh -i path/to/your-key.pem ubuntu@YOUR_PUBLIC_IP

# Mac/Linux
chmod 400 path/to/your-key.pem
ssh -i path/to/your-key.pem ubuntu@YOUR_PUBLIC_IP
```

### Step 5: Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Verify
docker --version
```

### Step 6: Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-aarch64" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### Step 7: Install Node.js

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

# Verify
node --version
npm --version
```

### Step 8: Clone Your Project

```bash
# Clone repository (replace with your repo)
git clone https://github.com/YOUR_USERNAME/CodeSync.git
cd CodeSync
```

### Step 9: Setup Backend

```bash
cd backend
npm install

# Create .env file
nano .env
```

Add this content (replace with your actual values):
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codesync
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STREAM_API_KEY=...
STREAM_API_SECRET=...
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
REDIS_HOST=localhost
REDIS_PORT=6379
CLIENT_URL=http://YOUR_PUBLIC_IP:5173
```

Save with `Ctrl+X`, then `Y`, then `Enter`

### Step 10: Setup Frontend

```bash
cd ../frontend

# Create .env file
nano .env
```

Add:
```env
VITE_API_URL=http://YOUR_PUBLIC_IP:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STREAM_API_KEY=...
```

```bash
# Install and build
npm install
npm run build
```

### Step 11: Start Redis

```bash
cd ..
docker-compose up -d redis
```

### Step 12: Install PM2 and Start Services

```bash
# Install PM2
sudo npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name codesync-backend

# Serve frontend
cd ../frontend
npm install -g serve
pm2 start "serve -s dist -p 5173" --name codesync-frontend

# Save PM2 configuration
pm2 save
pm2 startup  # Run the command it outputs
```

### Step 13: Configure Ubuntu Firewall

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 5173
sudo ufw allow ssh
sudo ufw enable
```

### Step 14: Access Your App!

Open in browser:
```
http://YOUR_PUBLIC_IP:5173
```

### Step 15: Setup Domain (Optional)

If you have a domain:

1. Point DNS A record to your instance IP
2. Install Nginx:

```bash
sudo apt install nginx -y

sudo nano /etc/nginx/sites-available/codesync
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/codesync /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 🎯 METHOD 3: Railway.app (Quick but Limited Free)

### Step 1: Install Railway CLI

```bash
npm i -g @railway/cli
```

### Step 2: Login and Initialize

```bash
railway login
railway init
```

### Step 3: Deploy Backend

```bash
cd backend
railway up
```

### Step 4: Add Environment Variables

```bash
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set CLERK_SECRET_KEY="your-key"
railway variables set CLERK_PUBLISHABLE_KEY="your-key"
railway variables set STREAM_API_KEY="your-key"
railway variables set STREAM_API_SECRET="your-secret"
railway variables set INNGEST_EVENT_KEY="your-key"
railway variables set INNGEST_SIGNING_KEY="your-key"
```

### Step 5: Deploy Frontend to Vercel

```bash
cd ../frontend
npm i -g vercel
vercel
```

Follow prompts to deploy.

---

## 📊 Which Method Should You Choose?

| Method | Best For | Time | Difficulty |
|--------|----------|------|------------|
| **Oracle Cloud** | Long-term, production use | 30 min | Medium |
| **Railway** | Quick testing | 5 min | Easy |
| **Render** | Balanced approach | 10 min | Easy |

**My Recommendation:**
- **Testing/Demo:** Use Railway
- **Production:** Use Oracle Cloud

---

## 🆘 Common Issues

### "Docker not available" on Render
- Render free tier has limited Docker support
- Upgrade to paid tier or use Oracle Cloud

### "Cannot connect to MongoDB"
- Check connection string format
- Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Verify username/password

### "Rate limit exceeded" errors
- Wait 1 minute
- Or increase limits in `backend/controller/executeController.js`

### Frontend can't connect to backend
- Check `VITE_API_URL` in frontend .env
- Update `CLIENT_URL` in backend .env
- Verify CORS settings

### PM2 processes not starting
- Check logs: `pm2 logs`
- Restart: `pm2 restart all`
- Check ports: `sudo netstat -tulpn | grep -E ':(3000|5173)'`

---

## ✅ Verify Deployment

Test these:

1. **Health check:** `curl http://YOUR_URL/health`
2. **Execute code:** Login and run code in the UI
3. **Socket.io:** Join a session with another user
4. **Redis:** Check `pm2 logs` for "Execution queue initialized"

---

## 🎉 Success!

Your CodeSync app is now deployed and accessible worldwide!

**Next steps:**
- Add your domain
- Setup SSL certificate
- Configure monitoring
- Setup backups

Need help? Check [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md) for detailed troubleshooting.
