import { ChatInputCommandInteraction } from 'discord.js';

import { xkcdCommand } from './xkcd';

describe('fun: commands: xkcd', function () {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation();
  const options = new Map();

  const interaction = {
    options,
    deferReply: jest.fn(),
    editReply: jest.fn()
  } as unknown as ChatInputCommandInteraction;

  beforeAll(function () {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({ img: 'foobar' })
    } as Response));
  });

  afterAll(function () {
    jest.clearAllMocks();
  });

  it('should contain certain properties', function () {
    expect(xkcdCommand).toEqual({
      data: {
        name: 'xkcd',
        name_localizations: undefined,
        description: 'Posts XKCD comics',
        description_localizations: undefined,
        defaultPermission: undefined,
        options: [{
          autocomplete: undefined,
          choices: undefined,
          description: 'XKCD comic id',
          description_localizations: undefined,
          name: 'id',
          name_localizations: undefined,
          required: false,
          type: 3,
        }],
      },
      isLocked: false,
      execute: expect.anything()
    });
  });

  it('should respond with the latest XKCD comic', async function () {
    await xkcdCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('https://xkcd.com/info.0.json');
    expect(interaction.editReply).toHaveBeenCalledWith({ files: ['foobar'] });
  });

  it('should respond with a specific XKCD comic', async function () {
    options.set('id', { value: 'foobar' });
    await xkcdCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('https://xkcd.com/foobar/info.0.json');
    expect(interaction.editReply).toHaveBeenCalledWith({ files: ['foobar'] });
  });

  it('should respond with a fallback XKCD comic if one cannot be resolved', async function () {
    const err = new Error('error message');
    fetchMock.mockImplementation(async () => { throw err; });

    await xkcdCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith({ files: ['https://imgs.xkcd.com/comics/not_available.png'] });
  });
});