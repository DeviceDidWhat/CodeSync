import express from 'express';
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
import { protectRoute } from './middleware/protectRoute.js';

const app = express();

const __dirname = path.resolve()

//middleware
app.use(express.json())
// credentials:true => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(clerkMiddleware());//adds auth field to request object -> req.auth()

app.use("/api/inngest",serve({client:inngest, functions}));
app.use("/api/chat", chatRoutes)
app.use("/api/sessions", sessionRoutes)
app.use("/api/problems", problemRoutes);

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
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();