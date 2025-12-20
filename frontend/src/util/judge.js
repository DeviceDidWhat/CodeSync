import { CPP_TYPE_REGISTRY } from "./CPP_REGISTRY.js";

function buildCppParam(name, type, value) {
    const handler = CPP_TYPE_REGISTRY[type];
    if (!handler) {
        throw new Error(`Unsupported C++ type: ${type}`);
    }
    return handler.declare(name, value);
}

export function generateCppJudge(problem, userCode) {
    const { functionName, parameters, testCases, returnType } = problem;
    const isVoid = returnType === "void" || returnType.kind === "void";

    const tests = testCases.map((tc, i) => {
        const vars = parameters
            .map((param, idx) => buildCppParam(`arg${idx}_${i}`, param.type, tc.input[idx]))
            .join("\n");

        const callArgs = parameters.map((_, idx) => `arg${idx}_${i}`).join(", ");

        return `
{
    ${vars}
    ${isVoid ? '' : `auto result${i} = `}${functionName}(${callArgs});
    ${isVoid ? `printValue(arg0_${i});` : `printValue(result${i});`}
    cout << endl;
}`;
    }).join("\n");

    return `
#include <bits/stdc++.h>
using namespace std;

// Enhanced Serializer
template <typename T>
void printValue(const T& value) { cout << value; }
void printValue(const bool& value) { cout << (value ? "true" : "false"); }
void printValue(const string& value) { cout << "\\"" << value << "\\""; }

template <typename T>
void printValue(const vector<T>& vec) {
    cout << "[";
    for (size_t i = 0; i < vec.size(); i++) {
        printValue(vec[i]);
        if (i + 1 < vec.size()) cout << ",";
    }
    cout << "]";
}

${userCode}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    ${tests}
    return 0;
}
`;
}