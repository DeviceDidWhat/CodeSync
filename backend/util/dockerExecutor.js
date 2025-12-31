import Docker from 'dockerode';

const docker = new Docker();

// Language configurations with Docker images
const LANGUAGE_CONFIGS = {
  javascript: {
    image: 'node:18-alpine',
    extension: 'js',
    compileCommand: null,
    executeCommand: ['node', '/code/main.js'],
    executionTimeout: 10000, // 10 seconds
    needsCompilation: false,
  },
  python: {
    image: 'python:3.10-alpine',
    extension: 'py',
    compileCommand: null,
    executeCommand: ['python', '/code/main.py'],
    executionTimeout: 10000,
    needsCompilation: false,
  },
  c: {
    image: 'gcc:11',
    extension: 'c',
    compileCommand: ['gcc', '/code/main.c', '-o', '/code/main', '-O2'],
    executeCommand: ['/code/main'],
    executionTimeout: 5000,
    compilationTimeout: 30000,
    needsCompilation: true,
  },
  cpp: {
    image: 'gcc:11',
    extension: 'cpp',
    compileCommand: [
      'g++',
      '/code/main.cpp',
      '-o',
      '/code/main',
      '-O3',                    // Maximum optimization
      '-std=c++17',
      '-march=native',          // CPU-specific optimizations
      '-mtune=native',
      '-ffast-math',            // Fast floating point
    ],
    executeCommand: ['/code/main'],
    executionTimeout: 5000,    
    compilationTimeout: 60000,
    needsCompilation: true,
  },
};

// Resource limits - INCREASED for large test cases
const RESOURCE_LIMITS = {
  Memory: 1024 * 1024 * 1024, // 1GB (increased from 512MB)
  MemorySwap: 1024 * 1024 * 1024,
  NanoCpus: 2000000000, // 2 CPU cores (increased from 1)
  PidsLimit: 50,
};

// Compilation limits
const COMPILATION_LIMITS = {
  Memory: 2 * 1024 * 1024 * 1024, // 2GB
  MemorySwap: 2 * 1024 * 1024 * 1024,
  NanoCpus: 2000000000,
  PidsLimit: 100,
};

/**
 * Execute code in an isolated Docker container with separate compilation and execution phases
 * @param {string} language - Programming language
 * @param {string} code - Source code to execute
 * @param {string} stdin - Optional stdin input for the program (for test cases)
 * @returns {Promise<{success: boolean, output?: string, error?: string, executionTime?: number, compilationTime?: number, timeLimitExceeded?: boolean, compilationError?: boolean}>}
 */
export async function executeCodeInDocker(language, code, stdin = '') {
  const config = LANGUAGE_CONFIGS[language];

  if (!config) {
    return {
      success: false,
      error: `Unsupported language: ${language}`,
    };
  }

  let compileContainer;
  let executeContainer;
  let compilationTime = 0;

  try {
    await ensureImageExists(config.image);

    const filename = language === 'java' ? 'Main.java' : `main.${config.extension}`;

    // PHASE 1: COMPILATION (if needed)
    if (config.needsCompilation) {
      const compileResult = await compileCode(config, filename, code);
      
      if (!compileResult.success) {
        return {
          success: false,
          error: compileResult.error,
          output: compileResult.output,
          compilationTime: compileResult.compilationTime,
          compilationError: true,
          timeLimitExceeded: false,
        };
      }
      
      compilationTime = compileResult.compilationTime;
    } else {
      await writeCodeToTempDir(filename, code);
    }

    // PHASE 2: EXECUTION (with strict time limit)
    const executeResult = await executeCode(config, filename, code, stdin);

    return {
      ...executeResult,
      compilationTime,
    };

  } catch (error) {
    return {
      success: false,
      error: `System error: ${error.message}`,
      executionTime: 0,
      compilationTime,
      timeLimitExceeded: false,
    };
  }
}

async function compileCode(config, filename, code) {
  let container;
  const startTime = Date.now();

  try {
    await writeCodeToTempDir(filename, code);

    container = await docker.createContainer({
      Image: config.image,
      Cmd: config.compileCommand,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      NetworkDisabled: true,
      HostConfig: {
        Memory: COMPILATION_LIMITS.Memory,
        MemorySwap: COMPILATION_LIMITS.MemorySwap,
        NanoCpus: COMPILATION_LIMITS.NanoCpus,
        PidsLimit: COMPILATION_LIMITS.PidsLimit,
        SecurityOpt: ['no-new-privileges'],
        Binds: [`${process.cwd()}/tmp:/code`],
      },
    });

    await container.start();

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Compilation Timeout'));
      }, config.compilationTimeout);
    });

    const waitPromise = container.wait();
    const result = await Promise.race([waitPromise, timeoutPromise]);

    const compilationTime = Date.now() - startTime;
    const logs = await container.logs({ stdout: true, stderr: true });
    const output = cleanDockerOutput(logs);

    await container.remove({ force: true });

    if (result.StatusCode !== 0) {
      return {
        success: false,
        error: 'Compilation Error',
        output,
        compilationTime,
      };
    }

    return {
      success: true,
      compilationTime,
    };

  } catch (error) {
    if (container) {
      try {
        await container.remove({ force: true });
      } catch (e) {
        console.error('Cleanup error:', e.message);
      }
    }

    const compilationTime = Date.now() - startTime;

    if (error.message === 'Compilation Timeout') {
      return {
        success: false,
        error: 'Compilation Timeout',
        output: `Compilation exceeded ${config.compilationTimeout}ms`,
        compilationTime,
      };
    }

    return {
      success: false,
      error: `Compilation failed: ${error.message}`,
      compilationTime,
    };
  }
}

/**
 * OPTIMIZED: Execute with buffered stdin writing
 */
async function executeCode(config, filename, code, stdin = '') {
  let container;
  let startTime;
  let timeoutHandle;
  let isTimedOut = false;

  try {
    container = await docker.createContainer({
      Image: config.image,
      Cmd: config.executeCommand,
      AttachStdout: true,
      AttachStderr: true,
      AttachStdin: stdin ? true : false,
      OpenStdin: stdin ? true : false,
      StdinOnce: stdin ? true : false,
      Tty: false,
      NetworkDisabled: true,
      HostConfig: {
        Memory: RESOURCE_LIMITS.Memory,
        MemorySwap: RESOURCE_LIMITS.MemorySwap,
        NanoCpus: RESOURCE_LIMITS.NanoCpus,
        PidsLimit: RESOURCE_LIMITS.PidsLimit,
        SecurityOpt: ['no-new-privileges'],
        Binds: [`${process.cwd()}/tmp:/code`],
      },
    });

    await container.start();

    // OPTIMIZED: Write stdin in larger chunks if provided
    if (stdin) {
      const stream = await container.attach({
        stream: true,
        stdin: true,
        stdout: false,
        stderr: false,
      });

      // Write entire stdin at once (buffered)
      stream.write(stdin);
      stream.end();
    }

    // Start timing AFTER stdin is written
    startTime = Date.now();

    const killPromise = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(async () => {
        isTimedOut = true;
        try {
          await container.kill({ signal: 'SIGKILL' });
          reject(new Error('TLE'));
        } catch (killError) {
          reject(killError);
        }
      }, config.executionTimeout);
    });

    const waitPromise = container.wait();

    let result;
    try {
      result = await Promise.race([waitPromise, killPromise]);
    } catch (error) {
      if (error.message === 'TLE' || isTimedOut) {
        clearTimeout(timeoutHandle);
        
        let output = '';
        try {
          const logs = await container.logs({ stdout: true, stderr: true });
          output = cleanDockerOutput(logs);
        } catch (e) {
          // Ignore
        }

        await container.remove({ force: true });

        return {
          success: false,
          error: `Time Limit Exceeded (${config.executionTimeout}ms)`,
          output: output || 'No output (execution terminated)',
          executionTime: config.executionTimeout,
          timeLimitExceeded: true,
        };
      }
      throw error;
    }

    clearTimeout(timeoutHandle);

    const executionTime = Date.now() - startTime;

    const logs = await container.logs({ stdout: true, stderr: true });
    const output = cleanDockerOutput(logs);

    await container.remove({ force: true });

    if (result.StatusCode === 137 || result.StatusCode === 143) {
      return {
        success: false,
        error: `Time Limit Exceeded (${config.executionTimeout}ms)`,
        output: output || 'No output',
        executionTime,
        timeLimitExceeded: true,
      };
    }

    if (result.StatusCode === 0) {
      return {
        success: true,
        output: output || 'No output',
        executionTime,
        timeLimitExceeded: false,
      };
    } else {
      return {
        success: false,
        error: `Runtime Error (Exit code: ${result.StatusCode})`,
        output: output || 'No output',
        executionTime,
        timeLimitExceeded: false,
      };
    }

  } catch (error) {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }

    const executionTime = startTime ? Date.now() - startTime : 0;

    if (container) {
      try {
        await container.remove({ force: true });
      } catch (cleanupError) {
        console.error('Container cleanup error:', cleanupError.message);
      }
    }

    if (isTimedOut || error.message === 'TLE') {
      return {
        success: false,
        error: `Time Limit Exceeded (${config.executionTimeout}ms)`,
        executionTime: config.executionTimeout,
        timeLimitExceeded: true,
      };
    }

    return {
      success: false,
      error: `Execution failed: ${error.message}`,
      executionTime,
      timeLimitExceeded: false,
    };
  }
}

async function writeCodeToTempDir(filename, content) {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const tmpDir = path.join(process.cwd(), 'tmp');
  
  try {
    await fs.mkdir(tmpDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
  
  const filePath = path.join(tmpDir, filename);
  await fs.writeFile(filePath, content, 'utf-8');
}

function cleanDockerOutput(buffer) {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  let output = '';
  let offset = 0;

  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) {
      output += buffer.slice(offset).toString('utf-8');
      break;
    }

    const streamType = buffer[offset];
    const size = buffer.readUInt32BE(offset + 4);

    offset += 8;

    if (offset + size <= buffer.length) {
      output += buffer.slice(offset, offset + size).toString('utf-8');
      offset += size;
    } else {
      output += buffer.slice(offset).toString('utf-8');
      break;
    }
  }

  // eslint-disable-next-line no-control-regex
  output = output.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
  // eslint-disable-next-line no-control-regex
  output = output.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  return output.trim();
}

async function ensureImageExists(imageName) {
  try {
    await docker.getImage(imageName).inspect();
  } catch (error) {
    console.log(`Pulling image: ${imageName}...`);
    await new Promise((resolve, reject) => {
      docker.pull(imageName, (err, stream) => {
        if (err) return reject(err);

        docker.modem.followProgress(stream, (err, output) => {
          if (err) return reject(err);
          resolve(output);
        });
      });
    });
    console.log(`Image pulled successfully: ${imageName}`);
  }
}

export async function pullAllImages() {
  console.log('Pulling Docker images for code execution...');
  const images = [...new Set(Object.values(LANGUAGE_CONFIGS).map(c => c.image))];

  for (const image of images) {
    try {
      await ensureImageExists(image);
    } catch (error) {
      console.error(`Failed to pull image ${image}:`, error.message);
    }
  }
  console.log('All Docker images ready!');
}

export async function checkDockerAvailability() {
  try {
    await docker.ping();
    return true;
  } catch (error) {
    console.error('Docker is not available:', error.message);
    return false;
  }
}

export async function cleanupTempFiles() {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const tmpDir = path.join(process.cwd(), 'tmp');
  
  try {
    await fs.rm(tmpDir, { recursive: true, force: true });
    await fs.mkdir(tmpDir, { recursive: true });
  } catch (error) {
    console.error('Cleanup error:', error.message);
  }
}