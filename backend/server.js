import express from 'express';
import http from "http";
import path from "path";
import cors from "cors";
import {serve} from "inngest/express";
import {clerkMiddleware} from "@clerk/express"

import { ENV } from './env.js';
import { connectDB } from './util/db.js';
import {inngest,functions} from "./util/inngest.js"

import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoute.js"
import problemRoutes from "./routes/problemRoutes.js";
import executeRoutes from "./routes/executeRoute.js";
import { protectRoute } from './middleware/protectRoute.js';
import { initializeSocket } from './util/socket.js';
import { checkDockerAvailability, pullAllImages } from './util/dockerExecutor.js';

const app = express();
const httpServer = http.createServer(app);

const __dirname = path.resolve()

//middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// credentials:true => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(clerkMiddleware());//adds auth field to request object -> req.auth()

app.use("/api/inngest",serve({client:inngest, functions}));
app.use("/api/chat", chatRoutes)
app.use("/api/sessions", sessionRoutes)
app.use("/api/problems", problemRoutes);
app.use("/api/code", executeRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// GET /api/users/me
app.get("/api/users/me", protectRoute, (req, res) => {
  res.json({
    id: req.user._id,
    controlAdmin: req.user.controlAdmin,
  });
});


//making ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();

    // Check Docker availability
    const dockerAvailable = await checkDockerAvailability();
    if (dockerAvailable) {
      console.log('Docker is available ✓');
      // Pull Docker images in background (don't wait for it)
      pullAllImages().catch(err => {
        console.error('Warning: Failed to pull Docker images:', err.message);
      });
    } else {
      console.warn('⚠️  Docker is not available. Code execution will not work!');
      console.warn('Please install Docker and ensure it is running.');
    }

    initializeSocket(httpServer);
    httpServer.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();