import { ChatInputCommandInteraction } from 'discord.js';

import { dadjokeCommand } from './dadjoke';

describe('fun: commands: dadjoke', function () {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation();

  const interaction = {
    deferReply: jest.fn(),
    editReply: jest.fn()
  } as unknown as ChatInputCommandInteraction;

  afterAll(function () {
    jest.clearAllMocks();
  });

  it('should contain certain properties', function () {
    expect(dadjokeCommand).toEqual({
      data: {
        name: 'dadjoke',
        name_localizations: undefined,
        description: 'Posts a random dad joke',
        description_localizations: undefined,
        defaultPermission: undefined,
        options: [],
      },
      isLocked: false,
      execute: expect.anything()
    });
  });

  it('should post a random dad joke', async function () {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({
        joke: 'foobar'
      })
    } as Response));

    await dadjokeCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } });
    expect(interaction.editReply).toHaveBeenCalledWith({ content: 'foobar' });
  });

  it('should post a fallback cat image if the request failed', async function () {
    const err = new Error('error message');
    fetchMock.mockImplementation(async () => { throw err; });

    await dadjokeCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } });
    expect(console.error).toHaveBeenCalledWith(err);
    expect(interaction.editReply).toHaveBeenCalledWith('Sorry, I was unable to fetch a dad joke for you.');
  });
});