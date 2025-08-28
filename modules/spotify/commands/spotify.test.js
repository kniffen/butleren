import * as command from './spotify.js'
import latestepisodeSubCommand from './spotify/latestepisode.js'

jest.mock(
  './spotify/latestepisode.js',
  () => ({ __esModule: true, default: jest.fn()})
)

describe('modules.spotify.commands.spotify', function() {
  it('Should contain certain properties', function() {
    expect(command.data.toJSON()).toEqual({
      name: 'spotify',
      description: 'Spotify integration',
      type: 1,
      options: [
        {
          name: 'latestepisode',
          description: 'Latest episode for a Spotify show',
          type: 1,
          options: [
            {
              name: 'show',
              description: 'Name of the show',
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
        getSubcommand: () => 'latestepisode'
      }
    }
    await command.execute(interaction)

    expect(latestepisodeSubCommand).toHaveBeenCalledWith(interaction)
  })
})