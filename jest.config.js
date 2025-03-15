export default {
    transform: {},
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/**',
        '!src/docs/**',
        '!src/**/*.test.js',
        '!src/index.js'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    testEnvironment: "node",
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    }
}; 