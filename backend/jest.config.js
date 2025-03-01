module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};