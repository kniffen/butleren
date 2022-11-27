import onError from './onError.js'

describe('discord.eventHandlers.onError()', function() {
  const err = new Error('Test error')

  beforeAll(function() {
    onError(err)
  })

  it('should log errors', function() {
    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(err)
  })
})