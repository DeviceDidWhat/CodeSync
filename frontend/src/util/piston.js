// CodeSync Code Execution Service
// Uses our own backend Docker-based execution engine

const API_URL = import.meta.env.VITE_API_URL;

const SUPPORTED_LANGUAGES = {
  javascript: "javascript",
  python: "python",
  java: "java",
  c: "c",
  cpp: "cpp",
};

/**
 * Execute code using our backend execution service
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @param {string} stdin - optional stdin input for the program
 * @returns {Promise<{success:boolean, output?:string, error?: string, executionTime?: number}>}
 */
export async function executeCode(language, code, stdin = '') {
  try {
    if (!SUPPORTED_LANGUAGES[language]) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await fetch(`${API_URL}/code/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify({
        language: language,
        code: code,
        stdin: stdin,
      }),
    });

    if (!response.ok) {
      // Handle specific HTTP errors
      if (response.status === 429) {
        const data = await response.json();
        return {
          success: false,
          error: data.error || "Rate limit exceeded. Please try again later.",
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          error: "Authentication required to execute code.",
        };
      }

      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();

    // The backend returns { success, output?, error?, executionTime? }
    return data;
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

/**
 * Get list of supported languages
 * @returns {Promise<Array>}
 */
export async function getSupportedLanguages() {
  try {
    const response = await fetch(`${API_URL}/code/languages`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.languages || [];
  } catch (error) {
    console.error("Failed to fetch supported languages:", error);
    return [];
  }
}