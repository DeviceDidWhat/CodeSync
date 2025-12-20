// src/data/problems.js

export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",

    description: {
      text:
        "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution.",
        "You may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },

    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],

    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists",
    ],

    // CORE METADATA (used by judge)
    functionName: "twoSum",

    parameters: [
      { name: "nums", type: "int[]" },
      { name: "target", type: "int" },
    ],

    returnType: {
      kind: "array",
      element: { kind: "primitive", name: "int" }
    },


    starterCode: {
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}`,
    },

    // Hidden tests (judge only)
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1] },
      { input: [[3, 2, 4], 6], output: [1, 2] },
      { input: [[3, 3], 6], output: [0, 1] },
      { input: [[1, 5, 0, 7], 8], output: [0, 3] },
      { input: [[0, 4, 3, 0], 0], output: [0, 3] },
      { input: [[-1, -2, -3, -4, -5], -8], output: [2, 4] },
      { input: [[1000000000, -1000000000], 0], output: [0, 1] },
    ],
  },

  "max-subarray": {
    id: "max-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",

    description: {
      text:
        "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
      notes: [
        "The subarray must contain at least one number."
      ],
    },

    functionName: "maxSubArray",

    parameters: [
      { name: "nums", type: "int[]" }
    ],

    returnType: {
      kind: "primitive",
      name: "int"
    },

    starterCode: {
      cpp: `int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}`
    },

    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], output: 6 },
      { input: [[1]], output: 1 },
      { input: [[5, 4, -1, 7, 8]], output: 23 }
    ]
  },

  "best-time-stock": {
    id: "best-time-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array • Greedy",

    description: {
      text:
        "You are given an array prices where prices[i] is the price of a stock on the ith day.",
      notes: [
        "You want to maximize profit by choosing a single day to buy and a different day to sell."
      ],
    },

    functionName: "maxProfit",

    parameters: [
      { name: "prices", type: "int[]" }
    ],

    returnType: {
      kind: "primitive",
      name: "int"
    },

    starterCode: {
      cpp: `int maxProfit(vector<int>& prices) {
    // Write your solution here
    return 0;
}`
    },

    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], output: 5 },
      { input: [[7, 6, 4, 3, 1]], output: 0 }
    ]
  },

  "move-zeroes": {
    id: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    category: "Array • Two Pointers",

    description: {
      text:
        "Given an integer array nums, move all 0's to the end while maintaining the relative order of non-zero elements.",
      notes: [
        "Return the resulting array."
      ],
    },

    functionName: "moveZeroes",

    parameters: [
      { name: "nums", type: "int[]" }
    ],

    returnType: {
      kind: "array",
      element: { kind: "primitive", name: "int" }
    },

    starterCode: {
      cpp: `vector<int> moveZeroes(vector<int>& nums) {
    // Write your solution here
    return nums;
}`
    },

    testCases: [
      { input: [[0, 1, 0, 3, 12]], output: [1, 3, 12, 0, 0] },
      { input: [[0]], output: [0] },
      { input: [[1, 2, 3]], output: [1, 2, 3] }
    ]
  },

  "running-sum": {
    id: "running-sum",
    title: "Running Sum of 1D Array",
    difficulty: "Easy",
    category: "Array • Prefix Sum",

    description: {
      text:
        "Given an array nums, return the running sum of nums.",
    },

    functionName: "runningSum",

    parameters: [
      { name: "nums", type: "int[]" }
    ],

    returnType: {
      kind: "array",
      element: { kind: "primitive", name: "int" }
    },

    starterCode: {
      cpp: `vector<int> runningSum(vector<int>& nums) {
    // Write your solution here
    return {};
}`
    },

    testCases: [
      { input: [[1, 2, 3, 4]], output: [1, 3, 6, 10] },
      { input: [[1, 1, 1, 1, 1]], output: [1, 2, 3, 4, 5] }
    ]
  },

  "matrix-diagonal-sum": {
    id: "matrix-diagonal-sum",
    title: "Matrix Diagonal Sum",
    difficulty: "Easy",
    category: "Array • Matrix",

    description: {
      text:
        "Given a square matrix mat, return the sum of the matrix diagonals.",
      notes: [
        "Only count the center element once."
      ],
    },

    functionName: "diagonalSum",

    parameters: [
      { name: "mat", type: "int[][]" }
    ],

    returnType: {
      kind: "primitive",
      name: "int"
    },

    starterCode: {
      cpp: `int diagonalSum(vector<vector<int>>& mat) {
    // Write your solution here
    return 0;
}`
    },

    testCases: [
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], output: 25 },
      { input: [[[1, 1, 1], [1, 1, 1], [1, 1, 1]]], output: 5 }
    ]
  },

};

export const LANGUAGE_CONFIG = {
  // javascript: { name: "JavaScript", icon: "/javascript.png", monacoLang: "javascript" },
  // python: { name: "Python", icon: "/python.png", monacoLang: "python" },
  // java: { name: "Java", icon: "/java.png", monacoLang: "java" },
  cpp: { name: "C++", icon: "/cpp.png", monacoLang: "cpp" },
};