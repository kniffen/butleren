jest.mock('../../routes/router.js', () => {
  const callbacks = {
    get:    {},
    post:   {},
    put:    {},
    patch:  {},
    delete: {},
  }

  return {
    __esModule: true,
    default: {
      get:    jest.fn((path, cb) => callbacks.get[path]    = cb),
      post:   jest.fn((path, cb) => callbacks.post[path]   = cb),
      put:    jest.fn((path, cb) => callbacks.put[path]    = cb),
      patch:  jest.fn((path, cb) => callbacks.patch[path]  = cb),
      delete: jest.fn((path, cb) => callbacks.delete[path] = cb),
    },
    callbacks
  }
})