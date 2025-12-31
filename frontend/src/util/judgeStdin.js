/**
 * Parse type object and return C++ type info
 * @param {object|string} type - Type object or string
 * @returns {{cppType: string, isVector: boolean, is2DVector: boolean, innerType: string}}
 */
function parseType(type) {
  // If it's already a string (from typeToCppKey), parse it
  if (typeof type === 'string') {
    if (type.endsWith('[][]')) {
      const base = type.replace('[][]', '');
      return {
        cppType: `vector<vector<${base}>>`,
        isVector: true,
        is2DVector: true,
        innerType: base
      };
    } else if (type.endsWith('[]')) {
      const base = type.replace('[]', '');
      return {
        cppType: `vector<${base}>`,
        isVector: true,
        is2DVector: false,
        innerType: base
      };
    } else if (type === 'long') {
      return {
        cppType: 'long long',
        isVector: false,
        is2DVector: false,
        innerType: null
      };
    } else {
      return {
        cppType: type,
        isVector: false,
        is2DVector: false,
        innerType: null
      };
    }
  }
  
  // If it's a type object, parse it
  if (type.kind === 'array') {
    if (type.element && type.element.kind === 'array') {
      // 2D array
      const innerType = getBaseType(type.element.element);
      return {
        cppType: `vector<vector<${innerType}>>`,
        isVector: true,
        is2DVector: true,
        innerType: innerType
      };
    } else {
      // 1D array
      const innerType = getBaseType(type.element);
      return {
        cppType: `vector<${innerType}>`,
        isVector: true,
        is2DVector: false,
        innerType: innerType
      };
    }
  }
  
  // Primitive type
  const baseType = getBaseType(type);
  return {
    cppType: baseType,
    isVector: false,
    is2DVector: false,
    innerType: null
  };
}

/**
 * Get base C++ type from type object
 */
function getBaseType(type) {
  if (typeof type === 'string') {
    return type === 'long' ? 'long long' : type;
  }
  
  switch (type.kind) {
    case 'number': return 'int';
    case 'long': return 'long long';
    case 'double': return 'double';
    case 'string': return 'string';
    case 'boolean': return 'bool';
    default: return 'int';
  }
}

/**
 * Generate optimized C++ variable declarations
 */
function generateVariableDeclarations(parameters) {
  return parameters
    .map((param, idx) => {
      const typeInfo = parseType(param.type);
      return `${typeInfo.cppType} arg${idx};`;
    })
    .join("\n        ");
}

/**
 * Generate ULTRA-optimized C++ input reading code
 * Uses getline for vectors to read entire lines at once
 */
function generateOptimizedReader(param, idx) {
  const varName = `arg${idx}`;
  const typeInfo = parseType(param.type);
  
  if (typeInfo.is2DVector) {
    // 2D vector - read all values as fast as possible
    return `{
            int rows, cols;
            cin >> rows >> cols;
            ${varName}.assign(rows, vector<${typeInfo.innerType}>(cols));
            for (int i = 0; i < rows; i++) {
                for (int j = 0; j < cols; j++) {
                    cin >> ${varName}[i][j];
                }
            }
        }`;
  } else if (typeInfo.isVector) {
    // 1D vector - optimized reading
    return `{
            int size;
            cin >> size;
            ${varName}.assign(size, ${typeInfo.innerType}());
            for (int i = 0; i < size; i++) {
                cin >> ${varName}[i];
            }
        }`;
  } else if (typeInfo.cppType === "string") {
    return `{
            string temp;
            cin >> temp;
            ${varName} = temp.substr(1, temp.length() - 2);
        }`;
  } else if (typeInfo.cppType === "bool") {
    return `{
            int temp;
            cin >> temp;
            ${varName} = (temp == 1);
        }`;
  } else {
    return `cin >> ${varName};`;
  }
}

/**
 * Generate minimal serializer based on return type
 */
function generateMinimalSerializer(returnType) {
  const typeInfo = parseType(returnType);
  
  // For primitive types, just output directly - MUCH faster
  if (!typeInfo.isVector && !typeInfo.is2DVector) {
    if (typeInfo.cppType === 'bool') {
      return `cout << (result ? "true" : "false");`;
    } else if (typeInfo.cppType === 'string') {
      return `cout << "\\"" << result << "\\"";`;
    } else {
      return `cout << result;`; // Direct output for numbers
    }
  }
  
  // For arrays, use the template serializer
  return `printValue(result);`;
}

/**
 * Generate C++ code that reads test cases from stdin (ULTRA-OPTIMIZED)
 * @param {object} problem - Problem object with parameters and return type
 * @param {string} userCode - User's solution code
 * @returns {string} Complete C++ program that reads from stdin
 */
export function generateCppJudgeStdin(problem, userCode) {
  const { functionName, parameters, returnType } = problem;

  const isVoid = returnType === "void" || returnType?.kind === "void";

  // Generate variable declarations
  const variableDeclarations = generateVariableDeclarations(parameters);

  // Generate optimized parameter reading
  const readParameters = parameters
    .map((param, idx) => {
      return generateOptimizedReader(param, idx);
    })
    .join("\n        ");

  const callArgs = parameters.map((_, idx) => `arg${idx}`).join(", ");

  // Generate minimal output serialization
  const outputCode = isVoid 
    ? `printValue(arg0);`
    : generateMinimalSerializer(returnType);

  return `
#include <bits/stdc++.h>
using namespace std;

/* -------- ULTRA Fast I/O -------- */
static auto _fast_io = []() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
    return 0;
}();

/* -------- Minimal Serializer (only for arrays) -------- */

template <typename T>
inline void printValue(const T& value) {
    cout << value;
}

inline void printValue(const bool& value) {
    cout << (value ? "true" : "false");
}

inline void printValue(const string& value) {
    cout << "\\"" << value << "\\"";
}

template <typename T>
inline void printValue(const vector<T>& vec) {
    cout << "[";
    for (size_t i = 0; i < vec.size(); i++) {
        printValue(vec[i]);
        if (i + 1 < vec.size()) cout << ",";
    }
    cout << "]";
}

/* -------- User Code -------- */

${userCode}

/* -------- Main -------- */

int main() {
    int numTestCases;
    cin >> numTestCases;

    for (int tc = 0; tc < numTestCases; tc++) {
        ${variableDeclarations}
        ${readParameters}

        ${isVoid ? "" : `auto result = `}${functionName}(${callArgs});
        ${outputCode}
        cout << '\\n';
    }

    return 0;
}
`;
}

/**
 * Generate optimized stdin input data from test cases
 * Uses space-separated format for faster parsing
 * @param {object} problem - Problem object with parameters and test cases
 * @returns {string} Formatted stdin input
 */
export function generateStdinInput(problem) {
  const { parameters, testCases } = problem;

  const lines = [`${testCases.length}`]; // Number of test cases

  for (const tc of testCases) {
    for (let i = 0; i < parameters.length; i++) {
      const param = parameters[i];
      const value = tc.input[i];
      const typeInfo = parseType(param.type);

      const formatted = formatValueForStdin(value, typeInfo);
      lines.push(formatted);
    }
  }

  return lines.join("\n");
}

/**
 * Format a value for stdin input (OPTIMIZED - space separated)
 * @param {any} value - The value to format
 * @param {object} typeInfo - Type info object from parseType
 * @returns {string} Formatted string for stdin
 */
function formatValueForStdin(value, typeInfo) {
  // Handle arrays/vectors
  if (typeInfo.is2DVector) {
    // 2D vector - all on separate lines for faster parsing
    if (!Array.isArray(value) || value.length === 0) {
      return "0 0";
    }
    const rows = value.length;
    const cols = value[0]?.length || 0;
    const lines = [`${rows} ${cols}`];
    
    for (const row of value) {
      lines.push(row.join(" ")); // All row elements space-separated
    }
    return lines.join("\n");
  } else if (typeInfo.isVector) {
    // 1D vector - space separated for faster parsing
    if (!Array.isArray(value)) {
      return `1\n${value}`;
    }
    return `${value.length}\n${value.join(" ")}`;
  } else if (typeInfo.cppType === "string") {
    return `"${value}"`;
  } else if (typeInfo.cppType === "bool") {
    return value ? "1" : "0";
  } else {
    // Primitive types (int, double, etc.)
    return String(value);
  }
}