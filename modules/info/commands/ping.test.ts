import { ChatInputCommandInteraction } from 'discord.js';

import { pingCommand } from './ping';

describe('modules.info.commands.ping', function () {
  const interaction = {
    reply: jest.fn()
  } as unknown as ChatInputCommandInteraction;

  beforeAll(async function () {
    await pingCommand.execute(interaction);
  });

  it('should contain certain properties', function () {
    expect(pingCommand).toEqual({
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
    });
  });

  it('should reply with "pong!"', function () {
    expect(interaction.reply).toHaveBeenCalledWith('pong!');
  });
});