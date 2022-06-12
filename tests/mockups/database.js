jest.mock('../../database/index.js', () => {
  const sqlite3 = jest.requireActual('sqlite3')
  const { open } = jest.requireActual('sqlite')

  return {
    __esModule: true,
    default: open({
      filename: ':memory:',
      driver: sqlite3.Database,
    })
  }
})