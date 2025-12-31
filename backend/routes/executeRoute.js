import express from 'express';
import {
  executeCode,
  getQueueStats,
  getSupportedLanguages,
} from '../controller/executeController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Execute code - requires authentication
router.post('/execute', protectRoute, executeCode);

// Get supported languages - public endpoint
router.get('/languages', getSupportedLanguages);

// Get queue statistics - admin only
router.get('/stats', protectRoute, async (req, res, next) => {
  // Check if user is admin
  if (!req.user?.controlAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}, getQueueStats);

export default router;
