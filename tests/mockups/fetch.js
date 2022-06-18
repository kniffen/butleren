jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn()
}))