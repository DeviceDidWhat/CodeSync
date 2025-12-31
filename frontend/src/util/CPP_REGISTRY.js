function escapeCppString(str) {
    return str
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\t/g, "\\t");
}

export const CPP_TYPE_REGISTRY = {

    /* ---------- Primitives ---------- */

    int: {
        declare: (name, value) =>
            `int ${name} = ${value};`,
        readFromStdin: (name) =>
            `cin >> ${name};`
    },

    long: {
        declare: (name, value) =>
            `long long ${name} = ${value};`,
        readFromStdin: (name) =>
            `cin >> ${name};`
    },

    double: {
        declare: (name, value) =>
            `double ${name} = ${value};`,
        readFromStdin: (name) =>
            `cin >> ${name};`
    },

    bool: {
        declare: (name, value) =>
            `bool ${name} = ${value ? "true" : "false"};`,
        readFromStdin: (name) =>
            `cin >> ${name};`
    },

    char: {
        declare: (name, value) =>
            `char ${name} = '${value}';`,
        readFromStdin: (name) =>
            `cin >> ${name};`
    },

    string: {
        declare: (name, value) =>
            `string ${name} = "${escapeCppString(value)}";`,
        readFromStdin: (name) =>
            `cin >> ${name};`
    },

    /* ---------- 1D Arrays ---------- */

    "int[]": {
        declare: (name, value) =>
            `vector<int> ${name} = {${value.join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector<int>();`
    },

    "long[]": {
        declare: (name, value) =>
            `vector<long long> ${name} = {${value.join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector<long long>();`
    },

    "double[]": {
        declare: (name, value) =>
            `vector<double> ${name} = {${value.join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector<double>();`
    },

    "bool[]": {
        declare: (name, value) =>
            `vector<bool> ${name} = {${value.map(v => v ? "true" : "false").join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector<bool>();`
    },

    "char[]": {
        declare: (name, value) =>
            `vector<char> ${name} = {${value.map(v => `'${v}'`).join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector<char>();`
    },

    "string[]": {
        declare: (name, value) =>
            `vector<string> ${name} = {${value
                .map(v => `"${escapeCppString(v)}"`)
                .join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector<string>();`
    },

    /* ---------- 2D Arrays ---------- */

    "int[][]": {
        declare: (name, value) =>
            `vector<vector<int>> ${name} = {${value
                .map(row => `{${row.join(",")}}`)
                .join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector2D<int>();`
    },

    "long[][]": {
        declare: (name, value) =>
            `vector<vector<long long>> ${name} = {${value
                .map(row => `{${row.join(",")}}`)
                .join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector2D<long long>();`
    },

    "double[][]": {
        declare: (name, value) =>
            `vector<vector<double>> ${name} = {${value
                .map(row => `{${row.join(",")}}`)
                .join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector2D<double>();`
    },

    "char[][]": {
        declare: (name, value) =>
            `vector<vector<char>> ${name} = {${value
                .map(row => `{${row.map(v => `'${v}'`).join(",")}}`)
                .join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector2D<char>();`
    },

    "string[][]": {
        declare: (name, value) =>
            `vector<vector<string>> ${name} = {${value
                .map(
                    row =>
                        `{${row
                            .map(v => `"${escapeCppString(v)}"`)
                            .join(",")}}`
                )
                .join(",")}};`,
        readFromStdin: (name) =>
            `${name} = readVector2D<string>();`
    }
};