# CodeSync — Full-Stack Interview Platform

A modern, production-grade full-stack interview and collaborative coding platform designed for real-time technical interviews, practice problems, and live code evaluation — all in one place.

Built with real-time systems, secure execution, background jobs, and interview-grade engineering practices.

---

## 🌐 Demo

🖥️ **Live Demo:** https://codesync-446m.onrender.com/ 

📽️ **Preview:** Live coding + video interview experience

---

## ✨ Key Features

### 👨‍💻 Development & Coding
- **Collabrative Code Editor** — Monaco Editor for professional coding experience
- **Secure Code Execution** — Isolated, safe environment for running code
- **Language-Aware Editor** — Support for multiple programming languages
- **Auto Feedback** — Instant success/fail verdict based on test cases
- **Hidden Test Cases** — Secure evaluation without exposing test logic
- **Practice Problems Page** — Solo coding mode for skill building

### 🎥 Interview Experience
- **1-on-1 Video Interview Rooms** — Stream-powered video conferencing
- **Mic & Camera Toggle** — Full control over audio/video settings
- **Screen Sharing & Recording** — Capture interviews for review
- **Real-time Chat Messaging** — Built-in communication during sessions
- **Room Locking** — Maximum 2 participants per interview room
- **Dashboard with Live Stats** — Monitor interview progress and metrics

### 🎉 User Experience
- **Confetti on Success** — Celebratory feedback for correct solutions
- **Toast Notifications** — Real-time alerts for failures and events
- **Responsive Design** — Works seamlessly across devices

### 🔐 Security & Authentication
- **Clerk Authentication** — Enterprise-grade auth solution
- **JWT-Based Security** — Secure API token validation
- **Protected Routes** — Authorization at API level
- **User Sync** — Automatic user synchronization with background jobs

### ⚙️ Backend & Infrastructure
- **REST API** — Node.js & Express backend
- **Background Jobs** — Inngest for async, event-driven tasks
- **Real-time Systems** — Stream SDK for video and chat
- **MongoDB Database** — Scalable document storage
- **Data Fetching & Caching** — TanStack Query for optimized data management
- **Git & GitHub Workflow** — Professional version control with PR reviews
- **CodeRabbit Integration** — Automated PR analysis and code optimization

### 🚀 Deployment
- **Render Hosting** — Free-tier friendly cloud deployment
- **Environment-Based Config** — Flexible configuration management
- **Secure Secrets** — Environment variables via .env files

---

## 🏗️ Tech Stack

### Frontend
- **React** + **Vite** — Modern UI framework and build tool
- **Monaco Editor** — VSCode-like code editing experience
- **TanStack Query** — Powerful data fetching and caching
- **Clerk** — Authentication and user management
- **Stream Video & Chat SDK** — Real-time communication
- **Tailwind CSS** + **DaisyUI** — Modern styling framework

### Backend
- **Node.js** + **Express** — Server runtime and framework
- **MongoDB** + **Mongoose** — NoSQL database with ODM
- **Clerk JWT** — Token-based authentication
- **Stream** — Video and chat infrastructure
- **Inngest** — Background job processing
- **RESTful API** — Standard HTTP API design

### Infrastructure
- **Render** — Cloud deployment platform
- **Environment Configuration** — .env-based setup
- **GitHub Actions** — CI/CD ready

---

## 🧠 System Architecture

```
Frontend (React)
    ↓
Clerk Authentication
    ↓
Protected Express APIs
    ↓
MongoDB (Sessions, Users)
    ↓
Stream (Video + Chat)
    ↓
Inngest (Async background tasks)
```

---

## 📂 Project Structure

```
codesync/
├── backend/
│   ├── controllers/          # Request handlers
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth, logging, etc.
│   ├── util/                 # Helper functions
│   ├── server.js            # Express server entry point
│   ├── package.json
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── data/                # Mock data, constants
│   ├── main.jsx            # Entry point
│   ├── package.json
│   └── .env                # Environment variables
│
└── README.md
```

---

## 🔐 Environment Setup

### Backend Configuration

Create a `.env` file in the `/backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB_URL=your_mongodb_connection_url

# Background Jobs (Inngest)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Real-time Services (Stream)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration

Create a `.env` file in the `/frontend` directory:

```env
# Authentication (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Configuration
VITE_API_URL=http://localhost:3000/api

# Real-time Services (Stream)
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## ▶️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- API keys from Clerk, Stream, and Inngest

### Installation & Setup

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/codesync.git
cd codesync
```

#### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Configure your `.env` file with all required API keys (see Environment Setup above).

Start the development server:

```bash
npm run dev
```

The backend will run at `http://localhost:3000`

#### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Configure your `.env` file with all required API keys (see Environment Setup above).

Start the development server:

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`

#### 4️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🧪 Features in Detail

### 🔐 Authentication Flow

- **Clerk Integration** — Enterprise-grade authentication provider
- **JWT Tokens** — Secure token-based API authentication
- **Automatic User Sync** — Users are synced to MongoDB via Inngest on signup
- **Protected Routes** — API endpoints require valid JWT tokens
- **Session Management** — Persistent user sessions across browser restarts

### 🎥 Interview Session Management

- **Room Creation** — Initiate new interview sessions
- **Room Joining** — Connect to existing interview rooms
- **Stream Integration** — Video and chat powered by Stream SDK
- **Room Locking** — Automatically locks after 2 users join
- **Session Persistence** — Interview history stored in MongoDB

### 👨‍💻 Code Execution Engine

- **Editor Features** — Syntax highlighting, auto-completion, error detection
- **Language Support** — Multiple programming languages available
- **Test Case Evaluation** — Run code against hidden test cases
- **Isolated Execution** — Safe sandbox environment prevents malicious code
- **Real-time Feedback** — Instant pass/fail results with detailed error messages
- **Performance Metrics** — Track execution time and resource usage

### 🧠 Background Jobs & Event Processing

- **Inngest Integration** — Event-driven async task processing
- **User Lifecycle** — Auto-sync users on creation/deletion
- **Stream Management** — User provisioning for video/chat services
- **Scheduled Tasks** — Support for cron-like scheduled jobs
- **Error Handling** — Automatic retries and failure notifications

### 🚀 Deployment Strategy

- **Render Hosting** — Single-service deployment (frontend served by backend)
- **Environment Variables** — Manage secrets via Render dashboard
- **CI/CD Ready** — GitHub integration for automated deployments
- **Free Tier** — Suitable for prototype and MVP phase

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout

### Interviews
- `GET /api/interviews` — List user's interviews
- `POST /api/interviews` — Create new interview session
- `GET /api/interviews/:id` — Get interview details
- `PUT /api/interviews/:id` — Update interview
- `DELETE /api/interviews/:id` — Delete interview

### Code Execution
- `POST /api/code/execute` — Execute code with test cases
- `GET /api/problems` — List all practice problems
- `GET /api/problems/:id` — Get problem details

### Users
- `GET /api/users/profile` — Get current user profile
- `PUT /api/users/profile` — Update user profile
- `GET /api/users/stats` — Get user statistics

---

## 🛠️ Development Workflow

### Git & GitHub

We follow professional Git practices:

1. **Branching** — Create feature branches from `main`
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Commits** — Write clear, descriptive commit messages
   ```bash
   git commit -m "feat: add video recording functionality"
   ```

3. **Pull Requests** — Create PRs for code review before merging
4. **Code Review** — Use CodeRabbit for automated analysis
5. **Merging** — Merge after approval and passing checks

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
```

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🚀 Deployment Guide

### Deploy to Render

1. Create a Render account
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Deploy:
   ```bash
   git push origin main
   ```

The app will automatically build and deploy.

### Production Checklist

- [ ] All environment variables configured
- [ ] Database URL points to production MongoDB
- [ ] Clerk keys set to production values
- [ ] Stream API keys configured
- [ ] Inngest signing keys added
- [ ] CLIENT_URL set to production domain
- [ ] Logging enabled for monitoring

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check all `.env` variables are set correctly
- Verify MongoDB connection URL is valid
- Ensure PORT 3000 is not in use

**Frontend can't connect to backend:**
- Verify `VITE_API_URL` matches backend URL
- Check CORS is enabled in Express
- Ensure backend is running

**Video/Chat not working:**
- Verify Stream API keys are correct
- Check browser permissions for camera/mic
- Ensure Clerk authentication is successful

**Code execution failing:**
- Check code syntax in editor
- Verify test cases are properly formatted
- Look for timeout errors in browser console

---


## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and learn from.

See the LICENSE file for details.

---

## 🙌 Acknowledgements

This project wouldn't be possible without:

- **[Clerk](https://clerk.com)** — Modern authentication
- **[Stream](https://getstream.io)** — Real-time video and chat
- **[Inngest](https://www.inngest.com)** — Background job processing
- **[Monaco Editor](https://microsoft.github.io/monaco-editor)** — Code editor
- **[TanStack Query](https://tanstack.com/query)** — Data fetching
- **[Tailwind CSS](https://tailwindcss.com)** — Styling framework
- **[DaisyUI](https://daisyui.com)** — Component library
- **[Render](https://Render.com)** — Cloud hosting

---

**Built with ❤️ by the Krish, Kavya**
