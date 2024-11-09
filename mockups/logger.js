jest.mock('../logger/logger.js', () => ({
  __esModule: true,
  logger: { 
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  }
}));