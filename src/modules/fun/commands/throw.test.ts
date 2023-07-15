import { ChatInputCommandInteraction } from 'discord.js';

import { throwCommand } from './throw';

describe('fun: commands: throw', function () {
  const options = new Map();

  options.set('item', { value: 'foobar' });

  const interaction = {
    options,
    reply: jest.fn(),
  } as unknown as ChatInputCommandInteraction;


  beforeAll(async function () {
    throwCommand.execute(interaction);
  });

  it('should contain certain properties', function () {
    expect(throwCommand).toEqual({
      data: {
        name: 'throw',
        name_localizations: undefined,
        description: 'Throws things!',
        description_localizations: undefined,
        defaultPermission: undefined,
        options: [{
          autocomplete: undefined,
          choices: undefined,
          description: 'item to throw',
          description_localizations: undefined,
          name: 'item',
          name_localizations: undefined,
          required: true,
          type: 3,
        }],
      },
      isLocked: false,
      execute: expect.anything()
    });
  });

  it('should throw the item', async function () {
    expect(interaction.reply).toHaveBeenCalledWith({ content: '(╯°□°）╯︵ foobar' });
  });
});