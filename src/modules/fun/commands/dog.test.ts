import fetch, { Response } from 'node-fetch';
import { ChatInputCommandInteraction } from 'discord.js';

import { dogCommand } from './dog';

describe('fun.commands.dog', function () {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  const interaction = {
    deferReply: jest.fn(),
    editReply: jest.fn()
  } as unknown as ChatInputCommandInteraction;

  afterAll(function () {
    jest.clearAllMocks();
  });

  it('should contain certain properties', function () {
    expect(dogCommand).toEqual({
      data: {
        name: 'dog',
        name_localizations: undefined,
        description: 'Posts a random dog image',
        description_localizations: undefined,
        defaultPermission: undefined,
        options: [],
      },
      isLocked: false,
      execute: expect.anything()
    });
  });

  it('should post a random dog image', async function () {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({
        message: 'foobar'
      })
    } as Response));

    await dogCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random');
    expect(interaction.editReply).toHaveBeenCalledWith({ files: ['foobar'] });
  });

  it('should post a fallback dog image if the request failed', async function () {
    const err = new Error('error message');
    fetchMock.mockImplementation(async () => { throw err; });

    await dogCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random');
    expect(console.error).toHaveBeenCalledWith(err);
    expect(interaction.editReply).toHaveBeenCalledWith({ files: ['https://i.imgur.com/9oPUiCu.gif'] });
  });

});