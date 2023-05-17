import { ChatInputCommandInteraction } from 'discord.js';
import { spotifyCommand } from './spotify';
import { latestEpisodeSubCommand } from './spotify/latestepisode';

jest.mock(
  './spotify/latestepisode',
  () => ({ __esModule: true, latestEpisodeSubCommand: jest.fn() })
);

describe('modules.spotify.commands.spotify', function () {
  it('Should contain certain properties', function () {
    expect(spotifyCommand.data.toJSON?.()).toEqual({
      name: 'spotify',
      description: 'Spotify integration',
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
    });
  });

  it('Should forward sub commands', async function () {
    const interaction = {
      options: {
        getSubcommand: () => 'latestepisode'
      }
    } as ChatInputCommandInteraction;

    await spotifyCommand.execute(interaction);

    expect(latestEpisodeSubCommand).toHaveBeenCalledWith(interaction);
  });
});