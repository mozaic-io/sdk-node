module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    collectCoverage: true,
    coverageReporters: ["json", "html"],
    collectCoverageFrom: ['src/**/*.ts','!src/api/**/*.ts']
  };