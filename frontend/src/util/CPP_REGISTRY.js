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
            `int ${name} = ${value};`
    },

    long: {
        declare: (name, value) =>
            `long long ${name} = ${value};`
    },

    double: {
        declare: (name, value) =>
            `double ${name} = ${value};`
    },

    bool: {
        declare: (name, value) =>
            `bool ${name} = ${value ? "true" : "false"};`
    },

    char: {
        declare: (name, value) =>
            `char ${name} = '${value}';`
    },

    string: {
        declare: (name, value) =>
            `string ${name} = "${escapeCppString(value)}";`
    },

    /* ---------- 1D Arrays ---------- */

    "int[]": {
        declare: (name, value) =>
            `vector<int> ${name} = {${value.join(",")}};`
    },

    "long[]": {
        declare: (name, value) =>
            `vector<long long> ${name} = {${value.join(",")}};`
    },

    "double[]": {
        declare: (name, value) =>
            `vector<double> ${name} = {${value.join(",")}};`
    },

    "bool[]": {
        declare: (name, value) =>
            `vector<bool> ${name} = {${value.map(v => v ? "true" : "false").join(",")}};`
    },

    "char[]": {
        declare: (name, value) =>
            `vector<char> ${name} = {${value.map(v => `'${v}'`).join(",")}};`
    },

    "string[]": {
        declare: (name, value) =>
            `vector<string> ${name} = {${value
                .map(v => `"${escapeCppString(v)}"`)
                .join(",")}};`
    },

    /* ---------- 2D Arrays ---------- */

    "int[][]": {
        declare: (name, value) =>
            `vector<vector<int>> ${name} = {${value
                .map(row => `{${row.join(",")}}`)
                .join(",")}};`
    },

    "long[][]": {
        declare: (name, value) =>
            `vector<vector<long long>> ${name} = {${value
                .map(row => `{${row.join(",")}}`)
                .join(",")}};`
    },

    "double[][]": {
        declare: (name, value) =>
            `vector<vector<double>> ${name} = {${value
                .map(row => `{${row.join(",")}}`)
                .join(",")}};`
    },

    "char[][]": {
        declare: (name, value) =>
            `vector<vector<char>> ${name} = {${value
                .map(row => `{${row.map(v => `'${v}'`).join(",")}}`)
                .join(",")}};`
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
                .join(",")}};`
    }
};