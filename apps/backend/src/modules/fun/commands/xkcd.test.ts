import { ChatInputCommandInteraction } from 'discord.js';
import fetch, { type Response } from 'node-fetch';
import { xkcdCommand } from './xkcd';

describe('xkcdCommand', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    fetchMock.mockClear();
  });

  test('It should not be locked', () => {
    expect(xkcdCommand.isLocked).toBe(false);
  });

  test('It should have a slash command builder', () => {
    expect(xkcdCommand.slashCommandBuilder.toJSON()).toEqual(expect.objectContaining({
      name:        'xkcd',
      description: 'Posts XKCD comics'
    }));
  });

  describe('execute', () => {
    test('It should reply with the latest XKCD comic', async () => {
      fetchMock.mockResolvedValueOnce(response);
      const editReply = jest.fn();
      const commandInteraction = {
        deferReply: jest.fn(),
        editReply,
        options:    { get: jest.fn().mockReturnValue(undefined) }
      } as unknown as ChatInputCommandInteraction;

      await xkcdCommand.execute(commandInteraction);

      expect(fetchMock).toHaveBeenCalledWith('https://xkcd.com/info.0.json');
      expect(editReply).toHaveBeenCalledWith({ content: 'XKCD comic', files: ['https://xkcd.com/comic.png'] });
    });

    test('It should reply with a specific XKCD comic', async () => {
      fetchMock.mockResolvedValueOnce(response);
      const editReply = jest.fn();
      const commandInteraction = {
        deferReply: jest.fn(),
        editReply,
        options:    { get: jest.fn().mockReturnValue({ value: '1234' }) }
      } as unknown as ChatInputCommandInteraction;

      await xkcdCommand.execute(commandInteraction);

      expect(fetchMock).toHaveBeenCalledWith('https://xkcd.com/1234/info.0.json');
      expect(editReply).toHaveBeenCalledWith({ content: 'XKCD comic', files: ['https://xkcd.com/comic.png'] });
    });

    test('It should reply with an error message if the XKCD comic is not found', async () => {
      fetchMock.mockResolvedValueOnce({ ...response, ok: false } as Response);
      const editReply = jest.fn();
      const commandInteraction = {
        deferReply: jest.fn(),
        editReply,
        options:    { get: jest.fn().mockReturnValue(undefined) }
      } as unknown as ChatInputCommandInteraction;

      await xkcdCommand.execute(commandInteraction);

      expect(editReply).toHaveBeenCalledWith({
        content: 'Sorry, I was unable to fetch the XKCD comic',
        files:   ['https://imgs.xkcd.com/comics/not_available.png']
      });
    });
  });
});

const response = {
  ok:   true,
  json: jest.fn().mockResolvedValue({ title: 'XKCD comic', img: 'https://xkcd.com/comic.png' }),
  text: jest.fn().mockResolvedValue('Error message'),
} as unknown as Response;