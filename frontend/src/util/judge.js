import { CPP_TYPE_REGISTRY } from "./CPP_REGISTRY.js";
import { typeToCppKey } from "./typeToCppKey.js";

/* --------------------------------
   Build single C++ parameter
-------------------------------- */
function buildCppParam(name, cppType, value) {
  const handler = CPP_TYPE_REGISTRY[cppType];
  if (!handler) {
    throw new Error(`Unsupported C++ type: ${cppType}`);
  }

  if (cppType.endsWith("[]") && !Array.isArray(value)) {
    throw new Error(
      `Expected array for type ${cppType}, got ${typeof value}`
    );
  }

  return handler.declare(name, value);
}

/* --------------------------------
   Generate full C++ judge program
-------------------------------- */
export function generateCppJudge(problem, userCode) {
  const { functionName, parameters, testCases, returnType } = problem;

  const isVoid =
    returnType === "void" || returnType?.kind === "void";

  const tests = testCases
    .map((tc, i) => {
      /* -----------------------------
         STEP 9 APPLIED HERE
      ----------------------------- */
      const vars = parameters
        .map((param, idx) => {
          const cppType = typeToCppKey(param.type); // 🔥 FIX
          return buildCppParam(
            `arg${idx}_${i}`,
            cppType,
            tc.input[idx]
          );
        })
        .join("\n");

      const callArgs = parameters
        .map((_, idx) => `arg${idx}_${i}`)
        .join(", ");

      return `
{
    ${vars}
    ${isVoid ? "" : `auto result${i} = `}${functionName}(${callArgs});
    ${isVoid ? `printValue(arg0_${i});` : `printValue(result${i});`}
    cout << endl;
}`;
    })
    .join("\n");

  return `
#include <bits/stdc++.h>
using namespace std;

/* -------- Serializer -------- */

template <typename T>
void printValue(const T& value) {
    cout << value;
}

void printValue(const bool& value) {
    cout << (value ? "true" : "false");
}

void printValue(const string& value) {
    cout << "\\"" << value << "\\"";
}

template <typename T>
void printValue(const vector<T>& vec) {
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
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    ${tests}

    return 0;
}
`;
}
