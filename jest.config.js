/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  coverageProvider: 'v8',
  collectCoverage: true,
  verbose: true,
  forceExit: true,
  preset: 'ts-jest',
  setupFiles: [
    '<rootDir>/setupTests.js'
  ],
  transform: {
    '^.+\\.(js|ts)?$': 'ts-jest'
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/client/',
    '/dist/'
  ]
};
