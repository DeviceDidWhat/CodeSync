# Standard Input (stdin) Support for Large Test Cases

## The Problem

When embedding large test cases (like 100,000 rows × 3 columns) directly in C++ source code as arrays, the compiler crashes with:
```
g++: internal compiler error: Segmentation fault signal terminated program cc1plus
```

This happens because:
- The source file becomes **extremely large** (50MB+ with embedded data)
- g++ runs out of memory trying to parse and compile the massive literal array
- Even with 2GB RAM, the compiler cannot handle such large embedded data

## The Solution: stdin Input (Like LeetCode)

LeetCode doesn't embed test data in source code. Instead:
1. **Small source file** with just the solution code
2. **Test data passed separately** via stdin at runtime
3. **No compilation overhead** from large data arrays

## How to Use

### Backend API

The `/api/code/execute` endpoint now accepts an optional `stdin` parameter:

```javascript
POST /api/code/execute
{
  "language": "cpp",
  "code": "// your C++ code that reads from cin",
  "stdin": "100000\n1 2 3\n4 5 6\n..."  // Large test data
}
```

### Frontend Usage

```javascript
import { executeCode } from './util/piston.js';

// Execute with stdin input
const result = await executeCode(
  'cpp',
  yourCode,
  largeTestCaseData  // Pass test data as stdin
);
```

## Example: Before vs After

### ❌ Before (Causes Crash)

```cpp
// 50MB+ file - compiler crashes
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> testCase = {
        {1, 2, 3},
        {4, 5, 6},
        // ... 99,998 more rows (MASSIVE FILE!)
    };

    // Your solution here
    return 0;
}
```

### ✅ After (Works Perfectly)

**C++ Code (Small file):**
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;  // Read number of rows

    vector<vector<int>> testCase(n, vector<int>(3));
    for (int i = 0; i < n; i++) {
        cin >> testCase[i][0] >> testCase[i][1] >> testCase[i][2];
    }

    // Your solution here

    return 0;
}
```

**stdin Input (Passed separately):**
```
100000
1 2 3
4 5 6
7 8 9
...
```

## Benefits

1. ✅ **No Compilation Crashes** - Small source files compile instantly
2. ✅ **Handles Massive Test Cases** - stdin can be gigabytes if needed
3. ✅ **Just Like LeetCode** - Same approach as competitive programming platforms
4. ✅ **Memory Efficient** - Data streamed at runtime, not compiled into binary
5. ✅ **Faster Compilation** - No need to parse huge literal arrays

## Resource Limits

Current configuration:
- **Compilation**: 2GB RAM, 2 CPU cores, 60 seconds timeout
- **Execution**: 512MB RAM, 1 CPU core, configurable timeout
- **Code Size**: Max 5MB (source code only, not including stdin)
- **stdin Size**: No strict limit (controlled by overall request size)

## Implementation Details

### Backend Changes

1. **dockerExecutor.js** - Added stdin parameter and Docker stdin attachment
2. **executeController.js** - Accept and forward stdin from request body
3. **piston.js** - Frontend utility function accepts stdin parameter

### How It Works

1. Code file is written to `/code/main.cpp` (small file)
2. Compilation happens (fast, no large data)
3. Execution container starts with stdin attached
4. stdin data is streamed to the running process
5. Program reads from `cin`/`scanf`/`input()` as normal
6. Output captured and returned

## Migration Guide

If you have existing code with embedded test cases:

1. **Extract test data** from your source code
2. **Add input reading** to your code (use `cin`, `scanf`, etc.)
3. **Pass test data** as the `stdin` parameter
4. **Enjoy instant compilation** instead of crashes!

## Example API Call

```bash
curl -X POST http://localhost:5000/api/code/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "cpp",
    "code": "#include <iostream>\nusing namespace std;\nint main() {\n  int n;\n  cin >> n;\n  cout << \"Received: \" << n << endl;\n  return 0;\n}",
    "stdin": "42"
  }'
```

Response:
```json
{
  "success": true,
  "output": "Received: 42",
  "executionTime": 125,
  "compilationTime": 1843,
  "timeLimitExceeded": false
}
```
