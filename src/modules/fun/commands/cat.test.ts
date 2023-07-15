import fetch, { Response } from 'node-fetch';
import { ChatInputCommandInteraction } from 'discord.js';

import { catCommand } from './cat';

describe('fun: commands: cat', function () {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  const interaction = {
    deferReply: jest.fn(),
    editReply: jest.fn()
  } as unknown as ChatInputCommandInteraction;

  afterAll(function () {
    jest.clearAllMocks();
  });

  it('should contain certain properties', function () {
    expect(catCommand).toEqual({
      data: {
        name: 'cat',
        name_localizations: undefined,
        description: 'Posts a random cat image',
        description_localizations: undefined,
        defaultPermission: undefined,
        options: [],
      },
      isLocked: false,
      execute: expect.anything()
    });
  });

  it('should post a random cat image', async function () {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({
        file: 'foobar'
      })
    } as Response));

    await catCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('https://aws.random.cat/meow');
    expect(interaction.editReply).toHaveBeenCalledWith({ files: ['foobar'] });
  });

  it('should post a fallback cat image if the request failed', async function () {
    const err = new Error('error message');
    fetchMock.mockImplementation(async () => { throw err; });

    await catCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('https://aws.random.cat/meow');
    expect(console.error).toHaveBeenCalledWith(err);
    expect(interaction.editReply).toHaveBeenCalledWith({ files: ['http://i.imgur.com/Bai6JTL.jpg'] });
  });
});