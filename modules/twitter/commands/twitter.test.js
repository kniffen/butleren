import * as command from './twitter.js'
import latesttweetSubCommand from './twitter/latesttweet.js'

jest.mock(
  './twitter/latesttweet.js',
  () => ({ __esModule: true, default: jest.fn()})
)

describe('modules.twitter.commands.twitter', function() {
  it('Should contain certain properties', function() {
    expect(command.data.toJSON()).toEqual({
      name: 'twitter',
      description: 'Twitter integration',
      type: 1,
      options: [
        {
          name: 'latesttweet',
          description: 'Latest tweet from a Twitter user',
          type: 1,
          options: [
            {
              name: 'handle',
              description: '@handle for the Twitter user',
              required: true,
              type: 3
            }
          ]
        }
      ]
    })
  })

  it('Should forward sub commands', async function() {
    const interaction = {
      options: {
        getSubcommand: () => 'latesttweet'
      }
    }
    await command.execute(interaction)

    expect(latesttweetSubCommand).toHaveBeenCalledWith(interaction)
  })
})