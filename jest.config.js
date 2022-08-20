module.exports = {
    transformIgnorePatterns: [
        ".*/node_modules/(?!(lighthouse)/)"
      ],
    testTimeout: 20000,
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ]
}