import { ChatInputCommandInteraction } from 'discord.js';

import { twitchCommand} from './twitch';
import streamSubCommand from './twitch/stream';
import scheduleSubCommand from './twitch/schedule';

jest.mock(
  './twitch/stream',
  () => ({ __esModule: true, default: jest.fn() })
);

jest.mock(
  './twitch/schedule',
  () => ({ __esModule: true, default: jest.fn() })
);

describe('modules.twitch.commands.twitch', function () {
  it('Should contain certain properties', function () {
    expect(twitchCommand.data.toJSON?.()).toEqual({
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
    });
  });

  it('Should forward sub commands', async function () {
    const interactions = [
      { options: { getSubcommand: () => 'stream' } },
      { options: { getSubcommand: () => 'schedule' } },
    ] as ChatInputCommandInteraction[];

    await Promise.all(interactions.map(interaction => twitchCommand.execute(interaction)));

    expect(streamSubCommand).toHaveBeenCalledWith(interactions[0]);
    expect(scheduleSubCommand).toHaveBeenCalledWith(interactions[1]);
  });
});