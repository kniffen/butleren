import type { Guild } from 'discord.js';
import type { Response } from 'express';
import { validateDiscordChannel } from './validateDiscordChannel';

describe('validateDiscordChannel()', () => {
  test('It should do nothing if the channel is valid', async () => {
    channelFetchMock.mockResolvedValueOnce({ id: 'channel-id-1', isTextBased: () => true } as unknown as Guild);

    await expect(validateDiscordChannel('channel-id-1', guild, res)).resolves.toEqual(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('It should respond with 400 if the channel does not exist', async () => {
    channelFetchMock.mockResolvedValueOnce(null);

    await expect(validateDiscordChannel('invalid-channel-id', guild, res)).resolves.toEqual(false);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Discord channel with id "invalid-channel-id" not found or is not a text channel' });
  });

  test('It should respond with 400 if the channel is not a text channel', async () => {
    channelFetchMock.mockResolvedValueOnce({ id: 'channel-id-2', isTextBased: () => false } as unknown as Guild);

    await expect(validateDiscordChannel('channel-id-2', guild, res)).resolves.toEqual(false);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Discord channel with id "channel-id-2" not found or is not a text channel' });
  });
});

const channelFetchMock = jest.fn();
const guild = {
  channels: {
    fetch: channelFetchMock
  }
} as unknown as Guild;

const res = {
  status: jest.fn(() => res),
  json:   jest.fn(),
} as unknown as Response;