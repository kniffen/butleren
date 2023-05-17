const config = {
  coverageProvider: 'v8',
  collectCoverage: true,
  verbose: true,
  forceExit: true,
  preset: 'ts-jest',
  setupFiles: [
    '<rootDir>/setupTests.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/client/'
  ]
}

export default config