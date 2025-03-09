import type { Request, Response } from 'express';
import { ChannelType, Collection, Guild, NonThreadGuildBasedChannel, Role } from 'discord.js';
import { getGuild } from './getGuild';
import { database } from '../../database/database';
import { client } from '../client';

jest.mock('../client', () => ({
  client: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

describe('getGuild()', () => {
  const fetchGuildMock = jest.spyOn(client.guilds, 'fetch');

  beforeEach(async () => {
    jest.clearAllMocks();

    const db = await database;
    await db.run(
      'INSERT INTO guilds (guildId, settings) VALUES (?, ?)',
      guildId,
      JSON.stringify({ color: 'red', timezone: 'UTC' })
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should get a guild and its settings', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    const request = { params: { 'guild': guildId } } as unknown as Request;
    await getGuild(request, response);
    expect(response.json).toHaveBeenCalledWith({
      id:       '12345',
      name:     'Test Guild',
      iconURL:  'https://example.com/icon.png',
      settings: {
        color:    'red',
        timezone: 'UTC',
      },
      channels: [
        { id: '11111', name: 'general', type: 'TEXT' },
        { id: '22222', name: 'voice',   type: 'VOICE' },
      ],
      roles: [
        { id: 'r11111', name: 'Admin'     },
        { id: 'r22222', name: 'Moderator' },
      ],
    });
  });

  test('It should handle the guild not having any settings', async () => {
    const db = await database;
    await db.run('DELETE FROM guilds');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    const request = { params: { 'guild': guildId } } as unknown as Request;
    await getGuild(request, response);
    expect(response.json).toHaveBeenCalledWith({
      id:       '12345',
      name:     'Test Guild',
      iconURL:  'https://example.com/icon.png',
      channels: [
        { id: '11111', name: 'general', type: 'TEXT' },
        { id: '22222', name: 'voice',   type: 'VOICE' },
      ],
      roles: [
        { id: 'r11111', name: 'Admin'     },
        { id: 'r22222', name: 'Moderator' },
      ],
    });
  });

  test('It should respond with a 404 if the guild is not found', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(null);

    const request = { params: { 'guild': guildId } } as unknown as Request;
    await getGuild(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(404);
  });

  test('It should respond with a 500 if an error occurs', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockRejectedValue(new Error('Test error'));

    const request = { params: { 'guild-id': guildId } } as unknown as Request;
    await getGuild(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(500);
  });
});

const channels = new Collection<string, NonThreadGuildBasedChannel | null>([
  ['11111', { id: '11111', name: 'general', type: ChannelType.GuildText  } as unknown as NonThreadGuildBasedChannel],
  ['22222', { id: '22222', name: 'voice',   type: ChannelType.GuildVoice } as unknown as NonThreadGuildBasedChannel],
  ['33333', null],
]);

const roles = new Collection<string, Role>([
  ['r11111', { id: 'r11111', name: 'Admin'     } as unknown as Role],
  ['r22222', { id: 'r22222', name: 'Moderator' } as unknown as Role],
]);

const guild = {
  id:       '12345',
  name:     'Test Guild',
  iconURL:  () => 'https://example.com/icon.png',
  settings: { color: 'red', timezone: 'UTC' },
  channels: { fetch: jest.fn().mockResolvedValue(channels) },
  roles:    { fetch: jest.fn().mockResolvedValue(roles) }
} as unknown as Guild;

const guildId = '12345';

const response = {
  json:       jest.fn(),
  sendStatus: jest.fn(),
} as unknown as Response;