import * as command from './ping.js'

describe('modules.info.commands.ping', function() {
  const interaction = {
    reply: jest.fn()
  }

  beforeAll(async function() {
    await command.execute(interaction)
  })

  it('should contain certain properties', function() {
    expect(command).toEqual({
      data: {
        name: 'ping',
        name_localizations: undefined,
        description: 'Latency check',
        description_localizations: undefined,
        default_permission: undefined,
        options: [],
      },
      isLocked: true,
      execute: expect.anything()
    })
  })

  it('should reply with "pong!"', function() {
    expect(interaction.reply).toHaveBeenCalledWith('pong!')
  })
})