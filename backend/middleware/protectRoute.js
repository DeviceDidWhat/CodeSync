import { requireAuth } from "@clerk/express";
import User from "../models/user.js";

const ADMIN_EMAILS = [
  "kavyabhanvadia@gmail.com",
  "b24cs1037@iitj.ac.in",
];

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth.userId;

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      const user = await User.findOne({ clerkId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      /* --------------------------------
         AUTO-ASSIGN ADMIN BY EMAIL
      -------------------------------- */
      if (
        ADMIN_EMAILS.includes(user.email) &&
        user.controlAdmin !== true
      ) {
        user.controlAdmin = true;
        await user.save();
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
