import { executeCodeInDocker } from '../util/dockerExecutor.js';
import Queue from 'bull';
import { ENV } from '../env.js';

// Create execution queue with Redis
// If Redis is not available, executions will run synchronously
let executionQueue;

try {
  // Try to create queue with Redis
  const redisConfig = ENV.REDIS_URL
    ? ENV.REDIS_URL
    : {
        host: ENV.REDIS_HOST || 'localhost',
        port: ENV.REDIS_PORT || 6379,
      };

  executionQueue = new Queue('code-execution', redisConfig, {
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 1, // No retries for code execution
      timeout: 30000, // 30 seconds max per job
    },
  });

  // Process jobs from the queue
  executionQueue.process(async (job) => {
    const { language, code, stdin } = job.data;
    return await executeCodeInDocker(language, code, stdin || '');
  });

  console.log('Execution queue initialized with Redis');
} catch (error) {
  console.warn('Redis not available, running executions synchronously:', error.message);
  executionQueue = null;
}

// In-memory rate limiting (per user)
const userExecutionCount = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_EXECUTIONS_PER_WINDOW = 10; // 10 executions per minute

/**
 * Check if user has exceeded rate limit
 * @param {string} userId - User ID
 * @returns {boolean} True if rate limit exceeded
 */
function isRateLimited(userId) {
  const now = Date.now();
  const userHistory = userExecutionCount.get(userId) || [];

  // Filter out old executions outside the window
  const recentExecutions = userHistory.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentExecutions.length >= MAX_EXECUTIONS_PER_WINDOW) {
    return true;
  }

  // Update user history
  recentExecutions.push(now);
  userExecutionCount.set(userId, recentExecutions);

  return false;
}

/**
 * Execute code endpoint
 */
export async function executeCode(req, res) {
  try {
    const { language, code, stdin } = req.body;
    const userId = req.user?._id?.toString() || req.ip; // Use user ID or IP for anonymous

    // Validation
    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: 'Language and code are required',
      });
    }

    // Check code size (max 5MB to handle large test cases)
    if (code.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'Code size exceeds maximum limit of 5MB',
      });
    }

    // Rate limiting check
    if (isRateLimited(userId)) {
      return res.status(429).json({
        success: false,
        error: `Rate limit exceeded. Maximum ${MAX_EXECUTIONS_PER_WINDOW} executions per minute.`,
      });
    }

    // Security: Basic code validation to prevent malicious patterns
    const maliciousPatterns = [
      /import\s+os/i,
      /require\s*\(\s*['"]child_process['"]\s*\)/i,
      /eval\s*\(/i,
      /exec\s*\(/i,
      /spawn\s*\(/i,
      /__import__\s*\(/i,
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(code)) {
        return res.status(400).json({
          success: false,
          error: 'Code contains potentially dangerous operations',
        });
      }
    }

    let result;

    // Execute with queue if available, otherwise direct execution
    if (executionQueue) {
      // Add job to queue
      const job = await executionQueue.add(
        { language, code, stdin: stdin || '' },
        {
          priority: 1, // Can be adjusted based on user tier
        }
      );

      // Wait for job to complete
      result = await job.finished();
    } else {
      // Direct execution without queue
      result = await executeCodeInDocker(language, code, stdin || '');
    }

    // Log execution for monitoring
    console.log(`Code execution: ${language} | User: ${userId} | Success: ${result.success}`);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in executeCode controller:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error during code execution',
    });
  }
}

/**
 * Get queue statistics (for monitoring)
 */
export async function getQueueStats(req, res) {
  try {
    if (!executionQueue) {
      return res.status(200).json({
        message: 'Queue not available, running in direct mode',
      });
    }

    const [waiting, active, completed, failed] = await Promise.all([
      executionQueue.getWaitingCount(),
      executionQueue.getActiveCount(),
      executionQueue.getCompletedCount(),
      executionQueue.getFailedCount(),
    ]);

    return res.status(200).json({
      queue: {
        waiting,
        active,
        completed,
        failed,
      },
    });
  } catch (error) {
    console.error('Error getting queue stats:', error);
    return res.status(500).json({ error: 'Failed to get queue statistics' });
  }
}

/**
 * Get supported languages
 */
export async function getSupportedLanguages(req, res) {
  const languages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      version: 'Node.js 18',
    },
    {
      id: 'python',
      name: 'Python',
      version: '3.10',
    },
    {
      id: 'java',
      name: 'Java',
      version: '17',
    },
    {
      id: 'c',
      name: 'C',
      version: 'GCC 11',
    },
    {
      id: 'cpp',
      name: 'C++',
      version: 'G++ 11',
    },
  ];

  return res.status(200).json({ languages });
}
