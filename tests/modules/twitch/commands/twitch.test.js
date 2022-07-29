import * as command from '../../../../modules/twitch/commands/twitch.js'
import streamSubCommand from '../../../../modules/twitch/commands/twitch/stream.js'
import scheduleSubCommand from '../../../../modules/twitch/commands/twitch/schedule.js'

jest.mock(
  '../../../../modules/twitch/commands/twitch/stream.js',
  () => ({ __esModule: true, default: jest.fn()})
)

jest.mock(
  '../../../../modules/twitch/commands/twitch/schedule.js',
  () => ({ __esModule: true, default: jest.fn()})
)

describe('modules.twitch.commands.twitch', function() {
  it('Should contain certain properties', function() {
    expect(command.data.toJSON()).toEqual({
      name: 'twitch',
      description: 'Twitch integration',
      options: [
        {
          name: 'stream',
          description: 'Information about a Twitch stream',
          type: 1,
          options: [
            {
              name: 'channel',
              description: 'Name of the channel',
              required: true,
              type: 3
            }
          ]
        },
        {
          name: 'schedule',
          description: 'Schedule for a Twitch channel',
          type: 1,
          options: [
            {
              name: 'channel',
              description: 'Name of the channel',
              required: true,
              type: 3
            }
          ]
        }
      ]
    })
  })

  it('Should forward sub commands', async function() {
    const interactions = [
      {options: {getSubcommand: () => 'stream'}},
      {options: {getSubcommand: () => 'schedule'}},
    ]
    
    await Promise.all(interactions.map(interaction => command.execute(interaction)))
    
    expect(streamSubCommand).toHaveBeenCalledWith(interactions[0])
    expect(scheduleSubCommand).toHaveBeenCalledWith(interactions[1])
  })
})