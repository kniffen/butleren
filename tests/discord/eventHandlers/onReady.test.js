import onReady from '../../../discord/eventHandlers/onReady.js'

describe('discord.eventHandlers.onReady()', function() {
  const client = {
    user: {
      setActivity: jest.fn()
    }
  }

  beforeAll(function() {
    onReady(client)
  })

  it('should log successful connections', function() {
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith('Discord: Client is ready.')
  })

  it('should set the activity status of the bot', function() {
    expect(client.user.setActivity).toHaveBeenCalledWith(process.env.npm_package_version)
  })
})