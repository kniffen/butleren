import  type { Request, Response } from 'express';
import { getGuilds } from './getGuilds';
import { database } from '../../database/database';
import { client } from '../client';
import { Collection, type Guild, type OAuth2Guild } from 'discord.js';

jest.mock('../client', () => ({
  client: {
    guilds: {
      cache: {
        get: jest.fn(),
      },
      fetch: jest.fn(),
    },
  },
}));

describe('getGuilds()', () => {
  const fetchGuildsMock = jest.spyOn(client.guilds, 'fetch');

  jest
    .spyOn(client.guilds.cache, 'get')
    .mockImplementation((id: string) => guilds.get(id) as unknown as Guild);

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

  test('It should get all guilds and their settings', async () => {
    fetchGuildsMock.mockResolvedValue(guilds);

    await getGuilds(request, response);
    expect(response.json).toHaveBeenCalledWith([
      {
        id:       '12345',
        name:     'Test Guild',
        iconURL:  'https://example.com/icon.png',
        settings: {
          color:    'red',
          timezone: 'UTC',
        },
      },
      {
        id:      '67890',
        name:    'Another Guild',
        iconURL: 'https://example.com/another-icon.png',
      },
    ]);
  });

  test('It should return 500 if an error is thrown', async () => {
    fetchGuildsMock.mockRejectedValue(new Error('Test error'));

    await getGuilds(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(500);
  });
});

const guildId = '12345';
const guilds = new Collection<string, OAuth2Guild>([
  [
    guildId,
    {
      id:      '12345',
      name:    'Test Guild',
      iconURL: () => 'https://example.com/icon.png',
    } as OAuth2Guild,
  ],
  [
    '67890',
    {
      id:      '67890',
      name:    'Another Guild',
      iconURL: () => 'https://example.com/another-icon.png',
    } as OAuth2Guild,
  ]
]);

const request = {} as Request;

const response = {
  sendStatus: jest.fn(),
  json:       jest.fn(),
} as unknown as Response;